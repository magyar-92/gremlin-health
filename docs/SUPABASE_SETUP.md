# Supabase Setup Guide

## Кроки налаштування

### 1. Створити Supabase проєкт
1. Перейти на https://supabase.com
2. Зареєструватися або увійти
3. Створити новий проєкт:
   - Database name: `gremlin_health`
   - Region: виберіть найближчий до вас
   - Password: збережіть в безпечному місці

### 2. Отримати Connection String
1. Перейти до Settings → Database
2. Copy "Connection string" під "URI"
3. Замінити `[YOUR-PASSWORD]` на пароль з кроку 1

Connection string виглядає так:
```
postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
```

### 3. Налаштувати .env
1. Скопіювати `backend/.env.example` у `backend/.env`
2. Вставити CONNECTION string:
```bash
cp backend/.env.example backend/.env
# Відредагувати backend/.env з вашим CONNECTION string
```

### 4. Ініціалізувати базу даних
```bash
cd backend
python -c "from database import create_tables; create_tables()"
```

Це створить таблиці: `users`, `steps_records`, `photos`, `achievement_cards`

## Перевірка з psql (опціонально)
```bash
psql "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres"
# \dt  -- список таблиць
```

## Наступні кроки
1. Створити Pydantic schemas для API
2. Написати CRUD операції
3. Розробити endpoints для синхронізації кроків та завантаження фото
