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
- No WebGL in the shared showroom bundle.
- Respect `prefers-reduced-motion` globally.
- Keep meaningful content available before animation completes.
- Route-specific CSS/interaction stays with each vertical.
- Self-host fonts before high-traffic production deployment.
- Measure LCP, INP and CLS on deployed builds, not only locally.

## Accessibility baseline

- semantic links/buttons;
- visible keyboard focus;
- large mobile interaction targets;
- state conveyed by more than color when necessary;
- reduced-motion handling;
- labels for inputs and range controls;
- dismissible modal/drawer layers.
