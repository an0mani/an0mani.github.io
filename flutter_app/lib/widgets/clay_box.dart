import 'package:flutter/material.dart';

import '../theme/clay_colors.dart';

/// 클레이 질감 상자
///
/// Flutter의 BoxShadow는 안쪽 그림자(inset)를 지원하지 않아서,
/// 그라디언트로 빛을 받은 볼륨을 흉내 냅니다.
/// [isPressed]가 true면 빛 방향을 뒤집어 안으로 파인 것처럼 보입니다.
class ClayBox extends StatelessWidget {
  const ClayBox({
    super.key,
    required this.child,
    this.color = Colors.white,
    this.radius = 28,
    this.padding = const EdgeInsets.all(20),
    this.isPressed = false,
  });

  final Widget child;
  final Color color;
  final double radius;
  final EdgeInsetsGeometry padding;
  final bool isPressed;

  @override
  Widget build(BuildContext context) {
    final highlight = Color.lerp(color, Colors.white, 0.5)!;
    final shade = Color.lerp(color, ClayColors.shadow, 0.1)!;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeOut,
      padding: padding,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(radius),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isPressed ? [shade, color, highlight] : [highlight, color, shade],
          stops: const [0, 0.45, 1],
        ),
        boxShadow: isPressed
            ? [
                BoxShadow(
                  color: Colors.white.withValues(alpha: 0.8),
                  offset: const Offset(2, 2),
                  blurRadius: 4,
                ),
              ]
            : [
                BoxShadow(
                  color: ClayColors.shadow.withValues(alpha: 0.28),
                  offset: const Offset(8, 10),
                  blurRadius: 20,
                ),
                BoxShadow(
                  color: Colors.white.withValues(alpha: 0.7),
                  offset: const Offset(-4, -4),
                  blurRadius: 10,
                ),
              ],
      ),
      child: child,
    );
  }
}
