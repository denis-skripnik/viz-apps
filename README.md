# viz-apps
 Apps for Viz blockchain

## Список
1. Telegram бот @viz_awards_bot;
2. Telegram бот viz_committee_bot;
3. Telegram бот readdle_bot: чтение постов в readdle.me, а также публикация постов-заметок.
4. viz-top - рейтинги по балансам.
5. viz-price - выводит информацию о ценах Viz.
6. witness_rewards - сервис выводит список делегатов Viz с их наградами за текущий и предыдущий день, текущий и предыдущий месяц.
7. links - сервис viz-links [репозиторий](https://github.com/denis-skripnik/viz-links), [статья](https://viz.media/viz-links/).
Если кратко, позволяет добавлять ссылки через награды к committee и искать по ним с точным и неточным совпадением.
8. votes - опросы в блокчейне Viz.

Всё в js_modules.

## А также там-же
- api.js - файл с viz-api приложений
- helpers.js - различные функции, например, перевод даты в красивую строку и т.д.
- methods.js - методы отправки данных к БЧ. Некоторые функции просто их вызывают с возвратом данных, а некоторые выполняют некую фобработку.

## В viz.js
Производится парсинг блоков и вызов методов приложений в зависимости от операции. Также ниже вызываются методы, которые необходимо запускать сразу, либо по cron.

## В config.json
Все настройки: Нода,, подписка для большего количества запросов, а также конфигурация приложений.

## В databases
Файлы с методами работы с базой данных Mongo DB. Зависят от приложений.
Если в приложении используется больше одного файла базы данных (1 файл = одна коллекция), они размещаются в поддериктории databases.

## Установка
1. Скопировать на сервер
2. Переход в папку проекта.
3. npm install
4. Изменение параметров в config.json
provider_account - аккаунт, который создал подписку в Viz блокчейне для получения возможности делать больше запросов,
authTrueLimiter - это сколько одновременных запросов может сделать пользователь, если активировал подписку и подтвердил авторизацию, authFalseLimiter - сколько одновременных запросов могут сделать неавторизованные пользователиб
В votes меняем to - кому, а также vote_price - сумму создания опроса;
В awards_bot и committee_bot заменяем api_key на свой api ключ бота, а admin_id на telegram id  своего пользователя;
В readdle_bot в admins добавляем telegram id админов, а в bot_api_key api ключ бота;
В viz-projects указываем логин и сумму, которая требуется для добавления проекта
5. Запуск:
node viz.js или pm2 start viz.js