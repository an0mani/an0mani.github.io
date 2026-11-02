import 'dart:math';

import 'package:flutter/material.dart';

import '../theme/clay_colors.dart';

/// Done Buddy 자리에 들어간 임시 캐릭터
///
/// [progress]만큼 웃고, [doneCount]가 늘어날 때마다 통통 튑니다.
class DoneBuddy extends StatefulWidget {
  const DoneBuddy({
    super.key,
    required this.progress,
    required this.doneCount,
    this.size = 84,
  });

  final double progress;
  final int doneCount;
  final double size;

  @override
  State<DoneBuddy> createState() => _DoneBuddyState();
}

class _DoneBuddyState extends State<DoneBuddy> with TickerProviderStateMixin {
  late final AnimationController _bounce = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 550),
  );
  late final AnimationController _blink = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 3600),
  )..repeat();

  @override
  void didUpdateWidget(DoneBuddy oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.doneCount > oldWidget.doneCount) {
      _bounce.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _bounce.dispose();
    _blink.dispose();
    super.dispose();
  }

  // 주기의 마지막 6% 동안 눈을 감았다 뜹니다.
  double get _eyeOpen {
    final value = _blink.value;
    if (value < 0.94) {
      return 1;
    }
    return max(0.1, 1 - sin((value - 0.94) / 0.06 * pi));
  }

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(end: widget.progress),
      duration: const Duration(milliseconds: 700),
      curve: Curves.elasticOut,
      builder: (context, smile, _) => AnimatedBuilder(
        animation: Listenable.merge([_bounce, _blink]),
        builder: (context, _) {
          final jump = sin(pi * _bounce.value);

          return Transform.translate(
            offset: Offset(0, -16 * jump),
            child: Transform(
              alignment: Alignment.bottomCenter,
              transform: Matrix4.diagonal3Values(1 - 0.06 * jump, 1 + 0.08 * jump, 1),
              child: CustomPaint(
                size: Size.square(widget.size),
                painter: _BuddyPainter(smile: smile, eyeOpen: _eyeOpen),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _BuddyPainter extends CustomPainter {
  _BuddyPainter({required this.smile, required this.eyeOpen});

  final double smile;
  final double eyeOpen;

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final s = smile.clamp(-0.2, 1.2);
    final center = Offset(w * 0.5, w * 0.5);
    final radius = w * 0.42;

    canvas.drawOval(
      Rect.fromCenter(center: Offset(w * 0.5, w * 0.95), width: w * 0.6, height: w * 0.1),
      Paint()
        ..color = ClayColors.shadow.withValues(alpha: 0.3)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6),
    );

    canvas.drawCircle(
      center,
      radius,
      Paint()
        ..shader = const RadialGradient(
          center: Alignment(-0.35, -0.45),
          radius: 1,
          colors: [Color(0xFFF6F2FF), ClayColors.lilacDeep],
        ).createShader(Rect.fromCircle(center: center, radius: radius)),
    );

    final eyePaint = Paint()..color = ClayColors.ink;
    for (final x in [0.37, 0.63]) {
      canvas.drawOval(
        Rect.fromCenter(
          center: Offset(w * x, w * 0.45),
          width: w * 0.09,
          height: w * 0.11 * eyeOpen,
        ),
        eyePaint,
      );
    }

    final cheekPaint = Paint()
      ..color = ClayColors.roseDeep.withValues(alpha: (0.25 + 0.6 * s).clamp(0, 1));
    canvas.drawCircle(Offset(w * 0.27, w * 0.58), w * 0.05, cheekPaint);
    canvas.drawCircle(Offset(w * 0.73, w * 0.58), w * 0.05, cheekPaint);

    final edgeY = w * (0.64 - 0.05 * s);
    final mouth = Path()
      ..moveTo(w * (0.36 - 0.05 * s), edgeY)
      ..quadraticBezierTo(w * 0.5, w * (0.66 + 0.16 * s), w * (0.64 + 0.05 * s), edgeY);
    canvas.drawPath(
      mouth,
      Paint()
        ..color = ClayColors.ink
        ..style = PaintingStyle.stroke
        ..strokeWidth = w * 0.045
        ..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(_BuddyPainter oldDelegate) =>
      oldDelegate.smile != smile || oldDelegate.eyeOpen != eyeOpen;
}
