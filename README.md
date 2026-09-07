# Gremlin Health MVP

Move-to-earn фітнес-застосунок: користувач ходить пішки, кроки конвертуються в "картки досягнень", верифіковані фото + GPS-метаданими.

## Ідея
Основний цикл: **синхронізація кроків → завантаження фото з GPS → генерація картки досягнення**

## MVP Scope (без блокчейну/NFT)
Що включено:
- Синхронізація кроків з Google Health Connect API
- Завантаження фото з GPS-координатами
- Генерація базових карток досягнення

Що навмисно виключено на цьому етапі:
- Токеномка GRLN
- NFT / маркетплейс
- AI-генерація дизайну карток
- Solana / будь-який блокчейн
- KYC, DAO

## Технічний стек

| Компонент | Рішення |
|---|---|
| Backend | FastAPI + PostgreSQL |
| Хостинг backend | Railway.app |
| База даних | Supabase (Postgres) |
| Frontend | React Native + Expo |
| Платформа | Android спочатку, iOS пізніше |
| Кроки | Health Connect API (Google) |
| Тестування | Expo Go на Android-пристрої |

## Структура проєкту

```
gremlin-health/
├── backend/          # FastAPI server
│   ├── main.py
│   └── requirements.txt
├── frontend/         # React Native + Expo
│   ├── App.js
│   ├── app.json
│   └── package.json
├── docs/            # Documentation
└── README.md
```

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Сервер буде доступний на `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm start
```

Відскануйте QR-код у Expo Go на Android

## На горизонті (не зараз)
- iOS підтримка
- Google Play публікація
- Telegram Bot (сповіщення)
- Токен/NFT/блокчейн-шар (довгострокова візія)

## Ключові принципи
- Блокчейн/NFT не блокують MVP — основний цикл можна довести без них
- Дисципліна скоупу критична — розрив між повною візією і реалістичним стартом значний
- Розробка ведеться разом з Claude Code
