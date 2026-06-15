/// Camada de áudio — carrega os samples acústicos (The Open Source Drum Kit)
/// e toca com a menor latência possível via flutter_soloud (engine C++).
library;

import 'package:flutter_soloud/flutter_soloud.dart';

import 'kit_pieces.dart';

class DrumAudio {
  DrumAudio._(); // singleton — uma engine de áudio só pro app inteiro
  static final DrumAudio instance = DrumAudio._();

  final _soloud = SoLoud.instance;
  final _sources = <String, AudioSource>{};
  final _gains = <String, double>{};
  bool _ready = false;

  bool get ready => _ready;

  /// Inicializa a engine e pré-carrega todos os samples na memória.
  /// Chamar uma vez no startup; tocar antes disso é silenciosamente ignorado.
  Future<void> init() async {
    if (_ready) return;
    await _soloud.init();
    for (final piece in kitPieces) {
      _sources[piece.id] =
          await _soloud.loadAsset('assets/sounds/${piece.id}.wav');
      _gains[piece.id] = piece.gain;
    }
    _ready = true;
  }

  /// Dispara o sample da peça. Cada chamada cria uma voz nova, então
  /// toques rápidos se sobrepõem naturalmente (como numa bateria real).
  void play(String id) {
    final source = _sources[id];
    if (source == null) return;
    _soloud.play(source, volume: _gains[id] ?? 0.85);
  }

  void dispose() {
    _soloud.deinit();
    _sources.clear();
    _ready = false;
  }
}
