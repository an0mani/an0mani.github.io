import 'package:flutter/material.dart';

/// 누르면 찌그러졌다가 놓으면 스프링처럼 튀어 오르는 래퍼
class Squishy extends StatefulWidget {
  const Squishy({super.key, required this.child, required this.onTap});

  final Widget child;
  final VoidCallback? onTap;

  @override
  State<Squishy> createState() => _SquishyState();
}

class _SquishyState extends State<Squishy> {
  static const _pressDuration = Duration(milliseconds: 90);

  bool _isPressed = false;
  DateTime _pressedAt = DateTime.now();

  void _press() {
    _pressedAt = DateTime.now();
    setState(() => _isPressed = true);
  }

  // 아주 짧게 탭해도 눌림이 보이도록 최소 시간을 지킨 뒤 놓습니다.
  Future<void> _release() async {
    final elapsed = DateTime.now().difference(_pressedAt);
    if (elapsed < _pressDuration) {
      await Future<void>.delayed(_pressDuration - elapsed);
    }
    if (!mounted) {
      return;
    }
    setState(() => _isPressed = false);
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: (_) => _press(),
        onTapUp: (_) => _release(),
        onTapCancel: _release,
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: _isPressed ? _pressDuration : const Duration(milliseconds: 650),
          curve: _isPressed ? Curves.easeOut : Curves.elasticOut,
          transformAlignment: Alignment.center,
          transform: _isPressed
              ? Matrix4.diagonal3Values(1.05, 0.9, 1)
              : Matrix4.identity(),
          child: widget.child,
        ),
      ),
    );
  }
}
