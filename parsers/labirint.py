import sys
import os
import re
import time

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from playwright.sync_api import sync_playwright
from database import SessionLocal, ItemDB


def save_to_postgres(items: list):
    """Сохраняет собранные товары с Лабиринта в базу данных PostgreSQL"""
    db = SessionLocal()
    try:
        for item in items:
            db_item = ItemDB(
                name=item["title"],
                shop_name="Лабиринт",
                price=item["price"]
            )
            db.add(db_item)
        db.commit()
        print(f"[Лабиринт] Успешно сохранено в БД: {len(items)} товаров.")
    except Exception as e:
        db.rollback()
        print("[Лабиринт] Ошибка при записи в PostgreSQL:", e)
    finally:
        db.close()


def parse_labirint(query: str, limit: int = 10) -> list:
    """Подключается к уже открытому реальному браузеру Chrome и парсит Лабиринт"""
    results = []

    with sync_playwright() as p:
        try:
            # Подключаемся к вашему реальному окну Chrome, открытому на порту 9222
            browser = p.chromium.connect_over_cdp("http://localhost:9222")
            context = browser.contexts[0]
            page = context.pages[0] if context.pages else context.new_page()
            lab_domain = "https://www." + "labirint" + "." + "\u0072\u0075" + "/"
            page.goto(lab_domain, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)

            # Находим поисковую строку и вводим запрос
            search_input = page.locator("input[name='q']").first
            search_input.wait_for(state="visible", timeout=15000)
            search_input.click()
            search_input.fill(query)
            page.keyboard.press("Enter")

            # Ждем загрузки товаров и прокручиваем вниз
            page.wait_for_timeout(4000)
            page.mouse.wheel(0, 1200)
            page.wait_for_timeout(2000)

            product_links = page.query_selector_all("a.cover, a.product-card__link, a[href*='/books/']")
            print(f"[Лабиринт] Найдено ссылок на товары: {len(product_links)}")

            seen_titles = set()
            for link in product_links:
                if len(results) >= limit:
                    break

                card = link.evaluate_handle(
                    "el => el.closest('div.product[data-product-id]') || el.closest('div.product') || el.closest('li[class*=\"product\"]') || el.parentElement.parentElement.parentElement"
                )
                if not card:
                    continue

                card_text = card.inner_text()
                price_match = re.search(r"(\d[\d\s\xa0]*)\s*₽", card_text)
                if not price_match:
                    continue

                raw_price = re.sub(r"[^\d]", "", price_match.group(1))
                price = float(raw_price) if raw_price else 0.0

                lines = [
                    line.strip() for line in card_text.split("\n")
                    if len(line.strip()) > 12 and "₽" not in line and "%" not in line and "отзыв" not in line.lower()
                ]
                title = max(lines, key=len) if lines else ""

                if price > 0 and title and title not in seen_titles:
                    seen_titles.add(title)
                    results.append({
                        "title": title,
                        "shop": "Лабиринт",
                        "price": price
                    })

        except Exception as e:
            print(f"[Лабиринт] Ошибка подключения или парсинга: {e}")

    if results:
        save_to_postgres(results)
    else:
        print("[Лабиринт] Товары не найдены.")

    return results


if __name__ == "__main__":
    test_query = "python"
    print(f"Ищем на Лабиринте через подключенный Chrome: {test_query}...")
    items = parse_labirint(test_query, limit=5)

    for item in items:
        print(f"- {item['title']} | Цена: {item['price']} ₽")
