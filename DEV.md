# Команды разработки

Все из корня проекта.

---

## Продакшн в сторы (TestFlight / APK)

Это то, что нужно **перед** Archive в Xcode и Generate Signed Bundle/APK в Android Studio. Без live: приложение грузит файлы из себя, не с ноута.

```bash
npm run cap:sync
```

Что делает эта команда (`NUXT_NATIVE=1 nuxt generate && cap sync`):

1. Собирает Nuxt как **SPA без SSR** (`NUXT_NATIVE=1`).
2. Кладёт статику в `.output/public`.
3. Копирует её в натив:
   - `ios/App/App/public`
   - `android/app/src/main/assets/public`
4. Пишет `capacitor.config.json` **без** `server.url`.  
   Если перед этим гонял live, в iOS мог остаться `http://localhost:3000` — `cap:sync` без `CAP_LIVE` это снимает.

Проверка: в `ios/App/App/capacitor.config.json` и `android/app/src/main/assets/capacitor.config.json` **не должно быть** блока `server`.

Дальше руками в IDE:

```bash
npx cap open android
npx cap open ios
```

**Android Studio:** Build → Generate Signed App Bundle / APK.

**Xcode:** Product → Archive → Distribute App → TestFlight.

Иконки/сплэш, если менял исходники в `assets/`:

```bash
npm run assets:generate
npm run cap:sync
```

Потом снова Archive / APK. Live (`cap:ios`) иконки не обновляет для стора.

---

## Веб (сайт, SSR)

```bash
npm run dev
```

http://localhost:3000

По сети (телефон в Wi‑Fi):

```bash
npx nuxi dev --host
```

Продакшн сайта (не приложение): `npm run build`.

---

## Live на симуляторе (только разработка)

Dev-сервер должен быть запущен. В натив попадает `server.url` — **в стор так не выкладывать**. Перед релизом всегда `npm run cap:sync`.

### iOS

Терминал 1: `npm run dev`  
Терминал 2:

```bash
npm run cap:ios
```

Конкретный симулятор:

```bash
xcrun simctl list devices available
CAP_LIVE=1 npx cap run ios --target <UDID>
```

Открыть Xcode: `npx cap open ios`

### Android

Терминал 1: `npm run dev`  
Терминал 2 (эмулятор ходит на хост через `10.0.2.2`):

```bash
npm run cap:android
```

или

```bash
CAP_LIVE=1 CAP_LIVE_URL=http://10.0.2.2:3000 npx cap run android
```

Список эмуляторов: `npx cap run android --list`

### Реальный телефон

```bash
npx nuxi dev --host
CAP_LIVE=1 CAP_LIVE_URL=http://192.168.x.x:3000 npx cap run ios
CAP_LIVE=1 CAP_LIVE_URL=http://192.168.x.x:3000 npx cap run android
```

---

## Что уже сделано для Android/релиза

Команды, которые выполнялись при подготовке продакшн-натива:

```bash
NUXT_NATIVE=1 npx nuxi generate
npx capacitor-assets generate --android
npx cap sync android
unset CAP_LIVE CAP_LIVE_URL
npm run cap:sync
```

`npx cap add android` не понадобился — папка `android/` уже была.  
`cap run android` для стора не нужен: APK собираешь в Android Studio после `cap:sync`.

Сайт (`npm run dev` / `npm run build`) — SSR. Натив и live из Capacitor — без SSR (UA `CapacitorNative` / `NUXT_NATIVE=1`).
