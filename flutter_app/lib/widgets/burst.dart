import 'dart:math';

import 'package:flutter/material.dart';

import '../theme/clay_colors.dart';

/// 체크할 때 사방으로 튀는 작은 점토 조각
///
/// key가 바뀔 때마다 새로 만들어지면서 한 번 재생됩니다.
class Burst extends StatefulWidget {
  const Burst({super.key});

  @override
  State<Burst> createState() => _BurstState();
}

class _BurstState extends State<Burst> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 650),
  )..forward();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, _) => CustomPaint(
        painter: _BurstPainter(Curves.easeOut.transform(_controller.value)),
      ),
    );
  }
}

class _BurstPainter extends CustomPainter {
  _BurstPainter(this.progress);

  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    if (progress >= 1) {
      return;
    }

    final center = size.center(Offset.zero);
    const colors = ClayColors.burst;

    for (var i = 0; i < colors.length; i++) {
      final angle = i / colors.length * 2 * pi;
      final offset = Offset(cos(angle), sin(angle)) * (8 + 26 * progress);
      final paint = Paint()..color = colors[i].withValues(alpha: 1 - progress);
      canvas.drawCircle(center + offset, 5 * (1 - progress), paint);
    }
  }

  @override
  bool shouldRepaint(_BurstPainter oldDelegate) => oldDelegate.progress != progress;
}
