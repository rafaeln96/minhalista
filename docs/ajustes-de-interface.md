# Ajustes de Interface

Pequenos ajustes de CSS que resolvem comportamentos específicos de navegador e que não são óbvios apenas lendo o seletor.

## Cabeçalho fixo sem "linha fantasma" no scroll (`src/App.css`)

`.sticky-wrapper` usa `box-shadow: 0 1px 0 var(--color-background)` (em vez de `border-bottom` ou nada) para cobrir um artefato visual de 1px que alguns navegadores mobile desenham entre um elemento `position: sticky` e o conteúdo abaixo dele durante o scroll.

## Botão flutuante (FAB) clicável sobre uma área "furada" (`src/components/FAB/FAB.module.css`)

`.fabContainer` ocupa a largura inteira da tela para centralizar o botão, mas usa `pointer-events: none` para não bloquear cliques nos elementos abaixo dele nas áreas vazias ao redor do botão. `.fabBtn`, o botão em si, reativa os cliques com `pointer-events: auto`.

## `100dvh` em vez de `100vh`

Alturas de tela cheia usam a unidade `dvh` (dynamic viewport height) em vez de `vh` para evitar rolagem falsa em navegadores mobile (principalmente iOS Safari) onde `100vh` inclui a área coberta pela barra de navegação do navegador.
