# drumio

Simulador de bateria que roda 100% no browser, sem instalar nada. Abre o HTML e toca.

Fiz porque toco bateria e queria entender síntese de áudio na web — cada som é gerado matematicamente pela Web Audio API, sem samples externos.

## Como usar

Baixe `drumio-standalone.html` e abra no navegador. Só isso.

## O que tem

**Modo Polirritmia** — cada instrumento mantém o seu próprio BPM. Ative os que quiser e use os anéis-guia para treinar precisão de tempo. Toque com o mouse ou com as teclas:

| Tecla | Instrumento |
|-------|-------------|
| F | Chimbal |
| Espaço | Bumbo |
| J | Caixa |
| U | Tom Agudo |
| I | Tom Médio |
| O | Tom de Chão |
| Q | Ataque |
| P | Condução |

**Modo Sequenciador** — monte um padrão passo a passo:
- BPM global para todos os instrumentos
- Cada instrumento tem o seu próprio número de passos (4 a 64) — loops de tamanhos diferentes criam polirritmia natural
- Clique esquerdo: ativa/desativa um passo
- Clique direito: define roll (×2 a ×8 sub-toques dentro do passo)
- Contagem regressiva **3 · 2 · 1** antes de começar, no tempo do BPM

## Stack

- HTML + CSS + JavaScript puro
- React (carregado via CDN, sem build)
- Web Audio API para síntese de áudio

## Por que um único HTML?

Porque é fácil de compartilhar. Manda o arquivo, abre no browser, funciona.
