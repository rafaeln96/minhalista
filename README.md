# Minha Lista de Mercado

Progressive Web App para montar e acompanhar sua lista de compras de mercado em tempo real, com cálculo automático de total, geração de PDF e suporte a português e inglês.

## Funcionalidades

- Cadastro de produtos por nome e/ou foto (tirada na hora ou da galeria).
- Preço e quantidade por unidade, quilo, grama, litro ou mililitro.
- Cálculo automático do total do carrinho, com arredondamento monetário consistente.
- Busca por nome ou preço dentro da lista.
- Exportação da lista em PDF, pronta para levar ao mercado.
- Instalável como app (PWA), com uso offline após o primeiro carregamento.
- Interface em português e inglês.

## Stack técnica

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) como build tool e dev server
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) para o suporte a PWA (manifest, service worker, cache offline)
- [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) para a exportação em PDF
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) como linter
- Persistência local via `localStorage` (sem backend/servidor)

## Como rodar o projeto

Pré-requisitos: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
npm install
npm run dev
```

O app abre em `http://localhost:5173` por padrão.

### Scripts disponíveis

| Script            | Descrição                                              |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Sobe o servidor de desenvolvimento com hot reload.       |
| `npm run build`   | Checa os tipos (`tsc -b`) e gera o build de produção.    |
| `npm run preview` | Serve localmente o build de produção gerado.             |
| `npm run lint`    | Roda o linter (`oxlint`) sobre o projeto.                |

## Estrutura de pastas

```
src/
├── assets/          Imagens estáticas usadas na UI
├── components/      Componentes de UI, cada um com seu .tsx e .module.css
├── contexts/        Estado global via React Context (carrinho e idioma)
├── i18n/            Dicionário de traduções (pt/en)
├── utils/           Funções puras reutilizáveis (formatação, geração de PDF)
├── App.tsx          Composição da tela principal
└── main.tsx         Ponto de entrada da aplicação
```

Documentação complementar em [`docs/`](docs/):

- [`docs/regras-de-negocio.md`](docs/regras-de-negocio.md) — decisões de cálculo e comportamento (preço por unidade vs. por medida, arredondamento monetário, parsing de quantidade, etc.).
- [`docs/ajustes-de-interface.md`](docs/ajustes-de-interface.md) — ajustes de CSS que resolvem comportamentos específicos de navegador.

## Dados do usuário

A lista de produtos é salva localmente no navegador (`localStorage`), por dispositivo — não há sincronização entre dispositivos nem conta de usuário. Limpar os dados do navegador ou desinstalar o PWA apaga a lista salva.
