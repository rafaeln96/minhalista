# Minha Lista de Compras (Mercado) 🛒

Um aplicativo Web progressivo e moderno para gerenciamento de listas de compras de supermercado, projetado com foco em usabilidade mobile-first, alta velocidade, internacionalização e operações matemáticas robustas.

## 🌟 Funcionalidades Principais

- **Adição Rápida de Produtos**: Interface intuitiva via Bottom Sheet para adicionar produtos rapidamente, com suporte para nome ou foto (câmera nativa no celular).
- **Suporte Multilíngue (i18n Bilíngue)**: Alternância em tempo real entre **Português (PT)** e **Inglês (EN)** com detecção de idioma e salvamento de preferência no `localStorage`.
- **Gerenciamento Inteligente de Quantidades**: 
  - Cálculo independente para itens por Unidade (multiplica pelo valor) e itens por Peso/Volume (como kg ou gramas, onde o preço inserido já é o total).
  - Suporte total a frações (ex: `1,5 kg`) mantendo um estado numérico exato na interface.
- **Prevenção de Falhas de Flutuação (Float-point)**: Toda a matemática é executada com tratamentos precisos de arredondamento (`Number(Math.round(val + 'e2')) + 'e-2'`), eliminando problemas clássicos de soma com centavos no JavaScript.
- **Exportação Nativa para PDF Bilíngue**: Geração local e instantânea de relatórios no formato PDF utilizando a biblioteca `jsPDF` e `jspdf-autotable`. O PDF é gerado automaticamente no idioma selecionado pelo usuário (Português ou Inglês). Carregamento otimizado via **Importação Dinâmica (Code-Splitting)**, mantendo o bundle inicial leve (~215 KB).
- **Busca em Tempo Real**: Componente dedicado de pesquisa instantânea no carrinho (mesmo para itens adicionados apenas por imagem) com suporte a buscas bilíngues ("foto", "photo", "imagem", "picture").
- **PWA Completo & Alta Performance no iOS**: Instalação direta no Android e iOS ("Adicionar à Tela de Início") com Service Worker registrado (`virtual:pwa-register`), cache offline inteligente via Workbox (`CacheFirst` para assets e fontes do Google), suporte completo a `<meta name="theme-color">` e CSS crítico inline, eliminando telas escuras e garantindo abertura instantânea em 0ms.
- **Sem Dependência de Backend**: Toda a persistência é mantida no cliente ou exportada diretamente. Tudo roda localmente no navegador!

## 🛠️ Tecnologias e Arquitetura

- **Frontend Framework**: React 19 + TypeScript (para tipagem estática rigorosa).
- **Build Tool**: Vite (Extremamente rápido com Hot Module Replacement).
- **Internacionalização (i18n)**: Sistema customizado via `LanguageContext` + `translations.ts` com suporte a dicionários dinâmicos e substituição de parâmetros (`{{count}}`, `{{name}}`).
- **PWA & Cache Offline**: `vite-plugin-pwa` + Workbox com estratégias de `runtimeCaching` para fontes do Google e assets estáticos.
- **Gerenciamento de Estado**: Context API Nativa (`CartContext.tsx` e `LanguageContext.tsx`).
- **Estilização & Componentização**: Componentes 100% isolados com CSS Modules Puros e escopados, mantendo o `App.css` focado apenas em layout global e variáveis de design system.
- **Geração de PDF (Code-Splitting)**: `jspdf` e `jspdf-autotable` carregados dinamicamente via `import(...)` sob demanda.

## 🗂️ Estrutura de Pastas

```text
src/
├── components/           # Componentes UI Reutilizáveis & Modulares
│   ├── BottomSheet/      # Modal de inserção/edição de produtos deslizando de baixo
│   ├── ConfirmModal/     # Modal reutilizável de confirmação (exclusão de item / limpar lista)
│   ├── EmptyState/       # Estado visual estilizado para carrinho vazio
│   ├── FAB/              # Botão flutuante estilizado de ação principal
│   ├── Header/           # Cabeçalho com totais, ações e seletor de idioma
│   ├── LanguageSelector/ # Seletor de idioma bilíngue (PT / EN)
│   ├── ProductCard/      # Cartão individual do produto (nome, img, preço, qtd)
│   ├── ProductList/      # Grid/Lista de produtos filtrados e busca sem resultados
│   └── SearchBar/        # Barra de pesquisa com botão de limpar
├── contexts/             # Gerenciadores de estado globais
│   ├── CartContext.tsx   # Lógica central do carrinho (Totais, add, edit, remove)
│   └── LanguageContext.tsx # Gerenciador de idioma bilíngue (PT/EN) e t() helper
├── i18n/                 # Dicionários de tradução
│   └── translations.ts   # Chaves e textos em Português e Inglês
├── utils/                # Utilitários puros
│   ├── format.ts         # Formatação de moeda BRL / USD por locale
│   └── pdfGenerator.ts   # Gerador de PDF nativo bilíngue
├── App.tsx               # Componente Root desacoplado e limpo
├── App.css               # Variáveis globais e layout container
└── main.tsx              # Ponto de entrada do React com Service Worker
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
