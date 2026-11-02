import 'package:flutter/material.dart';

import '../models/task.dart';
import '../theme/clay_colors.dart';
import 'burst.dart';
import 'clay_box.dart';
import 'squishy.dart';

class TaskTile extends StatelessWidget {
  const TaskTile({
    super.key,
    required this.task,
    required this.burstCount,
    required this.onTap,
  });

  final Task task;
  final int burstCount;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Squishy(
      onTap: onTap,
      child: ClayBox(
        color: task.isDone ? ClayColors.mint : Colors.white,
        radius: 22,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            SizedBox.square(
              dimension: 32,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  ClayBox(
                    color: task.isDone ? Colors.white : ClayColors.lilac,
                    radius: 16,
                    padding: EdgeInsets.zero,
                    isPressed: !task.isDone,
                    child: TweenAnimationBuilder<double>(
                      tween: Tween(end: task.isDone ? 1 : 0),
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeOut,
                      builder: (context, value, _) => CustomPaint(
                        size: const Size.square(32),
                        painter: _CheckPainter(value),
                      ),
                    ),
                  ),
                  if (burstCount > 0)
                    Positioned.fill(
                      child: IgnorePointer(child: Burst(key: ValueKey(burstCount))),
                    ),
                ],
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 200),
                style: TextStyle(
                  fontFamily: 'Jua',
                  fontSize: 17,
                  color: ClayColors.ink.withValues(alpha: task.isDone ? 0.55 : 1),
                  decoration: task.isDone ? TextDecoration.lineThrough : TextDecoration.none,
                  decorationColor: ClayColors.ink.withValues(alpha: 0.55),
                ),
                child: Text(task.title),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// [progress]만큼 체크 표시를 그립니다.
class _CheckPainter extends CustomPainter {
  _CheckPainter(this.progress);

  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0) {
      return;
    }

    final path = Path()
      ..moveTo(size.width * 0.25, size.height * 0.52)
      ..lineTo(size.width * 0.43, size.height * 0.7)
      ..lineTo(size.width * 0.77, size.height * 0.32);
    final metric = path.computeMetrics().first;
    final paint = Paint()
      ..color = ClayColors.mintDeep
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.drawPath(metric.extractPath(0, metric.length * progress), paint);
  }

  @override
  bool shouldRepaint(_CheckPainter oldDelegate) => oldDelegate.progress != progress;
}
