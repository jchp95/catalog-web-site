# Architecture — LOCAL/SHOWROOM V3

## Product boundaries

LOCAL/SHOWROOM has three independent responsibilities:

1. **Showroom** — discover and enter the right vertical quickly.
2. **Vertical experience** — prove a business outcome through a domain-specific interaction.
3. **Sales layer** — temporarily personalize and share a concept during prospect conversations.

The central showroom never owns booking, restaurant, property, automotive or dispatch state.

## Structure

```text
app/
  (showroom)/
  demos/
    mireya/
    apex/
    blackline/
    casa-fuego/
    harbor/
    brightline/
components/
  showroom/
  sales/
  ui/
features/
  mireya/
  apex/
  blackline/
  casa-fuego/
  harbor/
  brightline/
lib/
  demos.ts
```

## SOLID, applied pragmatically

### Single Responsibility

Route pages resolve route metadata/styles. Feature experiences own domain interactions. `DemoSalesDock` owns presentation personalization/share behavior. `ProjectRail` renders catalog metadata only.

### Open / Closed

A seventh vertical is introduced by adding a route, one feature module and one `lib/demos.ts` record. Existing vertical business logic does not change.

### Interface Segregation

There is no universal domain interface. Catalog metadata is deliberately smaller than runtime interaction state. The sales dock receives only the identity fields it needs.

### Dependency Inversion

Vertical features depend on framework primitives and small shared UI/sales components. They do not depend on the showroom page. Future CRM/booking integrations should depend on application interfaces, not HTTP clients embedded in React components.

## Server / client split

Pages remain Server Components for metadata and route composition. Interactive feature roots opt into `"use client"`. Expensive future integrations (3D, maps, video) should be dynamically loaded only inside the vertical that needs them.

## State strategy

V3 intentionally uses local state because conversions are simulated. Do not introduce global state management until state must cross real workflow boundaries.

Production evolution:

```text
features/<domain>/
  domain/
  application/
  infrastructure/
  ui/
```

Use that layering when a real provider exists: CRM, booking engine, payment processor, property feed, dispatch system, etc.

## Performance rules

- Animate `transform` and `opacity` whenever possible.
- No WebGL in the shared showroom bundle — see "Progressive 3D" below.
- Respect `prefers-reduced-motion` globally.
- Keep meaningful content available before animation completes.
- Route-specific CSS/interaction stays with each vertical.
- Self-host fonts before high-traffic production deployment (done — `public/fonts`).
- Measure LCP, INP and CLS on deployed builds, not only locally.

## Progressive 3D

Two flagship moments use real-time WebGL (`three`, `@react-three/fiber`, `@react-three/drei`): the showroom hero's drag-to-explore photo gallery (`components/showroom/LiveDeckScene.tsx`) and APEX's drag-to-inspect vehicle stage (`features/apex/VehicleScene3D.tsx`). Both follow the same rule, not just as a preference but as a hard requirement:

1. **The 2D/DOM experience is complete on its own.** Every route works, reads and converts with 3D absent. 3D is layered on top of it, never load-bearing.
2. **Code-split, never in the initial bundle.** Every 3D component is `next/dynamic(..., { ssr: false })`, so `three`/`fiber`/`drei` ship in one dedicated chunk fetched only by the routes that mount it, at the moment they mount it — verified after each build (`grep` the built chunks for `THREE`/`drei`, confirm no other route references that chunk).
3. **Upgrade only after mount, only when it is safe.** `lib/webgl.ts#hasWebGL()` and Motion's `useReducedMotion()` gate the swap; SSR and first paint always render the plain 2D version, so there is no hydration mismatch and no motion forced on anyone who asked not to have it.
4. **A crash falls back, it does not break the page.** `components/ui/Canvas3DBoundary.tsx` wraps every 3D scene — React Three Fiber has no built-in WebGL context-loss recovery, so any render error swaps back to the 2D fallback silently.

A new WebGL moment in another vertical should follow the same four rules; skip any of them only with a specific, documented reason.

## Accessibility baseline

- semantic links/buttons;
- visible keyboard focus;
- large mobile interaction targets;
- state conveyed by more than color when necessary;
- reduced-motion handling;
- labels for inputs and range controls;
- dismissible modal/drawer layers.
