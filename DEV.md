# Команды разработки

Все из корня проекта. Live на симуляторе: dev-сервер должен быть уже запущен.

## Веб

```bash
npm run dev
```

Открыть http://localhost:3000

С доступом по сети (телефон в той же Wi‑Fi):

```bash
npx nuxi dev --host
```

## iOS Simulator (live)

Терминал 1:

```bash
npm run dev
```

Терминал 2:

```bash
npm run cap:ios
```

Конкретный симулятор:

```bash
xcrun simctl list devices available
CAP_LIVE=1 npx cap run ios --target <UDID>
```

Последний рабочий: iPhone 16 Pro (`E7EBE962-16C3-417C-A4C3-4A6AA114E12D`).

Открыть проект в Xcode:

```bash
npx cap open ios
```

## Android Emulator (live)

Терминал 1:

```bash
npm run dev
```

Терминал 2 — эмулятор ходит на хост через `10.0.2.2`:

```bash
CAP_LIVE=1 CAP_LIVE_URL=http://10.0.2.2:3000 npx cap run android
```

Открыть в Android Studio:

```bash
npx cap open android
```

## Реальный телефон (live)

Терминал 1:

```bash
npx nuxi dev --host
```

Терминал 2 (IP компа в Wi‑Fi, например `192.168.1.150`):

```bash
CAP_LIVE=1 CAP_LIVE_URL=http://192.168.1.150:3000 npx cap run ios
CAP_LIVE=1 CAP_LIVE_URL=http://192.168.1.150:3000 npx cap run android
```

## Сборка в приложение без live (как в сторе)

```bash
npm run cap:sync
npx cap open ios
npx cap open android
```

`cap:sync` без `CAP_LIVE` — статика из `.output/public`, не dev-сервер.

## Иконка и splash

Исходники в `assets/` (из `public/img/rlgn_icon.svg` и `rlgn_splash.svg`):

```bash
npm run assets:generate
```

Потом пересобери натив (`npm run cap:ios`). Live reload иконку/сплэш не подхватывает.
