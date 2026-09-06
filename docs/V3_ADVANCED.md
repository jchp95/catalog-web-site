# V3 Advanced Edition

## Completed

- Six production-structured demo routes.
- Six independent art directions.
- Six interactive conversion simulations.
- Shared client-preview dock.
- Prospect business-name and city personalization.
- URL-carried personalization.
- Native share / clipboard fallback.
- Central Live Sales Mode launcher.
- Mobile-first responsive rules for all new verticals.
- Reduced-motion baseline.
- Progressive 3D: a drag-to-explore WebGL photo gallery in the showroom hero and a drag-to-inspect 3D vehicle stage in APEX, both code-split and falling back to the ordinary 2D presentation with no WebGL support, reduced motion, or a runtime error.
- Cursor-reactive 3D tilt (`components/ui/TiltCard.tsx`) on MIREYA's portrait, HARBOR's selected-home photo and CASA FUEGO's menu photo.
- A missing favicon, a real skip-to-content link and BRIGHTLINE ZIP validation — accessibility/QA gaps closed during the V3 pass.

## Recommended V4

### Commercial integrations

- CRM adapter (HubSpot, GoHighLevel or chosen provider).
- Real lead capture and source attribution.
- Analytics event contract: demo opened, interaction started, conversion reached, share created.
- Seller/admin screen for saved prospect presets.
- Generated QR for phone handoff.

### Content

- Real licensed photography/video per chosen production vertical.
- CMS-managed services, team, menu, properties and testimonials.
- SEO/local-business schema per client deployment.

### Engineering

- Playwright route/flow tests.
- Lighthouse CI budgets.
- Dynamic imports for any future WebGL/maps/video.
- Self-hosted production fonts.
- Error boundaries and integration observability when backend providers are added.

## Agile delivery model

Use thin vertical increments. A sprint should finish one demonstrable sales outcome rather than several partially-complete layers. Example: "prospect can personalize, share and reopen BLACKLINE" is a shippable slice; "build generic sharing infrastructure" alone is not.

Definition of Done for a new vertical: unique visual thesis, mobile layout, one meaningful interaction, simulated success state, sales-dock compatibility, keyboard focus, reduced-motion behavior, route metadata and smoke-test coverage once Playwright is introduced.
