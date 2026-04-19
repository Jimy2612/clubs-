# BETMASTER - Full Betting Website
## Betika-Style Betting Platform · Kenya

---

## 📁 FILE STRUCTURE

```
betmaster/
├── index.html      → Main app shell (all pages)
├── style.css       → Complete styles
├── app.js          → All logic, data, API calls
└── README.md       → This guide
```

---

## 🚀 QUICK START (Go Live in Minutes)

### Option 1: Upload to any web host
1. Upload `index.html`, `style.css`, `app.js` to your hosting root
2. Visit your domain — site is live immediately (works in demo mode without APIs)

### Option 2: Deploy to Netlify (Free)
1. Go to netlify.com → "New site from Git" or drag-and-drop the folder
2. Done — free HTTPS URL instantly

### Option 3: cPanel / Shared Hosting
1. Zip all 3 files
2. Upload via File Manager to `public_html/`
3. Extract — done

---

## 🔑 API INTEGRATIONS

### 1. LIVE SPORTS ODDS — The Odds API
**Get API key free:** https://the-odds-api.com

In `app.js`, update:
```js
ODDS_API_KEY: 'YOUR_KEY_HERE',
```

Sports keys: `soccer_epl`, `soccer_spain_la_liga`, `basketball_nba`, `tennis_atp`

### 2. M-PESA STK Push (Safaricom Daraja API)
**Register:** https://developer.safaricom.co.ke

Steps:
1. Create app on Daraja portal
2. Get Consumer Key & Secret
3. Go LIVE (swap sandbox URL to live)

In `app.js`, update:
```js
MPESA_CONSUMER_KEY: 'your_key',
MPESA_CONSUMER_SECRET: 'your_secret',
MPESA_SHORTCODE: 'your_paybill_or_till',
MPESA_PASSKEY: 'your_passkey',
MPESA_CALLBACK_URL: 'https://yourdomain.com/api/mpesa/callback',
```

**IMPORTANT:** M-PESA requires a backend server. The STK push must be called server-side to protect credentials.

### 3. Your Backend API
The app connects to `https://yourapi.betmaster.co.ke/api/v1`

Update in `app.js`:
```js
BACKEND_BASE: 'https://yourapi.yoursite.co.ke/api/v1',
```

Required backend endpoints:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login, returns JWT |
| GET | /user/balance | Get balance |
| POST | /bets/place | Place bet |
| GET | /bets/my | Get user bets |
| POST | /payments/mpesa/stkpush | Trigger M-PESA push |
| POST | /payments/withdraw | Withdraw via M-PESA B2C |

---

## 🏗️ RECOMMENDED BACKEND STACK

### Node.js / Express (Recommended)
```bash
npm install express mongoose jsonwebtoken bcryptjs axios cors dotenv
```

### PHP / Laravel
```bash
composer require laravel/sanctum guzzlehttp/guzzle
```

### Python / Django / FastAPI
```bash
pip install fastapi pymongo python-jose passlib requests
```

---

## 💾 DATABASE SCHEMA (MongoDB)

```js
// Users
{
  name: String,
  phone: String (unique),
  pin: String (hashed),
  balance: Number,
  createdAt: Date,
  isActive: Boolean,
  kycStatus: String, // pending | verified
}

// Bets
{
  userId: ObjectId,
  betId: String,
  selections: [{ matchId, pick, label, odd, matchName }],
  stake: Number,
  totalOdds: Number,
  potential: Number,
  status: String, // pending | won | lost
  placedAt: Date,
  settledAt: Date,
}

// Transactions
{
  userId: ObjectId,
  type: String, // deposit | withdrawal | bet | winnings
  amount: Number,
  direction: String, // credit | debit
  method: String, // mpesa | bank
  reference: String,
  status: String, // pending | completed | failed
  createdAt: Date,
}
```

---

## 🎨 CUSTOMIZATION

### Change Brand Name
Find & replace `BETMASTER` and `BetMaster` in all 3 files.

### Change Colors (style.css)
```css
:root {
  --green: #00c853;     /* Primary brand color */
  --yellow: #ffc107;    /* Accent / highlights */
  --red: #ff3d3d;       /* Live / alerts */
  --dark: #0a0f0d;      /* Background */
}
```

### Add Real Match Data
Replace the `MATCHES` array in `app.js` with API response data.
Use the Odds API or SportMonks API for real fixtures.

### Add More Payment Methods
Extend the `payment-methods` section in `index.html`.
Add handlers in `app.js` following the M-PESA pattern.

---

## 📱 FEATURES

✅ Fully responsive — Mobile first (like Betika app)  
✅ Fixed header with sport tab navigation  
✅ Mobile bottom navigation bar  
✅ Hero banner with auto-slideshow  
✅ Live score ticker  
✅ Match cards with 1X2 odds  
✅ Betslip with multi-bet accumulator  
✅ Potential winnings calculator  
✅ User registration & login  
✅ M-PESA deposit & withdrawal flow  
✅ Casino games grid  
✅ Virtual sports  
✅ Mega Jackpot (pick 17)  
✅ My Bets history  
✅ Transaction history  
✅ Responsible Gaming tools  
✅ Promotions page  
✅ FAQ / Support  
✅ Toast notifications  
✅ Session persistence (localStorage)  
✅ Auto-refreshing live odds  
✅ Demo mode (works without APIs)  

---

## 🔒 LEGAL & COMPLIANCE (Kenya)

Before going live you **must**:
1. **Obtain BCLB License** from Betting Control & Licensing Board Kenya
2. **Register business** with Registrar of Companies
3. Add **Responsible Gambling** disclaimer on all pages
4. Display **18+ warning** prominently
5. Implement **KYC** (ID verification) for withdrawals > KES 40,000
6. Display **helpline number**: 0800 723 253

Official responsible gambling message to add:
> "Gambling is addictive and can be harmful. Please gamble responsibly. 18+ only. Need help? Call 0800 723 253."

---

## ⚡ PERFORMANCE TIPS

- Minify CSS and JS before deploying: https://minifier.org
- Use Cloudflare CDN (free) for faster loading across Kenya
- Enable GZIP compression on your server
- Use a Kenya-based VPS (Linode Nairobi, AWS Africa Cape Town)

---

## 📞 SUPPORT

For implementation help, backend development, or M-PESA integration assistance, contact your developer with this codebase.
