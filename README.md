# FinHub Lite

Create a modern Telegram Mini App (React + Tailwind CSS) designed as a neobank financial hub for currency exchange, digital subscriptions, and foreign bank cards.

Requirements:
1. Telegram WebApp Integration:
- Integrate Telegram WebApp SDK (window.Telegram.WebApp).
- Call expand() on launch.
- Adapt dynamically to Telegram's themeParams (light / dark mode colors, background, text, accent).
- Trigger native haptic feedback (HapticFeedback.impactOccurred('light')) on tab switching and key actions.

2. Navigation & Layout:
- Mobile-first, native app look & feel (rounded-2xl, clean typography, soft shadows, glassmorphism/translucent accents, no browser default links/styles).
- Bottom Tab Bar with 3 tabs and Lucide icons:
  * Обмен (Exchange)
  * Подписки (Subscriptions)
  * Карты (Cards)

3. Tab 1 - Currency Exchange (Обмен):
- Two large input fields: "Отдаете" (default RUB) and "Получаете" (default USDT / USD) with currency pickers.
- Swap button to invert direction.
- Instant recalculation with realistic dummy exchange rates.
- Primary CTA button "Продолжить" styled like Telegram's native main button.

4. Tab 2 - Subscriptions Store (Подписки):
- Grid of popular foreign services (Spotify, Netflix, YouTube Premium, ChatGPT Plus, PlayStation, etc.) with icons/logos, names, and starting price (e.g. "от 400 ₽/мес").
- Clicking a card opens a smooth BottomSheet modal with duration selector (1, 3, 6, 12 months) showing total price, breakdown, and "Оплатить" button.

5. Tab 3 - Foreign Cards (Карты):
- Sub-tabs: "Мои карты" and "Выпустить новую".
- "Мои карты": Realistic virtual bank card mockup with balance, currency, masked number (**** 1234), expiry, and quick action buttons: "Пополнить", "Реквизиты", "Заморозить" (with toggle state).
- "Выпустить новую": List/carousel of countries (Казахстан, Турция, Киргизия, ОАЭ) with pricing, delivery terms, limits, and order flow.

Neobank aesthetics, sleek transitions, and realistic mock data in Russian.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ruble-to-globe.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f5974c77-3a89-45d2-98b5-a43f1702837d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
