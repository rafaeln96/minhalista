# Minha Lista de Compras (Mercado) 🛒

Um aplicativo Web progressivo e moderno para gerenciamento de listas de compras de supermercado, projetado com foco em usabilidade mobile-first, alta velocidade e operações matemáticas robustas.

## 🌟 Funcionalidades Principais

- **Adição Rápida de Produtos**: Interface intuitiva via Bottom Sheet para adicionar produtos rapidamente, com suporte para nome ou foto (camera nativa no celular).
- **Gerenciamento Inteligente de Quantidades**: 
  - Cálculo independente para itens por Unidade (multiplica pelo valor) e itens por Peso/Volume (como kg ou gramas, onde o preço inserido já é o total).
  - Suporte total a frações (ex: `1,5 kg`) mantendo um estado numérico exato na interface.
- **Prevenção de Falhas de Flutuação (Float-point)**: Toda a matemática é executada com tratamentos precisos de arredondamento (`Number(Math.round(val + 'e2')) + 'e-2'`), eliminando problemas clássicos de soma com centavos no JavaScript.
- **Exportação Nativa para PDF**: Geração local e instantânea de relatórios no formato PDF utilizando renderização nativa da biblioteca `jsPDF`, simulando o design de uma "nota fiscal" premium, sem necessidade de internet ou backend.
- **Busca em Tempo Real**: Barra superior fixada com pesquisa instantânea no carrinho (mesmo para itens adicionados apenas por imagem).
- **Sem Dependência de Backend**: Toda a persistência pode ser feita no cliente ou exportada diretamente. Tudo roda localmente no navegador!

## 🛠️ Tecnologias e Arquitetura

- **Frontend Framework**: React 19 + TypeScript (para tipagem estática rigorosa).
- **Build Tool**: Vite (Extremamente rápido com Hot Module Replacement).
- **Gerenciamento de Estado**: Context API Nativa (`CartContext.tsx`), centralizando a lógica de soma e formatação de unidades.
- **Estilização**: CSS Modules Puros. Variáveis CSS (`App.css`) para gerenciar as cores primárias (Verde Floresta `1C4230`) e dark-modes dinâmicos no futuro. Micro-interações via keyframes (`float`, `pulse`).
- **Geração de PDF**: `jspdf` e `jspdf-autotable`. Desenhado nativamente usando os métodos de canvas interno do PDF (retângulos com cantos arredondados, tabelas estilizadas).

## 🗂️ Estrutura de Pastas

```text
src/
├── components/           # Componentes UI Reutilizáveis
│   ├── BottomSheet/      # Modal de inserção de produtos deslizando de baixo
│   ├── FAB/              # Botão flutuante estilizado de ação principal
│   ├── Header/           # Cabeçalho pegajoso com totais, botões de ação (PDF e Limpar)
│   └── ProductCard/      # Cartão de cada produto (nome, img, preço, controles qtd)
├── contexts/             # Gerenciadores de estado globais
│   └── CartContext.tsx   # Lógica central (Totais, add, edit, remove, filters)
├── utils/                # Utilitários puros sem interface
│   ├── format.ts         # Funções para formatação de BRL (R$)
│   └── pdfGenerator.ts   # Desenho algorítmico do PDF nativo
├── App.tsx               # Componente Root (Integração das peças)
├── App.css               # Variáveis globais e CSS Base + Animações (Empty States)
└── main.tsx              # Ponto de entrada do React
```

## 🚀 Como Rodar o Projeto (Desenvolvimento)

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Navegue até o diretório do projeto e instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
4. O app ficará disponível em `http://localhost:5173`.

## 📦 Como Construir para Produção

Execute o comando de build:
```bash
npm run build
```
Os arquivos otimizados serão gerados dentro da pasta `dist/`, prontos para serem hospedados de forma estática (Vercel, Netlify, GitHub Pages, etc).

## 📄 Notas Futuras / Roadmap

- Conectar a um backend (Supabase ou Firebase) para login se necessário.
- Transformar 100% em PWA (adicionar `manifest.json` e Service Workers) para instalação direta como aplicativo no Android/iOS.
