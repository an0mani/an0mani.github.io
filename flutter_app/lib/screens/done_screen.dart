import 'package:flutter/material.dart';

import '../models/task.dart';
import '../theme/clay_colors.dart';
import '../widgets/clay_box.dart';
import '../widgets/done_buddy.dart';
import '../widgets/squishy.dart';
import '../widgets/task_tile.dart';

class DoneScreen extends StatefulWidget {
  const DoneScreen({super.key});

  @override
  State<DoneScreen> createState() => _DoneScreenState();
}

class _DoneScreenState extends State<DoneScreen> {
  static const _maxTasks = 8;

  final _listKey = GlobalKey<AnimatedListState>();
  final _textController = TextEditingController();
  final _tasks = <Task>[
    Task(title: '물 한 잔 마시기'),
    Task(title: '커밋 하나 올리기'),
    Task(title: '스트레칭 5분'),
    Task(title: '포트폴리오 구경하기'),
  ];
  late final _burstCounts = List<int>.filled(_tasks.length, 0, growable: true);

  int get _doneCount => _tasks.where((task) => task.isDone).length;

  bool get _isAllDone => _tasks.isNotEmpty && _doneCount == _tasks.length;

  void _toggleTask(int index) {
    setState(() {
      final task = _tasks[index];
      task.isDone = !task.isDone;
      if (task.isDone) {
        _burstCounts[index]++;
      }
    });
  }

  void _addTask() {
    final title = _textController.text.trim();
    if (title.isEmpty || _tasks.length >= _maxTasks) {
      return;
    }

    setState(() {
      _tasks.add(Task(title: title));
      _burstCounts.add(0);
    });
    _listKey.currentState?.insertItem(
      _tasks.length - 1,
      duration: const Duration(milliseconds: 450),
    );
    _textController.clear();
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 44, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Done It', style: TextStyle(fontSize: 30, color: ClayColors.ink)),
                  Text(
                    '오늘 해낸 일을 눌러 주세요',
                    style: TextStyle(fontSize: 15, color: ClayColors.muted),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 4),
              child: _buildSummary(),
            ),
            Expanded(
              child: AnimatedList(
                key: _listKey,
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                initialItemCount: _tasks.length,
                itemBuilder: (context, index, animation) => _buildTaskItem(index, animation),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 4, 20, 20),
              child: _buildInput(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummary() {
    final progress = _tasks.isEmpty ? 0.0 : _doneCount / _tasks.length;

    return ClayBox(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          DoneBuddy(progress: progress, doneCount: _doneCount),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$_doneCount / ${_tasks.length} 해냈어요',
                  style: const TextStyle(fontSize: 19, color: ClayColors.ink),
                ),
                const SizedBox(height: 8),
                _buildProgressBar(progress),
                const SizedBox(height: 8),
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 500),
                  transitionBuilder: (child, animation) => ScaleTransition(
                    scale: CurvedAnimation(parent: animation, curve: Curves.elasticOut),
                    alignment: Alignment.centerLeft,
                    child: child,
                  ),
                  child: _isAllDone
                      ? const Row(
                          key: ValueKey('all-done'),
                          children: [
                            Icon(Icons.celebration_rounded, size: 18, color: ClayColors.butterDeep),
                            SizedBox(width: 4),
                            Text(
                              '오늘도 해냈어요!',
                              style: TextStyle(fontSize: 15, color: ClayColors.ink),
                            ),
                          ],
                        )
                      : const Text(
                          '하나씩 눌러 볼까요?',
                          key: ValueKey('in-progress'),
                          style: TextStyle(fontSize: 15, color: ClayColors.muted),
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressBar(double progress) {
    return Container(
      height: 14,
      padding: const EdgeInsets.all(3),
      alignment: Alignment.centerLeft,
      decoration: BoxDecoration(
        color: ClayColors.lilac.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(999),
      ),
      child: TweenAnimationBuilder<double>(
        tween: Tween(end: progress),
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeOutBack,
        builder: (context, value, _) => FractionallySizedBox(
          widthFactor: value.clamp(0, 1),
          heightFactor: 1,
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: ClayColors.lilacDeep,
              borderRadius: BorderRadius.circular(999),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTaskItem(int index, Animation<double> animation) {
    return SizeTransition(
      sizeFactor: CurvedAnimation(parent: animation, curve: Curves.easeOut),
      child: ScaleTransition(
        scale: CurvedAnimation(parent: animation, curve: Curves.elasticOut),
        child: Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: TaskTile(
            task: _tasks[index],
            burstCount: _burstCounts[index],
            onTap: () => _toggleTask(index),
          ),
        ),
      ),
    );
  }

  Widget _buildInput() {
    final isFull = _tasks.length >= _maxTasks;

    return Row(
      children: [
        Expanded(
          child: ClayBox(
            radius: 20,
            isPressed: true,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TextField(
              controller: _textController,
              enabled: !isFull,
              maxLength: 20,
              onSubmitted: (_) => _addTask(),
              style: const TextStyle(fontSize: 16, color: ClayColors.ink),
              decoration: InputDecoration(
                border: InputBorder.none,
                counterText: '',
                hintText: isFull ? '오늘은 여기까지!' : '할 일 추가하기',
                hintStyle: const TextStyle(color: ClayColors.muted),
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Squishy(
          onTap: _addTask,
          child: const ClayBox(
            color: ClayColors.lilac,
            radius: 20,
            padding: EdgeInsets.all(14),
            child: Icon(Icons.add_rounded, color: ClayColors.ink),
          ),
        ),
      ],
    );
  }
}
