import sys
import os
import re

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from playwright.sync_api import sync_playwright
from database import SessionLocal, ItemDB


def save_to_postgres(items: list):
    """Сохраняет собранные товары в базу данных PostgreSQL"""
    db = SessionLocal()
    try:
        for item in items:
            db_item = ItemDB(
                name=item["title"],
                shop_name="Wildberries",
                price=item["price"]
            )
            db.add(db_item)
        db.commit()
        print(f"[WB] Успешно сохранено в БД: {len(items)} товаров.")
    except Exception as e:
        db.rollback()
        print("[WB] Ошибка при записи в PostgreSQL:", e)
    finally:
        db.close()


def parse_wildberries(query: str, limit: int = 10) -> list:
    """Парсит товары с Wildberries через реальный браузер"""
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            channel="chrome",
            headless=False,
            args=["--disable-blink-features=AutomationControlled"]
        )
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        try:
            wb_domain = "https://www." + "wildberries" + "." + "\u0072\u0075" + "/"
            page.goto(wb_domain, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)

            search_input = page.locator("#searchInput")
            search_input.click()
            search_input.fill(query)
            page.keyboard.press("Enter")

            page.wait_for_timeout(4000)
            page.mouse.wheel(0, 1000)
            page.wait_for_timeout(2000)
            
            cards = page.query_selector_all("article.product-card")
            print(f"[WB] Найдено карточек на странице: {len(cards)}")

            for card in cards:
                if len(results) >= limit:
                    break

                # 1. Берем весь текст карточки и ищем первую цену перед значком ₽
                card_text = card.inner_text()
                price_match = re.search(r"(\d[\d\s\xa0]*)\s*₽", card_text)
                
                if not price_match:
                    continue
                
                # Очищаем пробелы в цене и превращаем в число
                raw_price = re.sub(r"[^\d]", "", price_match.group(1))
                price = float(raw_price) if raw_price else 0.0

                # 2. Достаем название товара из ссылки или картинки
                link_el = card.query_selector("a[aria-label]")
                img_el = card.query_selector("img[alt]")
                
                title = ""
                if link_el:
                    title = link_el.get_attribute("aria-label")
                elif img_el:
                    title = img_el.get_attribute("alt")
                else:
                    # Если атрибутов нет, берем самую длинную текстовую строку из карточки
                    lines = [line.strip() for line in card_text.split("\n") if len(line.strip()) > 5 and "₽" not in line]
                    title = lines[0] if lines else "Товар Wildberries"

                if price > 0 and title:
                    results.append({
                        "title": title.strip(),
                        "shop": "Wildberries",
                        "price": price
                    })

        except Exception as e:
            print(f"[WB] Ошибка при загрузке страницы: {e}")
        finally:
            browser.close()

    if results:
        save_to_postgres(results)
    else:
        print("[WB] Не удалось извлечь цены из карточек.")

    return results


if __name__ == "__main__":
    test_query = "ноутбук"
    print(f"Ищем на Wildberries через браузер: {test_query}...")
    items = parse_wildberries(test_query, limit=5)
    
    for item in items:
        print(f"- {item['title']} | Цена: {item['price']} ₽")
