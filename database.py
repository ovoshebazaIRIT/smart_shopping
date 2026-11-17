from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:12345@localhost:5432/shopping_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Описываем таблицу товаров
class ItemDB(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)       # Название товара
    shop_name = Column(String)              # Название магазина
    price = Column(Float)                   # Цена

# Автоматически создаем таблицу в PostgreSQL при запуске сервера
Base.metadata.create_all(bind=engine)
