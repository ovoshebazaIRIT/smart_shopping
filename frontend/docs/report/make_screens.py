# -*- coding: utf-8 -*-
"""Рендерит PNG-изображения терминала из реального вывода команд."""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "report_assets")
os.makedirs(OUT, exist_ok=True)

FONT_R = "C:\\Windows\\Fonts\\consola.ttf"
FONT_B = "C:\\Windows\\Fonts\\consolab.ttf"
FONT_UI = "C:\\Windows\\Fonts\\segoeui.ttf"

FS = 17
LH = 27
PAD_X = 20
PAD_T = 14
PAD_B = 16
TAB_H = 36

BG = (12, 12, 12)
BAR = (32, 32, 32)
BORDER = (58, 58, 58)
C_TXT = (204, 204, 204)
C_CMD = (240, 240, 240)
C_PS = (86, 156, 214)
C_PATH = (220, 220, 170)
C_WARN = (230, 192, 106)
C_ERR = (244, 98, 98)
C_OK = (78, 201, 176)
C_DIM = (150, 150, 150)

PROMPT_PS = "PS "
PROMPT_PATH = "C:\\Users\\rorg0\\Downloads\\Study\\Umnyi_shop> "

f_r = ImageFont.truetype(FONT_R, FS)
f_b = ImageFont.truetype(FONT_B, FS)
f_ui = ImageFont.truetype(FONT_UI, 13)
f_ui_b = ImageFont.truetype(FONT_UI, 13)


def tw(draw, text, font):
    return draw.textlength(text, font=font)


def measure(block):
    img = Image.new("RGB", (10, 10))
    d = ImageDraw.Draw(img)
    w = 0
    for kind, text in block["lines"]:
        if kind == "cmd":
            w = max(w, tw(d, PROMPT_PS, f_b) + tw(d, PROMPT_PATH, f_r) + tw(d, text, f_r))
        else:
            f = f_b if kind == "outb" else f_r
            w = max(w, tw(d, text, f))
    return w


def render(block):
    probe = Image.new("RGB", (10, 10))
    d0 = ImageDraw.Draw(probe)
    text_w = measure(block)
    width = int(max(720, min(1180, text_w + PAD_X * 2 + 12)))
    height = TAB_H + PAD_T + LH * len(block["lines"]) + PAD_B

    img = Image.new("RGB", (width, height), BG)
    d = ImageDraw.Draw(img)

    # заголовок окна / вкладка
    d.rectangle([0, 0, width, TAB_H], fill=BAR)
    d.rectangle([0, TAB_H, width, TAB_H + 1], fill=(70, 70, 70))
    d.rounded_rectangle([12, 7, 18, 22], radius=3, fill=(78, 201, 176))
    d.text((18, 14), ">_", font=f_ui, fill=BAR, anchor="lm")
    d.text((34, TAB_H / 2), block.get("title", "Windows PowerShell"),
           font=f_ui_b, fill=(235, 235, 235), anchor="lm")
    # кнопки окна: свернуть, развернуть, закрыть
    ctrl_y = TAB_H / 2
    cx = width - 22
    d.line([cx - 5, ctrl_y, cx + 5, ctrl_y], fill=(170, 170, 170), width=1)
    cx -= 26
    d.rectangle([cx - 5, ctrl_y - 5, cx + 5, ctrl_y + 5], outline=(170, 170, 170), width=1)
    cx -= 26
    d.line([cx - 5, ctrl_y - 5, cx + 5, ctrl_y + 5], fill=(170, 170, 170), width=1)
    d.line([cx - 5, ctrl_y + 5, cx + 5, ctrl_y - 5], fill=(170, 170, 170), width=1)

    y = TAB_H + PAD_T
    for kind, text in block["lines"]:
        if kind == "cmd":
            x = PAD_X
            d.text((x, y), PROMPT_PS, font=f_b, fill=C_PS, anchor="la")
            x += tw(d, PROMPT_PS, f_b)
            d.text((x, y), PROMPT_PATH, font=f_r, fill=C_PATH, anchor="la")
            x += tw(d, PROMPT_PATH, f_r)
            d.text((x, y), text, font=f_r, fill=C_CMD, anchor="la")
        elif kind == "out":
            d.text((PAD_X, y), text, font=f_r, fill=C_TXT, anchor="la")
        elif kind == "outb":
            d.text((PAD_X, y), text, font=f_b, fill=C_CMD, anchor="la")
        elif kind == "ok":
            d.text((PAD_X, y), text, font=f_r, fill=C_OK, anchor="la")
        elif kind == "warn":
            d.text((PAD_X, y), text, font=f_r, fill=C_WARN, anchor="la")
        elif kind == "err":
            d.text((PAD_X, y), text, font=f_r, fill=C_ERR, anchor="la")
        elif kind == "dim":
            d.text((PAD_X, y), text, font=f_r, fill=C_DIM, anchor="la")
        y += LH

    d.rectangle([0, 0, width - 1, height - 1], outline=BORDER)
    path = os.path.join(OUT, block["file"])
    img.save(path, "PNG")
    return path


BLOCKS = [
    {
        "file": "01-node.png",
        "lines": [
            ("cmd", "node -v"), ("out", "v26.13.0"),
            ("cmd", "npm -v"), ("out", "11.20.0"),
            ("cmd", "pnpm -v"), ("out", "12.18.0"),
            ("cmd", "where.exe node"), ("out", "C:\\Program Files\\nodejs\\node.exe"),
        ],
    },
    {
        "file": "02-git.png",
        "lines": [
            ("cmd", "git --version"), ("out", "git version 2.55.0.windows.2"),
            ("cmd", "git config --global user.name"), ("out", "frakt"),
            ("cmd", "git config --global user.email"),
            ("out", "romanrodionov0601@gmail.com"),
            ("cmd", "git lfs version"),
            ("out", "git-lfs/3.7.1 (GitHub; windows amd64; go 1.25.1)"),
        ],
    },
    {
        "file": "03-tools.png",
        "lines": [
            ("cmd", "code --version"),
            ("out", "1.129.1"),
            ("out", "8a7abeba6e03ea3af87bfbce9a1b7e48fed567b8"),
            ("out", "x64"),
            ("cmd", "python --version"), ("out", "Python 3.15.0"),
            ("cmd", "winget --version"), ("out", "v1.29.380"),
        ],
    },
    {
        "file": "04-pnpm.png",
        "lines": [
            ("cmd", "npm install -g pnpm"),
            ("out", "added 2 packages in 4s"),
            ("warn", "npm warn install-scripts 1 package has install scripts"),
            ("warn", "not yet covered by allowScripts: pnpm@12.18.0"),
            ("cmd", "pnpm -v"), ("ok", "12.18.0"),
            ("cmd", "pnpm store path"),
            ("out", "C:\\Users\\rorg0\\AppData\\Local\\pnpm\\store\\v11"),
        ],
    },
    {
        "file": "05-checks.png",
        "lines": [
            ("cmd", "npm ping"),
            ("out", "npm notice PING https://registry.npmjs.org/"),
            ("ok", "npm notice PONG 550ms"),
            ("cmd", "Get-ExecutionPolicy"), ("out", "Unrestricted"),
            ("cmd", "$env:COMSPEC"), ("out", "C:\\WINDOWS\\system32\\cmd.exe"),
        ],
    },
]

for b in BLOCKS:
    p = render(b)
    print("saved:", p)
