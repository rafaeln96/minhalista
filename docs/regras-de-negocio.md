# Regras de Negócio

Este documento descreve decisões de cálculo e comportamento que não são óbvias a partir da leitura direta do código.

## Preço por unidade vs. preço por medida

Cada produto tem uma `unit` (`un`, `kg`, `g`, `L`, `ml`). O campo `price` é sempre o preço de **1 unidade da medida "grande"** correspondente — 1 unidade, 1 kg ou 1 L — mesmo quando a medida escolhida para a quantidade é a "pequena" (`g` ou `ml`):

- **`un` / `kg` / `L`:** `quantity` já está na mesma escala do `price`. Subtotal = `price × quantity` (ex.: R$ 8,00/kg × 1,2 kg = R$ 9,60).
- **`g` / `ml`:** `quantity` é digitada em gramas/mililitros (ex.: `250` para 250 g), mas `price` continua sendo por kg/L. Por isso `quantity` é dividida por 1000 antes de multiplicar (ex.: R$ 23,00/kg × 250 g → R$ 23,00 × 0,25 = R$ 5,75).

Essa conversão está centralizada em `calculateItemTotal` (`src/utils/format.ts`) e é reutilizada em todos os lugares que calculam subtotal — nenhum deles deve reimplementar a fórmula:

- `src/contexts/CartContext.tsx` — cálculo do `totalPrice` do carrinho.
- `src/components/ProductCard/ProductCard.tsx` — exibição do subtotal no card do produto.
- `src/utils/pdfGenerator.ts` — coluna "Subtotal" da lista exportada em PDF.

## Contagem de itens (`totalUnits`)

Para o resumo do carrinho, um produto em `un` conta pela sua quantidade (ex.: 3 unidades = 3 itens). Um produto em `kg`/`g`/`L`/`ml` conta como **1 item físico**, independente da quantidade pesada — porque ele representa uma única embalagem/produto no carrinho, não várias unidades.

## Arredondamento monetário

Todo valor monetário derivado de multiplicação (`price × quantity`) passa por `roundMoney` (`src/utils/format.ts`) antes de ser somado ou exibido. Isso evita que carrinho, card de produto e PDF divirjam em centavos por causa de imprecisão de ponto flutuante do JavaScript. Qualquer novo local que calcule um subtotal deve reutilizar essa função em vez de arredondar manualmente.

## Passo de incremento/decremento de quantidade

Os botões de +/- de quantidade (no card do produto e no formulário de adicionar/editar) usam um passo que depende da unidade, definido em `getQuantityStep` (`src/utils/format.ts`):

- `un`, `g`, `ml`: passo de `1` (grandezas tipicamente inteiras).
- `kg`, `L`: passo de `0,1` (grandezas tipicamente fracionadas, ex.: 0,750 kg).

Ao decrescer, se o novo valor chegar a zero ou menos, o produto é removido do carrinho em vez de ficar com quantidade zero.

## Parsing de quantidade em pt-BR

O campo de quantidade aceita entrada livre de texto. Em português, `.` é tratado como separador de milhar e `,` como separador decimal (`1.234,5` → `1234.5`). Vírgulas extras digitadas por engano (ex.: `"1,,5"`) são descartadas em vez de quebrar o parsing, para nunca travar o preenchimento do formulário.

## Persistência e falhas de armazenamento

A lista de produtos é salva no `localStorage` a cada alteração (`src/contexts/CartContext.tsx`). Se o navegador recusar a escrita (ex.: armazenamento cheio, modo privado, PWA em iOS com quota reduzida), o app não falha silenciosamente: um aviso visível (`src/components/Toast/Toast.tsx`) é exibido ao usuário informando que a alteração pode não ter sido salva.

## Modais fecham apenas por ação explícita, nunca ao clicar fora

`BottomSheet.tsx` (formulário de produto), a imagem expandida em `ProductCard.tsx` e `ConfirmModal.tsx` não têm `onClick` no overlay de fundo — clicar fora deliberadamente **não** fecha nada. Isso foi uma decisão de produto (evitar fechar o formulário sem querer e perder o que já foi digitado), não um esquecimento: `BottomSheet` e a imagem expandida têm um botão "×" explícito para fechar; `ConfirmModal` não tem "×", mas seus botões "Cancelar"/"Confirmar" já cumprem esse papel de ação explícita. Ao mexer em qualquer modal novo, manter o mesmo padrão (sem `onClick` no overlay).

## Geração de PDF

A geração do PDF (`src/utils/pdfGenerator.ts`) roda inteiramente no navegador via `jspdf`/`jspdf-autotable`, carregados sob demanda (`import()` dinâmico) para não engordar o bundle inicial. Se qualquer etapa da geração falhar, o erro é capturado no componente que chama a função e um aviso visível é exibido ao usuário.

### Logo do cabeçalho (`loadRoundedIcon`)

O arquivo `public/icon-512x512.png` é na verdade um JPEG (sem canal alfa) com um fundo branco nos quatro cantos ao redor do ícone com cantos arredondados. Não dá para simplesmente transformar pixels brancos em transparentes: o próprio desenho do carrinho dentro do ícone é branco, e esse truque apagaria o desenho junto com o fundo.

Em vez disso, `loadRoundedIcon` desenha a imagem em um `<canvas>` recortado por um caminho de retângulo arredondado (`ctx.clip()`), calculado a partir de `cornerRatio` (≈ 15% do tamanho da imagem, medido a olho a partir do próprio arquivo). Esse recorte é puramente geométrico: só remove os quatro cantos externos e nunca toca nos pixels internos do ícone, não importa a cor deles.

### Layout compacto do cabeçalho

O cabeçalho do PDF usa 52mm de altura. Data/hora (canto esquerdo) e total (canto direito) dividem a mesma linha em vez de ficarem empilhados, e a grade de pontos decorativa fica restrita às duas primeiras linhas (perto do título) para nunca invadir visualmente essa linha de informações.

## Emoji ilustrativo quando o produto não tem foto

Como o app roda inteiramente no front-end e é hospedado no GitHub Pages (sem backend), não há como gerar uma imagem real por IA para cada produto sem foto — exigiria uma API paga com chave exposta no cliente. Em vez disso, `src/utils/productCatalog.ts` mantém um dicionário local de produtos comuns (nome canônico + emoji + lista de palavras-chave em pt/en) e duas funções:

- `findEmojiForProduct(name)`: normaliza o texto digitado (minúsculas, sem acento) e procura a palavra-chave cadastrada que tem a maior sobreposição com o nome do produto — o casamento mais longo vence, para que "Leite condensado" prefira a entrada específica em vez de cair genericamente em "Leite". Usado em `ProductCard.tsx` (substitui o ícone genérico de placeholder) e em `pdfGenerator.ts` (ao lado do nome, quando o produto não tem foto).
- `suggestCorrection(name)`: só entra em ação quando `findEmojiForProduct` **não** encontrou nada (ou seja, o texto não bate com nenhuma palavra-chave conhecida) e usa distância de Levenshtein para achar um item do catálogo a 1–2 caracteres de diferença — o limite é mais rígido (1) para palavras curtas e mais tolerante (2) para palavras longas, para não sugerir correções bobas em textos muito curtos. É consumida pelo campo de nome em `BottomSheet.tsx`, que mostra "Você quis dizer…?" como sugestão clicável — nunca substitui o texto sozinho, para não trocar por engano algo que o usuário quis escrever diferente.

Essa cobertura é limitada aos itens cadastrados no catálogo; produtos fora dessa lista continuam usando o ícone genérico e não recebem sugestão de correção.

Além das categorias genéricas ("Refrigerante", "Cerveja", "Achocolatado" etc.), o catálogo também cadastra marcas populares no Brasil como entradas próprias (ex.: `Coca-Cola`, `Pepsi`, `Guaraná Antarctica`, `Skol`, `Nescau`, `Omo`, `Doritos`), já que na prática o usuário digita o nome da marca, não da categoria. Cada marca é uma entrada separada (não apenas mais uma palavra-chave da categoria) para que a sugestão de correção aponte para o nome certo — sem isso, um typo em "Coca-Cola" seria "corrigido" para o genérico "Refrigerante".

`normalize()` remove todo caractere que não seja letra ou número (além de acento e caixa), então "Coca-Cola", "CocaCola" e "Coca Cola" normalizam para o mesmo texto e batem com uma única palavra-chave cadastrada — não é preciso listar cada variação de espaço/hífen manualmente.

### Emoji no PDF é uma imagem, não texto

`jspdf` só sabe desenhar texto com as 14 fontes padrão do PDF (Helvetica, Courier, Times), que não têm glifos coloridos de emoji — desenhar o caractere via `doc.text()` resultaria em um quadrado vazio. Por isso `renderEmojiToPNG` (em `pdfGenerator.ts`) desenha o emoji em um `<canvas>` usando a fonte do sistema (que sabe renderizar emoji colorido) e converte para PNG, que é então inserido via `doc.addImage()` — a mesma técnica usada para a logo do cabeçalho. Os resultados ficam em cache (`emojiImageCache`) para não redesenhar o mesmo emoji a cada produto repetido na lista.
