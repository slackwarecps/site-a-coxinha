# Site A Coxinha

Um projeto interativo e divertido dedicado à apreciação da Coxinha.

## Funcionalidades

- **Visualização Centralizada:** Uma bela imagem de uma coxinha dourada centralizada na tela.
- **Interatividade Sonora:** Ao clicar na coxinha, um som de "grito de cabra" é reproduzido (ou um fallback de voz sintetizada "Bééééé").
- **Efeitos Visuais:**
  - **Cursor Gigante:** O cursor do mouse se transforma em uma seta gigante ao passar sobre a coxinha.
  - **Tooltip:** Uma mensagem "Clique na coxinha" aparece ao passar o mouse.
  - **Chuva de Texto:** Ao clicar, a palavra "COXINHA" surge e flutua para o topo da tela.
  - **Sombra:** A imagem possui uma sombra elegante.

## Estrutura do Projeto

```
/Users/fabioalvaropereira/workspaces/www/site-coxinha/
├── images/           # Pasta contendo os arquivos de imagem
│   ├── coxinha.jpg
│   ├── coxinha2.png
│   └── coxinha3.png
├── cabra.ogg         # Arquivo de áudio (efeito sonoro)
├── index.html        # Estrutura principal da página
├── style.css         # Estilos e animações
├── script.js         # Lógica de interação (áudio, cursor, animações)
└── README.md         # Documentação do projeto
```

## Como Executar

1. Navegue até a pasta do projeto.
2. Abra o arquivo `index.html` em seu navegador de preferência.

## Tecnologias

- HTML5
- CSS3 (Flexbox, Animations, Transitions)
- JavaScript (DOM Manipulation, Audio API, Speech Synthesis API)

## Notas

- O arquivo de áudio `cabra.ogg` é utilizado para o efeito sonoro.
- Caso o arquivo de áudio não seja carregado, a API de síntese de voz do navegador é usada como backup.