# drumio

Simulador de bateria que roda 100% no browser, sem instalar nada. Abre o HTML e toca.

Fiz porque toco bateria e queria entender áudio na web. Os sons são gravações reais de uma bateria acústica de estúdio, embutidas no próprio arquivo — e existe um sintetizador matemático via Web Audio API como fallback enquanto os samples carregam.

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

**Modo Virada** — monte a sua própria virada (drum fill) e treine-a:
- Grade própria de 4, 8 ou 16 passos, uma linha por peça — escolha quais instrumentos e em que ordem
- Clique esquerdo: ativa/desativa · clique direito: roll (×2 a ×8), igual ao sequenciador
- **INÍCIO** loopa a virada com as guias na cena POV, para você praticar acompanhando
- No **Modo Sequenciador**, ligue **Virada no loop** para encaixar a sua virada automaticamente a cada 2, 4 ou 8 compassos — como numa música de verdade

## Build

O `drumio-standalone.html` é gerado a partir dos módulos-fonte legíveis em `extracted/` (cada arquivo = um UUID do manifesto embutido). Depois de editar qualquer arquivo em `extracted/`, rode `python3 build.py` para re-empacotar no HTML. Use `python3 build.py --check` para ver se o HTML está sincronizado com o source.

## Stack

- HTML + CSS + JavaScript puro
- React (carregado via CDN, sem build)
- Web Audio API para reprodução dos samples (com síntese matemática como fallback)
- Samples acústicos do [The Open Source Drum Kit](https://github.com/crabacus/the-open-source-drumkit) (Real Music Media), convertidos para MP3 mono 32kHz e embutidos em base64

## Por que um único HTML?

Porque é fácil de compartilhar. Manda o arquivo, abre no browser, funciona.
