# 🎂 CakeBox — Celebrate Every Moment

> A high-performance, mobile-first artisanal bakery app built with **React Native (New Architecture)**, **TurboModules & NitroModules**, **MMKV v4 + Zustand State Persistence**, **Firebase Firestore real-time synchronization**, and an **AI Pastry Chef powered by Google Gemini 2.5 Flash**.

---

## 🌟 Key Highlights

- ⚡ **Ultra-Fast Local Storage**: Native **MMKV v4** backed by C++ **NitroModules** with synchronous reads/writes.
- 🏬 **Real-Time Firestore Catalog**: Automatic two-way sync for live menus, artisanal cake cards, and prices.
- 🎨 **3D Interactive Cake Studio**: Real-time layer visualizer for sponge flavors, frosting bowls, drip glazes, toppers, and dynamic tier pricing.
- 👩‍🍳 **Chef Rosette AI Concierge**: Embedded AI pastry consultant powered by **Gemini 2.5 Flash** for flavor pairing, portion estimation, and dietary recommendations.
- 📦 **Offline-First Resilience**: Full cart and order queue persistence with automatic background cloud sync when online.
- 🚀 **Optimized Release APK**: 24 MB standalone binary for `arm64-v8a` with **R8 / ProGuard** dead-code minification and resource shrinking.

---

## 📱 Features

### 1. 🎂 Dynamic Menu & Cake Catalog
- Curated categories: **Birthday**, **Wedding**, **Custom 3D**, and **Artisanal Cupcakes**.
- Rich product details with size selection (6", 8", 10", or multi-tier), allergen breakdown, and ingredient badges.
- Instant search and category filtering with responsive UI feedback.

### 2. ✨ 3D Interactive Custom Cake Builder
- **Tier Configuration**: Single-tier or multi-tier wedding cakes.
- **Base Sponge Selection**: Madagascar Vanilla, Dutch Chocolate Fudge, Crimson Red Velvet, or Funfetti Rainbow.
- **Frosting Palette**: Whipped Chocolate Ganache, Bourbon Vanilla Cream, Strawberry Cloud, or Salted Caramel.
- **Drip Glaze Effects**: Strawberry Pink Drip, Dark Chocolate Drip, Cream White Drip, Amber Caramel Drip, or None.
- **Custom Inscription & Toppers**: Pre-set celebration banners and personalized custom messages with live preview.

### 3. 👩‍🍳 Chef Rosette — AI Pastry Concierge
- Integrated **Gemini 2.5 Flash** AI pastry chef.
- Quick prompts for:
  - *Sizing & Servings Calculator* (exact diameter & tier guidance based on guest count)
  - *Dietary & Allergen Guidance* (eggless, gluten-free, vegan alternatives)
  - *Flavor Pairing Recommendations* (complementary sponges, fillings, and glazes)
  - *Budget Planning* (tailoring recommendations to party budgets)

### 4. 🛒 Smart Cart & Checkout Engine
- Custom-built and catalog cakes combined in unified cart.
- Dynamic promo code engine (e.g., `SWEET10` for 10% discount).
- Multiple delivery methods: **Express Delivery** or **Store Pickup**.
- Simulated payment checkout with delivery date/time slot picker and custom gift message notes.

### 5. 📍 Bakery Hubs Interactive Map
- Visual map modal with live pickup hub cards, open hours, and instant distance calculations.

---

## 🛠️ Architecture & Tech Stack

```
                                  +-----------------------+
                                  |    CakeBox Mobile     |
                                  | React Native 0.81.5   |
                                  |   (New Architecture)  |
                                  +-----------+-----------+
                                              |
                     +------------------------+------------------------+
                     |                        |                        |
           +---------v---------+    +---------v---------+    +---------v---------+
           |  State Management |    |   Cloud Backend   |    |    AI Services    |
           |  Zustand 5.0      |    |  Firestore & Auth |    | Google Gemini API |
           |  MMKV v4 + Nitro  |    |  Realtime Sync    |    |  2.5 Flash Model  |
           +-------------------+    +-------------------+    +-------------------+
```

- **Framework**: [React Native 0.81.5](https://reactnative.dev/) with [Expo 54](https://expo.dev/)
- **Native Architecture**: Enabled **New Architecture** (TurboModules + Fabric)
- **Local Storage**: [`react-native-mmkv` v4](https://github.com/mrousavy/react-native-mmkv) with [`react-native-nitro-modules`](https://github.com/mrousavy/nitro) C++ bindings
- **State Management**: [Zustand 5](https://zustand.docs.pmnd.rs/) with custom synchronous `mmkvStateStorage` adapter
- **Backend & Database**: [Firebase v12](https://firebase.google.com/) (Cloud Firestore & Authentication)
- **AI Engine**: `@google/genai` (Gemini 2.5 Flash)
- **Icons & Graphics**: `lucide-react-native`, `react-native-svg`, `expo-linear-gradient`

---

## 📂 Project Structure

```
cakebox/
├── android/                   # Native Android project with C++ CMake builds
│   ├── app/
│   │   ├── build.gradle       # R8 minification, Hermes bytecode & ABI config
│   │   └── proguard-rules.pro # NitroModules, MMKV & TurboModule keep rules
│   └── gradle.properties      # reactNativeArchitectures=arm64-v8a
├── assets/                    # Optimized icons, splash artwork & wordmarks
│   ├── logo.png               # High-res circular cupcake brand mark
│   └── logo_wordmark.png      # CakeBox die-cut sticker wordmark
├── src/
│   ├── components/            # Feature-oriented UI screens & components
│   │   ├── BakeryMapModal.tsx
│   │   ├── BottomNav.tsx
│   │   ├── CakeCustomizerScreen.tsx
│   │   ├── CakeDoodles.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CatalogScreen.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── DeviceFrame.tsx
│   │   ├── GeminiChefChatModal.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── OrdersProfileScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── SplashScreen.tsx
│   │   └── TopBar.tsx
│   ├── core/
│   │   └── storage/           # Native MMKV initialization
│   │       ├── mmkv.ts
│   │       └── index.ts
│   ├── data/
│   │   └── cakes.ts           # Curated seed cakes, sponges & frostings
│   ├── services/
│   │   ├── firebase.ts        # Firestore CRUD & realtime listeners
│   │   └── gemini.ts          # Chef Rosette Gemini AI client
│   ├── store/                 # Persistent Zustand stores
│   │   ├── mmkvStorage.ts     # MMKV StateStorage adapter
│   │   ├── useCakeStore.ts    # Catalog, filters & selected cake
│   │   ├── useCartStore.ts    # Cart items, orders & sync queues
│   │   ├── useUserStore.ts    # User profile, wishlist & offline mode
│   │   └── index.ts           # Unified barrel export
│   ├── utils/
│   │   ├── storage.ts         # Fast synchronous MMKV getters
│   │   └── theme.ts           # Design tokens, colors & shadows
│   ├── App.tsx                # Master screen router & lifecycle
│   └── types.ts               # Shared TypeScript schemas
├── app.json                   # Expo configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18 or **Bun** >= 1.1
- **Android Studio** with Android SDK 34/35 & NDK installed
- Running Android Emulator or connected physical device

### 1. Install Dependencies
```bash
bun install
# or
npm install
```

### 2. Firebase & Gemini Setup
1. Place your Firebase credentials in `firebase-applet-config.json` or configure in `src/services/firebase.ts`.
2. Configure your Gemini API Key in `src/services/gemini.ts` or set `EXPO_PUBLIC_GEMINI_API_KEY`.

### 3. Run on Android Device / Emulator
Because `react-native-mmkv` v4 utilizes **C++ NitroModules**, run using the native dev build:

```bash
# Build and install debug APK with CMake binaries
cd android && ./gradlew assembleDebug

# Install APK onto running emulator
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Start Metro Bundler
npx expo start --dev-client
```

---

## 📦 Building Standalone Release APK

To create an optimized production APK targeting **64-bit ARM (`arm64-v8a`)** with **R8/ProGuard minification** and **Hermes bytecode**:

```bash
cd android
./gradlew assembleRelease --no-daemon
```

- **Output Path**: `android/app/build/outputs/apk/release/app-release.apk`
- **Output Size**: ~**24 MB** *(optimized from 85+ MB universal build)*

---

## 📄 License
MIT License. Crafted with 💖 for cake lovers everywhere.
