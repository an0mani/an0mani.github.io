import 'package:flutter/material.dart';

import 'screens/done_screen.dart';
import 'theme/clay_colors.dart';

void main() {
  runApp(const DoneItMiniApp());
}

class DoneItMiniApp extends StatelessWidget {
  const DoneItMiniApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Done It mini',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Jua',
        scaffoldBackgroundColor: ClayColors.background,
        colorScheme: ColorScheme.fromSeed(
          seedColor: ClayColors.lilacDeep,
          surface: ClayColors.background,
        ),
        textSelectionTheme: const TextSelectionThemeData(
          cursorColor: ClayColors.ink,
          selectionColor: ClayColors.lilac,
        ),
      ),
      home: const DoneScreen(),
    );
  }
}
