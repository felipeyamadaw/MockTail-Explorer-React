# Mocktail Explorer

Projeto em dupla desenvolvido para a disciplina de Programação Web Fullstack.

Alunos: Felipe Yamada e João Pedro 

## Sobre o projeto

O Mocktail Explorer é uma aplicação web para consultar receitas de bebidas sem álcool.

A aplicação foi desenvolvida com React.js e funciona como uma SPA (Single Page Application). Os dados são obtidos de uma API JSON pública utilizando requisições AJAX.

## Funcionalidades

- listar bebidas sem álcool;
- pesquisar bebidas pelo nome;
- ordenar os resultados de A-Z ou Z-A;
- visualizar ingredientes e modo de preparo;
- adicionar e remover favoritos;
- manter os favoritos salvos no navegador.

## Tecnologias utilizadas

- React.js
- JavaScript
- Vite
- Material UI
- HTML e CSS
- TheCocktailDB API

## API utilizada

TheCocktailDB

Documentação:
https://www.thecocktaildb.com/api.php

Foram utilizados os endpoints:

`filter.php?a=Non_Alcoholic`

Utilizado para buscar as bebidas sem álcool.

`lookup.php?i=ID`

Utilizado para consultar os detalhes de uma bebida selecionada.

## AJAX

As requisições para a API são realizadas com a função `fetch()` do JavaScript.

Os dados retornados em JSON são armazenados nos estados do React e a interface é atualizada sem recarregar a página.

## SPA

O projeto possui apenas um arquivo HTML principal.

As alterações na interface, pesquisas e abertura dos detalhes acontecem dinamicamente pelo React, sem redirecionar para outras páginas.

## Funcionalidade do React escolhida

Foi utilizado o `useMemo`.

Ele é aplicado na pesquisa e ordenação das bebidas. A lista filtrada é recalculada somente quando a lista de bebidas, o texto pesquisado ou a ordenação são alterados.

## Biblioteca externa

Foi utilizado o Material UI (MUI).

A biblioteca é utilizada nos campos de pesquisa, botões, cards, modal, alerta e indicador de carregamento.

## Como executar

É necessário possuir Node.js instalado.

No terminal:

```bash
npm install
npm run dev
```

Depois basta abrir o endereço mostrado pelo Vite no navegador.

## Estrutura principal

```text
src/
├── components/
│   ├── CardBebida.jsx
│   └── ModalBebida.jsx
├── App.jsx
├── index.css
└── main.jsx
```

## Uso de ferramentas de apoio

Durante o desenvolvimento foi utilizada uma ferramenta de inteligência artificial como apoio para organização inicial do projeto, esclarecimento de dúvidas e auxílio na estruturação de alguns trechos de código.

O código foi revisado e adaptado para os objetivos da atividade.

