"""Движок печатных рабочих листов.

Урок описывается функцией, которая для варианта ("А" или "Б") возвращает список заданий Task.
Движок строит лист ученика (HTML для печати на A4, без ответов), общий ключ для преподавателя
(ответы, разбор, диагностика неверных ответов, протокол проверки) и PDF через Edge или Chrome.
Python 3.10+, только стандартная библиотека.
"""
from __future__ import annotations

import html
import subprocess
import tempfile
from dataclasses import dataclass, field
from pathlib import Path

VARIANTS = ("А", "Б")

# Типы рабочей области задания на листе ученика.
#  solve  — одно поле «Решение»
#  phys   — «Дано / СИ» и «Решение» рядом (физика)
#  draw   — «Рисунок» и «Решение» рядом
#  lines  — несколько строк для развёрнутого ответа
#  code   — рамка для записи программы
#  short  — только строка ответа (да/нет, одно слово)
#  fill   — пустая таблица или схема из extra_html, затем строка ответа


@dataclass
class Task:
    text: str
    answer: str
    solution: list[str] = field(default_factory=list)
    diagnosis: list[tuple[str, str]] = field(default_factory=list)
    work: str = "solve"
    extra_html: str = ""
    answer_label: str | None = "Ответ"
    note: str = ""


@dataclass
class Lesson:
    subject: str
    number: int
    title: str
    minutes: int
    codes: list[tuple[str, str, str]]
    build: object  # callable(variant: str) -> list[Task]
    hint: str = ""


CSS = """
@page { size: A4; margin: 12mm 14mm; }
* { box-sizing: border-box; }
body { font-family: "Segoe UI", Arial, sans-serif; font-size: 11.5pt; line-height: 1.35; color: #111; margin: 0; }
h1 { font-size: 16pt; margin: 0 0 2mm; }
.sub { color: #444; margin: 0 0 3mm; }
.head { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #111; padding-bottom: 2mm; margin-bottom: 3mm; }
.fields { font-size: 10.5pt; text-align: right; }
.fields span { display: inline-block; min-width: 42mm; border-bottom: 1px solid #111; margin-left: 2mm; }
.rules { border: 1px solid #888; border-radius: 3mm; padding: 2mm 4mm; margin: 0 0 4mm; font-size: 10.5pt; }
.task { border: 1px solid #333; border-radius: 3mm; padding: 3mm 4mm; margin: 0 0 4mm; break-inside: avoid; page-break-inside: avoid; }
.task h2 { font-size: 12pt; margin: 0 0 2mm; }
.task h2 .num { display: inline-block; min-width: 7mm; padding: 0 2mm; margin-right: 2mm; border-radius: 2mm; background: #111; color: #fff; text-align: center; }
.task .text { white-space: pre-line; }
.task pre.snippet { background: #f4f4f4; border: 1px solid #bbb; border-radius: 2mm; padding: 2mm 3mm; margin: 1.5mm 0; font: 10.5pt/1.3 "Cascadia Mono", Consolas, monospace; white-space: pre; }
table.data { border-collapse: collapse; margin: 1.5mm 0 2mm; }
table.data th, table.data td { border: 1px solid #111; padding: 1mm 3mm; min-width: 9mm; height: 7mm; text-align: center; font-size: 11pt; }
table.data th { background: #eee; }
table.data td.diag { background: #d8d8d8; }
table.data td.blank { min-width: 22mm; height: 9mm; }
.work { display: grid; gap: 3mm; margin-top: 2mm; }
.work.two { grid-template-columns: 56mm 1fr; }
.work.one { grid-template-columns: 1fr; }
.box { border: 1px dashed #666; border-radius: 2mm; min-height: 34mm; padding: 1mm 2mm; font-size: 9pt; color: #777; }
.box.short { min-height: 20mm; }
.box.tall { min-height: 46mm; }
.box.code { font-family: "Cascadia Mono", Consolas, monospace; background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 6.4mm, #ccc 6.4mm, #ccc 6.8mm); }
.ruled { border: 1px dashed #666; border-radius: 2mm; min-height: 40mm; padding: 1mm 2mm; font-size: 9pt; color: #777;
  background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 7.4mm, #bbb 7.4mm, #bbb 7.8mm); }
.answer { margin-top: 2mm; font-weight: 700; }
.answer span { display: inline-block; min-width: 40mm; border-bottom: 1.5px solid #111; }
.footer { font-size: 9pt; color: #555; text-align: center; margin-top: 2mm; }
.pb { break-before: page; page-break-before: always; }
.key table.proto { border-collapse: collapse; width: 100%; margin: 2mm 0 4mm; }
.key table.proto th, .key table.proto td { border: 1px solid #333; padding: 1.5mm 2mm; font-size: 10pt; vertical-align: top; }
.key table.proto td.blank { height: 9mm; }
.key h2 { font-size: 12.5pt; margin: 4mm 0 1mm; break-after: avoid; }
.key .ans { font-weight: 700; }
.key .qtext { white-space: pre-line; }
.key ul { margin: 1mm 0 2mm 5mm; padding: 0; }
.key li { margin: 0.5mm 0; }
.key .warn { background: #f1f1f1; padding: 1.5mm 3mm; border-left: 3px solid #111; margin: 1.5mm 0; font-size: 10.5pt; }
.key .qtask { break-inside: avoid; page-break-inside: avoid; }
"""


def esc(text) -> str:
    return html.escape(str(text), quote=False)


def fmt(value, digits: int = 2) -> str:
    """Число для текста: запятая вместо точки, без лишних нулей."""
    if isinstance(value, int):
        return str(value)
    rounded = round(float(value), digits)
    if rounded == int(rounded):
        return str(int(rounded))
    return f"{rounded:.{digits}f}".rstrip("0").rstrip(".").replace(".", ",")


def data_table(headers: list[str], rows: list[list[str]], first_col_header: bool = True) -> str:
    head = "".join(f"<th>{esc(h)}</th>" for h in headers)
    body = []
    for row in rows:
        cells = []
        for index, cell in enumerate(row):
            tag = "th" if first_col_header and index == 0 else "td"
            if cell == "":
                cells.append('<td class="blank"></td>')
            else:
                cells.append(f"<{tag}>{esc(cell)}</{tag}>")
        body.append("<tr>" + "".join(cells) + "</tr>")
    return f'<table class="data"><tr>{head}</tr>{"".join(body)}</table>'


def snippet(code: str) -> str:
    return f'<pre class="snippet">{esc(code)}</pre>'


def _page(title: str, body: str, key: bool = False) -> str:
    cls = ' class="key"' if key else ""
    return (f'<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>{esc(title)}</title>'
            f"<style>{CSS}</style></head><body{cls}>{body}</body></html>")


def _work_html(task: Task) -> str:
    w = task.work
    if w == "phys":
        return '<div class="work two"><div class="box tall">Дано (в СИ)</div><div class="box tall">Решение</div></div>'
    if w == "draw":
        return '<div class="work two"><div class="box">Рисунок</div><div class="box">Решение</div></div>'
    if w == "lines":
        return '<div class="work one"><div class="ruled">Запиши ответ своими словами</div></div>'
    if w == "code":
        return '<div class="work one"><div class="box code tall">Программа</div></div>'
    if w in ("short", "fill"):
        return ""
    return '<div class="work one"><div class="box">Решение</div></div>'


def student_sheet(lesson: Lesson, variant: str, tasks: list[Task]) -> str:
    title = f"Урок {lesson.number:02d}. {lesson.title}"
    parts = [f'<div class="head"><div><h1>{esc(title)}</h1>'
             f'<p class="sub">{esc(lesson.subject)} · 9 класс · Рабочий лист · Вариант {variant}</p></div>'
             '<div class="fields">Дата:<span></span><br>Имя (по желанию):<span></span></div></div>',
             f'<div class="rules"><b>Как работать.</b> Решай ручкой, около {lesson.minutes} минут, без подсказок и без экрана. '
             f'{esc(lesson.hint)} Не стирай черновое решение: по нему видно, как ты рассуждал. Если застрял, оставь вопрос на полях.</div>']
    for number, task in enumerate(tasks, start=1):
        label = f'<div class="answer">{esc(task.answer_label)}: <span></span></div>' if task.answer_label else ""
        note = f'<div class="note" style="font-size:9.5pt;color:#444">{esc(task.note)}</div>' if task.note else ""
        parts.append(f'<div class="task"><h2><span class="num">{number}</span>Задание {number}</h2>'
                     f'<div class="text">{esc(task.text)}</div>{task.extra_html}{note}{_work_html(task)}{label}</div>')
    parts.append('<div class="footer">Рабочий лист предназначен для самостоятельного решения. Ключ хранится у преподавателя.</div>')
    return _page(f"{title} — рабочий лист {variant}", "\n".join(parts))


def key_sheet(lesson: Lesson, all_tasks: dict[str, list[Task]]) -> str:
    title = f"Урок {lesson.number:02d}. {lesson.title}"
    count = max(len(t) for t in all_tasks.values())
    parts = [f'<div class="head"><div><h1>Ключ для преподавателя</h1><p class="sub">{esc(title)} · {esc(lesson.subject)} · варианты А и Б · не выдавать ученику</p></div></div>',
             '<div class="warn"><b>Как проверять.</b> Сверь ответ с ключом, затем посмотри ход решения: что записано в «Дано», какие формулы и шаги выбраны, нарисован ли рисунок. '
             'Для каждой ошибки поставь код из таблицы ниже. Если ошибка повторяется два раза и больше, это тема для мини-урока. '
             'Фото работы можно прислать для совместного разбора; имя ученика на фото и в записях не нужно.</div>',
             "<h2>Коды ошибок</h2><table class=\"proto\"><tr><th>Код</th><th>Что это</th><th>Признак</th></tr>" +
             "".join(f"<tr><td><b>{esc(c)}</b></td><td>{esc(n)}</td><td>{esc(d)}</td></tr>" for c, n, d in lesson.codes) + "</table>"]
    for variant, tasks in all_tasks.items():
        parts.append(f'<div class="pb"></div><h1>Вариант {variant}</h1>')
        for number, task in enumerate(tasks, start=1):
            block = [f'<div class="qtask"><h2>Задание {number}. Ответ: <span class="ans">{esc(task.answer)}</span></h2>',
                     f'<div class="qtext">{esc(task.text)}</div>']
            if task.solution:
                block.append("<ul>" + "".join(f"<li>{esc(s)}</li>" for s in task.solution) + "</ul>")
            seen_values: set[str] = set()
            diag = []
            for value, reason in task.diagnosis:
                key = value.strip()
                if key and key != task.answer.strip() and key not in seen_values:
                    seen_values.add(key)
                    diag.append((value, reason))
            if diag:
                block.append('<div class="warn"><b>Частые неверные ответы и ошибки:</b> ' +
                             "; ".join(f"<b>{esc(a)}</b> — {esc(b)}" for a, b in diag) + "</div>")
            block.append("</div>")
            parts.append("".join(block))
    parts.append('<div class="pb"></div><h1>Протокол проверки работы</h1>'
                 f'<p>Дата ___ Вариант ___ Верно ___ из {count}</p>'
                 '<table class="proto"><tr><th>№</th><th>Верно?</th><th>Код ошибки</th><th>Что именно написал ученик, как рассуждал</th></tr>' +
                 "".join(f'<tr><td>{i}</td><td class="blank"></td><td class="blank"></td><td class="blank"></td></tr>' for i in range(1, count + 1)) +
                 '</table><h2>Итог</h2><p>Повторяющиеся ошибки (коды): ______________ &nbsp; Тема мини-урока: ____________________________</p>'
                 '<p>Следующий шаг: ______________________________________________________</p>'
                 '<p style="font-size:9.5pt;color:#444">После мини-урока дать лист другого варианта и сравнить коды ошибок.</p>')
    return _page(f"Ключ для преподавателя — урок {lesson.number:02d}", "\n".join(parts), key=True)


BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
]


def to_pdf(html_path: Path, pdf_path: Path) -> bool:
    browser = next((b for b in BROWSERS if Path(b).exists()), None)
    if browser is None:
        return False
    if pdf_path.exists():
        pdf_path.unlink()
    with tempfile.TemporaryDirectory() as profile:
        cmd = [browser, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={profile}",
               "--no-pdf-header-footer", f"--print-to-pdf={pdf_path.resolve()}", html_path.resolve().as_uri()]
        subprocess.run(cmd, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=180)
    return pdf_path.exists() and pdf_path.stat().st_size > 1000


def build_lesson(lesson: Lesson, out_dir: Path, make_pdf: bool = True) -> dict:
    out_dir.mkdir(parents=True, exist_ok=True)
    all_tasks = {v: lesson.build(v) for v in VARIANTS}
    files = []
    for variant, tasks in all_tasks.items():
        path = out_dir / f"Лист {variant}.html"
        path.write_text(student_sheet(lesson, variant, tasks), encoding="utf-8")
        files.append(path)
    key_path = out_dir / "Ключ для преподавателя.html"
    key_path.write_text(key_sheet(lesson, all_tasks), encoding="utf-8")
    files.append(key_path)
    pdfs = []
    if make_pdf:
        for path in files:
            pdf = path.with_suffix(".pdf")
            if to_pdf(path, pdf):
                pdfs.append(pdf.name)
    return {"html": len(files), "pdf": len(pdfs), "tasks": {v: len(t) for v, t in all_tasks.items()}}
