# Graph Report - 9 КЛАСС  (2026-09-06)

## Corpus Check
- 68 files · ~41,617 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 671 nodes · 966 edges · 34 communities
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1c884ca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- 9 КЛАСС — Тренажёр
- MainWindow
- Урок 03 - Запись вспомогательных алгоритмов на Python
- LessonMarkdownParser
- Grade9Trainer.Core.Services
- ProgressStore
- Тренировка по шагам
- Урок 00. Быстрая проверка языка химии
- Тренировка по шагам
- build_student_vault.py
- Урок 03. Запись вспомогательных алгоритмов на Python
- Урок 02. Вспомогательные алгоритмы
- Тренировка по шагам
- Тренировка по шагам
- Тренировка по шагам
- PlainTextFormatter
- Тренировка по шагам
- Урок 02. Путь, перемещение и координата
- Урок 03. Равномерное прямолинейное движение
- Урок 01. Материальная точка и система отсчета
- Урок 02. Классификация химических реакций
- Урок 03. Скорость химических реакций
- Grade9Trainer.App.csproj
- Настройка Syncthing на двух компьютерах Windows
- Стартовый запас: физика и химия
- Проект «9 КЛАСС»
- Q: добавь еще третий урок по информатике
- Q: возможно создать программу для обучения ученика 9 класса на основе наших уроков на с# с возможностью дальнейшего добавления уроков
- Q: отлично тогда начнем; продолжи создание программы для обучения ученика 9 класса на C#
- Q: опубликовать 9 КЛАСС — Тренажёр MVP на GitHub и закоммитить все изменения
- MermaidDiagramParser
- StudentProfileStore
- LessonEditorWindow
- Q: Mermaid показывается как офлайн-схема со стрелками. Полноценные графические диаграммы, редактор преподавателя, несколько учеников и синхронизация — следующие этапы. давай перейдем к следующим этапам

## God Nodes (most connected - your core abstractions)
1. `MainWindow` - 30 edges
2. `LessonMarkdownParser` - 22 edges
3. `ProgressStore` - 21 edges
4. `Window` - 20 edges
5. `Урок 03 - Запись вспомогательных алгоритмов на Python` - 18 edges
6. `StudentProfileStore` - 17 edges
7. `MermaidDiagramParser` - 15 edges
8. `Grade9Trainer.Core.Services` - 14 edges
9. `PlainTextFormatter` - 14 edges
10. `LessonEditorWindow` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Сверка с учебниками - старт 9 класса` --references--> `Урок 01. Материальная точка и система отсчета`  [EXTRACTED]
  Общий/Сверка с учебниками - старт 9 класса.md → Физика/Уроки/Урок 01 - Материальная точка и система отсчета.md
- `Сверка с учебниками - старт 9 класса` --references--> `Урок 00. Быстрая проверка языка химии`  [EXTRACTED]
  Общий/Сверка с учебниками - старт 9 класса.md → Химия/Уроки/Урок 00 - Быстрая проверка языка химии.md
- `Сверка с учебниками - старт 9 класса` --references--> `Урок 01. Классификация химических соединений`  [EXTRACTED]
  Общий/Сверка с учебниками - старт 9 класса.md → Химия/Уроки/Урок 01 - Классификация химических соединений.md
- `9 КЛАСС README` --references--> `Информатика README`  [EXTRACTED]
  README.md → Информатика/README.md
- `Сверка с учебниками - старт 9 класса` --references--> `Урок 01 - Введение и информационная безопасность`  [EXTRACTED]
  Общий/Сверка с учебниками - старт 9 класса.md → Информатика/Уроки/Урок 01 - Введение и информационная безопасность.md

## Import Cycles
- None detected.

## Communities (34 total, 0 thin omitted)

### Community 0 - "9 КЛАСС — Тренажёр"
Cohesion: 0.11
Nodes (21): Физика README, Урок 01. Материальная точка и система отсчета, Формат добавляемого урока, 9 КЛАСС — Тренажёр, Где хранятся данные, Готовая Windows-сборка, Границы версии 0.2 и следующие этапы, Запуск для разработки (+13 more)

### Community 1 - "MainWindow"
Cohesion: 0.07
Nodes (31): DisplayTitle, FrameworkElement, LessonContent, LessonList, LessonMeta, LessonProgress, LessonScroll, LessonTitle (+23 more)

### Community 2 - "Урок 03 - Запись вспомогательных алгоритмов на Python"
Cohesion: 0.05
Nodes (40): 1. Функция без параметров, 2. Параметр и аргумент, 3. Возвращаемое значение, Алгоритм словами, Домашнее задание, Дополнительно, Дополнительно, Дополнительно (+32 more)

### Community 3 - "LessonMarkdownParser"
Cohesion: 0.12
Nodes (15): Body, IReadOnlyList, CatalogLoadResult, ImportResult, LessonDocument, LessonMetadata, LessonStep, LessonCatalogService (+7 more)

### Community 4 - "Grade9Trainer.Core.Services"
Cohesion: 0.06
Nodes (22): ComboBox, Grade9Trainer.Core.Models, Grade9Trainer.Core.Services, Grade9Trainer.UiSmoke, Grade9Trainer.App, DependencyObject, Application, App (+14 more)

### Community 5 - "ProgressStore"
Cohesion: 0.15
Nodes (14): DateTimeOffset, Dictionary, JsonSerializerOptions, LessonProgress, LastOpenedUtc, Steps, ProgressStore, StepProgress (+6 more)

### Community 6 - "Тренировка по шагам"
Cohesion: 0.08
Nodes (23): Вопросы ученика, Кислоты, Комментарий преподавателя, Наглядная схема, Оксиды, Основания, Основные классы сложных веществ, Пример 1 (+15 more)

### Community 7 - "Урок 00. Быстрая проверка языка химии"
Cohesion: 0.09
Nodes (22): Алгоритм расстановки коэффициентов, Вопросы ученика, Индекс и коэффициент, Как читать химическую формулу, Комментарий преподавателя, Наглядная схема, Пример 1, Пример 2 (+14 more)

### Community 8 - "Тренировка по шагам"
Cohesion: 0.09
Nodes (21): Вопросы ученика, Информационная безопасность, Комментарий преподавателя, Личные данные, Наглядная схема, Обзор курса 9 класса, Пароли, Работа за компьютером (+13 more)

### Community 9 - "build_student_vault.py"
Cohesion: 0.19
Nodes (21): Path, build(), callout(), clean_section(), header(), learning_step(), lesson_path(), main() (+13 more)

### Community 10 - "Урок 03. Запись вспомогательных алгоритмов на Python"
Cohesion: 0.10
Nodes (19): 1. Функция без параметров, 2. Параметр и аргумент, 3. Возвращаемое значение, Алгоритм словами, Вопросы ученика, Комментарий преподавателя, Наглядная схема, Программа (+11 more)

### Community 11 - "Урок 02. Вспомогательные алгоритмы"
Cohesion: 0.11
Nodes (17): Вариант через исполнителя, Вопросы ученика, Вспомогательный алгоритм, Комментарий преподавателя, Наглядная схема, Новая идея, Пример на Python, Трассировка запуска (+9 more)

### Community 12 - "Тренировка по шагам"
Cohesion: 0.11
Nodes (17): Вопросы ученика, Дополнительный блок: таблица и график, Комментарий преподавателя, Модель и формулы, Наглядная схема, Перевод единиц, Разобранный пример, Тренировка по шагам (+9 more)

### Community 13 - "Тренировка по шагам"
Cohesion: 0.11
Nodes (17): Вопросы ученика, Комментарий преподавателя, Наглядная схема, От вещества к реакции, Разобранный пример, Тренировка по шагам, Урок 02. Классификация химических реакций, Четыре типа по составу участников (+9 more)

### Community 14 - "Тренировка по шагам"
Cohesion: 0.11
Nodes (17): Вопросы ученика, Комментарий преподавателя, Наглядная схема, Разобранный пример: сравниваем одно условие, Тренировка по шагам, Урок 03. Скорость химических реакций, Что значит «быстрее», Что может влиять на скорость (+9 more)

### Community 15 - "PlainTextFormatter"
Cohesion: 0.29
Nodes (5): GeneratedRegex, IEnumerable, IReadOnlyList, Regex, PlainTextFormatter

### Community 16 - "Тренировка по шагам"
Cohesion: 0.12
Nodes (15): Вопросы ученика, Комментарий преподавателя, Координата и проекция, Наглядная схема, Объяснение через маршрут, Разобранный пример, Тренировка по шагам, Урок 02. Путь, перемещение и координата (+7 more)

### Community 17 - "Урок 02. Путь, перемещение и координата"
Cohesion: 0.13
Nodes (14): 10. После занятия, 1. Разминка без оценки, 2. Объяснение через маршрут, 3. Разобранный пример, 4. Практика вместе, 5. Самостоятельная работа, 6. Выходной вопрос и решение о следующем уроке, 7. Домашнее задание на 10–15 минут (+6 more)

### Community 18 - "Урок 03. Равномерное прямолинейное движение"
Cohesion: 0.13
Nodes (14): 10. Типичные ошибки и запись результата, 1. Разминка, 2. Модель и формулы, 3. Разобранный пример, 4. Практика вместе, 5. Самостоятельная работа, 6. Дополнительный блок: таблица и график, 7. Выходной вопрос и критерий перехода (+6 more)

### Community 19 - "Урок 01. Материальная точка и система отсчета"
Cohesion: 0.14
Nodes (13): Вопросы ученика, Комментарий преподавателя, Материальная точка, Механическое движение, Наглядная схема, Система отсчета, Тренировка по шагам, Урок 01. Материальная точка и система отсчета (+5 more)

### Community 20 - "Урок 02. Классификация химических реакций"
Cohesion: 0.14
Nodes (13): 10. Типичные ошибки и запись результата, 1. Мягкое вспоминание, 2. От вещества к реакции, 3. Четыре типа по составу участников, 4. Разобранный пример, 5. Практика вместе, 6. Самостоятельная работа, 7. Выходной вопрос и критерий перехода (+5 more)

### Community 21 - "Урок 03. Скорость химических реакций"
Cohesion: 0.14
Nodes (13): 1. Разминка, 2. Что значит «быстрее», 3. Разобранный пример: сравниваем одно условие, 4. Практика вместе, 5. Самостоятельная работа, 6. Выходной вопрос и критерий успеха, 7. Домашнее задание на 10–15 минут, 8. Ключ для взрослого — после попытки (+5 more)

### Community 22 - "Grade9Trainer.App.csproj"
Cohesion: 0.19
Nodes (8): net10.0-windows, Microsoft.NET.Sdk, net10.0, Microsoft.NET.Sdk, net10.0, Microsoft.NET.Sdk, net10.0-windows, Microsoft.NET.Sdk

### Community 23 - "Настройка Syncthing на двух компьютерах Windows"
Cohesion: 0.18
Nodes (10): 1. Установка и первое открытие, 2. Связать компьютеры, 3. Добавить общую папку на компьютере преподавателя, 4. Принять папку на компьютере ученика, 5. Как проходить урок по шагам, 6. Автозапуск, 7. Правила работы без конфликтов, 8. Контрольная проверка (+2 more)

### Community 24 - "Стартовый запас: физика и химия"
Cohesion: 0.29
Nodes (6): Выбрать занятие, Границы набора, Как начать без дополнительной подготовки, Короткая запись после занятия, На что смотреть при переходе, Стартовый запас: физика и химия

### Community 25 - "Проект «9 КЛАСС»"
Cohesion: 0.40
Nodes (4): Автоматическое сохранение итогов, Границы, Проект «9 КЛАСС», Чтение памяти

### Community 26 - "Q: добавь еще третий урок по информатике"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: добавь еще третий урок по информатике, Source Nodes

### Community 27 - "Q: возможно создать программу для обучения ученика 9 класса на основе наших уроков на с# с возможностью дальнейшего добавления уроков"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: возможно создать программу для обучения ученика 9 класса на основе наших уроков на с# с возможностью дальнейшего добавления уроков, Source Nodes

### Community 28 - "Q: отлично тогда начнем; продолжи создание программы для обучения ученика 9 класса на C#"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: отлично тогда начнем; продолжи создание программы для обучения ученика 9 класса на C#, Source Nodes

### Community 29 - "Q: опубликовать 9 КЛАСС — Тренажёр MVP на GitHub и закоммитить все изменения"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: опубликовать 9 КЛАСС — Тренажёр MVP на GitHub и закоммитить все изменения, Source Nodes

### Community 30 - "MermaidDiagramParser"
Cohesion: 0.10
Nodes (27): Border, Canvas, DiagramStyle, Dictionary, SolidColorBrush, DiagramView, IReadOnlyList, DiagramDirection (+19 more)

### Community 31 - "StudentProfileStore"
Cohesion: 0.11
Nodes (18): DateTimeOffset, List, StudentProfile, StudentProfileRegistry, CurrentProfileId, Profiles, DateTimeOffset, JsonSerializerOptions (+10 more)

### Community 32 - "LessonEditorWindow"
Cohesion: 0.15
Nodes (12): EditorText, ValidationText, Window, RoutedEventArgs, LessonEditorWindow, SavedLessonId, TextBlock, TextBox (+4 more)

### Community 33 - "Q: Mermaid показывается как офлайн-схема со стрелками. Полноценные графические диаграммы, редактор преподавателя, несколько учеников и синхронизация — следующие этапы. давай перейдем к следующим этапам"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mermaid показывается как офлайн-схема со стрелками. Полноценные графические диаграммы, редактор преподавателя, несколько учеников и синхронизация — следующие этапы. давай перейдем к следующим этапам, Source Nodes

## Knowledge Gaps
- **312 isolated node(s):** `net10.0-windows`, `Microsoft.NET.Sdk`, `TextBox`, `TextBlock`, `SavedLessonId` (+307 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 378 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `Программа - Босова 9 класс` (4× useful, score=3.989099087)
- `Информатика README` (4× useful, score=3.989099087)
- `Физика README` (3× useful, score=2.994210436)
- `Химия README` (3× useful, score=2.994210436)
- `Урок 02 - Методы построения алгоритмов и вспомогательные алгоритмы` (3× useful, score=2.98947837)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MainWindow` connect `MainWindow` to `LessonEditorWindow`, `LessonMarkdownParser`, `Grade9Trainer.Core.Services`, `ProgressStore`, `MermaidDiagramParser`, `StudentProfileStore`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `LessonMarkdownParser` connect `LessonMarkdownParser` to `LessonEditorWindow`, `MainWindow`, `Grade9Trainer.Core.Services`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `MermaidDiagramParser` connect `MermaidDiagramParser` to `MainWindow`, `Grade9Trainer.Core.Services`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `net10.0-windows`, `Microsoft.NET.Sdk`, `TextBox` to the rest of the system?**
  _312 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `9 КЛАСС — Тренажёр` be split into smaller, more focused modules?**
  _Cohesion score 0.1067193675889328 - nodes in this community are weakly interconnected._
- **Should `MainWindow` be split into smaller, more focused modules?**
  _Cohesion score 0.06894049346879536 - nodes in this community are weakly interconnected._
- **Should `Урок 03 - Запись вспомогательных алгоритмов на Python` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._