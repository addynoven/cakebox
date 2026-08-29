# 🏛️ The Production App Architecture Blueprint & Master Playbook

> **The Definitive, Domain-Agnostic Specification for Building Scalable React Native & Full-Stack Apps.**  
> *Use this blueprint whenever starting ANY new mobile or full-stack project.*

---

## 📐 1. The Core 3-Tier Layout

Every production codebase strictly maintains exactly **3 top-level directories** inside `src/`:

```text
src/
├── app/          # 1. Navigation & Routing (Expo Router v6 file-based routes)
├── core/         # 2. Shared System Foundations (Strict file-by-file specification)
├── features/     # 3. Domain Feature Modules (Self-contained business units)
└── types.ts      # 4. Global application-level type declarations
```

---

## 🧱 2. The Complete `src/core/` Specification

The `src/core/` directory contains all shared infrastructure. It is divided into exactly **8 standardized submodules**:

```text
src/core/
├── api/                           # Data transport & cloud SDK adapters
│   ├── client.ts                  # Cloud SDK initialization (Firebase / Supabase / GraphQL)
│   ├── entityMappers.ts           # Pure functions mapping raw DB/API payloads to typed domain entities
│   ├── httpClient.ts              # Traced fetch client (X-Request-ID, 10s auto-timeout, Result returns)
│   └── index.ts
│
├── components/                    # Design system primitives & root guards
│   ├── Button.tsx                 # Accessible button (variants: primary/outline, loading, a11y labels)
│   ├── Card.tsx                   # Tokenized rounded container with platform shadows
│   ├── Badge.tsx                  # Status & promotional pill badges
│   ├── Input.tsx                  # Accessible text input with label, validation error, and focus ring
│   ├── Toast.tsx                  # Global floating notification toast
│   ├── TopBar.tsx                 # Universal screen header (Logo, title, back action, dynamic shortcuts)
│   ├── DeviceFrame.tsx            # Responsive bezel container for web/tablet previews
│   ├── FeatureGate.tsx            # Declarative feature flag gate: <FeatureGate flag="..." fallback={...}>
│   └── index.ts
│
├── config/                        # Environment variables & Feature Flags
│   ├── config.schema.ts           # Zod schema validating all required environment variables
│   ├── config.ts                  # Validated runtime configuration singleton
│   ├── featureFlags.schema.ts     # Zod schema for all feature toggles with local offline defaults
│   ├── useFeatureFlags.ts         # Reactive Zustand + MMKV store for feature flags & dev overrides
│   └── index.ts
│
├── errors/                        # Defensive error architecture & observability
│   ├── result.ts                  # Type-safe Result<T, E> envelope: { ok: true, data } | { ok: false, error }
│   ├── error-handler.ts           # AppError class, captureError(), withAsyncErrorCatch()
│   ├── breadcrumbs.ts             # 50-action circular Flight Recorder ring-buffer (nav, taps, network)
│   ├── ErrorBoundary.tsx          # Root React crash recovery fallback with retry action
│   └── index.ts
│
├── network/                       # Network resilience & offline synchronization
│   ├── useNetworkStatus.ts        # NetInfo listener auto-triggering offline queue sync on reconnect
│   └── index.ts
│
├── query/                         # Server-state caching (TanStack Query v5)
│   ├── queryClient.ts             # QueryClient instance (staleTime: 5m, gcTime: 15m, retry: 2)
│   ├── QueryProvider.tsx          # Root QueryClientProvider wrapper
│   └── index.ts
│
├── storage/                       # Tiered storage architecture
│   ├── mmkv.ts                    # Ultra-fast synchronous storage for UI cache, cart, & client state
│   ├── secureStorage.ts           # Hardware-encrypted storage (iOS Keychain / Android Keystore) for tokens
│   ├── biometrics.ts              # Native FaceID / Fingerprint local authentication helper
│   └── index.ts
│
└── theme/                         # Centralized design tokens
    ├── colors.ts                  # Primary, background, surface, border, and semantic colors
    ├── spacing.ts                 # Standard spacing scale (xs: 4, sm: 8, md: 16, lg: 24, xl: 32)
    ├── typography.ts              # Font families, sizes, line heights, and weights
    ├── shadows.ts                 # Platform-safe elevation & shadow presets (soft, medium, highlight)
    └── index.ts
```

---

## 🧩 3. The Standard 7-Folder Feature Blueprint

Every domain module inside `src/features/<feature_name>/` must follow this exact structure:

```text
src/features/<feature_name>/
├── components/     # Private UI sub-widgets used only inside this feature
├── hooks/          # React hooks & TanStack Query/Mutation hooks for this feature
├── models/         # Single source of truth: Zod schemas + z.infer compile-time types
├── repositories/   # Data access layer (API/DB queries, local cache fallback, explicit mappers)
├── screens/        # Composite top-level screens rendered by app/ routes
├── store/          # Zustand reactive client state & MMKV disk persistence
├── __tests__/      # Integration test suite (testing whole feature flows in <300ms)
├── keys.ts         # Query key factories for TanStack Query caching
└── index.ts        # The "Front Door" barrel export (only public APIs exported)
```

> **Empty Folder Rule**: If a feature is headless or doesn't need a specific subfolder initially (e.g. no custom `store/` or `screens/`), keep the folder with a `.gitkeep` file to preserve architecture symmetry.

---

## 🧭 4. `src/app/` (Expo Router Routing Layer)

The `src/app/` directory contains **zero business logic**. It acts strictly as a thin routing shell:

```text
src/app/
├── _layout.tsx             # Root layout: mounts SafeAreaProvider, ErrorBoundary, QueryProvider, Toast
├── index.tsx               # Root redirect: forwards user to /(tabs)
├── (tabs)/                 # Bottom Tab Navigator
│   ├── _layout.tsx         # Tab bar configuration & dynamic feature-flag tab gating
│   ├── index.tsx           # Thin route -> renders <FeatureAScreen />
│   ├── explore.tsx         # Thin route -> renders <FeatureBScreen />
│   └── profile.tsx         # Thin route -> renders <ProfileScreen />
├── <feature>/
│   └── [id].tsx            # Dynamic route -> reads useLocalSearchParams() and renders <DetailScreen id={id} />
└── auth/
    └── login.tsx           # Modal presentation route -> renders <LoginScreen />
```

---

## 🛡️ 5. The 6 Non-Negotiable System Pillars

| Pillar | Technology | Rule to Follow |
| :--- | :--- | :--- |
| **1. Navigation** | **Expo Router v6** | File-based routing with typed dynamic params (`[id].tsx`), native bottom tabs, and modal presentation. Never use monolithic manual `useState` screen routers. |
| **2. Data Layer** | **Repository Pattern + Mappers** | UI components **never** touch raw database/API SDKs directly. All external data passes through explicit Zod mappers with fallback defaults. |
| **3. Caching Layer** | **TanStack Query + MMKV** | **Dual Caching**: In-memory stale-while-revalidate for server state (`useQuery`), synchronous native MMKV for client state & offline disk persistence. |
| **4. Error System** | **Result<T, E> + Flight Recorder** | Safe envelope returns (`{ ok: true, data } | { ok: false, error }`), root `ErrorBoundary` for crash recovery, and 50-action circular breadcrumb ring-buffer. |
| **5. Tiered Security** | **SecureStore + Biometrics** | Hardware-encrypted storage (**iOS Keychain / Android Keystore**) for auth/payment tokens. Fast MMKV for UI caches. FaceID / Fingerprint unlock via `expo-local-authentication`. |
| **6. Testing** | **Integration-First (`bun test`)** | Black-box module testing that runs in <300ms. Test complete user flows, Zod schema parsing, and data mappers rather than tiny trivial unit functions. |

---

## 📋 6. Step-by-Step New Project Checklist (The Todo List)

### Phase 1: Tooling & Core Scaffolding
- [ ] Initialize Expo app with TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`).
- [ ] Configure `package.json` entry (`"main": "expo-router/entry"`), `babel.config.js`, and `bunfig.toml` + `test-setup.ts`.
- [ ] Scaffold `src/app/`, `src/core/` (all 8 submodules), and `src/features/`.
- [ ] Implement `core/theme/` design tokens (`colors.ts`, `spacing.ts`, `typography.ts`, `shadows.ts`).
- [ ] Implement `core/components/` atomic primitives (`Button`, `Card`, `Input`, `Badge`, `Toast`, `TopBar`, `FeatureGate`).
- [ ] Implement `core/errors/` (`result.ts`, `error-handler.ts`, `breadcrumbs.ts`, `ErrorBoundary.tsx`).
- [ ] Implement `core/storage/` (`mmkv.ts`, `secureStorage.ts`, `biometrics.ts`).
- [ ] Implement `core/config/` (`config.schema.ts`, `config.ts`, `featureFlags.schema.ts`, `useFeatureFlags.ts`).
- [ ] Implement `core/query/` (`queryClient.ts`, `QueryProvider.tsx`).
- [ ] Implement `core/network/` (`useNetworkStatus.ts` with auto-sync on reconnect).

### Phase 2: Building Features (Repeated for Each Feature)
- [ ] Create `features/<feature>/models/<entity>.model.ts` with Zod schema + inferred TypeScript type.
- [ ] Create `features/<feature>/repositories/<entity>.repository.ts` returning `Result<T, AppError>`.
- [ ] Create `features/<feature>/store/use<Feature>Store.ts` with Zustand + MMKV persistence.
- [ ] Create `features/<feature>/keys.ts` and `hooks/use<Feature>Query.ts` for TanStack Query caching.
- [ ] Build private `components/` and assemble top-level `screens/`.
- [ ] Write `__tests__/<feature>.integration.test.ts` testing end-to-end user flows and transformations.
- [ ] Export public APIs strictly through `index.ts`.

### Phase 3: Routing & App Assembly
- [ ] Mount routes in `src/app/(tabs)/` and dynamic paths `src/app/<feature>/[id].tsx`.
- [ ] Wrap root layout in `_layout.tsx` with `SafeAreaProvider`, `ErrorBoundary`, `QueryProvider`, and `Toast`.
- [ ] Run `tsc --noEmit` to verify **0 type errors**.
- [ ] Run `bun test` to verify **100% passing integration tests**.

---

## 🤖 7. The "Copy-Paste Master Prompt" for AI Coding Assistants

*Copy and paste this exact prompt whenever starting any new application with an AI agent:*

```text
I am building a production-grade React Native app with Expo Router.
You must strictly adhere to the Feature-Driven Modular Monolith Architecture:

1. Directory Layout:
   - src/app/ (Expo Router thin routing layer)
   - src/core/ (8 submodules: api, components, config, errors, network, query, storage, theme)
   - src/features/<name>/ (Standard 7 folders: components, hooks, models, repositories, screens, store, __tests__, plus keys.ts and index.ts)
   - src/types.ts

2. Architectural Non-Negotiables:
   - TypeScript Strict Mode: 100% strict types, zero `any`, zero `@ts-ignore`.
   - Data Layer: Repository pattern with explicit Zod runtime data mappers. Never call cloud SDKs directly from UI components.
   - Dual Caching: TanStack Query v5 for server state + synchronous MMKV v4 for client persistence.
   - Error Architecture: Use Result<T, E> return envelopes, root ErrorBoundary, and 50-action circular Flight Recorder breadcrumb buffer.
   - Tiered Security: Hardware-encrypted SecureStore (Keychain/Keystore) for auth/session tokens + biometric unlock.
   - Feature Flags: Use Zod featureFlags.schema.ts and <FeatureGate flag="..."> wrapper.
   - Testing: Write integration-first tests with bun:test testing complete user flows and schema parsing.
   - Style: Keep functions focused, co-locate code by feature, and maintain strict front-door encapsulation via index.ts.
```
