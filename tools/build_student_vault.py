"""Build the reviewed student edition from seven explicit Obsidian lesson notes.

No vault-wide copy: only reviewed sections and fresh templates enter the ZIP.
Existing student work and local settings are never overwritten by this builder.
Python 3.10+; standard library only.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import zipfile

HERE = Path(__file__).resolve().parent
TEMPLATES = HERE.parent / 'student-template'
DAY = '2026-09-05'
VAULT_NAME = '9 класс — ученик'

# Explicit allowlist: never discover additional teacher notes automatically.
SPECS = [
    ('Физика', 1, 'Материальная точка и система отсчета', [2, 3, 4]),
    ('Физика', 2, 'Путь, перемещение и координата', [2, 3]),
    ('Физика', 3, 'Равномерное прямолинейное движение', [2, 3, 6]),
    ('Химия', 0, 'Быстрая проверка языка химии', [2, 3, 4, 5, 6, 7]),
    ('Химия', 1, 'Классификация химических соединений', [2, 3, 4]),
    ('Химия', 2, 'Классификация химических реакций', [2, 3, 4]),
    ('Химия', 3, 'Скорость химических реакций', [2, 3]),
]

GOALS = {
    ('Физика', 1): 'Научиться выбирать тело отсчёта, объяснять модель материальной точки и называть три части системы отсчёта.',
    ('Физика', 2): 'Различать путь и перемещение; находить конечную координату и объяснять знак проекции перемещения.',
    ('Физика', 3): 'Решать задачи на равномерное движение, переводить единицы скорости и находить координату тела.',
    ('Химия', 0): 'Вспомнить формулы, индексы и коэффициенты. Это дополнительная подготовка перед основными уроками.',
    ('Химия', 1): 'Различать простые и сложные вещества, узнавать оксиды, кислоты, основания и соли по формуле.',
    ('Химия', 2): 'Различать соединение, разложение, замещение и обмен; расставлять коэффициенты без изменения индексов.',
    ('Химия', 3): 'Объяснять влияние условий на скорость реакции и сравнивать опыты, в которых меняется одно условие. Расчёт по молярной концентрации пока не нужен.',
}

EXIT_QUESTIONS = {
    ('Физика', 1): 'Объясни в 3–5 предложениях, зачем нужна система отсчёта. Книга лежит на парте: относительно каких тел она движется или покоится?',
    ('Физика', 2): 'Можно ли пройти 10 м и получить нулевое перемещение? Объясни примером.',
    ('Физика', 3): 'Два тела имеют проекции скорости +3 и −3 м/с. Кто движется быстрее и чем различается движение?',
    ('Химия', 0): 'Почему при уравнивании реакции можно менять коэффициенты, но нельзя менять индексы?',
    ('Химия', 1): 'Чем простое вещество отличается от сложного? По какому признаку ты узнаёшь каждый из четырёх классов соединений?',
    ('Химия', 2): 'Ученик назвал $2Mg+O_2\\rightarrow2MgO$ обменом: «Слева и справа есть двойки». В чём ошибка?',
    ('Химия', 3): 'Реакция с катализатором закончилась раньше. Доказывает ли это, что катализатор увеличил итоговое количество продукта?',
}

STEPS = {
    ('Физика', 1): [
        ('Движение относительно разных тел', 'Пассажир сидит в движущемся автобусе. Относительно каких тел он покоится, а относительно каких движется?', 'Пассажир покоится относительно сиденья и автобуса. Он движется относительно дороги, остановки и зданий. Поэтому движение всегда указывают относительно выбранного тела.'),
        ('Когда тело — материальная точка', 'Можно ли считать автомобиль материальной точкой при поездке между городами? А при заезде в тесный гараж? Объясни оба решения.', 'Между городами автомобиль можно считать материальной точкой: его размеры малы по сравнению с маршрутом. При заезде в гараж нельзя, потому что важны длина и ширина автомобиля.'),
        ('Собери систему отсчёта', 'Нужно описать движение ученика по коридору. Назови тело отсчёта, координатную ось и прибор для измерения времени.', 'Например: тело отсчёта — стена или начало коридора; ось направлена вдоль коридора; время измеряет секундомер. Вместе эти три части образуют систему отсчёта.'),
        ('Уточни физическую фразу', 'Почему фраза «дом стоит на месте» неполная с точки зрения физики?', 'Не указано тело отсчёта. Дом покоится относительно поверхности Земли, но вместе с Землёй движется относительно Солнца.'),
        ('Итог урока', 'Книга лежит на парте. В 3–5 предложениях объясни, относительно каких тел она покоится и относительно каких движется.', 'Книга покоится относительно парты, комнаты и поверхности Земли. Вместе с Землёй она движется относительно Солнца. Ответ «движется или покоится» зависит от выбранного тела отсчёта.'),
    ],
    ('Физика', 2): [
        ('Путь и перемещение', 'Ученик прошёл 5 м вперёд и 5 м назад в исходную точку. Найди путь и модуль перемещения.', 'Путь равен $5+5=10$ м. Начальная и конечная точки совпадают, поэтому перемещение и его модуль равны 0.'),
        ('Движение без разворота', 'Тело переместилось из $x_0=5$ м в $x=1$ м без разворота. Найди $s_x$, направление и путь.', '$s_x=x-x_0=1-5=-4$ м. Минус означает движение против положительного направления оси, то есть влево. Без разворота путь равен 4 м.'),
        ('Возвращение в начало', 'Из точки 0 ученик прошёл 4 м вправо и 4 м влево. Найди путь и перемещение.', 'Путь $l=4+4=8$ м. Конечная координата снова 0, поэтому $s_x=0-0=0$ м.'),
        ('Найди координату', 'Начальная координата −3 м, проекция перемещения +8 м. Найди конечную координату.', '$x=x_0+s_x=-3+8=5$ м.'),
        ('Замкнутый маршрут', 'Спортсмен пробежал полный круг длиной 200 м и вернулся к старту. Найди путь и модуль перемещения.', 'Путь равен 200 м. Начальная и конечная точки совпадают, поэтому модуль перемещения равен 0 м.'),
        ('Маршрут с разворотом', 'Тело прошло из +1 м в +7 м, затем в +3 м. Найди путь и итоговую проекцию перемещения.', 'Путь: $l=(7-1)+(7-3)=6+4=10$ м. Перемещение: $s_x=3-1=2$ м.'),
        ('Что можно узнать', 'При $x_0=5$ м и $s_x=-8$ м найди конечную координату. Можно ли однозначно узнать путь?', '$x=5-8=-3$ м. Путь однозначно неизвестен: он равен 8 м только при движении без разворотов и может быть больше при разворотах.'),
    ],
    ('Физика', 3): [
        ('Скорость и путь', 'Велосипедист едет равномерно со скоростью 18 км/ч в течение 20 с. Какой путь он проедет?', '$18$ км/ч $=18/3{,}6=5$ м/с. Тогда $l=vt=5\\cdot20=100$ м.'),
        ('Найди скорость', 'Машинка равномерно проходит 12 м за 4 с. Найди модуль скорости.', '$v=l/t=12/4=3$ м/с.'),
        ('Координата движущегося тела', 'Начальная координата −4 м, $v_x=2$ м/с. Где тело будет через 5 с?', '$x=x_0+v_xt=-4+2\\cdot5=6$ м. За это время путь равен 10 м.'),
        ('Перевод единиц', 'Переведи 72 км/ч в м/с, а 15 м/с в км/ч.', '$72/3{,}6=20$ м/с. $15\\cdot3{,}6=54$ км/ч.'),
        ('Минуты в секунды', 'Тело движется со скоростью 4 м/с в течение 2 мин. Найди путь.', '$2$ мин $=120$ с. $l=4\\cdot120=480$ м.'),
        ('Отрицательная проекция скорости', 'При $x_0=8$ м и $v_x=-3$ м/с найди координату через 4 с и путь.', '$x=8+(-3)\\cdot4=-4$ м. Модуль скорости 3 м/с, поэтому путь $l=3\\cdot4=12$ м.'),
        ('Найди время', 'Пешеход проходит 150 м со скоростью 1,5 м/с. Найди время.', '$t=l/v=150/1{,}5=100$ с.'),
        ('Итог урока', 'Два тела имеют $v_x=+3$ м/с и $v_x=-3$ м/с. Кто движется быстрее и чем различается их движение?', 'Модули скоростей одинаковы, поэтому тела движутся одинаково быстро. Знаки различаются, потому что направления движения противоположны.'),
    ],
    ('Химия', 0): [
        ('Состав формулы', 'Сколько атомов каждого элемента обозначает формула $H_2SO_4$?', 'В формульной записи: H — 2, S — 1, O — 4.'),
        ('Скобки в формуле', 'Сколько атомов каждого элемента обозначает $Al_2(SO_4)_3$?', 'Al — 2, S — $1\\cdot3=3$, O — $4\\cdot3=12$. Индекс после скобки умножает всё содержимое скобок.'),
        ('Индекс или коэффициент', 'Объясни значение цифры 2 в записях $2H_2O$ и $H_2O$.', 'В $2H_2O$ первая 2 — коэффициент: две молекулы воды, всего 4 H и 2 O. В $H_2O$ цифра 2 — индекс: два атома H в одной молекуле.'),
        ('Уравняй реакцию', 'Расставь коэффициенты: $H_2+Cl_2\\rightarrow HCl$.', '$H_2+Cl_2\\rightarrow2HCl$. С обеих сторон по 2 атома H и 2 атома Cl.'),
        ('Ещё одно уравнение', 'Расставь коэффициенты: $Li+O_2\\rightarrow Li_2O$.', '$4Li+O_2\\rightarrow2Li_2O$. С обеих сторон 4 Li и 2 O.'),
        ('Уравнение с оксидом', 'Расставь коэффициенты: $Al+O_2\\rightarrow Al_2O_3$.', '$4Al+3O_2\\rightarrow2Al_2O_3$. С обеих сторон 4 Al и 6 O.'),
        ('Разложение вещества', 'Расставь коэффициенты: $H_2O_2\\rightarrow H_2O+O_2$.', '$2H_2O_2\\rightarrow2H_2O+O_2$. С обеих сторон 4 H и 4 O.'),
        ('Итог урока', 'Почему при уравнивании реакции можно менять коэффициенты, но нельзя менять индексы?', 'Коэффициент меняет число частиц вещества. Индекс входит в формулу и определяет состав вещества; его изменение превратит исходное вещество в другое.'),
    ],
    ('Химия', 1): [
        ('Простые вещества', 'К какому виду относятся $O_2$ и Fe: простые или сложные? Объясни.', 'Оба вещества простые: каждая формула содержит атомы только одного химического элемента.'),
        ('Оксиды', 'Определи класс веществ $MgO$ и $CO_2$ и назови признак.', 'Оба вещества — оксиды: это соединения двух элементов, один из которых кислород со степенью окисления −II.'),
        ('Кислоты', 'Определи класс $HNO_3$ и HCl. Какой признак ты использовал?', 'Это кислоты. В школьном наборе их формулы начинаются с H и содержат кислотный остаток: $NO_3$ или Cl.'),
        ('Основания', 'Определи класс KOH и $Mg(OH)_2$.', 'Это основания: формулы состоят из металла и одной или нескольких групп OH.'),
        ('Соли', 'Определи класс NaCl и $CaCO_3$.', 'Это соли: они состоят из катиона металла и кислотного остатка Cl или $CO_3$.'),
        ('Смешанная проверка', 'Классифицируй $SO_3$, $H_3PO_4$, $CuCl_2$, $N_2$ и LiOH.', '$SO_3$ — оксид; $H_3PO_4$ — кислота; $CuCl_2$ — соль; $N_2$ — простое вещество; LiOH — основание.'),
        ('Итог урока', 'Чем простое вещество отличается от сложного? Назови признаки оксида, кислоты, основания и соли.', 'Простое вещество содержит атомы одного элемента, сложное — нескольких. Оксид содержит два элемента и кислород −II; кислота — H и кислотный остаток; основание — металл и OH; соль — катион металла и кислотный остаток.'),
    ],
    ('Химия', 2): [
        ('Разложение', 'Уравняй и назови тип: $H_2O_2\\rightarrow H_2O+O_2$.', '$2H_2O_2\\rightarrow2H_2O+O_2$ — разложение: из одного вещества образуются два.'),
        ('Замещение', 'Уравняй и назови тип: $Fe+CuSO_4\\rightarrow FeSO_4+Cu$.', 'Коэффициенты по 1. Это замещение: простое вещество Fe вытесняет Cu из сложного вещества.'),
        ('Обмен', 'Уравняй и назови тип: $H_2SO_4+NaOH\\rightarrow Na_2SO_4+H_2O$.', '$H_2SO_4+2NaOH\\rightarrow Na_2SO_4+2H_2O$ — обмен и нейтрализация.'),
        ('Соединение', 'Уравняй и назови тип: $CaO+H_2O\\rightarrow Ca(OH)_2$.', 'Коэффициенты по 1. Это соединение: два вещества образуют одно.'),
        ('Разложение при нагревании', 'Уравняй и назови тип: $Cu(OH)_2\\rightarrow CuO+H_2O$.', 'Коэффициенты по 1. Это разложение: одно вещество образует два.'),
        ('Замещение металлом', 'Уравняй и назови тип: $Mg+HCl\\rightarrow MgCl_2+H_2$.', '$Mg+2HCl\\rightarrow MgCl_2+H_2$ — замещение.'),
        ('Обмен с осадком', 'Уравняй и назови тип: $CaCl_2+Na_2CO_3\\rightarrow CaCO_3+NaCl$.', '$CaCl_2+Na_2CO_3\\rightarrow CaCO_3\\downarrow+2NaCl$ — обмен; образуется осадок.'),
        ('Физическое или химическое', 'При плавлении льда меняется ли формула воды? Возникает ли новое вещество?', 'Формула остаётся $H_2O$, нового вещества нет. Плавление — физическое явление.'),
        ('Итог урока', 'Почему коэффициенты в уравнении не определяют тип реакции?', 'Тип определяют по числу и составу исходных веществ и продуктов. Коэффициенты показывают только соотношение частиц.'),
    ],
    ('Химия', 3): [
        ('Температура', 'Одна реакция идёт при 20 °C и 40 °C; остальные условия одинаковы. При повышении температуры она ускоряется. Где скорость выше и можно ли узнать кратность?', 'Скорость выше при 40 °C. Кратность определить нельзя: числовых данных нет.'),
        ('Катализатор', 'В двух одинаковых порциях пероксида водорода во вторую добавили катализатор. Что изменится: скорость или теоретическое количество кислорода?', 'Катализатор увеличит скорость выделения кислорода, но сам по себе не изменит теоретическое количество продукта после полного разложения.'),
        ('Чистый опыт', 'Одновременно повысили температуру и измельчили твёрдый реагент. Можно ли определить вклад только температуры?', 'Нельзя, потому что изменены два условия. Для проверки температуры размер частиц и остальные условия должны быть одинаковыми.'),
        ('Концентрация', 'Два опыта отличаются только концентрацией HCl. Во втором она выше. Где выше начальная скорость и почему?', 'Во втором опыте: при большей концентрации в единице объёма больше частиц, поэтому эффективные столкновения происходят чаще.'),
        ('Площадь поверхности', 'Равные массы чистого $CaCO_3$ взяли порошком и одним кусочком, кислота в избытке. Где начальная скорость выше и изменится ли итоговое количество газа?', 'Порошок реагирует быстрее из-за большей площади поверхности. Итоговое количество газа одинаково, потому что массы чистого карбоната одинаковы и кислота в избытке.'),
        ('Сравнение по данным', 'За первые 10 с в опыте A выделилось 20 мл газа, в B — 50 мл. Найди средние объёмные темпы и их отношение.', 'A: $20/10=2$ мл/с; B: $50/10=5$ мл/с. В опыте B средний темп в $5/2=2{,}5$ раза выше.'),
        ('Неверное сравнение', 'В A взяли 1 г реагента и холодный раствор, в B — 2 г и тёплый. Почему нельзя выделить влияние температуры?', 'Одновременно изменены масса и температура. Нужно оставить одинаковыми массу, состав, размер частиц, объём и концентрацию раствора и способ измерения.'),
        ('Исправь утверждение', 'Исправь фразу: «Катализатор расходуется как реагент и поэтому даёт больше продукта».', 'Катализатор участвует в стадиях реакции и регенерируется; он ускоряет реакцию, не расходуется в суммарном уравнении и сам по себе не увеличивает теоретическое количество продукта.'),
        ('Итог урока', 'Реакция с катализатором закончилась раньше. Доказывает ли это, что продукта получилось больше?', 'Нет. Более быстрое завершение показывает увеличение скорости. Количество продукта определяют количества реагентов и степень превращения, а не сам факт использования катализатора.'),
    ],
}

VISUALS = {
    ('Физика', 1): '''```mermaid
flowchart LR
    P["Пассажир"] -->|"покоится относительно"| B["Автобус"]
    P -->|"движется относительно"| R["Дорога и остановка"]
    B --> S["Тело отсчёта"]
    S --> X["Координатная ось"]
    X --> T["Часы"]
    T --> D["Описание движения"]
    classDef focus fill:#fff3bf,stroke:#e67700,color:#212529;
    class P,S,X,T focus;
```''',
    ('Физика', 2): '''```mermaid
flowchart LR
    A["Старт: x = 0"] -->|"4 м вправо"| B["Разворот: x = 4"]
    B -->|"4 м влево"| C["Финиш: x = 0"]
    A -. "перемещение = 0" .-> C
    D["Путь = 4 + 4 = 8 м"]
    C --> D
    classDef start fill:#d3f9d8,stroke:#2b8a3e,color:#212529;
    classDef turn fill:#fff3bf,stroke:#e67700,color:#212529;
    class A,C start;
    class B turn;
```''',
    ('Физика', 3): '''```mermaid
flowchart LR
    A["t = 0 c<br/>x = 0 м"] -->|"1 с"| B["x = 2 м"]
    B -->|"1 с"| C["x = 4 м"]
    C -->|"1 с"| D["x = 6 м"]
    V["v = 2 м/с"] --> A
    F1["Путь: l = v · t"] --> F2["Координата: x = x₀ + vₓ · t"]
    classDef formula fill:#d0ebff,stroke:#1971c2,color:#212529;
    class V,F1,F2 formula;
```''',
    ('Химия', 0): '''```mermaid
flowchart TD
    A["2H₂O"] --> B["2 перед формулой<br/>коэффициент"]
    A --> C["₂ после H<br/>индекс"]
    B --> D["Две молекулы воды"]
    C --> E["Два атома H<br/>в одной молекуле"]
    D --> F["Всего: 4 H и 2 O"]
    E --> F
    classDef key fill:#e5dbff,stroke:#7048e8,color:#212529;
    class A,B,C key;
```''',
    ('Химия', 1): '''```mermaid
flowchart TD
    A["Вещество"] --> B{"Сколько элементов<br/>в формуле?"}
    B -->|"один"| C["Простое<br/>O₂, Fe"]
    B -->|"несколько"| D["Сложное"]
    D --> E["Оксид<br/>MgO, CO₂"]
    D --> F["Кислота<br/>HCl, HNO₃"]
    D --> G["Основание<br/>KOH, Mg(OH)₂"]
    D --> H["Соль<br/>NaCl, CaCO₃"]
    classDef root fill:#fff3bf,stroke:#e67700,color:#212529;
    classDef classbox fill:#d3f9d8,stroke:#2b8a3e,color:#212529;
    class A,B root;
    class C,E,F,G,H classbox;
```''',
    ('Химия', 2): '''```mermaid
flowchart TD
    A["Смотрим на число<br/>и состав веществ"] --> B["Соединение<br/>A + B → AB"]
    A --> C["Разложение<br/>AB → A + B"]
    A --> D["Замещение<br/>A + BC → AC + B"]
    A --> E["Обмен<br/>AB + CD → AD + CB"]
    K["Коэффициенты показывают<br/>соотношение частиц,<br/>а не тип реакции"]
    A --> K
    classDef type fill:#d0ebff,stroke:#1971c2,color:#212529;
    classDef warning fill:#ffe3e3,stroke:#c92a2a,color:#212529;
    class B,C,D,E type;
    class K warning;
```''',
    ('Химия', 3): '''```mermaid
flowchart LR
    T["Температура ↑"] --> C["Больше эффективных<br/>столкновений"]
    K["Концентрация ↑"] --> C
    S["Площадь поверхности ↑"] --> C
    Cat["Катализатор"] --> P["Более доступный<br/>путь реакции"]
    C --> V["Скорость реакции ↑"]
    P --> V
    V -. "не означает автоматически" .-> M["Больше итогового<br/>продукта"]
    classDef factor fill:#fff3bf,stroke:#e67700,color:#212529;
    classDef result fill:#d3f9d8,stroke:#2b8a3e,color:#212529;
    class T,K,S,Cat factor;
    class V result;
```''',
}


def lesson_path(subject: str, n: int, title: str) -> str:
    return f'Занятия/{subject}/Урок {n:02d} - {title}.md'


def wiki(path: str, label: str | None = None) -> str:
    return '[[' + path.removesuffix('.md') + ('|' + label if label else '') + ']]'


def header(kind: str, extra: str = '') -> str:
    return f'---\ntype: {kind}\nproject: "[[9 КЛАСС]]"\nedition: student\nupdated: {DAY}\n{extra}---\n\n'


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def zip_text(archive: zipfile.ZipFile, name: str, content: str) -> None:
    """Write reproducibly so a verified ZIP keeps the same checksum on rebuild."""
    info = zipfile.ZipInfo(name, date_time=(2026, 9, 5, 0, 0, 0))
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = 0o100644 << 16
    archive.writestr(info, content.encode('utf-8'))


def clean_section(subject: str, n: int, section: int, body: str) -> str:
    """Remove tutor directions in allowlisted sections; keep worked examples."""
    if section == 1:
        body = re.split(r'\n\nЕсли ', body, maxsplit=1)[0]
    body = re.split(r'\n\nПодсказки', body, maxsplit=1)[0]
    drops = [
        'Задавать по одному вопросу, просить объяснить ответ.',
        'Спросить спокойно:',
        'Сначала дать ученику самому нарисовать ось, затем предложить подсказку.',
        'По 1 баллу за задание; в заданиях с несколькими величинами нужен полный ответ.',
        'За каждое полностью выполненное задание — 1 балл.',
        'По 1 баллу за правильный вывод и 1 за объяснение, всего 8.',
        'Эту часть давать только если обнаружились пробелы. Если урок был разминкой перед параграфом 1, лучше домашнее взять из урока 01.',
    ]
    for line in drops:
        body = body.replace(line, '')
    body = body.replace('Разбирать устно, требуя объяснение "относительно чего".', 'В каждом ответе уточняй: «Относительно чего?»')
    body = body.replace('Классифицировать и обязательно проговаривать признак.', 'Изучи примеры: в каждом указан признак класса вещества.')
    body = body.replace('В каждом задании: уравняй, назови тип, объясни одним предложением. За уравнение и тип с объяснением — по 1 баллу, всего 8.', 'В каждом задании: уравняй, назови тип, объясни одним предложением.')
    body = body.replace('Если осталось время, вместо дополнительной практики разобрать', 'Дополнительно рассмотри')
    body = body.replace('Иначе оставить на начало следующего занятия.', 'Этот блок можно разобрать вместе на следующем занятии.')
    body = body.replace('Например, H2O - вода.', 'Например, H2O — вода, она относится к оксидам.')
    if subject == 'Химия' and n == 1 and section == 3:
        body = body.replace('Оксид обычно состоит из двух элементов, один из них кислород.', 'Оксид — соединение двух элементов, в котором кислород имеет степень окисления −II. Если степени окисления ещё не изучали, пока узнавай обычные оксиды по примерам ниже. Пероксиды, например H2O2, рассматриваются отдельно.')
        body += '\n\nПризнаки по началу формулы и группе OH — подсказки для данного набора. Амфотерные гидроксиды и кислые соли требуют отдельного объяснения.'
    if subject == 'Химия' and n == 0:
        # Typical products: potassium combustion does not normally yield K2O;
        # iron combustion is also an unsuitable unqualified Fe2O3 example.
        body = body.replace('K + O2 -> K2O', 'Li + O2 -> Li2O')
        body = body.replace('Fe + O2 -> Fe2O3', 'Cu + O2 -> CuO')
        if section == 2:
            body = body.replace('сколько атомов каждого элемента содержится в одной частице вещества.', 'состав молекулы, а для немолекулярных веществ — соотношение атомов в формульной единице. Например, NaCl не состоит из отдельных молекул NaCl.')
        if section == 7:
            body += '\n\nУсловия примеров: горение магния; взаимодействие алюминия с хлором после инициирования; разложение карбоната кальция при сильном нагревании. Рассматриваем только записи, опыты самостоятельно не проводим.'
        if section == 9:
            body += '\n\nЧасть C — письменная работа с данными схемами. Li реагирует с кислородом при горении, Cu и Al — при соответствующем нагревании/инициировании. Разложение пероксида может ускоряться катализатором. Опыты дома не проводить.'
    return re.sub(r'\n{3,}', '\n\n', body).strip()


def numbered_sections(text: str, source: Path) -> dict[int, tuple[str, str]]:
    sections = {}
    for item in re.split(r'^## ', text, flags=re.M)[1:]:
        heading, _, body = item.partition('\n')
        match = re.match(r'(\d+)\. (.+)', heading)
        if not match:
            continue
        number = int(match[1])
        if number in sections:
            raise ValueError(f'Duplicate numbered section in {source.name}: {number}')
        sections[number] = (match[2], body)
    return sections


def callout(kind: str, title: str, body: str, folded: bool = True) -> str:
    marker = '-' if folded else ''
    quoted = '\n'.join('> ' + line if line else '>' for line in body.splitlines())
    return f'> [!{kind}]{marker} {title}\n>\n{quoted}'


def learning_step(number: int, title: str, prompt: str, solution: str) -> str:
    """One self-contained cycle: task, learner response, folded solution."""
    return f'''### Шаг {number}. {title}

{prompt}

**Ответ ученика**

_Нажми `Ctrl+E` и замени эту строку своим ходом решения и ответом._

''' + callout('solution', f'Правильный ответ к шагу {number}', solution) + '\n'


def student_lesson(source: Path, subject: str, n: int, title: str, allowed: list[int]) -> str:
    text = source.read_text(encoding='utf-8-sig')
    if text.startswith('---\n'):
        text = text.split('\n---\n', 1)[1]
    sections = numbered_sections(text, source)
    parts = []
    for section in allowed:
        if section not in sections:
            raise ValueError(f'Missing reviewed section {section}: {source}')
        heading, body = sections[section]
        if re.search(r'ключ|ответы|преподавател', heading, re.I):
            raise ValueError(f'Teacher section in allowlist: {heading}')
        body = clean_section(subject, n, section, body)
        if subject == 'Химия' and n == 1 and section == 4:
            heading = 'Разобранные примеры'
        parts.append('## ' + heading + '\n\n' + body)
    result = header('lesson', f'subject: {subject}\nlesson: {n}\nduration: {35 if n == 0 else 45}\nstatus: not-started\n')
    result += f'# Урок {n:02d}. {title}\n\n{GOALS[subject,n]}\n\n'
    result += 'Понадобятся тетрадь и ручка' + ('; для рисунков — линейка.' if subject == 'Физика' else '; для формул — периодическая таблица. Все задания выполняем на бумаге или в заметке, без самостоятельных химических опытов.') + '\n\n'
    result += wiki('Занятия/Начать занятия.md', 'Все уроки') + ' · [[#Тренировка по шагам|Перейти к заданиям]]\n\n'
    result += '\n\n'.join(parts)
    result += '\n\n## Наглядная схема\n\n' + VISUALS[subject, n]
    result += '''

## Тренировка по шагам

Работай сверху вниз. Сначала запиши собственный ответ, затем нажми на свёрнутый блок «Правильный ответ» непосредственно под заданием. Исправление пиши ниже своей первой попытки, не стирая её.

'''
    result += '\n'.join(learning_step(i, *step) for i, step in enumerate(STEPS[subject, n], 1))
    result += '''
## Вопросы ученика

_Напиши, что осталось непонятным._

## Комментарий преподавателя

_Заполняется после проверки работы._
'''
    peers = [s for s in SPECS if s[0] == subject]
    ix = next(i for i, s in enumerate(peers) if s[1] == n)
    nav = []
    if ix:
        prev = peers[ix - 1]
        nav.append(wiki(lesson_path(*prev[:3]), 'Предыдущий урок'))
    if ix + 1 < len(peers):
        nxt = peers[ix + 1]
        nav.append(wiki(lesson_path(*nxt[:3]), 'Следующий урок'))
    result += '\n' + ' · '.join(nav) + '\n'
    # Source path references are forbidden, not silently fixed or copied.
    if re.search(r'30_Knowledge|90_Workspaces|source_file|source_url|ключ для взрослого|дополнительные заметки преподавателя', result, re.I):
        raise ValueError(f'Unreviewed teacher material in {source.name}')
    return result


def make_payload(source_root: Path) -> tuple[dict[str, str], dict[str, str], dict]:
    managed = {}
    seeds = {}
    sources = {}
    for subject, n, title, allowed in SPECS:
        source = source_root / subject / 'Уроки' / f'Урок {n:02d} - {title}.md'
        managed[lesson_path(subject, n, title)] = student_lesson(source, subject, n, title, allowed)
        sources[f'{subject}/{source.name}'] = sha(source.read_bytes())
    table = '| Урок | Физика | Химия |\n|---|---|---|\n'
    for n in range(1, 4):
        cells = []
        for subject in ('Физика', 'Химия'):
            spec = next(s for s in SPECS if s[0] == subject and s[1] == n)
            cells.append(wiki(lesson_path(*spec[:3]), spec[2]).replace('|', '\\|'))
        table += f'| {n:02d} | ' + ' | '.join(cells) + ' |\n'
    prep = next(s for s in SPECS if s[0] == 'Химия' and s[1] == 0)
    managed['Занятия/Начать занятия.md'] = header('course-index') + '''# Начать занятия

Здесь три основных урока физики и три химии. Выбери предмет, начни с урока 01 и двигайся дальше после обсуждения с преподавателем.

''' + table + '\nПодготовка при затруднениях с формулами: ' + wiki(lesson_path(*prep[:3]), 'Химия 00 — язык химии') + '''.

## Как заниматься

1. Прочитай цель, объяснение и рассмотренную наглядную схему.
2. По схеме своими словами перескажи главную мысль, затем перейди к разделу «Тренировка по шагам». Для редактирования нажми `Ctrl+E`.
3. В шаге 1 запиши ответ ученика.
4. Нажми на свёрнутый блок «Правильный ответ к шагу 1», сравни решения и напиши исправление ниже первоначального ответа.
5. Только после этого переходи к шагу 2. Не раскрывай ответы к будущим заданиям заранее.
6. Запиши вопрос преподавателю, если что-то осталось непонятным.

Скрытие ответов помогает соблюдать порядок работы, но не является технической защитой: правильные решения хранятся внутри файла и доступны в исходном Markdown.

> [!info] Схемы при первом запуске
> Если Obsidian спросит «Отображать диаграммы Mermaid в этом хранилище?», нажми **Разрешить**. Схемы входят в этот учебный пакет и не требуют сторонних плагинов.

''' + wiki('Занятия/Настройка Syncthing.md') + '\n'
    managed['Занятия/Настройка Syncthing.md'] = (TEMPLATES / 'Настройка Syncthing.md').read_text(encoding='utf-8-sig')
    seeds['9 КЛАСС.md'] = header('project') + '''# 9 класс — ученик

''' + wiki('Занятия/Начать занятия.md', 'Открыть уроки и мои ответы') + '\n\n' + wiki('Занятия/Настройка Syncthing.md', 'Настроить синхронизацию на Windows') + '\n'
    seeds['СНАЧАЛА ПРОЧИТАЙ.txt'] = '''9 класс — ученик

1. Распакуйте всю папку на диск своего компьютера (не работайте прямо из ZIP).
2. В Obsidian выберите «Открыть папку как хранилище» и укажите папку «9 класс — ученик».
3. Откройте заметку «9 КЛАСС», затем «Открыть уроки».
4. В каждом уроке ученик идёт по шагам: задание, свой ответ, раскрытие правильного решения.
5. Настройка Syncthing находится в Занятия/Настройка Syncthing.md.

В ZIP нет установленного Syncthing, чужих настроек или готового подключения к другому компьютеру.
Для повторных обновлений не распаковывайте архив поверх текущего хранилища: в уроках уже находятся ответы ученика. Новые уроки передаются через Syncthing отдельными файлами.
'''
    # Fresh local preferences, not copied from the teacher's .obsidian directory.
    seeds['.obsidian/app.json'] = json.dumps({
        'readableLineLength': True, 'showInlineTitle': False,
        'propertiesInDocument': 'hidden', 'defaultViewMode': 'preview',
        'attachmentFolderPath': 'Занятия/Вложения',
    }, ensure_ascii=False, indent=2) + '\n'
    seeds['.obsidian/appearance.json'] = json.dumps({'enabledCssSnippets': []}, ensure_ascii=False, indent=2) + '\n'
    seeds['.obsidian/community-plugins.json'] = '[]\n'
    ignore = '// Local Windows/Obsidian clutter; install on both devices.\n/.obsidian\n/.trash\nThumbs.db\ndesktop.ini\n.DS_Store\n'
    seeds['Занятия/.stignore'] = ignore
    return managed, seeds, sources


def validate_payload(payload: dict[str, str]) -> dict:
    errors = []
    link_count = 0
    forbidden = re.compile(r'30_Knowledge|90_Workspaces|Obsidian-Work|C:\\Users\\Oleg|source_file|source_url|BRAIN_ANON_KEY|api[_-]?key|Дополнительные заметки преподавателя', re.I)
    stems = {Path(p).stem for p in payload if p.endswith('.md')}
    lessons = [p for p in payload if re.fullmatch(r'Занятия/(?:Физика|Химия)/Урок \d{2} - .+\.md', p)]
    for path, content in payload.items():
        if '\ufffd' in content:
            errors.append(f'Bad UTF-8: {path}')
        if forbidden.search(content):
            errors.append(f'Unwanted source/config/answer reference: {path}')
        if path.endswith('.json'):
            json.loads(content)
        if path.endswith('.md'):
            if not content.startswith('---\n') or '\n---\n' not in content[4:]:
                errors.append(f'Frontmatter: {path}')
            if 'project: "[[9 КЛАСС]]"' not in content:
                errors.append(f'Project property: {path}')
            for link in re.findall(r'\[\[([^\]]+)\]\]', content):
                target = link.replace('\\|', '|').split('|')[0].split('#')[0]
                link_count += 1
                if target and target not in payload and target + '.md' not in payload and target not in stems:
                    errors.append(f'Broken link {path}: {target}')
            # Table alias pipes must be escaped or the table grows extra columns.
            for line in content.splitlines():
                if line.startswith('|') and re.search(r'\[\[[^\]]*(?<!\\)\|', line):
                    errors.append(f'Table alias not escaped: {path}')
    if len(lessons) != len(SPECS):
        errors.append(f'Expected {len(SPECS)} lesson files, found {len(lessons)}')
    for path in lessons:
        content = payload[path]
        subject = 'Физика' if '/Физика/' in path else 'Химия'
        lesson_number = int(re.search(r'/Урок (\d{2}) -', path).group(1))
        expected_steps = len(STEPS[subject, lesson_number])
        if content.count('> [!solution]- Правильный ответ к шагу') != expected_steps:
            errors.append(f'Hidden solution blocks: {path}')
        if '- [ ] Показать правильный ответ к шагу' in content:
            errors.append(f'Obsolete unlock checkbox: {path}')
        if content.count('**Ответ ученика**') != expected_steps:
            errors.append(f'Learner answer fields: {path}')
        if content.count('```mermaid') != 1 or '## Наглядная схема' not in content:
            errors.append(f'Lesson visualization: {path}')
    if '.obsidian/snippets/student-answers.css' in payload:
        errors.append('Obsolete checkbox CSS remains in payload')
    if any(path.startswith(('Материалы/', 'Мои решения/')) for path in payload):
        errors.append('Old split-folder layout remains in payload')
    if errors:
        raise ValueError('\n'.join(errors))
    return {'files': len(payload), 'internal_links': link_count, 'lessons': len(SPECS), 'errors': []}


def build(source_root: Path, output: Path, archive: Path) -> dict:
    managed, seeds, sources = make_payload(source_root)
    payload = {**managed, **seeds}
    checks = validate_payload(payload)
    output = output.resolve()
    # An exporter must not be aimed at the teacher vault or an ancestor of it.
    if output == source_root.resolve() or output in source_root.resolve().parents or source_root.resolve() in output.parents:
        raise ValueError('Output must be separate from the source vault tree')
    marker = output / '.student-export.json'
    previous = json.loads(marker.read_text(encoding='utf-8')) if marker.exists() else {}
    old_hashes = previous.get('managed', {})
    # Preflight all managed files before any write; preserve unknown local edits.
    for rel, content in managed.items():
        target = output / rel
        if target.exists():
            current = sha(target.read_bytes())
            if current != sha(content.encode('utf-8')) and current != old_hashes.get(rel):
                raise ValueError(f'Managed material has local edits; preserve and review it first: {target}')
    written = 0
    for rel, content in managed.items():
        p = output / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        if not p.exists() or p.read_bytes() != content.encode('utf-8'):
            p.write_text(content, encoding='utf-8', newline='\n')
            written += 1
    preserved = []
    for rel, content in seeds.items():
        p = output / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        if p.exists():
            preserved.append(rel)
        else:
            p.write_text(content, encoding='utf-8', newline='\n')
    (output / 'Занятия' / 'Вложения').mkdir(parents=True, exist_ok=True)
    marker.write_text(json.dumps({'managed': {p: sha(c.encode('utf-8')) for p, c in managed.items()}, 'source_hashes': sources}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    # ZIP is built from reviewed templates, NEVER by walking the live output.
    # Thus student answers, conflict copies, .stversions, GUI settings and secrets
    # from later local use cannot leak into a fresh distributable.
    archive.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED) as z:
        for rel, content in sorted(payload.items()):
            zip_text(z, f'{VAULT_NAME}/{rel}', content)
        zip_text(z, f'{VAULT_NAME}/Занятия/Вложения/', '')
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        actual = {n.removeprefix(VAULT_NAME + '/'): z.read(n).decode('utf-8') for n in z.namelist() if not n.endswith('/')}
        assert actual == payload
    return {**checks, 'output': str(output), 'archive': str(archive), 'archive_sha256': sha(archive.read_bytes()), 'material_files_written': written, 'existing_seed_files_preserved': preserved}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True, help='Canonical 30_Knowledge/9 КЛАСС folder')
    parser.add_argument('--output', type=Path, required=True, help='Separate student vault folder')
    parser.add_argument('--archive', type=Path, required=True, help='Fresh distributable ZIP')
    args = parser.parse_args()
    print(json.dumps(build(args.source, args.output, args.archive), ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
