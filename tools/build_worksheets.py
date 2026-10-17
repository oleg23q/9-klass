"""Сборка печатных рабочих листов по урокам (физика, химия, информатика).

Для каждого урока создаются: Лист А, Лист Б (для ученика), Ключ для преподавателя (HTML и PDF).
Задания описаны в tools/worksheets/specs_*.py, ответы вычисляются кодом.

Примеры:
  python tools/build_worksheets.py                      # все уроки
  python tools/build_worksheets.py --subject Физика     # один предмет
  python tools/build_worksheets.py --subject Физика --lesson 13 --no-pdf
Python 3.10+, только стандартная библиотека; PDF создаётся через Microsoft Edge или Google Chrome.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from worksheets.engine import build_lesson  # noqa: E402


def load_lessons():
    lessons = []
    for module_name in ("specs_physics", "specs_chemistry", "specs_informatics"):
        try:
            module = __import__(f"worksheets.{module_name}", fromlist=["LESSONS"])
        except ModuleNotFoundError as error:
            if error.name and error.name.endswith(module_name):
                continue
            raise
        lessons.extend(module.LESSONS)
    return lessons


def folder_name(root: Path, lesson) -> str:
    content = root / "Grade9Trainer" / "Content" / "Lessons" / lesson.subject
    prefix = f"Урок {lesson.number:02d} - "
    for path in content.glob(prefix + "*.md"):
        return path.stem
    return f"{prefix}{lesson.title}"


README_TEMPLATE = r"""# Рабочие листы для печати — {subject}

Печатные задания к урокам: ученик решает ручкой на бумаге, преподаватель проверяет по ключу и вместе с ассистентом разбирает ошибки. Если ошибки повторяются, готовится мини-урок ([шаблон](../../Общий/Шаблон%20мини-урока%20по%20ошибке.md)).

Статус: листы подготовлены, но ещё не использовались на занятиях. Напечатанный лист сам по себе не доказывает освоение темы.

## Что входит в комплект к каждому уроку

| Файл | Кому | Для чего |
|---|---|---|
| `Лист А.pdf` / `.html` | ученику | основная работа, 6–9 заданий, 25–45 минут |
| `Лист Б.pdf` / `.html` | ученику | второй вариант с теми же типами заданий и другими числами: для повторной проверки после мини-урока |
| `Ключ для преподавателя.pdf` / `.html` | только преподавателю | ответы, разбор, частые неверные ответы с причинами, коды ошибок, протокол проверки |

## Уроки

{table}

## Как напечатать

Открыть PDF (`Лист А.pdf`) в любом просмотрщике или браузере; бумага A4, масштаб 100 %. Интернет и установка не нужны. Если PDF-просмотрщика нет, открыть `.html` в браузере и нажать `Ctrl+P`. Копия всех листов лежит на `U:\9KLASS_PRINT`. Ключ печатать только для преподавателя.

## Как проходит проверка

1. Ученик решает лист ручкой без подсказок и без экрана. Рисунок и ход решения остаются на листе.
2. Преподаватель сверяет ответы с ключом и ставит коды ошибок в протоколе (последняя страница ключа).
3. Фото работы (целиком, ровно, при хорошем освещении) отправляется ассистенту. Имя ученика на фото и в записях не нужно. Ассистент разбирает ход решения по шагам, отмечает коды ошибок, прямо говорит, если почерк неразборчив, и предлагает вопрос, который стоит задать ученику.
4. Повторяющаяся ошибка (два раза и больше) становится темой мини-урока; после него даётся лист другого варианта.

## Как пересобрать

```bash
python tools/build_worksheets.py --subject {subject}
```

Задания описаны в `tools/worksheets/specs_*.py`; ответы и диагностика вычисляются кодом. PDF создаётся через Microsoft Edge или Google Chrome (режим headless).
"""


def write_readme(root: Path, subject: str, names: list[str], titles: dict[str, str]):
    rows = ["| Урок | Файлы |", "|---|---|"]
    for name in names:
        rows.append(f"| {titles[name]} | [папка]({name.replace(' ', '%20')}/) |")
    path = root / subject / "Рабочие листы" / "README.md"
    table = chr(10).join(rows)
    path.write_text(README_TEMPLATE.format(subject=subject, table=table), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--root", type=Path, default=HERE.parent, help="Корень проекта")
    parser.add_argument("--subject", help="Физика, Химия или Информатика")
    parser.add_argument("--lesson", type=int, help="Номер урока")
    parser.add_argument("--no-pdf", action="store_true", help="Только HTML")
    args = parser.parse_args()

    selected = [l for l in load_lessons()
                if (not args.subject or l.subject == args.subject) and (args.lesson is None or l.number == args.lesson)]
    if not selected:
        print("Нет подходящих уроков")
        return 1
    index: dict[str, list[str]] = {}
    titles: dict[str, str] = {}
    for lesson in selected:
        name = folder_name(args.root, lesson)
        out = args.root / lesson.subject / "Рабочие листы" / name
        result = build_lesson(lesson, out, make_pdf=not args.no_pdf)
        index.setdefault(lesson.subject, []).append(name)
        titles[name] = f"Урок {lesson.number:02d}. {lesson.title}"
        print(f"{lesson.subject} {lesson.number:02d}: {result['tasks']} html={result['html']} pdf={result['pdf']}", flush=True)
    for subject, names in index.items():
        write_readme(args.root, subject, names, titles)
    return 0


if __name__ == "__main__":
    sys.exit(main())
