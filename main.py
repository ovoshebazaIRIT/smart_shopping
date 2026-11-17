from fastapi import FastAPI

app = FastAPI(title="Умный шоппинг API")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Добро пожаловать в API Умного шоппинга!",
        "version": "1.0.0"
    }

@app.get("/items")
def get_items():
    # Это временный пример данных, которые потом будут браться из базы или парсера
    return [
        {"id": 1, "name": "Молоко 1л", "shop_A_price": 85, "shop_B_price": 79, "cheapest": "Магазин Б"},
        {"id": 2, "name": "Хлеб ржаной", "shop_A_price": 40, "shop_B_price": 45, "cheapest": "Магазин А"}
    ]
