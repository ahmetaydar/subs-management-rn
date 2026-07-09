<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Expo React Native subscription management app. The following changes were made:

- **`app.config.js`** — Created to expose `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` as `Constants.expoConfig.extra` values accessible at runtime via `expo-constants`.
- **`lib/posthog.ts`** — New PostHog client singleton, configured with lifecycle event capture, batching, retry logic, and graceful no-op when the token is not configured.
- **`app/_layout.tsx`** — Wrapped the app in `PostHogProvider` (with touch autocapture enabled), and added manual screen tracking via `usePathname` + `useEffect` for Expo Router compatibility.
- **`app/(auth)/sign-in.tsx`** — Added `posthog.identify()` and `posthog.capture('user_signed_in')` on both the direct sign-in path and the MFA verification path.
- **`app/(auth)/sign-up.tsx`** — Added `posthog.identify()` and `posthog.capture('user_signed_up')` on both the immediate sign-up completion path and after email verification.
- **`app/(tabs)/settings.tsx`** — Added `posthog.capture('user_signed_out')` and `posthog.reset()` before Clerk's `signOut()` to flush the event and clear the PostHog session.
- **`app/(tabs)/index.tsx`** — Added `posthog.capture('subscription_expanded')` when a user expands a subscription card.
- **`app/subscriptions/[id].tsx`** — Added `posthog.capture('subscription_detail_viewed')` on mount via `useEffect`.
- **`app/onboarding.tsx`** — Added `posthog.capture('onboarding_viewed')` on mount via `useEffect`.

## Events

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with email and password. | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User successfully creates a new account. | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | User signs out from the Settings screen. | `app/(tabs)/settings.tsx` |
| `subscription_expanded` | User expands a subscription card on the home screen to view details. | `app/(tabs)/index.tsx` |
| `subscription_detail_viewed` | User views the detail page for a specific subscription. | `app/subscriptions/[id].tsx` |
| `onboarding_viewed` | User lands on the onboarding screen. | `app/onboarding.tsx` |

## Next steps

We've built a dashboard and five insights to keep an eye on user behavior:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/194198/dashboard/806904)
- [User sign-ups over time](https://eu.posthog.com/project/194198/insights/BRPjdJIR)
- [Sign-up to sign-in funnel](https://eu.posthog.com/project/194198/insights/0zNCSCxq)
- [Daily active users](https://eu.posthog.com/project/194198/insights/4iCwxyK6)
- [Subscription engagement funnel](https://eu.posthog.com/project/194198/insights/pIG8ghpp)
- [Sign-in method breakdown](https://eu.posthog.com/project/194198/insights/8DjNgLLi)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
