/// Geometria do kit em primeira pessoa (POV do banco do baterista).
/// Mesmos valores do drumio web: cena virtual de 1600x1000, peças próximas
/// ficam baixas e grandes, pratos ficam altos e achatados (perspectiva).
library;

/// Tipo da peça — muda como ela é desenhada e o som que toca.
enum PieceType { cymbal, drum, hihat }

class KitPiece {
  final String id; // nome do arquivo de sample em assets/sounds/<id>.wav
  final String label;
  final PieceType type;
  final double cx, cy; // centro da elipse (coordenadas da cena 1600x1000)
  final double rx, ry; // raios da elipse
  final double depth; // altura do corpo do tambor (0 para pratos)
  final double gain; // volume relativo pra mixagem ficar equilibrada

  const KitPiece({
    required this.id,
    required this.label,
    required this.type,
    required this.cx,
    required this.cy,
    required this.rx,
    required this.ry,
    this.depth = 0,
    this.gain = 0.85,
  });
}

/// Ordem de fundo pra frente — o desenho segue essa ordem e o toque
/// testa na ordem inversa (peça da frente ganha).
const kitPieces = <KitPiece>[
  KitPiece(id: 'crash', label: 'Ataque', type: PieceType.cymbal, cx: 360, cy: 296, rx: 150, ry: 44, gain: 0.7),
  KitPiece(id: 'ride', label: 'Condução', type: PieceType.cymbal, cx: 1244, cy: 352, rx: 166, ry: 52, gain: 0.6),
  KitPiece(id: 'tom2', label: 'Tom Médio', type: PieceType.drum, cx: 968, cy: 470, rx: 118, ry: 48, depth: 74),
  KitPiece(id: 'tom1', label: 'Tom Agudo', type: PieceType.drum, cx: 632, cy: 470, rx: 110, ry: 46, depth: 70),
  KitPiece(id: 'hihat', label: 'Chimbal', type: PieceType.hihat, cx: 236, cy: 632, rx: 122, ry: 36, gain: 0.55),
  KitPiece(id: 'kick', label: 'Bumbo', type: PieceType.drum, cx: 800, cy: 700, rx: 232, ry: 90, depth: 150, gain: 1.0),
  KitPiece(id: 'floor', label: 'Tom de Chão', type: PieceType.drum, cx: 1300, cy: 742, rx: 150, ry: 64, depth: 122, gain: 0.9),
  KitPiece(id: 'snare', label: 'Caixa', type: PieceType.drum, cx: 506, cy: 802, rx: 130, ry: 54, depth: 60, gain: 0.9),
];

/// Largura/altura da cena virtual em que as peças foram posicionadas.
const sceneWidth = 1600.0;
const sceneHeight = 1000.0;
