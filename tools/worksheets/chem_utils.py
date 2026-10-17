"""Химические вспомогательные функции для рабочих листов: разбор формул, уравнивание, степени окисления."""
from __future__ import annotations

import re
from fractions import Fraction
from math import gcd

SUB = str.maketrans("0123456789", "₀₁₂₃₄₅₆₇₈₉")
SUP = str.maketrans("0123456789+-", "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻")


def pretty(formula: str) -> str:
    """H2SO4 → H₂SO₄, Al2(SO4)3 → Al₂(SO₄)₃: цифры после букв и скобок — индексы."""
    out = []
    for index, char in enumerate(formula):
        if char.isdigit() and index > 0 and (formula[index - 1].isalpha() or formula[index - 1] in ")" or formula[index - 1] in "₀₁₂₃₄₅₆₇₈₉"):
            out.append(char.translate(SUB))
        else:
            out.append(char)
    return "".join(out)


def ox(value: int) -> str:
    """Степень окисления для текста: +6 → +6, −2 → −2 (с типографским минусом)."""
    return f"+{value}" if value > 0 else ("0" if value == 0 else f"−{abs(value)}")


def parse(formula: str) -> dict[str, int]:
    """Число атомов каждого элемента; поддерживаются скобки любой вложенности."""
    stack: list[dict[str, int]] = [{}]
    position = 0
    while position < len(formula):
        char = formula[position]
        if char == "(":
            stack.append({})
            position += 1
        elif char == ")":
            position += 1
            match = re.match(r"\d+", formula[position:])
            factor = int(match.group()) if match else 1
            position += len(match.group()) if match else 0
            inner = stack.pop()
            for element, count in inner.items():
                stack[-1][element] = stack[-1].get(element, 0) + count * factor
        else:
            match = re.match(r"[A-Z][a-z]?", formula[position:])
            if not match:
                raise ValueError(f"Не удалось разобрать формулу {formula!r}")
            element = match.group()
            position += len(element)
            digits = re.match(r"\d+", formula[position:])
            count = int(digits.group()) if digits else 1
            position += len(digits.group()) if digits else 0
            stack[-1][element] = stack[-1].get(element, 0) + count
    return stack[0]


def balance(reactants: list[str], products: list[str]) -> list[int]:
    """Наименьшие целые коэффициенты: решение однородной системы по закону сохранения атомов."""
    compounds = reactants + products
    parsed = [parse(c) for c in compounds]
    elements = sorted({e for p in parsed for e in p})
    rows = []
    for element in elements:
        rows.append([Fraction(parsed[i].get(element, 0)) * (1 if i < len(reactants) else -1) for i in range(len(compounds))])
    # Приведение к ступенчатому виду.
    pivots = []
    row = 0
    for col in range(len(compounds)):
        pivot = next((r for r in range(row, len(rows)) if rows[r][col] != 0), None)
        if pivot is None:
            continue
        rows[row], rows[pivot] = rows[pivot], rows[row]
        rows[row] = [x / rows[row][col] for x in rows[row]]
        for r in range(len(rows)):
            if r != row and rows[r][col] != 0:
                factor = rows[r][col]
                rows[r] = [a - factor * b for a, b in zip(rows[r], rows[row])]
        pivots.append(col)
        row += 1
    free = [c for c in range(len(compounds)) if c not in pivots]
    if len(free) != 1:
        raise ValueError(f"Уравнение не имеет единственного решения: {reactants} → {products}")
    solution = [Fraction(0)] * len(compounds)
    solution[free[0]] = Fraction(1)
    for r, col in enumerate(pivots):
        solution[col] = -rows[r][free[0]]
    denominator = 1
    for x in solution:
        denominator = denominator * x.denominator // gcd(denominator, x.denominator)
    integers = [int(x * denominator) for x in solution]
    divisor = 0
    for x in integers:
        divisor = gcd(divisor, abs(x))
    integers = [x // divisor for x in integers]
    if any(x <= 0 for x in integers):
        raise ValueError(f"Получены неположительные коэффициенты: {integers}")
    return integers


def equation(coefs: list[int], reactants: list[str], products: list[str]) -> str:
    def side(names, cs):
        return " + ".join((f"{c}" if c != 1 else "") + pretty(n) for n, c in zip(names, cs))

    return f"{side(reactants, coefs[:len(reactants)])} → {side(products, coefs[len(reactants):])}"


def scheme(reactants: list[str], products: list[str]) -> str:
    return " + ".join(pretty(r) for r in reactants) + " → " + " + ".join(pretty(p) for p in products)


KNOWN = {"O": -2, "H": 1, "Na": 1, "K": 1, "Li": 1, "Mg": 2, "Ca": 2, "Ba": 2, "Zn": 2, "Al": 3, "F": -1}


def oxidation(formula: str, target: str, extra: dict[str, int] | None = None) -> int:
    """Степень окисления target в нейтральном веществе; все остальные элементы должны быть известны."""
    counts = parse(formula)
    if len(counts) == 1:
        return 0
    known = dict(KNOWN)
    known.update(extra or {})
    total = 0
    for element, count in counts.items():
        if element == target:
            continue
        if element not in known:
            raise ValueError(f"Неизвестна степень окисления {element} в {formula}")
        total += known[element] * count
    value = Fraction(-total, counts[target])
    if value.denominator != 1:
        raise ValueError(f"Нецелая степень окисления {target} в {formula}")
    return int(value)
