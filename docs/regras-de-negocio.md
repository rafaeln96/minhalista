# Regras de Negócio

Este documento descreve decisões de cálculo e comportamento que não são óbvias a partir da leitura direta do código.

## Preço por unidade vs. preço por medida

Cada produto tem uma `unit` (`un`, `kg`, `g`, `L`, `ml`). O significado do campo `price` muda de acordo com ela:

- **`un` (unidade):** `price` é o preço de uma unidade individual. O subtotal do item é `price × quantity`.
- **`kg` / `g` / `L` / `ml` (peso ou volume):** `price` já é o valor final da embalagem/etiqueta pesada no mercado. O subtotal do item é o próprio `price`, sem multiplicar pela quantidade.

Essa regra está implementada em três lugares que precisam continuar consistentes entre si:

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

## Geração de PDF

A geração do PDF (`src/utils/pdfGenerator.ts`) roda inteiramente no navegador via `jspdf`/`jspdf-autotable`, carregados sob demanda (`import()` dinâmico) para não engordar o bundle inicial. O logo do app é carregado e processado em um `<canvas>` para transformar pixels muito claros (branco/quase branco) em transparentes, permitindo sobrepor o logo em um fundo colorido sem uma borda branca visível ao redor. Se qualquer etapa da geração falhar, o erro é capturado no componente que chama a função e um aviso visível é exibido ao usuário.
