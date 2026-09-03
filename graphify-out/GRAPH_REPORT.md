# Graph Report - 9 КЛАСС  (2026-09-02)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 14 nodes · 17 edges · 5 communities (3 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 256 input · 49 output

## Graph Freshness
- Built from commit: `ef7862de`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Programming Basics and Algorithms
- Introduction and Info Security
- Chemistry Fundamentals
- Physics Fundamentals
- 9th Grade Overview

## God Nodes (most connected - your core abstractions)
1. `Сверка с учебниками - старт 9 класса` - 6 edges
2. `Подготовительный урок A. Как решать задачи: алгоритм, данные, результат` - 4 edges
3. `Программа - Босова 9 класс` - 3 edges
4. `Информатика README` - 3 edges
5. `Урок 01 - Введение и информационная безопасность` - 3 edges
6. `Урок 02 - Методы построения алгоритмов и вспомогательные алгоритмы` - 3 edges
7. `Подготовительный урок B. Условия и ветвление if` - 2 edges
8. `Химия README` - 2 edges
9. `Урок 00. Быстрая проверка языка химии` - 2 edges
10. `Урок 01. Классификация химических соединений` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Сверка с учебниками - старт 9 класса` --references--> `Урок 01. Материальная точка и система отсчета`  [EXTRACTED]
  Общий/Сверка с учебниками - старт 9 класса.md → Физика/Уроки/Урок 01 - Материальная точка и система отсчета.md
- `Сверка с учебниками - старт 9 класса` --references--> `Урок 00. Быстрая проверка языка химии`  [EXTRACTED]
  Общий/Сверка с учебниками - старт 9 класса.md → Химия/Уроки/Урок 00 - Быстрая проверка языка химии.md
- `Сверка с учебниками - старт 9 класса` --references--> `Урок 01. Классификация химических соединений`  [EXTRACTED]
  Общий/Сверка с учебниками - старт 9 класса.md → Химия/Уроки/Урок 01 - Классификация химических соединений.md
- `Сверка с учебниками - старт 9 класса` --references--> `Урок 01 - Введение и информационная безопасность`  [EXTRACTED]
  Общий/Сверка с учебниками - старт 9 класса.md → Информатика/Уроки/Урок 01 - Введение и информационная безопасность.md
- `Сверка с учебниками - старт 9 класса` --references--> `Урок 02 - Методы построения алгоритмов и вспомогательные алгоритмы`  [EXTRACTED]
  Общий/Сверка с учебниками - старт 9 класса.md → Информатика/Уроки/Урок 02 - Вспомогательные алгоритмы.md

## Communities (5 total, 2 thin omitted)

### Community 0 - "Programming Basics and Algorithms"
Cohesion: 0.83
Nodes (4): Подготовительный урок A. Как решать задачи: алгоритм, данные, результат, Подготовительный урок B. Условия и ветвление if, Программа - Босова 9 класс, Информатика README

### Community 1 - "Introduction and Info Security"
Cohesion: 0.67
Nodes (4): Урок 01 - Введение и информационная безопасность, Урок 02 - Методы построения алгоритмов и вспомогательные алгоритмы, Общий раздел README, Сверка с учебниками - старт 9 класса

### Community 2 - "Chemistry Fundamentals"
Cohesion: 0.67
Nodes (3): Химия README, Урок 00. Быстрая проверка языка химии, Урок 01. Классификация химических соединений

## Knowledge Gaps
- **3 isolated node(s):** `Общий раздел README`, `Физика README`, `9 КЛАСС README`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Сверка с учебниками - старт 9 класса` connect `Introduction and Info Security` to `Chemistry Fundamentals`, `Physics Fundamentals`?**
  _High betweenness centrality (0.609) - this node is a cross-community bridge._
- **Why does `Подготовительный урок A. Как решать задачи: алгоритм, данные, результат` connect `Programming Basics and Algorithms` to `Introduction and Info Security`?**
  _High betweenness centrality (0.346) - this node is a cross-community bridge._
- **Why does `Урок 01 - Введение и информационная безопасность` connect `Introduction and Info Security` to `Programming Basics and Algorithms`?**
  _High betweenness centrality (0.179) - this node is a cross-community bridge._
- **What connects `Общий раздел README`, `Физика README`, `9 КЛАСС README` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._