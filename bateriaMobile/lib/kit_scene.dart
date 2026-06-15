/// Cena do kit: desenho em canvas (CustomPainter) + toque multi-touch.
/// Equivale ao componente Kit (SVG) do drumio web, estilo "preenchido".
library;

import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

import 'drum_audio.dart';
import 'kit_pieces.dart';

/// Efeito visual de um toque: anel que expande e some (ripple).
class _Hit {
  final KitPiece piece;
  final double start; // segundos (relógio do Ticker)
  _Hit(this.piece, this.start);
}

class KitScene extends StatefulWidget {
  const KitScene({super.key});

  @override
  State<KitScene> createState() => _KitSceneState();
}

class _KitSceneState extends State<KitScene>
    with SingleTickerProviderStateMixin {
  late final Ticker _ticker;
  double _now = 0;
  final _hits = <_Hit>[];

  static const _hitLife = 0.55; // duração do ripple em segundos

  @override
  void initState() {
    super.initState();
    // Ticker = requestAnimationFrame do Flutter: repinta enquanto
    // houver ripples vivos na tela.
    _ticker = createTicker((elapsed) {
      setState(() {
        _now = elapsed.inMicroseconds / 1e6;
        _hits.removeWhere((h) => _now - h.start > _hitLife);
        if (_hits.isEmpty) _ticker.stop();
      });
    });
  }

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }

  /// Converte o ponto tocado (pixels da tela) pra cena 1600x1000 e
  /// encontra a peça — testa da frente pra trás, com margem pra dedo.
  void _onPointerDown(PointerDownEvent event, Size size) {
    final fit = _SceneFit.of(size);
    final p = fit.toScene(event.localPosition);

    for (final piece in kitPieces.reversed) {
      if (_hitTest(piece, p)) {
        DrumAudio.instance.play(piece.id);
        _hits.add(_Hit(piece, _now));
        if (!_ticker.isActive) _ticker.start();
        setState(() {});
        return;
      }
    }
  }

  bool _hitTest(KitPiece piece, Offset p) {
    // Dentro da elipse da pele/prato (com 15% de folga pra dedos)?
    final dx = (p.dx - piece.cx) / (piece.rx * 1.15);
    final dy = (p.dy - piece.cy) / (piece.ry * 1.15);
    if (dx * dx + dy * dy <= 1) return true;
    // Ou no corpo do tambor (área entre a pele e a base)?
    if (piece.depth > 0 &&
        (p.dx - piece.cx).abs() <= piece.rx &&
        p.dy >= piece.cy &&
        p.dy <= piece.cy + piece.depth + piece.ry) {
      return true;
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final size = constraints.biggest;
        return Listener(
          // Listener (e não GestureDetector) pra receber cada dedo
          // separadamente — multi-touch é essencial numa bateria.
          onPointerDown: (e) => _onPointerDown(e, size),
          child: CustomPaint(
            size: size,
            painter: _KitPainter(hits: _hits, now: _now, life: _hitLife),
          ),
        );
      },
    );
  }
}

/// Ajuste da cena virtual (1600x1000) dentro da tela: escala "contain"
/// centralizada, igual ao preserveAspectRatio do SVG.
class _SceneFit {
  final double scale;
  final Offset offset;
  _SceneFit(this.scale, this.offset);

  factory _SceneFit.of(Size size) {
    final scale =
        math.min(size.width / sceneWidth, size.height / sceneHeight);
    final offset = Offset(
      (size.width - sceneWidth * scale) / 2,
      (size.height - sceneHeight * scale) / 2,
    );
    return _SceneFit(scale, offset);
  }

  Offset toScene(Offset screen) => (screen - offset) / scale;
}

class _KitPainter extends CustomPainter {
  final List<_Hit> hits;
  final double now;
  final double life;

  _KitPainter({required this.hits, required this.now, required this.life});

  static const _accent = Color(0xFFF4F4F4);

  @override
  void paint(Canvas canvas, Size size) {
    // Fundo preto + brilho radial sutil perto do chão (clima de palco).
    canvas.drawRect(Offset.zero & size, Paint()..color = Colors.black);
    canvas.drawRect(
      Offset.zero & size,
      Paint()
        ..shader = RadialGradient(
          center: const Alignment(0, 0.72),
          radius: 1.1,
          colors: [Colors.white.withValues(alpha: 0.05), Colors.transparent],
          stops: const [0, 0.6],
        ).createShader(Offset.zero & size),
    );

    final fit = _SceneFit.of(size);
    canvas.save();
    canvas.translate(fit.offset.dx, fit.offset.dy);
    canvas.scale(fit.scale);

    _paintFloor(canvas);
    for (final piece in kitPieces) {
      _paintPiece(canvas, piece);
    }
    for (final hit in hits) {
      _paintRipple(canvas, hit);
    }

    canvas.restore();
  }

  /// Grade de chão em perspectiva: linhas convergindo pro ponto de fuga,
  /// igual ao PerspectiveFloor do web.
  void _paintFloor(Canvas canvas) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    const vp = Offset(800, 232); // ponto de fuga

    for (var i = -7; i <= 7; i++) {
      canvas.drawLine(vp, Offset(800 + i * 150.0, sceneHeight), paint);
    }
    for (var d = 0; d < 9; d++) {
      final y = vp.dy + math.pow(d / 8, 1.8) * (sceneHeight - vp.dy);
      canvas.drawLine(Offset(0, y), Offset(sceneWidth, y), paint);
    }
  }

  void _paintPiece(Canvas canvas, KitPiece p) {
    final rim = Paint()
      ..color = Colors.white.withValues(alpha: 0.55)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;
    final fill = Paint()..color = Colors.white.withValues(alpha: 0.07);

    final head = Rect.fromCenter(
      center: Offset(p.cx, p.cy),
      width: p.rx * 2,
      height: p.ry * 2,
    );

    if (p.type == PieceType.drum) {
      // Corpo do tambor: laterais retas + barriga em arco embaixo.
      final shell = Path()
        ..moveTo(p.cx - p.rx, p.cy)
        ..lineTo(p.cx - p.rx, p.cy + p.depth)
        ..arcTo(
          Rect.fromCenter(
            center: Offset(p.cx, p.cy + p.depth),
            width: p.rx * 2,
            height: p.ry * 2,
          ),
          math.pi,
          -math.pi,
          false,
        )
        ..lineTo(p.cx + p.rx, p.cy)
        ..close();
      canvas.drawPath(shell, fill);
      canvas.drawPath(shell, rim..strokeWidth = 1.5);
      // Pele por cima, um pouco mais clara que o corpo.
      canvas.drawOval(head, Paint()..color = Colors.white.withValues(alpha: 0.12));
      canvas.drawOval(head, rim..strokeWidth = 2.5);
    } else {
      // Prato/chimbal: haste + elipse(s) metálica(s).
      final stand = Paint()
        ..color = Colors.white.withValues(alpha: 0.25)
        ..strokeWidth = 3;
      canvas.drawLine(
        Offset(p.cx, p.cy + p.ry),
        Offset(p.cx, p.cy + p.ry + 130),
        stand,
      );
      if (p.type == PieceType.hihat) {
        // Chimbal = dois pratos quase colados.
        final lower = head.translate(0, 14);
        canvas.drawOval(lower, fill);
        canvas.drawOval(lower, rim..strokeWidth = 2);
      }
      canvas.drawOval(head, Paint()..color = Colors.white.withValues(alpha: 0.1));
      canvas.drawOval(head, rim..strokeWidth = 2.5);
      // Sino no centro do prato.
      canvas.drawOval(
        Rect.fromCenter(
          center: Offset(p.cx, p.cy),
          width: p.rx * 0.32,
          height: p.ry * 0.32,
        ),
        rim..strokeWidth = 1.5,
      );
    }

    // Nome da peça, discreto, abaixo dela.
    final tp = TextPainter(
      text: TextSpan(
        text: p.label.toUpperCase(),
        style: TextStyle(
          color: Colors.white.withValues(alpha: 0.3),
          fontSize: 17,
          letterSpacing: 2.5,
          fontWeight: FontWeight.w500,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    tp.paint(
      canvas,
      Offset(p.cx - tp.width / 2, p.cy + p.depth + p.ry + 12),
    );
  }

  /// Anel que expande e desaparece a partir da peça tocada.
  void _paintRipple(Canvas canvas, _Hit hit) {
    final t = ((now - hit.start) / life).clamp(0.0, 1.0);
    final eased = 1 - math.pow(1 - t, 3).toDouble(); // ease-out
    final p = hit.piece;
    final ring = Paint()
      ..color = _accent.withValues(alpha: (1 - t) * 0.8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.5 * (1 - t) + 1;
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(p.cx, p.cy),
        width: p.rx * 2 * (1 + eased * 0.45),
        height: p.ry * 2 * (1 + eased * 0.45),
      ),
      ring,
    );
  }

  @override
  bool shouldRepaint(_KitPainter old) =>
      old.now != now || old.hits.length != hits.length;
}
