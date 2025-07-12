# Portal Emocional Web

Este projeto é um portal estático para aplicação de questionários de saúde mental **PHQ-9**, **GAD-7** e **DASS-21**. O site pode ser hospedado no GitHub Pages e utiliza apenas HTML, CSS e JavaScript.

## Desenvolvimento

1. Clone o repositório e abra os arquivos `index.html`, `src/app.js` e `src/score.js` para ajustes.
2. Para rodar os testes das funções de cálculo execute:

```bash
node tests/score.test.js
```

## Deploy no GitHub Pages

O workflow `deploy.yml` gera o artefato estático e publica em GitHub Pages a cada push na branch `main`.

## Questionários

Os questionários seguem as versões oficiais e o cálculo de pontuação está implementado em `src/score.js`.
