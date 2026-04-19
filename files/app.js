/* ===== BETMASTER APP.JS ===== */
'use strict';

// ===== STATE =====
const State = {
  user: null,
  balance: 0,
  betslip: [],
  currentPage: 'home',
  currentSport: 'all',
  currentFilter: 'all',
  casinoFilter: 'all',
  jackpotPicks: {},
  transactions: [],
  placedBets: [],
  slideIndex: 0,
  liveMatches: [],
  selectedPayMethod: 'mpesa',
};

// ===== SAMPLE DATA =====
const LEAGUES = [
  { id: 'epl', name: 'English Premier League', country: 'England', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: 10 },
  { id: 'laliga', name: 'La Liga', country: 'Spain', icon: '🇪🇸', count: 8 },
  { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', icon: '🇩🇪', count: 9 },
  { id: 'seriea', name: 'Serie A', country: 'Italy', icon: '🇮🇹', count: 7 },
  { id: 'ligue1', name: 'Ligue 1', country: 'France', icon: '🇫🇷', count: 6 },
  { id: 'kpl', name: 'FKF Premier League', country: 'Kenya', icon: '🇰🇪', count: 5 },
];

const MATCHES = [
  { id: 'm1', league: 'Premier League', leagueId: 'epl', sport: 'football', home: 'Arsenal', away: 'Chelsea', time: '15:00', date: 'Today', odds: { home: 2.10, draw: 3.40, away: 3.60 }, live: false, homeScore: null, awayScore: null },
  { id: 'm2', league: 'Premier League', leagueId: 'epl', sport: 'football', home: 'Man City', away: 'Liverpool', time: '17:30', date: 'Today', odds: { home: 1.85, draw: 3.80, away: 4.20 }, live: false, homeScore: null, awayScore: null },
  { id: 'm3', league: 'La Liga', leagueId: 'laliga', sport: 'football', home: 'Real Madrid', away: 'Barcelona', time: '20:00', date: 'Today', odds: { home: 2.20, draw: 3.50, away: 3.10 }, live: false, homeScore: null, awayScore: null },
  { id: 'm4', league: 'Bundesliga', leagueId: 'bundesliga', sport: 'football', home: 'Bayern Munich', away: 'Dortmund', time: '18:30', date: 'Today', odds: { home: 1.65, draw: 4.00, away: 5.00 }, live: false, homeScore: null, awayScore: null },
  { id: 'm5', league: 'Serie A', leagueId: 'seriea', sport: 'football', home: 'Juventus', away: 'AC Milan', time: '21:45', date: 'Today', odds: { home: 2.30, draw: 3.20, away: 3.00 }, live: false, homeScore: null, awayScore: null },
  { id: 'm6', league: 'FKF Premier League', leagueId: 'kpl', sport: 'football', home: 'Gor Mahia', away: 'AFC Leopards', time: '16:00', date: 'Today', odds: { home: 2.00, draw: 3.10, away: 3.80 }, live: false, homeScore: null, awayScore: null },
  { id: 'm7', league: 'NBA', leagueId: 'nba', sport: 'basketball', home: 'Lakers', away: 'Celtics', time: '02:30', date: 'Today', odds: { home: 1.95, draw: null, away: 1.85 }, live: false, homeScore: null, awayScore: null },
  { id: 'm8', league: 'ATP Tour', leagueId: 'atp', sport: 'tennis', home: 'Djokovic', away: 'Alcaraz', time: '14:00', date: 'Today', odds: { home: 1.70, draw: null, away: 2.10 }, live: false, homeScore: null, awayScore: null },
  { id: 'm9', league: 'Premier League', leagueId: 'epl', sport: 'football', home: 'Tottenham', away: 'Man Utd', time: '12:30', date: 'Today', odds: { home: 2.40, draw: 3.30, away: 2.90 }, live: true, homeScore: 1, awayScore: 0 },
  { id: 'm10', league: 'La Liga', leagueId: 'laliga', sport: 'football', home: 'Atletico Madrid', away: 'Sevilla', time: '19:00', date: 'Today', odds: { home: 1.90, draw: 3.50, away: 4.10 }, live: true, homeScore: 2, awayScore: 1 },
  { id: 'm11', league: 'Ligue 1', leagueId: 'ligue1', sport: 'football', home: 'PSG', away: 'Lyon', time: '21:00', date: 'Today', odds: { home: 1.50, draw: 4.50, away: 6.00 }, live: false, homeScore: null, awayScore: null },
  { id: 'm12', league: 'Bundesliga', leagueId: 'bundesliga', sport: 'football', home: 'Leipzig', away: 'Leverkusen', time: '17:00', date: 'Tomorrow', odds: { home: 2.60, draw: 3.20, away: 2.80 }, live: false, homeScore: null, awayScore: null },
  { id: 'm13', league: 'Cricket', leagueId: 'cricket', sport: 'cricket', home: 'India', away: 'Australia', time: '09:00', date: 'Today', odds: { home: 1.80, draw: 5.00, away: 2.00 }, live: true, homeScore: '245/6', awayScore: null },
  { id: 'm14', league: 'Rugby World', leagueId: 'rugby', sport: 'rugby', home: 'South Africa', away: 'New Zealand', time: '16:30', date: 'Today', odds: { home: 2.00, draw: null, away: 1.80 }, live: false, homeScore: null, awayScore: null },
  { id: 'm15', league: 'Serie A', leagueId: 'seriea', sport: 'football', home: 'Inter Milan', away: 'Roma', time: '20:45', date: 'Today', odds: { home: 1.75, draw: 3.80, away: 4.50 }, live: false, homeScore: null, awayScore: null },
];

const JACKPOT_MATCHES = MATCHES.filter(m => m.sport === 'football').slice(0, 17).map((m, i) => ({ ...m, jpId: `jp${i+1}` }));

const CASINO_GAMES = [
  { id: 'cg1', title: 'Book of Dead', provider: 'Play\'n GO', icon: '📖', category: 'slots', badge: 'HOT' },
  { id: 'cg2', title: 'Sweet Bonanza', provider: 'Pragmatic Play', icon: '🍬', category: 'slots', badge: 'NEW' },
  { id: 'cg3', title: 'Gates of Olympus', provider: 'Pragmatic Play', icon: '⚡', category: 'slots', badge: 'HOT' },
  { id: 'cg4', title: 'Starburst', provider: 'NetEnt', icon: '⭐', category: 'slots', badge: '' },
  { id: 'cg5', title: 'Mega Moolah', provider: 'Microgaming', icon: '🦁', category: 'slots', badge: 'JP' },
  { id: 'cg6', title: 'Blackjack VIP', provider: 'Evolution', icon: '🃏', category: 'table', badge: 'LIVE' },
  { id: 'cg7', title: 'Roulette Live', provider: 'Evolution', icon: '🎡', category: 'live', badge: 'LIVE' },
  { id: 'cg8', title: 'Aviator', provider: 'Spribe', icon: '✈️', category: 'crash', badge: 'HOT' },
  { id: 'cg9', title: 'JetX', provider: 'SmartSoft', icon: '🚀', category: 'crash', badge: '' },
  { id: 'cg10', title: 'Baccarat', provider: 'Evolution', icon: '🎴', category: 'table', badge: 'LIVE' },
  { id: 'cg11', title: 'Big Bass', provider: 'Pragmatic Play', icon: '🎣', category: 'slots', badge: '' },
  { id: 'cg12', title: 'Wolf Gold', provider: 'Pragmatic Play', icon: '🐺', category: 'slots', badge: '' },
  { id: 'cg13', title: 'Dream Catcher', provider: 'Evolution', icon: '🎪', category: 'live', badge: 'LIVE' },
  { id: 'cg14', title: 'Texas Hold\'em', provider: 'Microgaming', icon: '♠️', category: 'table', badge: '' },
  { id: 'cg15', title: 'Balloon', provider: 'Spribe', icon: '🎈', category: 'crash', badge: 'NEW' },
];

const VIRTUAL_SPORTS = [
  { id: 'vf', name: 'Virtual Football', icon: '⚽', timer: '2:45', status: 'LIVE' },
  { id: 'vb', name: 'Virtual Basketball', icon: '🏀', timer: '5:12', status: 'STARTING' },
  { id: 'vt', name: 'Virtual Tennis', icon: '🎾', timer: '1:20', status: 'LIVE' },
  { id: 'vh', name: 'Virtual Horse Racing', icon: '🏇', timer: '3:00', status: 'STARTING' },
  { id: 'vd', name: 'Virtual Dogs', icon: '🐕', timer: '0:45', status: 'LIVE' },
  { id: 'vm', name: 'Virtual MotoGP', icon: '🏍️', timer: '4:30', status: 'STARTING' },
];

const PROMOTIONS = [
  { id: 'p1', title: 'Welcome Bonus', desc: 'Get 100% bonus on your first deposit up to KES 5,000. Deposit minimum KES 100 to activate.', icon: '🎁', bg: 'linear-gradient(135deg,#003a1a,#006400)', expiry: '31 Dec 2026' },
  { id: 'p2', title: 'Mega Jackpot', desc: 'Pick 17 correct scores and win KES 50,000,000! Entry costs just KES 99.', icon: '💎', bg: 'linear-gradient(135deg,#3a2500,#7a4f00)', expiry: 'Every Saturday' },
  { id: 'p3', title: 'Weekly Cashback', desc: 'Get 10% cashback on all your losses every Monday. No minimum. Automatically credited.', icon: '💵', bg: 'linear-gradient(135deg,#001a3a,#003a7a)', expiry: 'Every Monday' },
  { id: 'p4', title: 'Refer & Earn', desc: 'Earn KES 200 for every friend who registers and deposits. No limit on referrals!', icon: '👥', bg: 'linear-gradient(135deg,#1a001a,#3a003a)', expiry: 'Ongoing' },
  { id: 'p5', title: 'Free Bet Friday', desc: 'Get a KES 100 free bet every Friday when you place 3+ bets during the week.', icon: '🎯', bg: 'linear-gradient(135deg,#1a0000,#3a0000)', expiry: 'Every Friday' },
];

// ===== API CONFIG =====
const API_CONFIG = {
  // Odds & Sports Data
  // Replace with your actual API keys
  ODDS_API_KEY: 'YOUR_ODDS_API_KEY',
  ODDS_API_BASE: 'https://api.the-odds-api.com/v4',

  // M-PESA / Payment Gateway
  MPESA_BASE: 'https://sandbox.safaricom.co.ke',
  MPESA_CONSUMER_KEY: 'YOUR_MPESA_CONSUMER_KEY',
  MPESA_CONSUMER_SECRET: 'YOUR_MPESA_CONSUMER_SECRET',
  MPESA_SHORTCODE: '174379',
  MPESA_PASSKEY: 'YOUR_MPESA_PASSKEY',
  MPESA_CALLBACK_URL: 'https://yoursite.com/api/mpesa/callback',

  // Your Backend API
  BACKEND_BASE: 'http://localhost/betmaster/api',

  // Live Score API
  LIVESCORE_BASE: 'https://api.sofascore.com/api/v1',
};

// ===== API FUNCTIONS =====
const API = {
  // Fetch live odds from The Odds API
  async getLiveOdds(sport = 'soccer_epl') {
    try {
      const res = await fetch(`${API_CONFIG.ODDS_API_BASE}/sports/${sport}/odds?apiKey=${API_CONFIG.ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
      if (!res.ok) throw new Error('Odds API error');
      return await res.json();
    } catch (e) {
      console.warn('Live odds unavailable, using sample data:', e.message);
      return null;
    }
  },

  // Backend: Register user
  async registerUser(data) {
    try {
      const res = await fetch(`${API_CONFIG.BACKEND_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      // Demo mode: simulate success
      return { success: true, token: 'demo_token_' + Date.now(), user: data };
    }
  },

  // Backend: Login user
  async loginUser(phone, pin) {
    try {
      const res = await fetch(`${API_CONFIG.BACKEND_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin }),
      });
      return await res.json();
    } catch (e) {
      return { success: true, token: 'demo_token_' + Date.now(), user: { name: 'Demo User', phone } };
    }
  },

  // Backend: Place bet
  async placeBet(betData) {
    try {
      const res = await fetch(`${API_CONFIG.BACKEND_BASE}/bets/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('bm_token')}`,
        },
        body: JSON.stringify(betData),
      });
      return await res.json();
    } catch (e) {
      return { success: true, betId: 'BET' + Date.now(), message: 'Bet placed successfully' };
    }
  },

  // Backend: Get user balance
  async getBalance() {
    try {
      const res = await fetch(`${API_CONFIG.BACKEND_BASE}/user/balance`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('bm_token')}` },
      });
      const data = await res.json();
      return data.balance;
    } catch (e) {
      return State.balance;
    }
  },

  // M-PESA STK Push
  async mpesaDeposit(phone, amount) {
    try {
      // Get access token first (server-side in production)
      const res = await fetch(`${API_CONFIG.BACKEND_BASE}/payments/mpesa/stkpush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('bm_token')}`,
        },
        body: JSON.stringify({ phone, amount }),
      });
      return await res.json();
    } catch (e) {
      return { success: true, checkoutRequestId: 'ws_CO_' + Date.now(), message: 'STK Push sent to ' + phone };
    }
  },

  // Backend: Withdraw
  async withdraw(phone, amount) {
    try {
      const res = await fetch(`${API_CONFIG.BACKEND_BASE}/payments/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('bm_token')}`,
        },
        body: JSON.stringify({ phone, amount }),
      });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Withdrawal initiated. KES ' + amount + ' will be sent to ' + phone };
    }
  },

  // Get user bets
  async getUserBets() {
    try {
      const res = await fetch(`${API_CONFIG.BACKEND_BASE}/bets/my`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('bm_token')}` },
      });
      return await res.json();
    } catch (e) {
      return State.placedBets;
    }
  },
};

// ===== NAVIGATION =====
function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    State.currentPage = page;
  }
  // Update mobile nav
  document.querySelectorAll('.mob-nav').forEach(n => n.classList.remove('active'));
  // Update desktop nav
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  // Scroll to top
  window.scrollTo(0, 0);
  // Load page-specific data
  loadPageData(page);
}

function loadPageData(page) {
  switch(page) {
    case 'live': renderLiveMatches(); break;
    case 'sports': renderSportsMatches(); break;
    case 'casino': renderCasino(); break;
    case 'virtual': renderVirtual(); break;
    case 'jackpot': renderJackpot(); break;
    case 'mybets': renderMyBets(); break;
    case 'transactions': renderTransactions(); break;
    case 'promotions': renderPromotions(); break;
    case 'profile': renderProfile(); break;
  }
}

// ===== MODALS =====
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  if (id === 'withdrawModal') {
    document.getElementById('withdrawBalance').textContent = State.balance.toFixed(2);
  }
  if (id === 'betslipModal') {
    renderBetslip();
  }
}
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}
function switchModal(from, to) {
  closeModal(from);
  openModal(to);
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.add('hidden');
  });
});

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'} ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== AUTH =====
async function handleLogin() {
  const phone = document.getElementById('loginPhone').value.trim();
  const pin = document.getElementById('loginPin').value.trim();
  if (!phone || !pin) return showToast('Enter phone and PIN', 'error');
  if (!/^07\d{8}$/.test(phone)) return showToast('Enter valid Kenyan phone (07XXXXXXXX)', 'error');
  if (pin.length !== 4) return showToast('PIN must be 4 digits', 'error');

  showToast('Logging in...');
  const result = await API.loginUser(phone, pin);
  if (result.success !== false) {
    const user = { name: result.user?.name || 'User', phone };
    loginUser(user, result.token || 'demo_token');
    closeModal('loginModal');
    showToast(`Welcome back, ${user.name.split(' ')[0]}! 🎉`);
  } else {
    showToast(result.message || 'Login failed', 'error');
  }
}

async function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const pin = document.getElementById('regPin').value.trim();
  const pinConfirm = document.getElementById('regPinConfirm').value.trim();
  const terms = document.getElementById('termsCheck').checked;

  if (!name || !phone || !pin) return showToast('Fill all fields', 'error');
  if (!/^07\d{8}$/.test(phone)) return showToast('Enter valid Kenyan phone', 'error');
  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) return showToast('PIN must be exactly 4 digits', 'error');
  if (pin !== pinConfirm) return showToast('PINs do not match', 'error');
  if (!terms) return showToast('Accept terms to continue', 'warning');

  showToast('Creating account...');
  const result = await API.registerUser({ name, phone, pin });
  if (result.success !== false) {
    const user = { name, phone };
    loginUser(user, result.token || 'demo_token');
    closeModal('registerModal');
    showToast(`Account created! Welcome, ${name.split(' ')[0]}! 🎉`);
    // Give welcome bonus
    setTimeout(() => {
      State.balance += 50;
      updateBalanceDisplay();
      showToast('🎁 Welcome bonus of KES 50 credited!');
    }, 2000);
  } else {
    showToast(result.message || 'Registration failed', 'error');
  }
}

async function handleReset() {
  const phone = document.getElementById('resetPhone').value.trim();
  if (!/^07\d{8}$/.test(phone)) return showToast('Enter valid phone', 'error');
  showToast('Reset code sent to ' + phone + ' via SMS');
  closeModal('forgotModal');
}

function loginUser(user, token) {
  State.user = user;
  State.balance = parseFloat(localStorage.getItem('bm_balance') || '500');
  localStorage.setItem('bm_token', token);
  localStorage.setItem('bm_user', JSON.stringify(user));
  updateAuthUI();
}

function handleLogout() {
  localStorage.setItem('bm_balance', State.balance.toString());
  State.user = null;
  State.betslip = [];
  localStorage.removeItem('bm_token');
  localStorage.removeItem('bm_user');
  updateAuthUI();
  updateBetslipCount();
  navigateTo('home');
  showToast('Logged out. See you soon! 👋');
  // Close dropdown and profile menu
  document.getElementById('userDropdown').classList.add('hidden');
}

function updateAuthUI() {
  const isLoggedIn = !!State.user;
  document.getElementById('guestActions').classList.toggle('hidden', isLoggedIn);
  document.getElementById('userActions').classList.toggle('hidden', !isLoggedIn);
  if (isLoggedIn) {
    updateBalanceDisplay();
    const initial = State.user.name.charAt(0).toUpperCase();
    document.getElementById('userAvatar').textContent = initial;
  }
}

function updateBalanceDisplay() {
  document.getElementById('headerBalance').textContent = State.balance.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toggleUserMenu() {
  document.getElementById('userDropdown').classList.toggle('hidden');
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.user-menu')) {
    document.getElementById('userDropdown')?.classList.add('hidden');
  }
});

// ===== PAYMENTS =====
function selectPayMethod(el, method) {
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
  el.classList.add('active');
  State.selectedPayMethod = method;
}

function setAmount(amount) {
  document.getElementById('depositAmount').value = amount;
}

async function handleDeposit() {
  if (!State.user) { closeModal('depositModal'); return openModal('loginModal'); }
  const amount = parseFloat(document.getElementById('depositAmount').value);
  const phone = document.getElementById('depositPhone').value.trim();
  if (!amount || amount < 10) return showToast('Minimum deposit is KES 10', 'error');
  if (!/^07\d{8}$/.test(phone)) return showToast('Enter valid M-PESA number', 'error');

  showToast('Sending STK Push to ' + phone + '...');
  const result = await API.mpesaDeposit(phone, amount);

  if (result.success !== false) {
    closeModal('depositModal');
    showToast(`Enter your M-PESA PIN when prompted 📱`);
    // Simulate payment confirmation after 3 seconds (demo)
    setTimeout(() => {
      State.balance += amount;
      updateBalanceDisplay();
      localStorage.setItem('bm_balance', State.balance.toString());
      addTransaction('Deposit', amount, 'credit', 'M-PESA');
      showToast(`💰 KES ${amount.toLocaleString()} deposited successfully!`);
    }, 3000);
  } else {
    showToast(result.message || 'Deposit failed', 'error');
  }
}

async function handleWithdraw() {
  if (!State.user) return openModal('loginModal');
  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  const phone = document.getElementById('withdrawPhone').value.trim();
  if (!amount || amount < 100) return showToast('Minimum withdrawal is KES 100', 'error');
  if (amount > State.balance) return showToast('Insufficient balance', 'error');
  if (!/^07\d{8}$/.test(phone)) return showToast('Enter valid phone', 'error');

  showToast('Processing withdrawal...');
  const result = await API.withdraw(phone, amount);

  if (result.success !== false) {
    State.balance -= amount;
    updateBalanceDisplay();
    localStorage.setItem('bm_balance', State.balance.toString());
    addTransaction('Withdrawal', amount, 'debit', 'M-PESA');
    closeModal('withdrawModal');
    showToast(`💸 KES ${amount.toLocaleString()} sent to ${phone}`);
  } else {
    showToast(result.message || 'Withdrawal failed', 'error');
  }
}

function addTransaction(type, amount, direction, method) {
  State.transactions.unshift({
    id: 'TX' + Date.now(),
    type,
    amount,
    direction,
    method,
    date: new Date().toLocaleDateString('en-KE'),
    time: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
  });
}

// ===== BETSLIP =====
function addToBetslip(matchId, pick, label, odd) {
  if (!State.user) { openModal('loginModal'); return; }

  // Check if match already in betslip
  const existingIdx = State.betslip.findIndex(b => b.matchId === matchId);
  if (existingIdx >= 0) {
    if (State.betslip[existingIdx].pick === pick) {
      // Remove if same pick clicked
      State.betslip.splice(existingIdx, 1);
      // Deselect button
      document.querySelectorAll(`[data-match="${matchId}"]`).forEach(b => b.classList.remove('selected'));
    } else {
      // Replace with new pick
      State.betslip[existingIdx] = { matchId, pick, label, odd };
      document.querySelectorAll(`[data-match="${matchId}"]`).forEach(b => b.classList.remove('selected'));
      event?.target?.classList.add('selected');
    }
  } else {
    if (State.betslip.length >= 20) return showToast('Max 20 selections in betslip', 'warning');
    const match = MATCHES.find(m => m.id === matchId);
    State.betslip.push({ matchId, pick, label, odd, matchName: `${match?.home} vs ${match?.away}`, league: match?.league });
    event?.target?.classList.add('selected');
  }
  updateBetslipCount();
}

function updateBetslipCount() {
  document.getElementById('betslipCount').textContent = State.betslip.length;
}

function renderBetslip() {
  const content = document.getElementById('betslipContent');
  const total = document.getElementById('betslipTotal');

  if (State.betslip.length === 0) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">🎫</div><p>No selections yet.<br>Tap odds to add to betslip.</p></div>`;
    total.innerHTML = '';
    document.getElementById('potentialWin').textContent = 'Potential Win: KES 0.00';
    return;
  }

  const totalOdds = State.betslip.reduce((acc, b) => acc * b.odd, 1);

  content.innerHTML = State.betslip.map((b, i) => `
    <div class="betslip-item">
      <div class="betslip-match">${b.league || ''} · ${b.matchName || b.matchId}</div>
      <div class="betslip-pick">
        ${b.label} <span class="betslip-odd">${b.odd.toFixed(2)}</span>
        <button class="betslip-remove" onclick="removeBetslipItem(${i})">✕</button>
      </div>
    </div>
  `).join('');

  total.innerHTML = `
    <span>Total Odds</span>
    <span>${totalOdds.toFixed(2)}</span>
  `;
  calcPotential();
}

function removeBetslipItem(index) {
  const removed = State.betslip.splice(index, 1)[0];
  // Deselect button in match card
  document.querySelectorAll(`[data-match="${removed.matchId}"]`).forEach(b => b.classList.remove('selected'));
  updateBetslipCount();
  renderBetslip();
}

function calcPotential() {
  const stake = parseFloat(document.getElementById('stakeAmount').value) || 0;
  const totalOdds = State.betslip.reduce((acc, b) => acc * b.odd, 1);
  const potential = stake * totalOdds;
  document.getElementById('potentialWin').textContent = `Potential Win: KES ${potential.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function placeBet() {
  if (!State.user) return openModal('loginModal');
  if (State.betslip.length === 0) return showToast('Add selections to betslip', 'warning');
  const stake = parseFloat(document.getElementById('stakeAmount').value);
  if (!stake || stake < 10) return showToast('Minimum stake is KES 10', 'error');
  if (stake > State.balance) return showToast('Insufficient balance. Please deposit.', 'error');

  const totalOdds = State.betslip.reduce((acc, b) => acc * b.odd, 1);
  const potential = stake * totalOdds;

  showToast('Placing bet...');
  const betData = {
    selections: State.betslip,
    stake,
    totalOdds,
    potential,
    timestamp: new Date().toISOString(),
  };

  const result = await API.placeBet(betData);
  if (result.success !== false) {
    State.balance -= stake;
    updateBalanceDisplay();
    localStorage.setItem('bm_balance', State.balance.toString());

    // Save to local bets history
    const bet = {
      id: result.betId || 'BET' + Date.now(),
      selections: [...State.betslip],
      stake,
      totalOdds,
      potential,
      status: 'pending',
      date: new Date().toLocaleDateString('en-KE'),
    };
    State.placedBets.unshift(bet);

    addTransaction('Bet Placed', stake, 'debit', 'Betting');

    // Clear betslip
    State.betslip = [];
    updateBetslipCount();
    document.querySelectorAll('.odd-btn').forEach(b => b.classList.remove('selected'));

    closeModal('betslipModal');
    showToast(`✅ Bet placed! ID: ${bet.id}`);
    showToast(`🤞 Potential win: KES ${potential.toFixed(2)}`);
  } else {
    showToast(result.message || 'Bet failed', 'error');
  }
}

// ===== RENDER MATCHES =====
function renderFeaturedMatches() {
  const container = document.getElementById('featuredMatches');
  const featured = MATCHES.filter(m => m.sport === 'football').slice(0, 6);
  container.innerHTML = featured.map(match => renderMatchCard(match)).join('');
}

function renderMatchCard(match) {
  const isLive = match.live;
  const hasDraw = match.odds.draw !== null;
  return `
    <div class="match-card">
      <div class="match-header">
        <span class="match-league">${match.league}</span>
        ${isLive ? '<span class="live-badge">LIVE</span>' : `<span class="match-time">${match.time}</span>`}
      </div>
      <div class="match-teams">
        <div class="team-row">
          <span class="team-name">${match.home}</span>
          ${isLive ? `<span class="team-score">${match.homeScore ?? ''}</span>` : ''}
        </div>
        <div class="team-row">
          <span class="team-name">${match.away}</span>
          ${isLive ? `<span class="team-score">${match.awayScore ?? ''}</span>` : ''}
        </div>
      </div>
      <div class="match-odds">
        <div class="odd-btn" data-match="${match.id}" onclick="addToBetslip('${match.id}','home','${match.home}',${match.odds.home}); this.classList.toggle('selected')">
          <span class="odd-label">1</span>
          <span class="odd-value">${match.odds.home.toFixed(2)}</span>
        </div>
        ${hasDraw ? `<div class="odd-btn" data-match="${match.id}" onclick="addToBetslip('${match.id}','draw','Draw',${match.odds.draw}); this.classList.toggle('selected')">
          <span class="odd-label">X</span>
          <span class="odd-value">${match.odds.draw.toFixed(2)}</span>
        </div>` : ''}
        <div class="odd-btn" data-match="${match.id}" onclick="addToBetslip('${match.id}','away','${match.away}',${match.odds.away}); this.classList.toggle('selected')">
          <span class="odd-label">2</span>
          <span class="odd-value">${match.odds.away.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderMatchListItem(match) {
  const isLive = match.live;
  const hasDraw = match.odds.draw !== null;
  return `
    <div class="match-list-item">
      <div class="match-list-header">
        <span>🏆 ${match.league}</span>
        ${isLive ? '<span class="live-badge">⚡ LIVE</span>' : `<span>${match.date} · ${match.time}</span>`}
      </div>
      <div class="match-list-body">
        <div class="match-list-teams">
          <div class="match-list-team">
            <span>${match.home}</span>
            ${isLive ? `<span class="match-list-score">${match.homeScore}</span>` : ''}
          </div>
          <div class="match-list-team">
            <span>${match.away}</span>
            ${isLive ? `<span class="match-list-score">${match.awayScore ?? '-'}</span>` : ''}
          </div>
        </div>
        <div class="match-list-odds">
          <div class="odd-btn" data-match="${match.id}" onclick="addToBetslip('${match.id}','home','${match.home}',${match.odds.home}); this.classList.toggle('selected')">
            <span class="odd-label">1</span>
            <span class="odd-value">${match.odds.home.toFixed(2)}</span>
          </div>
          ${hasDraw ? `<div class="odd-btn" data-match="${match.id}" onclick="addToBetslip('${match.id}','draw','Draw',${match.odds.draw}); this.classList.toggle('selected')">
            <span class="odd-label">X</span>
            <span class="odd-value">${match.odds.draw.toFixed(2)}</span>
          </div>` : ''}
          <div class="odd-btn" data-match="${match.id}" onclick="addToBetslip('${match.id}','away','${match.away}',${match.odds.away}); this.classList.toggle('selected')">
            <span class="odd-label">2</span>
            <span class="odd-value">${match.odds.away.toFixed(2)}</span>
          </div>
          <span style="margin-left:auto;font-size:12px;color:var(--text3)">+${Math.floor(Math.random()*50+10)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderAllMatches() {
  const container = document.getElementById('matchesList');
  const matches = State.currentFilter === 'live'
    ? MATCHES.filter(m => m.live)
    : State.currentFilter === 'prematch'
    ? MATCHES.filter(m => !m.live)
    : MATCHES;
  const filtered = State.currentSport === 'all' ? matches : matches.filter(m => m.sport === State.currentSport);
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚽</div><p>No matches found</p></div>`;
    return;
  }
  container.innerHTML = filtered.map(m => renderMatchListItem(m)).join('');
}

function renderLiveMatches() {
  const live = MATCHES.filter(m => m.live);
  document.getElementById('liveCount').textContent = live.length;
  const container = document.getElementById('liveMatches');
  if (live.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔴</div><p>No live events right now.<br>Check back soon!</p></div>`;
    return;
  }
  container.innerHTML = live.map(m => renderMatchListItem(m)).join('');
}

function renderSportsMatches() {
  const container = document.getElementById('sportsMatches');
  container.innerHTML = MATCHES.map(m => renderMatchListItem(m)).join('');
}

function renderLeagues() {
  const container = document.getElementById('leaguesList');
  container.innerHTML = LEAGUES.map(l => `
    <div class="league-item" onclick="filterSport('${l.id}')">
      <div class="league-left">
        <span class="league-icon">${l.icon}</span>
        <div>
          <div class="league-name">${l.name}</div>
          <div class="league-country">${l.country}</div>
        </div>
      </div>
      <span class="league-count">${l.count}</span>
    </div>
  `).join('');
}

function filterSport(sport) {
  State.currentSport = sport;
  document.querySelectorAll('.sport-tab').forEach(t => t.classList.remove('active'));
  event?.target?.classList.add('active');
  renderAllMatches();
}

function filterMatches(filter, btn) {
  State.currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAllMatches();
}

// ===== RENDER CASINO =====
function renderCasino(filter = 'all') {
  const container = document.getElementById('casinoGrid');
  const games = filter === 'all' ? CASINO_GAMES : CASINO_GAMES.filter(g => g.category === filter);
  container.innerHTML = games.map(g => `
    <div class="casino-card" onclick="launchCasino('${g.id}','${g.title}')">
      <div class="casino-thumb">${g.icon}</div>
      <div class="casino-info">
        <div class="casino-title">${g.title}</div>
        <div class="casino-provider">${g.provider}</div>
        ${g.badge ? `<div class="casino-badge">${g.badge}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function filterCasino(filter, btn) {
  State.casinoFilter = filter;
  document.querySelectorAll('.casino-cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCasino(filter);
}

function launchCasino(id, name) {
  if (!State.user) { openModal('loginModal'); return; }
  showToast(`🎮 Launching ${name}...`);
}

// ===== RENDER VIRTUAL =====
function renderVirtual() {
  const container = document.getElementById('virtualGrid');
  container.innerHTML = VIRTUAL_SPORTS.map(v => `
    <div class="virtual-card" onclick="launchVirtual('${v.name}')">
      <div class="virtual-icon">${v.icon}</div>
      <div class="virtual-name">${v.name}</div>
      <div class="virtual-timer">⏱ ${v.timer}</div>
      <div class="virtual-status">${v.status}</div>
    </div>
  `).join('');

  // Auto-update timers
  setInterval(() => updateVirtualTimers(), 1000);
}

function updateVirtualTimers() {
  const timers = document.querySelectorAll('.virtual-timer');
  timers.forEach(t => {
    const parts = t.textContent.replace('⏱ ', '').split(':');
    let min = parseInt(parts[0]), sec = parseInt(parts[1]);
    if (sec > 0) sec--;
    else if (min > 0) { min--; sec = 59; }
    else { min = 5; sec = 0; }
    t.textContent = `⏱ ${min}:${sec.toString().padStart(2,'0')}`;
  });
}

function launchVirtual(name) {
  if (!State.user) { openModal('loginModal'); return; }
  showToast(`🎮 Launching ${name}...`);
}

// ===== RENDER JACKPOT =====
function renderJackpot() {
  const container = document.getElementById('jackpotMatches');
  const matches = JACKPOT_MATCHES.slice(0, 17);
  container.innerHTML = matches.map((m, i) => `
    <div class="jp-match">
      <div class="jp-match-num">Match ${i+1}: ${m.league}</div>
      <div class="match-list-teams" style="margin-bottom:8px">
        <div class="match-list-team"><span>${m.home}</span></div>
        <div class="match-list-team"><span>${m.away}</span></div>
      </div>
      <div class="jp-picks">
        <div class="jp-pick ${State.jackpotPicks[m.id]==='home'?'selected':''}" onclick="pickJackpot('${m.id}','home',this)">
          <div class="jp-pick-label">Home</div>
          <div class="jp-pick-val">${m.odds.home.toFixed(2)}</div>
        </div>
        ${m.odds.draw ? `<div class="jp-pick ${State.jackpotPicks[m.id]==='draw'?'selected':''}" onclick="pickJackpot('${m.id}','draw',this)">
          <div class="jp-pick-label">Draw</div>
          <div class="jp-pick-val">${m.odds.draw.toFixed(2)}</div>
        </div>` : ''}
        <div class="jp-pick ${State.jackpotPicks[m.id]==='away'?'selected':''}" onclick="pickJackpot('${m.id}','away',this)">
          <div class="jp-pick-label">Away</div>
          <div class="jp-pick-val">${m.odds.away.toFixed(2)}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function pickJackpot(matchId, pick, el) {
  State.jackpotPicks[matchId] = pick;
  el.closest('.jp-picks').querySelectorAll('.jp-pick').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');

  const total = Object.keys(State.jackpotPicks).length;
  const slipArea = document.getElementById('jpSlipArea');
  if (total >= 17) {
    slipArea.style.display = 'block';
  }
  showToast(`${total}/17 picks made`);
}

function submitJackpot() {
  if (!State.user) return openModal('loginModal');
  const picks = Object.keys(State.jackpotPicks).length;
  if (picks < 17) return showToast(`${picks}/17 picks. Select all 17 matches.`, 'warning');
  if (State.balance < 99) return showToast('Need KES 99 for jackpot entry', 'error');

  State.balance -= 99;
  updateBalanceDisplay();
  showToast('🎯 Jackpot entry submitted! Good luck!');
  State.jackpotPicks = {};
  renderJackpot();
  document.getElementById('jpSlipArea').style.display = 'none';
}

// ===== JACKPOT TIMER =====
function updateJackpotTimer() {
  const el = document.getElementById('jpTimer');
  if (!el) return;
  let [h, m, s] = el.textContent.split(':').map(Number);
  if (s > 0) s--;
  else if (m > 0) { m--; s = 59; }
  else if (h > 0) { h--; m = 59; s = 59; }
  el.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
setInterval(updateJackpotTimer, 1000);

// ===== MY BETS =====
function renderMyBets(filter = 'all') {
  const container = document.getElementById('myBetsList');
  if (!State.user) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔐</div><p>Login to see your bets</p></div>`;
    return;
  }
  const bets = filter === 'all' ? State.placedBets : State.placedBets.filter(b => b.status === filter);

  if (bets.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🎫</div><p>No ${filter === 'all' ? '' : filter} bets yet</p></div>`;
    return;
  }

  container.innerHTML = bets.map(b => `
    <div class="bet-item">
      <div class="bet-item-header">
        <span class="bet-id">ID: ${b.id}</span>
        <span class="bet-status status-${b.status}">${b.status.toUpperCase()}</span>
      </div>
      <div class="bet-item-body">
        ${b.selections.map(s => `
          <div class="bet-leg">
            <span>${s.matchName || s.matchId}</span>
            <span style="color:var(--yellow);font-weight:700">${s.label} @ ${s.odd.toFixed(2)}</span>
          </div>
        `).join('')}
        <div class="bet-foot">
          <span class="bet-stake">Stake: KES ${b.stake.toFixed(2)} · Odds: ${b.totalOdds.toFixed(2)}</span>
          <span class="bet-potential">KES ${b.potential.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function filterBets(filter, btn) {
  document.querySelectorAll('.bet-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMyBets(filter);
}

// ===== TRANSACTIONS =====
function renderTransactions() {
  const container = document.getElementById('transactionsList');
  if (!State.user) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔐</div><p>Login to see transactions</p></div>`;
    return;
  }
  if (State.transactions.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>No transactions yet</p></div>`;
    return;
  }
  container.innerHTML = State.transactions.map(tx => `
    <div class="transaction-item">
      <div class="tx-left">
        <span class="tx-icon">${tx.direction === 'credit' ? '💰' : '💸'}</span>
        <div>
          <div class="tx-type">${tx.type}</div>
          <div class="tx-date">${tx.date} · ${tx.time} · ${tx.method}</div>
        </div>
      </div>
      <div class="tx-amount tx-${tx.direction}">
        ${tx.direction === 'credit' ? '+' : '-'} KES ${tx.amount.toLocaleString()}
      </div>
    </div>
  `).join('');
}

// ===== PROFILE =====
function renderProfile() {
  if (!State.user) return;
  document.getElementById('profileName').textContent = State.user.name;
  document.getElementById('profilePhone').textContent = State.user.phone;
  document.getElementById('profileAvatar').textContent = State.user.name.charAt(0).toUpperCase();
  document.getElementById('statBets').textContent = State.placedBets.length;
  document.getElementById('statWon').textContent = State.placedBets.filter(b => b.status === 'won').length;
  const earned = State.placedBets.filter(b => b.status === 'won').reduce((acc, b) => acc + b.potential, 0);
  document.getElementById('statEarned').textContent = earned.toFixed(0);
}

// ===== PROMOTIONS =====
function renderPromotions() {
  const container = document.getElementById('promosGrid');
  container.innerHTML = PROMOTIONS.map(p => `
    <div class="promo-big-card">
      <div class="promo-big-thumb" style="background:${p.bg}">${p.icon}</div>
      <div class="promo-big-body">
        <div class="promo-big-title">${p.title}</div>
        <div class="promo-big-desc">${p.desc}</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:10px">Valid: ${p.expiry}</div>
        <button class="btn-primary" onclick="claimPromo('${p.id}')">CLAIM OFFER</button>
      </div>
    </div>
  `).join('');
}

function claimPromo(id) {
  if (!State.user) return openModal('loginModal');
  showToast('🎁 Offer claimed! Check your account.');
}

// ===== RESPONSIBLE GAMING =====
function selfExclude() {
  const period = document.getElementById('exclusionPeriod').value;
  const labels = { '1': '1 day', '7': '1 week', '30': '1 month', '365': '1 year' };
  showToast(`🛡 Self-exclusion of ${labels[period]} applied`);
}

function setDepositLimit() {
  const limit = document.getElementById('depositLimit').value;
  if (!limit || limit < 10) return showToast('Enter a valid limit', 'error');
  showToast(`💰 Daily deposit limit set to KES ${parseFloat(limit).toLocaleString()}`);
}

// ===== SUPPORT =====
function openLiveChat() {
  showToast('💬 Live chat connecting...');
}

function toggleFaq(el) {
  el.classList.toggle('open');
  el.nextElementSibling.classList.toggle('open');
}

// ===== HERO SLIDER =====
function goToSlide(index) {
  State.slideIndex = index;
  const slides = document.getElementById('heroSlides');
  if (slides) slides.style.transform = `translateX(-${index * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
}

function autoSlide() {
  State.slideIndex = (State.slideIndex + 1) % 3;
  goToSlide(State.slideIndex);
}
setInterval(autoSlide, 4000);

// ===== LIVE TICKER =====
function initTicker() {
  const liveMatches = MATCHES.filter(m => m.live);
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const items = liveMatches.map(m =>
    `<span class="ticker-item">${m.home} <span class="ticker-score">${m.homeScore}</span> - <span class="ticker-score">${m.awayScore ?? '-'}</span> ${m.away} (${m.league})</span>`
  ).join('');
  track.innerHTML = items + items; // duplicate for infinite scroll
}

// ===== ODDS AUTO-REFRESH =====
function refreshOdds() {
  // Slightly fluctuate odds every 30 seconds to simulate live data
  MATCHES.forEach(m => {
    if (m.live) {
      m.odds.home = Math.max(1.01, m.odds.home + (Math.random() - 0.5) * 0.2);
      m.odds.away = Math.max(1.01, m.odds.away + (Math.random() - 0.5) * 0.2);
      if (m.odds.draw) m.odds.draw = Math.max(1.01, m.odds.draw + (Math.random() - 0.5) * 0.15);
      m.odds.home = parseFloat(m.odds.home.toFixed(2));
      m.odds.away = parseFloat(m.odds.away.toFixed(2));
      if (m.odds.draw) m.odds.draw = parseFloat(m.odds.draw.toFixed(2));
    }
  });
  if (State.currentPage === 'home') renderAllMatches();
  if (State.currentPage === 'live') renderLiveMatches();
}
setInterval(refreshOdds, 30000);

// ===== RESTORE SESSION =====
function restoreSession() {
  const savedUser = localStorage.getItem('bm_user');
  const savedToken = localStorage.getItem('bm_token');
  if (savedUser && savedToken) {
    State.user = JSON.parse(savedUser);
    State.balance = parseFloat(localStorage.getItem('bm_balance') || '0');
    updateAuthUI();
  }
}

// ===== INIT =====
function init() {
  restoreSession();
  renderFeaturedMatches();
  renderAllMatches();
  renderLeagues();
  initTicker();
}

document.addEventListener('DOMContentLoaded', init);
