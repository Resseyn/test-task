Это проект на [Next.js](https://nextjs.org) созданный при помощи [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) для pryaniky.com.

## Начало
Сначала установите зависимости

```bash
npm install
```
Затем добавьте секрет
```bash
npx auth secret
```
В новом файле .env.local добавьте строчку AUTH_TRUST_HOST=true

Далее:

```bash
npm run build
npm start
```

Откройте [http://localhost:3000](http://localhost:3000) и оцените результат.

Изменение и удаление строк осуществляется нажатием на строку
