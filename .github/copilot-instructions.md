# Copilot instructions for this codebase

## Big picture architecture
- Express app entry is [server.js](server.js): configures Pug views, static assets, sessions, and registers route modules in [routes/](routes/).
- Data is in-memory only via [data/dataStore.js](data/dataStore.js) with mock catalogs in [data/products.js](data/products.js), users, and orders; no database layer.
- Adobe Target integration is centralized in [config/targetClient.js](config/targetClient.js) and [utils/targetHelpers.js](utils/targetHelpers.js); routes call `getTargetOffers()` and `extractMboxContent()` to render mbox-driven content.
- Visitor identity for Target is stored in session by [middleware/target.js](middleware/target.js) and updated on login/registration in [routes/auth.js](routes/auth.js).

## Key flows & data paths
- Request → middleware (`ensureTargetVisitorId`, `addUserToLocals`, `addCartToLocals`) → route → Pug render. See [server.js](server.js).
- Cart state is stored in `req.session.cart` and computed in [routes/cart.js](routes/cart.js); totals are recalculated server-side on every change.
- Checkout requires authentication via `isAuthenticated` in [middleware/auth.js](middleware/auth.js) and creates orders through [data/dataStore.js](data/dataStore.js) (see [routes/checkout.js](routes/checkout.js)).
- Target mboxes follow the `page-section-element` pattern; examples appear throughout [routes/](routes/) and are documented in [README.md](README.md).

## Adobe Target conventions
- Always assume Target may be unconfigured: `getTargetOffers()` can return null, so route rendering should handle `extractMboxContent()` returning null or default content.
- Target request context is built from request URL, UA, and timezone in [middleware/target.js](middleware/target.js); reuse helpers instead of re-building.
- Conversion tracking is done via `trackConversion()` in [utils/targetHelpers.js](utils/targetHelpers.js) (see order confirmation in [routes/checkout.js](routes/checkout.js)).

## Auth & sessions
- Sessions are configured in [config/session.js](config/session.js); `SESSION_SECRET` is required for persistence.
- Password hashing uses SHA-256 for demo only via [utils/auth.js](utils/auth.js); keep demo semantics consistent unless explicitly upgrading.
- User data in templates is provided via `res.locals` in [middleware/auth.js](middleware/auth.js).

## Developer workflows
- Run dev server: `npm run dev` (nodemon) or `npm start` (see [package.json](package.json)).
- App reads environment from `.env` (see [README.md](README.md) and [config/target.js](config/target.js)).

## UI/templates
- Views are Pug templates in [views/](views/) with shared layout in [views/layout.pug](views/layout.pug); product cards are partials in [views/partials/](views/partials/).
- Styling is Tailwind via CDN (documented in [README.md](README.md)); templates embed class-heavy markup rather than component CSS files.
