# -*- coding: utf-8 -*-
"""Собирает два кратких отчёта о выполненной работе по задачам."""
import os

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = r'C:\Users\rorg0\Downloads\Study\Umnyi_shop'
SHOTS = os.path.join(ROOT, 'docs', 'screenshots')
OUT_DIR = r'C:\Users\rorg0\Downloads\Study\Umnyi_shop-doc'
os.makedirs(OUT_DIR, exist_ok=True)

ACCENT = RGBColor(0x1F, 0x38, 0x64)
GREY = RGBColor(0x59, 0x59, 0x59)


def new_doc():
    doc = Document()
    section = doc.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(1.5)
    section.top_margin = Cm(2)
    section.bottom_margin = Cm(2)

    normal = doc.styles['Normal']
    normal.font.name = 'Times New Roman'
    normal.font.size = Pt(12)
    normal.element.rPr.rFonts.set(qn('w:eastAsia'), 'Times New Roman')

    add_page_numbers(section)
    return doc


def add_page_numbers(section):
    p = section.footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    run.font.name = 'Times New Roman'
    run.font.size = Pt(10)
    begin = OxmlElement('w:fldChar')
    begin.set(qn('w:fldCharType'), 'begin')
    instr = OxmlElement('w:instrText')
    instr.set(qn('xml:space'), 'preserve')
    instr.text = 'PAGE'
    end = OxmlElement('w:fldChar')
    end.set(qn('w:fldCharType'), 'end')
    run._r.append(begin)
    run._r.append(instr)
    run._r.append(end)


def set_run(run, size=12, bold=False, italic=False, color=None):
    run.font.name = 'Times New Roman'
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color is not None:
        run.font.color.rgb = color


def title(doc, text, subtitle):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_after = Pt(2)
    set_run(p.add_run(text), 20, bold=True, color=ACCENT)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(14)
    set_run(p.add_run(subtitle), 12, color=GREY)


def heading(doc, text):
    p = doc.add_heading(level=1)
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    pf = p.paragraph_format
    pf.space_before = Pt(12)
    pf.space_after = Pt(6)
    pf.keep_with_next = True
    set_run(p.add_run(text), 14, bold=True, color=ACCENT)


def body(doc, text, space_after=6):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pf = p.paragraph_format
    pf.space_after = Pt(space_after)
    pf.line_spacing = 1.15
    set_run(p.add_run(text), 12)
    return p


def bullets(doc, items):
    for text in items:
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        set_run(p.add_run(text), 12)


def figure(doc, filename, caption, width=15.4):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    p.add_run().add_picture(os.path.join(SHOTS, filename), width=Cm(width))

    c = doc.add_paragraph()
    c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    c.paragraph_format.space_after = Pt(12)
    set_run(c.add_run(caption), 10, italic=True, color=GREY)


def image_pair(doc, left, left_caption, right, right_caption, width=7.2):
    table = doc.add_table(rows=2, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    for column, filename in enumerate((left, right)):
        cell = table.cell(0, column)
        paragraph = cell.paragraphs[0]
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        paragraph.add_run().add_picture(os.path.join(SHOTS, filename), width=Cm(width))
        caption_cell = table.cell(1, column)
        caption = caption_cell.paragraphs[0]
        caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_run(caption.add_run(left_caption if column == 0 else right_caption), 10, italic=True, color=GREY)


def simple_table(doc, headers, rows, widths):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = 'Table Grid'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    for index, text in enumerate(headers):
        cell = table.rows[0].cells[index]
        paragraph = cell.paragraphs[0]
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_run(paragraph.add_run(text), 10, bold=True)

    for row in rows:
        cells = table.add_row().cells
        for index, text in enumerate(row):
            paragraph = cells[index].paragraphs[0]
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            set_run(paragraph.add_run(text), 10)

    for row in table.rows:
        for index, width in enumerate(widths):
            row.cells[index].width = Cm(width)
    return table


# ---------------------------------------------------------------- отчёт 1
doc = new_doc()
title(doc, 'Бесконечный каталог товаров', 'Отчёт о выполненной задаче · «Умный Шопинг»')

body(doc, 'Задача — чтобы каталог не отдавал все товары сразу, а подгружал их порциями '
          'по мере прокрутки. Так страница открывается быстро и не тяжелеет с ростом каталога: '
          'сейчас в нём 55 товаров, после подключения парсеров их станет больше.')

heading(doc, 'Что сделано')
bullets(doc, [
    'Товары отдаются страницами по 12 карточек через отдельную функцию загрузки.',
    'Следующая страница подгружается автоматически при подходе к концу списка; '
    'кнопка «Показать ещё» осталась как запасной вариант.',
    'На время загрузки показываются скелетоны, при ошибке — сообщение и кнопка «Повторить».',
    'В конце списка выводится строка «Показано 55 из 55».',
    'При смене поиска, категории или сортировки лента начинается заново и прокручивается вверх.',
    'Открытие карточки товара ленту не пересобирает — позиция прокрутки сохраняется.',
])

heading(doc, 'Как это выглядит')
figure(doc, '09-catalog-skeleton.png', 'Рисунок 1 — Состояние загрузки: двенадцать скелетонов')
figure(doc, '10-catalog-start.png', 'Рисунок 2 — Первая порция: 12 карточек')
figure(doc, '11-catalog-end.png', 'Рисунок 3 — Конец списка: «Показано 55 из 55 — список закончился»')

heading(doc, 'Результаты проверки')
bullets(doc, [
    'первая загрузка — 12 карточек и один запрос;',
    'кнопка «Показать ещё» — 24 карточки;',
    'прокрутка — 36, 48, 55 карточек, затем сообщение об окончании списка;',
    'дубликатов нет: 55 уникальных заголовков из 55;',
    'смена категории — снова 12 карточек, прокрутка вверх;',
    'открытие и закрытие карточки товара — прокрутка 587 → 587.',
])

body(doc, 'Итог: каталог листается без разрывов и не грузит всю выдачу сразу, '
          'а состояние загрузки и окончание списка видны пользователю.')

doc.save(os.path.join(OUT_DIR, 'Отчёт_Бесконечный_каталог.docx'))

# ---------------------------------------------------------------- отчёт 2
doc = new_doc()
title(doc, 'Адаптация под телефоны', 'Отчёт о выполненной задаче · «Умный Шопинг»')

body(doc, 'Задача — привести интерфейс к рабочему виду на телефонах от 360px. '
          'На узких экранах ломались шапка (навигация уезжала в бургер-меню), сетка каталога '
          'и таблица предложений в карточке товара.')

heading(doc, 'Что сделано')
bullets(doc, [
    'Шапка: логотип и «Личный кабинет» в одной строке, поиск отдельной строкой на всю ширину, '
    'навигация (Главная, Каталог, Избранное) всегда видна — бургер-меню убрано.',
    'Каталог: карточки в одну колонку, фильтры переносятся строками, сортировка под ними.',
    'Карточка товара: модальное окно на весь экран, таблица предложений перестраивается в две колонки.',
    'Личный кабинет: разделы одной строкой, поля профиля в одну колонку.',
    'Отступы контента 12–16 px, кнопки не меньше 44 px, горизонтальной прокрутки нет.',
])

heading(doc, 'Как это выглядит')
image_pair(doc, '12-mobile-home.png', 'Рисунок 1 — Главная на телефоне',
           '13-mobile-catalog.png', 'Рисунок 2 — Каталог на телефоне')

extra = doc.add_paragraph()
extra.paragraph_format.space_after = Pt(0)
extra.add_run('')

image_pair(doc, '14-mobile-modal.png', 'Рисунок 3 — Карточка товара',
           '15-mobile-account.png', 'Рисунок 4 — Личный кабинет')

heading(doc, 'Проверка на разных ширинах')
simple_table(
    doc,
    ['Ширина', 'Навигация', 'Личный кабинет', 'Прокрутка'],
    [
        ['390 px', 'видна, под поиском', 'справа, 12 px от края', 'нет'],
        ['768 px', 'видна, под поиском', 'справа, 20 px от края', 'нет'],
        ['1440 px', 'видна, под шапкой', 'в шапке справа', 'нет'],
    ],
    [3.2, 5.4, 5.4, 3.0],
)

body(doc, '')
body(doc, 'Итог: основными сценариями — поиск, просмотр карточки товара и личный кабинет — '
          'можно пользоваться с телефона, вёрстка не требует горизонтальной прокрутки.')

doc.save(os.path.join(OUT_DIR, 'Отчёт_Мобильная_версия.docx'))

print('готово')
for name in ('Отчёт_Бесконечный_каталог.docx', 'Отчёт_Мобильная_версия.docx'):
    path = os.path.join(OUT_DIR, name)
    check = Document(path)
    print(name, '| параграфов:', len(check.paragraphs), '| картинок:', len(check.inline_shapes),
          '| таблиц:', len(check.tables))
