# E-Commerce Demo with Adobe Target Integration

A full-featured e-commerce demo application built with **Express.js**, **Pug**, and **Adobe Target** to showcase personalization and A/B testing capabilities throughout the customer journey.

## 🚀 Features

### E-Commerce Functionality
- 🏠 **Homepage** with featured products and sale items
- 🔍 **Product Search** with real-time filtering
- 📦 **Product Detail Pages** with specifications and related items
- 🛒 **Shopping Cart** with quantity management
- 💳 **Checkout Flow** with address and payment forms
- ✅ **Order Confirmation** with order tracking
- 👤 **User Authentication** (login, registration, logout)
- 📱 **Responsive Design** with Tailwind CSS

### Adobe Target Integration
- **Homepage Hero Personalization** (`homepage-hero` mbox)
- **Product Recommendations** (`homepage-recommendations`, `pdp-recommendations` mboxes)
- **Search Results Optimization** (`search-results-sorting` mbox)
- **Cart Abandonment Offers** (`cart-abandonment-offer` mbox)
- **Checkout Optimization** (`checkout-form-fields`, `checkout-payment-options` mboxes)
- **Post-Purchase Upsell** (`confirmation-recommendations` mbox)
- **Conversion Tracking** for order completion

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Adobe Target Account** (optional - app works without Target configuration)
  - Client Code
  - Organization ID
  - Property Token (optional)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd demo-pug-expressjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your Adobe Target credentials**
   ```env
   # Express Configuration
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=your-super-secret-key-here
   
   # Adobe Target Configuration
   TARGET_CLIENT_CODE=your-client-code
   TARGET_ORGANIZATION_ID=your-org-id@AdobeOrg
   TARGET_PROPERTY_TOKEN=
   TARGET_TIMEOUT=3000
   TARGET_SERVER_DOMAIN=your-client-code.tt.omtrdc.net
   TARGET_DECISIONING_METHOD=server-side
   ```

## 🚀 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at **http://localhost:3000**

## 👥 Test Accounts

Three demo user accounts are pre-configured:

| Username | Password | Description |
|----------|----------|-------------|
| `demo` | `password123` | Default demo user |
| `john.doe` | `demo123` | User with order history |
| `jane.smith` | `demo456` | Fitness enthusiast |

## 🎯 Adobe Target Activity Setup

### Prerequisites in Adobe Target UI

To see personalization in action, create the following activities in Adobe Target:

### 1. Homepage Hero Banner (A/B Test)
- **Activity Type:** A/B Test
- **Location:** `homepage-hero` mbox
- **Goal:** Test different hero messages
- **Experiences:**
  - **Control:** "Welcome to TechStore"
  - **Variation A:** "Save Big on Premium Electronics"
  - **Variation B:** "Discover the Latest Tech Innovations"

### 2. Product Recommendations
- **Activity Type:** Recommendations
- **Locations:** 
  - `homepage-recommendations` (Homepage)
  - `pdp-recommendations` (Product Detail Page)
  - `cart-recommendations` (Shopping Cart)
  - `confirmation-recommendations` (Order Confirmation)
- **Criteria:** 
  - People Who Viewed This, Viewed That
  - Recently Viewed Items
  - Top Sellers

### 3. Cart Abandonment Offer (Experience Targeting)
- **Activity Type:** Experience Targeting (XT)
- **Location:** `cart-abandonment-offer` mbox
- **Audiences:**
  - High-value cart (>$500): "Free shipping on orders over $500"
  - Medium-value cart ($100-$500): "Get 10% off with code SAVE10"
  - Low-value cart (<$100): "Add $50 more for free shipping"

### 4. Checkout Form Optimization (Multivariate Test)
- **Activity Type:** Multivariate Test
- **Location:** `checkout-form-fields` mbox
- **Test Elements:**
  - Form layout: Single column vs. Two columns
  - Required fields: Minimal vs. Complete
  - Progress indicator: Show vs. Hide

### 5. Search Results Sorting (Auto-Target)
- **Activity Type:** Auto-Target
- **Location:** `search-results-sorting` mbox
- **Goal:** Optimize product sort order based on visitor behavior
- **Variations:**
  - Relevance first
  - Price: Low to High
  - Best sellers first
  - Newest first

## 📁 Project Structure

```
demo-pug-expressjs/
├── config/
│   ├── target.js              # Adobe Target configuration
│   ├── targetClient.js        # Target client initialization
│   └── session.js             # Express session config
├── data/
│   ├── products.js            # Mock product catalog (12 products)
│   ├── users.js               # Mock user accounts (3 users)
│   ├── orders.js              # Order storage
│   └── dataStore.js           # In-memory data management
├── middleware/
│   ├── auth.js                # Authentication middleware
│   └── target.js              # Adobe Target helpers
├── routes/
│   ├── index.js               # Homepage route
│   ├── auth.js                # Login/register/logout
│   ├── products.js            # Search & product detail
│   ├── cart.js                # Shopping cart management
│   └── checkout.js            # Checkout & order confirmation
├── utils/
│   ├── auth.js                # Password hashing utilities
│   └── targetHelpers.js       # Adobe Target API helpers
├── views/
│   ├── layout.pug             # Base template with Tailwind
│   ├── index.pug              # Homepage
│   ├── search.pug             # Search results
│   ├── product-detail.pug     # Product page
│   ├── cart.pug               # Shopping cart
│   ├── checkout.pug           # Checkout form
│   ├── order-confirmation.pug # Order success
│   ├── login.pug              # Login page
│   ├── register.pug           # Registration page
│   ├── error.pug              # Error page
│   └── partials/
│       ├── header.pug         # Navigation header
│       ├── footer.pug         # Footer
│       └── product-card.pug   # Product card component
├── public/                    # Static assets (future use)
├── .env.example               # Environment template
├── .gitignore
├── package.json
├── server.js                  # Express app entry point
└── README.md
```

## 🎨 Styling

This project uses **Tailwind CSS** via CDN for rapid prototyping. For production:

1. Install Tailwind CLI:
   ```bash
   npm install -D tailwindcss
   ```

2. Generate config:
   ```bash
   npx tailwindcss init
   ```

3. Build CSS:
   ```bash
   npx tailwindcss -i ./public/css/input.css -o ./public/css/output.css --watch
   ```

## 🔧 Adobe Target Configuration

### Decisioning Methods

The app supports three Adobe Target decisioning methods (configured in `.env`):

1. **server-side** (default): Calls Target edge servers for each request
   - Best for: Dynamic content, real-time personalization
   - Latency: ~100-300ms per request

2. **on-device**: Downloads decisioning artifact, makes decisions locally
   - Best for: High-traffic sites, low-latency requirements
   - Latency: ~1-5ms per request
   - Note: Requires artifact to be updated periodically

3. **hybrid**: Combines both approaches
   - Best for: Balancing performance and real-time data

### Mbox Naming Convention

All mboxes follow the pattern: `{page}-{section}-{element}`

Examples:
- `homepage-hero` - Hero banner on homepage
- `pdp-add-to-cart` - Add to cart button on product detail page
- `cart-abandonment-offer` - Promotional message in cart

## 📊 Analytics & Tracking

### Conversion Tracking

The app tracks the following conversion events:

1. **Order Confirmation** (`order-confirmation` mbox)
   - Triggered: When order is successfully placed
   - Parameters: `orderId`, `orderValue`, `orderNumber`

2. **Product Views** (via at.js)
   - Automatically tracked on product detail pages

3. **Cart Actions** (future enhancement)
   - Add to cart
   - Remove from cart
   - Checkout initiated

## 🔒 Security Notes

⚠️ **This is a DEMO application**. For production use:

1. Replace `crypto` hashing with **bcrypt** for passwords
2. Use environment-specific session secrets
3. Enable HTTPS and set `secure: true` for cookies
4. Implement CSRF protection
5. Add rate limiting for authentication endpoints
6. Validate and sanitize all user inputs
7. Use a real database (PostgreSQL, MongoDB, etc.)
8. Implement proper error handling and logging

## 🐛 Troubleshooting

### Adobe Target not loading
- Verify `TARGET_CLIENT_CODE` and `TARGET_ORGANIZATION_ID` in `.env`
- Check browser console for at.js errors
- Ensure Target activities are active in Target UI

### Session/Cart not persisting
- Check that `SESSION_SECRET` is set in `.env`
- Verify cookies are enabled in browser
- Clear browser cookies and restart server

### Products not displaying
- Ensure mock data in `data/products.js` is valid
- Check server console for data loading errors

## 📚 Resources

- [Adobe Target Documentation](https://experienceleague.adobe.com/docs/target/using/target-home.html)
- [Adobe Target Node.js SDK](https://github.com/adobe/target-nodejs-sdk)
- [Express.js Documentation](https://expressjs.com/)
- [Pug Template Engine](https://pugjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📝 License

MIT License - This is a demonstration project for educational purposes.

## 🤝 Contributing

This is a demo project. Feel free to fork and customize for your own learning!

---

**Built with ❤️ to demonstrate Adobe Target personalization capabilities**
