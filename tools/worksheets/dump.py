"""Выводит задания и ответы уроков в текстовый файл для проверки автором.

  python -m tools.worksheets.dump --subject Информатика --out dump.txt
"""
from __future__ import annotations

import argparse
import importlib
import io
import re
import sys
from pathlib import Path


def plain(html_text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html_text)
    return re.sub(r"\s+", " ", text).strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--subject", required=True)
    parser.add_argument("--lesson", type=int)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    here = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(here))
    module_name = {"Физика": "specs_physics", "Химия": "specs_chemistry", "Информатика": "specs_informatics"}[args.subject]
    module = importlib.import_module(f"worksheets.{module_name}")
    out = io.open(args.out, "w", encoding="utf-8")
    for lesson in module.LESSONS:
        if args.lesson and lesson.number != args.lesson:
            continue
        for variant in ("А", "Б"):
            out.write(f"\n##### {lesson.subject} {lesson.number:02d} {lesson.title} — вариант {variant}\n")
            for number, task in enumerate(lesson.build(variant), start=1):
                out.write(f"\n{number}. {task.text}\n")
                if task.extra_html:
                    out.write(f"   [таблица/код: {plain(task.extra_html)[:260]}]\n")
                out.write(f"   ОТВЕТ: {task.answer}\n")
                for s in task.solution:
                    out.write(f"   - {s}\n")
                for a, b in task.diagnosis:
                    out.write(f"   ! {a} — {b}\n")
    out.close()


if __name__ == "__main__":
    main()
