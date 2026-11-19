# -*- coding: utf-8 -*-
"""Объединяет отчёт по окружению и отчёт по вёрстке каркаса в один документ."""
import io
import os

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

DOC_DIR = r'C:\Users\rorg0\Downloads\Study\Umnyi_shop-doc'
ROOT = r'C:\Users\rorg0\Downloads\Study\Umnyi_shop'
ASSETS = os.path.join(ROOT, 'docs', 'report', 'layout_assets')
SOURCE = os.path.join(DOC_DIR, 'Отчёт_подготовка_окружения.docx')
OUTPUT = os.path.join(DOC_DIR, 'Отчёт_окружение_и_вёрстка_каркаса.docx')

ACCENT = RGBColor(0x1F, 0x38, 0x64)
GREY = RGBColor(0x59, 0x59, 0x59)

SECTION_TITLE = '7. Вёрстка каркаса'
INTRO = (
    'Задача этапа — создать общую обвязку сайта, которая не изменяется от дизайна, '
    'и настроить роутинг (переходы по ссылкам). Ниже приведены скриншоты текущего '
    'состояния каркаса: главный экран, каталог товаров, карточка товара, личный кабинет '
    'и избранное.'
)
OUTRO = (
    'Пока что есть только готовые предложения из списка, позже будет добавлено '
    'распределение по категориям товара и подключение к базе данных с товарами '
    'и магазинами. Поиск работает, личный кабинет готов, регистрация аккаунта — на '
    'следующем этапе.'
)

FIGURES = [
    ('layout-01.png', 'Главный экран'),
    ('layout-02.png', 'Каталог всех товаров'),
    ('layout-03.png', 'Карточка товара'),
    ('layout-04.png', 'Личный кабинет'),
    ('layout-05.png', 'Вкладка «Избранное»'),
]

doc = Document(SOURCE)


def set_run(run, size, bold=False, italic=False, color=None, name='Times New Roman'):
    run.font.name = name
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color is not None:
        run.font.color.rgb = color


def heading(text):
    p = doc.add_heading(level=1)
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    pf = p.paragraph_format
    pf.space_before = Pt(14)
    pf.space_after = Pt(6)
    pf.keep_with_next = True
    run = p.add_run(text)
    set_run(run, 14, bold=True, color=ACCENT)
    return p


def body(text, space_after=8):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pf = p.paragraph_format
    pf.space_after = Pt(space_after)
    pf.line_spacing = 1.15
    run = p.add_run(text)
    set_run(run, 12)
    return p


def figure(filename, number, caption):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    p.add_run().add_picture(os.path.join(ASSETS, filename), width=Cm(15.5))

    c = doc.add_paragraph()
    c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    c.paragraph_format.space_after = Pt(12)
    run = c.add_run('Рисунок %d — %s' % (number, caption))
    set_run(run, 10, italic=True, color=GREY)


# --- титул: расширяем подзаголовок под объединённый отчёт ---
updated = False
for p in doc.paragraphs:
    if p.text.strip().startswith('о подготовке окружения'):
        if p.runs:
            p.runs[0].text = 'о подготовке окружения\nи вёрстке каркаса платформы'
            for extra in p.runs[1:]:
                extra.text = ''
        updated = True
        break
print('титул обновлён:', updated)

# --- новый раздел ---
doc.add_page_break()
heading(SECTION_TITLE)
body(INTRO)

for index, (filename, caption) in enumerate(FIGURES, start=6):
    figure(filename, index, caption)

body(OUTRO, space_after=6)

# --- согласуем «ближайшие шаги» с новым разделом 7 ---
for p in doc.paragraphs:
    if p.text.strip().startswith('Создание каркаса'):
        if not p.runs:
            continue
        size = p.runs[0].font.size
        for run in p.runs:
            run.text = ''
        first = p.runs[0]
        first.text = 'Вёрстка каркаса'
        first.bold = True
        first.font.name = 'Times New Roman'
        first.font.size = size
        rest = p.add_run(
            ' — выполнено: стек выбран (React + TypeScript + Vite), проект инициализирован, '
            'роутинг настроен, страницы свёрстаны (раздел 7);'
        )
        rest.bold = False
        rest.font.name = 'Times New Roman'
        rest.font.size = size
        print('пункт про каркас обновлён:', p.text.strip()[:80])
        break

doc.save(OUTPUT)

# --- проверка результата ---
check = Document(OUTPUT)
texts = [p.text.strip() for p in check.paragraphs if p.text.strip()]
print('сохранено:', OUTPUT)
print('абзацев с текстом:', len(texts))
print('таблиц:', len(check.tables), 'картинок:', len(check.inline_shapes))
print('заголовки:', [t for t in texts if t[:2] in ('1.', '2.', '3.', '4.', '5.', '6.', '7.')])
print('подписи:', [t for t in texts if t.startswith('Рисунок')])
print('титул:', texts[:2])
