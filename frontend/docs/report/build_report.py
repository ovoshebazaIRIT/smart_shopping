# -*- coding: utf-8 -*-
"""Формирует отчёт .docx о подготовке окружения frontend-разработчика."""
import os

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

BASE = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE))
ASSETS = os.path.join(BASE, "report_assets")
DOCX_PATH = os.path.join(PROJECT_ROOT, "Отчёт_подготовка_окружения.docx")

ACCENT = RGBColor(0x1F, 0x38, 0x64)
GREY = RGBColor(0x59, 0x59, 0x59)


def set_cell_bg(cell, hex_color):
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    cell._tc.get_or_add_tcPr().append(shd)


def add_page_numbers(section):
    p = section.footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    run.font.name = "Times New Roman"
    run.font.size = Pt(10)
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = "PAGE"
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    run._r.append(begin)
    run._r.append(instr)
    run._r.append(end)


def spacer(doc, pts=4):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(0)
    pf.space_after = Pt(pts)
    pf.line_spacing = 1.0
    r = p.add_run("")
    r.font.size = Pt(3)
    return p


def body(doc, text, space_after=8, first_indent=0.0, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    p = doc.add_paragraph(text)
    p.alignment = align
    pf = p.paragraph_format
    pf.space_after = Pt(space_after)
    pf.line_spacing = 1.15
    pf.first_line_indent = Cm(first_indent)
    for r in p.runs:
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)
    return p


def bullet(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style="List Bullet")
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r = p.add_run(bold_prefix)
        r.bold = True
        r.font.size = Pt(12)
        r.font.name = "Times New Roman"
    r = p.add_run(text)
    r.font.size = Pt(12)
    r.font.name = "Times New Roman"
    return p


def code(doc, text):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.left_indent = Cm(0.75)
    pf.space_before = Pt(4)
    pf.space_after = Pt(8)
    pf.line_spacing = 1.0
    r = p.add_run(text)
    r.font.name = "Consolas"
    r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(0x1A, 0x1A, 0x1A)
    return p


def heading(doc, text, level=1):
    p = doc.add_heading(level=level)
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    pf = p.paragraph_format
    pf.space_before = Pt(12 if level == 1 else 9)
    pf.space_after = Pt(6)
    pf.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(14 if level == 1 else 12)
    r.bold = True
    r.font.color.rgb = ACCENT
    return p


def figure(doc, filename, caption, width_cm=14.8):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    p.add_run().add_picture(os.path.join(ASSETS, filename), width=Cm(width_cm))
    c = doc.add_paragraph()
    c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    c.paragraph_format.space_after = Pt(12)
    r = c.add_run(caption)
    r.italic = True
    r.font.name = "Times New Roman"
    r.font.size = Pt(10)
    r.font.color.rgb = GREY


def table(doc, headers, rows, widths):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    tblPr = t._tbl.tblPr
    layout = OxmlElement("w:tblLayout")
    layout.set(qn("w:type"), "fixed")
    tblPr.append(layout)
    tblW = OxmlElement("w:tblW")
    tblW.set(qn("w:type"), "dxa")
    tblW.set(qn("w:w"), str(int(sum(widths) / 2.54 * 1440)))
    tblPr.append(tblW)
    for i, w in enumerate(widths):
        t.columns[i].width = Cm(w)
    hdr = t.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = ""
        p = hdr[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        set_cell_bg(hdr[i], "DCE3F0")
    for row in rows:
        cells = t.add_row().cells
        for i, val in enumerate(row):
            cells[i].text = ""
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.0
            if i > 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(val)
            r.font.name = "Consolas" if i == 1 else "Times New Roman"
            r.font.size = Pt(10.5)
            if i == 1:
                r.font.color.rgb = RGBColor(0x1A, 0x1A, 0x1A)
    for r_ in t.rows:
        for i, w in enumerate(widths):
            r_.cells[i].width = Cm(w)
    return t


doc = Document()

# --- параметры страницы и базовый стиль ---
sec = doc.sections[0]
sec.page_width = Cm(21)
sec.page_height = Cm(29.7)
sec.left_margin = Cm(2.5)
sec.right_margin = Cm(1.5)
sec.top_margin = Cm(2)
sec.bottom_margin = Cm(2)
add_page_numbers(sec)

normal = doc.styles["Normal"]
normal.font.name = "Times New Roman"
normal.font.size = Pt(12)
normal.element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")

# --- титул ---
for _ in range(3):
    doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("ОТЧЁТ")
r.bold = True
r.font.name = "Times New Roman"
r.font.size = Pt(24)
r.font.color.rgb = ACCENT

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(6)
r = p.add_run("о подготовке окружения\nдля frontend-разработки")
r.font.name = "Times New Roman"
r.font.size = Pt(16)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(28)
r = p.add_run("Проект «Umnyi_shop»")
r.bold = True
r.font.name = "Times New Roman"
r.font.size = Pt(14)

for _ in range(7):
    doc.add_paragraph()

for label, value in (
    ("Исполнитель:", "rorg0 (git-аккаунт: frakt)"),
    ("Рабочая папка:", "C:\\Users\\rorg0\\Downloads\\Study\\Umnyi_shop"),
    ("Операционная система:", "Windows 11 Домашняя, сборка 26300"),
    ("Дата:", "7 ноября 2026 г."),
):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.left_indent = Cm(3.0)
    p.paragraph_format.space_after = Pt(4)
    r1 = p.add_run(label + " ")
    r1.bold = True
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(12)
    r2 = p.add_run(value)
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(12)

doc.add_page_break()

# --- 1. Цель ---
heading(doc, "1. Цель работы")
body(doc, "Цель — подготовить рабочее место для frontend-разработки проекта «Umnyi_shop» "
          "и убедиться, что все инструменты установлены, настроены и работают. "
          "Папка проекта на момент начала работ была пустой, поэтому окружение "
          "разворачивалось с нуля: от установки среды выполнения JavaScript "
          "до настройки менеджера пакетов и редактора кода.")
body(doc, "Проверка выполнялась по трём критериям: инструмент установлен, "
          "его версия соответствует требованиям современного фронтенд-стека, "
          "и он корректно запускается из командной строки, то есть "
          "фактически доступен в PATH.")

# --- 2. Состав окружения ---
heading(doc, "2. Состав установленного окружения")
body(doc, "Итоговый набор инструментов приведён в таблице 1.")
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.LEFT
p.paragraph_format.space_after = Pt(4)
r = p.add_run("Таблица 1 — Установленные компоненты")
r.italic = True
r.font.name = "Times New Roman"
r.font.size = Pt(10)
r.font.color.rgb = GREY

table(doc,
      ["Компонент", "Версия", "Назначение"],
      [
          ["Node.js", "26.13.0", "Среда выполнения JavaScript"],
          ["npm", "11.20.0", "Менеджер пакетов (входит в Node.js)"],
          ["pnpm", "12.18.0", "Основной менеджер пакетов проекта"],
          ["Git + Git LFS", "2.55.0 / 3.7.1", "Контроль версий, работа с репозиторием"],
          ["Visual Studio Code", "1.129.1 (x64)", "Редактор кода"],
          ["Python", "3.15.0", "Вспомогательные скрипты и инструменты"],
          ["winget", "1.29.380", "Установка и обновление ПО из консоли"],
      ],
      widths=[4.3, 3.5, 9.2])
spacer(doc)

body(doc, "Node.js — базовая часть окружения: без него не работают ни сборщик Vite, "
          "ни сам npm, ни любой современный тулинг фронтенда. Установлена LTS-ветка "
          "26.13.0, что для проекта, который будет разрабатываться и поддерживаться, "
          "предпочтительнее экспериментальных выпусков.", space_after=8)

body(doc, "Версии Node.js, npm и pnpm, а также фактический путь к исполняемому файлу "
          "приведены на рисунке 1.")
figure(doc, "01-node.png",
       "Рисунок 1 — Проверка версий Node.js, npm и pnpm, путь к node.exe")

body(doc, "Git настроен на уровне пользователя: указаны имя и адрес электронной почты, "
          "которые будут попадать в коммиты. Git LFS установлен отдельно — он нужен, "
          "если в репозитории появятся макеты, шрифты или крупные бинарные файлы.")
figure(doc, "02-git.png",
       "Рисунок 2 — Версия Git, параметры пользователя и Git LFS")

body(doc, "Дополнительно проверены редактор кода VS Code, интерпретатор Python "
          "и консольный менеджер пакетов winget.")
figure(doc, "03-tools.png",
       "Рисунок 3 — Версии VS Code, Python и winget")

# --- 3. pnpm ---
heading(doc, "3. Установка пакетного менеджера pnpm")
body(doc, "В качестве основного менеджера пакетов выбран pnpm: он хранит пакеты "
          "в едином хранилище на диске и создаёт жёсткие ссылки вместо копирования, "
          "за счёт чего установка зависимостей проходит быстрее, а папка node_modules "
          "занимает заметно меньше места. Кроме того, pnpm строже относится к "
          "необъявленным зависимостям, что помогает не тащить в проект лишнее.")
body(doc, "Установка выполнялась глобально через npm:")
code(doc, "npm install -g pnpm")
body(doc, "Первая попытка завершилась ошибкой: установочный скрипт пакета вызывается "
          "как cmd /d /s /c node install.js, то есть через голую команду node, "
          "и система не смогла найти исполняемый файл. Причина описана в разделе 5.")
body(doc, "После исправления PATH пакет установился (рисунок 4). npm предупредил, "
          "что install-скрипты пакета не выполнялись автоматически: начиная с версии 11 "
          "npm по умолчанию блокирует их ради безопасности цепочки поставок. "
          "Для pnpm это не критично — он работает и без них, что подтверждает "
          "вывод команды pnpm -v.")
figure(doc, "04-pnpm.png",
       "Рисунок 4 — Установка pnpm и проверка его работоспособности")

# --- 4. Проверки ---
heading(doc, "4. Проверка готовности окружения")
body(doc, "Помимо версий инструментов, проверены условия, которые чаще всего "
          "ломают сборку на Windows. Результаты сведены в таблицу 2.")
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.LEFT
p.paragraph_format.space_after = Pt(4)
r = p.add_run("Таблица 2 — Результаты проверок")
r.italic = True
r.font.name = "Times New Roman"
r.font.size = Pt(10)
r.font.color.rgb = GREY

table(doc,
      ["Проверка", "Результат", "Что даёт"],
      [
          ["node -v", "v26.13.0", "Node.js запускается"],
          ["npm ping", "PONG 550 ms", "Реестр npm доступен"],
          ["pnpm store path", "…\\pnpm\\store\\v11", "Хранилище pnpm создано"],
          ["LongPathsEnabled", "1", "Длинные пути Windows включены"],
          ["ExecutionPolicy", "Unrestricted", "Скрипты PowerShell не блокируются"],
          ["Свободно на диске C:", "60 ГБ", "Хватает для node_modules"],
      ],
      widths=[4.3, 4.3, 8.4])
spacer(doc)

body(doc, "Отдельно стоит отметить длинные пути. Путь к node_modules в реальном проекте "
          "легко превышает 260 символов, и без параметра LongPathsEnabled установка "
          "зависимостей может завершиться ошибкой. На этой машине параметр уже включён, "
          "дополнительных действий не требуется.")
body(doc, "Доступность реестра npm проверена командой npm ping (рисунок 5): "
          "ответ пришёл за 550 мс, значит установка зависимостей не упрётся "
          "в блокировку сети или прокси.")
figure(doc, "05-checks.png",
       "Рисунок 5 — Проверка доступа к реестру npm и политики выполнения скриптов")

# --- 5. Проблема с PATH ---
heading(doc, "5. Проблема с PATH и её решение")
body(doc, "При установке pnpm возникла ошибка «\"node\" не является внутренней или "
          "внешней командой». Разбор показал, что дело не в Node.js: файл "
          "C:\\Program Files\\nodejs\\node.exe существовал и запускался, а каталог "
          "был прописан в системной переменной Path.")
body(doc, "Причина в том, как устроен npm.cmd. Внутри него задан путь к node.exe "
          "относительно собственного каталога, и только если файла там нет, "
          "используется команда node из PATH:")
code(doc, "SET \"NODE_EXE=%~dp0\\node.exe\"\nIF NOT EXIST \"%NODE_EXE%\" SET \"NODE_EXE=node\"")
body(doc, "Поэтому npm запускался и даже скачивал пакет, а вот install-скрипт, "
          "который выполняется отдельным процессом cmd через голый node, "
          "уже не находил исполняемый файл. Сам PATH при этом изменён не был — "
          "устаревшую копию переменных держал процесс терминала, запущенный "
          "до правки системных настроек.")
body(doc, "Решение — обновить PATH в текущей сессии и повторить установку:")
code(doc, "$env:Path = \"C:\\Program Files\\nodejs;\" + $env:Path\nnpm install -g pnpm")
body(doc, "Чтобы проблема не повторилась в новых окнах, достаточно перезапустить "
          "Проводник или перезайти в систему: после этого процессы получат "
          "актуальную переменную Path из реестра. Правка реестра не требуется — "
          "запись там уже корректна.")

# --- 6. Итоги ---
heading(doc, "6. Итоги и следующие шаги")
body(doc, "Окружение для frontend-разработки готово. Установлены и проверены "
          "Node.js 26.13.0, npm 11.20.0, pnpm 12.18.0, Git 2.55.0 с Git LFS, "
          "VS Code 1.129.1 и Python 3.15.0. Системные параметры Windows, "
          "критичные для сборки фронтенда, соответствуют требованиям. "
          "Все проверки выполнялись реальными командами, вывод которых "
          "приведён на рисунках 1–5.")
body(doc, "Ближайшие шаги по проекту:")
bullet(doc, "выбрать стек и инициализировать проект в папке Umnyi_shop "
            "(package.json, сборщик, структура каталогов);", "Создание каркаса — ")
bullet(doc, "настроить ESLint, Prettier и EditorConfig, добавить "
            "соответствующие расширения в VS Code (сейчас установлен только ESLint);",
       "Линтеры и форматирование — ")
bullet(doc, "инициализировать git-репозиторий и настроить .gitignore;",
       "Версионирование — ")
bullet(doc, "зафиксировать версию Node.js в файле .nvmrc, чтобы окружение "
            "воспроизводилось на другой машине.", "Воспроизводимость — ")

doc.save(DOCX_PATH)
print("saved:", DOCX_PATH)
