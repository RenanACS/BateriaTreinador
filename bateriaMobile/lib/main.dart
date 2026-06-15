/// drumio mobile — port do drumio web (React + Web Audio) pra Flutter.
/// Modo atual: toque livre no kit com samples acústicos reais.
library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'drum_audio.dart';
import 'kit_scene.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Bateria pede tela deitada e sem barras do sistema atrapalhando.
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
  runApp(const DrumioApp());
}

class DrumioApp extends StatelessWidget {
  const DrumioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'drumio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(brightness: Brightness.dark, useMaterial3: true),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _audioReady = false;
  String? _audioError;

  @override
  void initState() {
    super.initState();
    _initAudio();
  }

  Future<void> _initAudio() async {
    try {
      await DrumAudio.instance.init();
      if (mounted) setState(() => _audioReady = true);
    } catch (e) {
      // Sem áudio o app ainda abre — mostra o erro em vez de travar.
      if (mounted) setState(() => _audioError = '$e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          const Positioned.fill(child: KitScene()),
          // Logo no canto, igual ao web.
          Positioned(
            top: 18,
            left: 24,
            child: IgnorePointer(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'DRUMIO',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 3,
                    ),
                  ),
                  Text(
                    'TREINO POV · MOBILE',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.4),
                      fontSize: 10.5,
                      letterSpacing: 2.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Aviso enquanto os samples carregam (ou se o áudio falhar).
          if (!_audioReady)
            Positioned(
              bottom: 24,
              left: 0,
              right: 0,
              child: IgnorePointer(
                child: Text(
                  _audioError ?? 'carregando samples…',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: _audioError == null
                        ? Colors.white.withValues(alpha: 0.45)
                        : Colors.redAccent,
                    fontSize: 12,
                    letterSpacing: 1.5,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
