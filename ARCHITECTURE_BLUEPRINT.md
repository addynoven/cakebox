# 🏛️ The Production App Architecture Blueprint & Playbook

> **The Golden Standard for Building Scalable, Feature-Driven Mobile & Full-Stack Apps.**  
> *Use this blueprint whenever starting a new React Native / Expo / Full-Stack project.*

---

## 📐 1. The Core 3-Tier Layout

Every production app must have exactly **3 top-level directories** inside `src/`:

```text
src/
├── app/          # 1. Navigation & Routing (Expo Router file-based routes)
├── core/         # 2. Shared System Foundations (Design tokens, error handling, storage, query)
└── features/     # 3. Domain Modules (Self-contained business features)
```

---

## 🧩 2. The Standard 7-Folder Feature Blueprint

Every feature module inside `src/features/<feature_name>/` must follow the exact same predictable folder structure:

```text
src/features/<feature_name>/
├── components/     # Feature-specific UI widgets (Cards, headers, subviews)
├── hooks/          # React hooks & TanStack Query/Mutation hooks
├── models/         # Single source of truth: Zod schemas + z.infer types
├── repositories/   # Data access layer (Firestore, Supabase, REST APIs + mappers)
├── screens/        # Top-level screen compositions rendered by app/ routes
├── store/          # Zustand reactive client state & MMKV persistence
├── __tests__/      # Integration test suite (testing whole feature flows)
├── keys.ts         # (Optional) Query key factories for cache invalidation
└── index.ts        # The "Front Door" barrel export (only public APIs exposed)
```

---

## 🛡️ 3. The 6 Non-Negotiable System Pillars

| Pillar | Technology | Rule to Follow |
| :--- | :--- | :--- |
| **1. Navigation** | **Expo Router v6** | File-based routing with typed dynamic params (`[id].tsx`), native bottom tabs, and modal presentation. Never use monolithic manual `useState` screen routers. |
| **2. Data Layer** | **Repository Pattern + Mappers** | UI components **never** touch Firebase/Supabase SDKs directly. All raw cloud docs pass through explicit data mappers (`firestoreMappers.ts`) with fallback defaults. |
| **3. Caching Layer** | **TanStack Query + MMKV** | **Dual Caching**: In-memory stale-while-revalidate for server state (`useQuery`), synchronous native MMKV for client state & offline disk persistence. |
| **4. Error System** | **Result<T, E> + Flight Recorder** | Safe envelope returns (`{ ok: true, data } | { ok: false, error }`), root `ErrorBoundary` for crash recovery, and 50-action circular breadcrumb ring-buffer. |
| **5. Tiered Security** | **SecureStore + Biometrics** | Hardware-encrypted storage (**iOS Keychain / Android Keystore**) for auth/payment tokens. Fast MMKV for UI caches. FaceID / Fingerprint unlock via `expo-local-authentication`. |
| **6. Testing** | **Integration-First (`bun test`)** | Black-box module testing that runs in <300ms. Test complete user flows, Zod schema parsing, and data mappers rather than tiny trivial unit functions. |

---

## 📋 4. Step-by-Step New Project Checklist (The Todo List)

### Phase 1: Core Scaffolding
- [ ] Initialize Expo project with TypeScript strict mode enabled (`"strict": true`).
- [ ] Setup `src/app/`, `src/core/`, and `src/features/`.
- [ ] Configure `core/theme/` (colors, typography, spacing, shadows tokens).
- [ ] Configure `core/components/` (atomic primitives: `Button`, `Card`, `Input`, `Badge`, `Toast`, `TopBar`, `FeatureGate`).
- [ ] Configure `core/errors/` (`AppError`, `result.ts`, `breadcrumbs.ts`, `ErrorBoundary.tsx`).
- [ ] Configure `core/storage/` (`mmkv.ts`, `secureStorage.ts`, `biometrics.ts`).
- [ ] Configure `core/query/` (`queryClient.ts` with `staleTime: 5m` and `QueryProvider.tsx`).
- [ ] Configure `core/network/` (`useNetworkStatus.ts` with NetInfo auto-sync).

### Phase 2: Building Features (Repeated for Each Feature)
- [ ] Create `models/<feature>.model.ts` with Zod schema + `export type X = z.infer<typeof XSchema>`.
- [ ] Create `repositories/<feature>.repository.ts` with typed queries and mappers.
- [ ] Create `store/use<Feature>Store.ts` with Zustand + MMKV persistence.
- [ ] Create `hooks/use<Feature>Query.ts` and `keys.ts` for TanStack Query caching.
- [ ] Build `components/` and composite `screens/`.
- [ ] Write `__tests__/<feature>.integration.test.ts` testing end-to-end feature logic.
- [ ] Export public APIs through `index.ts`.

### Phase 3: Routing & Integration
- [ ] Wire up routes in `src/app/(tabs)/` and dynamic detail paths `src/app/<feature>/[id].tsx`.
- [ ] Wrap root layout in `_layout.tsx` with `SafeAreaProvider`, `ErrorBoundary`, `QueryProvider`, and `Toast`.
- [ ] Verify 100% strict type safety (`tsc --noEmit`).
- [ ] Run test suite (`bun test`).

---

## 🤖 5. The "Copy-Paste Master Prompt" for Future AI Pair Programming

*When starting a new app or handing requirements to an AI agent, copy and paste this exact prompt:*

```text
I am building a production-grade React Native app with Expo Router. 
You must strictly follow the Feature-Driven Modular Monolith Architecture:

1. Directory Structure:
   - Root in `src/`: only `app/` (Expo Router), `core/` (shared foundations), `features/` (domain modules), and `types.ts`.
   - Each feature in `src/features/<name>/` MUST have: `components/`, `hooks/`, `models/`, `repositories/`, `screens/`, `store/`, `__tests__/`, and `index.ts`.

2. Engineering Rules:
   - TypeScript Strict Mode: No `any`, no `@ts-ignore`.
   - Data Layer: Use the Repository pattern with explicit Zod runtime data mappers. Never call cloud SDKs directly from UI components.
   - Caching: Use TanStack Query for server data + MMKV for fast client persistence.
   - Error Handling: Use `Result<T, E>` pattern for safe returns and maintain a 50-action circular breadcrumb buffer attached to `AppError`.
   - Security: Store sensitive auth/session tokens in hardware-encrypted SecureStore (Keychain/Keystore).
   - Testing: Write integration-first tests using `bun:test` testing complete feature flows and schema validations.
   - Code Style: Lead with the code, keep functions small and focused, and maintain strict front-door encapsulation through `index.ts`.
```
