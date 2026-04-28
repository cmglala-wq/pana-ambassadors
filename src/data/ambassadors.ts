export type Country = 'DO' | 'MX' | 'GT' | 'CO' | 'HN' | 'SV' | 'US';
export type Track = 'Embajador' | 'Influencer' | 'Corporativo';

export type ContractStatus = 'signed' | 'pending_signature' | 'pending_review' | 'expired';

export interface ContractRecord {
  id: string;             // CT-YYYY-XXX
  status: ContractStatus;
  sentAt: string;         // ISO
  signedAt?: string;      // ISO
  ip?: string;            // signature IP
  fileUrl: string;        // path or URL to the signed contract
}

export interface Ambassador {
  id: string;
  name: string;
  email: string;
  country: Country;
  track: Track;
  photo: string;
  joinedAt: string;        // ISO
  installs: number;        // Adjust app installs from this ambassador's link
  approved: number;        // accounts opened + activated
  installs30d: number;
  approved30d: number;
  commission: number;      // approved * $10
  streak: number;          // days
  xp: number;
  badges: string[];        // badge ids unlocked
  rank?: number;           // computed
  adjustLink: string;      // unique attribution link
  contract: ContractRecord;
}

export interface Payment {
  id: string;
  ambassadorId: string;
  month: string;            // YYYY-MM
  amount: number;
  status: 'paid' | 'pending' | 'scheduled';
  paidAt?: string;
  approvedAccounts: number;
}

const COUNTRY_NAME: Record<Country, string> = {
  DO: 'República Dominicana', MX: 'México', GT: 'Guatemala',
  CO: 'Colombia', HN: 'Honduras', SV: 'El Salvador', US: 'Estados Unidos'
};
const COUNTRY_FLAG: Record<Country, string> = { DO: '🇩🇴', MX: '🇲🇽', GT: '🇬🇹', CO: '🇨🇴', HN: '🇭🇳', SV: '🇸🇻', US: '🇺🇸' };

export const countryName = (c: Country) => COUNTRY_NAME[c];
export const countryFlag = (c: Country) => COUNTRY_FLAG[c];

const photoF = (n: number) => `https://randomuser.me/api/portraits/women/${n}.jpg`;
const photoM = (n: number) => `https://randomuser.me/api/portraits/men/${n}.jpg`;

function adjustToken(seed: string): string {
  // Deterministic 5-char token from seed
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  let token = '';
  for (let i = 0; i < 5; i++) { token += chars[h % chars.length]; h = Math.floor(h / chars.length) + (h * 7); h >>>= 0; }
  return token;
}

function buildContract(id: string, joinedAt: string): ContractRecord {
  const join = new Date(joinedAt);
  const now = new Date('2026-04-28');
  const daysSinceJoin = (now.getTime() - join.getTime()) / 86400000;
  const ctId = `CT-${joinedAt.slice(0, 4)}-${id.slice(1)}`;
  if (daysSinceJoin < 14) {
    return { id: ctId, status: 'pending_signature', sentAt: new Date(join.getTime() + 86400000).toISOString().slice(0, 10), fileUrl: '/acuerdo-embajadores.pdf' };
  }
  // signed within 1-3 days of join
  const signedDate = new Date(join.getTime() + (1 + Math.floor((parseInt(id.slice(1)) % 3))) * 86400000);
  const ip = ['190.', '186.', '189.', '170.'][parseInt(id.slice(1)) % 4] + (parseInt(id.slice(1)) * 7 % 250) + '.' + (parseInt(id.slice(1)) * 11 % 250) + '.' + (parseInt(id.slice(1)) * 13 % 250);
  return {
    id: ctId,
    status: 'signed',
    sentAt: new Date(join.getTime() + 86400000).toISOString().slice(0, 10),
    signedAt: signedDate.toISOString().slice(0, 10),
    ip,
    fileUrl: '/acuerdo-embajadores.pdf'
  };
}

export const AMBASSADORS_RAW: Omit<Ambassador, 'rank' | 'adjustLink' | 'contract'>[] = [
  { id: 'A001', name: 'Sofía Ramírez',     email: 'sofia.r@example.com',    country: 'DO', track: 'Influencer', photo: photoF(48), joinedAt: '2025-08-12', installs: 312, approved: 168, installs30d: 64, approved30d: 32, commission: 1680, streak: 23, xp: 3420, badges: ['genesis','rising','streak7','decimator','half','centurion','top10','top3','highroller','marathon','influencer','cross'] },
  { id: 'A002', name: 'Diego Castro',      email: 'diego.c@example.com',    country: 'MX', track: 'Influencer', photo: photoM(33), joinedAt: '2025-07-04', installs: 410, approved: 224, installs30d: 88, approved30d: 41, commission: 2240, streak: 31, xp: 4280, badges: ['genesis','rising','streak7','decimator','half','centurion','top10','top3','highroller','marathon','influencer','lightning'] },
  { id: 'A003', name: 'Camila Álvarez',    email: 'camila.a@example.com',   country: 'CO', track: 'Embajador',  photo: photoF(12), joinedAt: '2025-09-02', installs: 256, approved: 142, installs30d: 51, approved30d: 28, commission: 1420, streak: 14, xp: 2980, badges: ['genesis','rising','streak7','decimator','half','centurion','top10','highroller','marathon'] },
  { id: 'A004', name: 'Ricardo Mendoza',   email: 'ricardo.m@example.com',  country: 'HN', track: 'Embajador',  photo: photoM(18), joinedAt: '2025-10-15', installs: 184, approved: 96, installs30d: 42, approved30d: 22, commission: 960, streak: 9, xp: 1740, badges: ['genesis','rising','streak7','decimator','half','top10','marathon'] },
  { id: 'A005', name: 'Valentina Torres',  email: 'val.torres@example.com', country: 'GT', track: 'Influencer', photo: photoF(22), joinedAt: '2025-06-08', installs: 521, approved: 279, installs30d: 102, approved30d: 54, commission: 2790, streak: 47, xp: 5320, badges: ['genesis','rising','streak7','decimator','half','centurion','top10','top3','numero1','highroller','marathon','influencer','lightning','cross'] },
  { id: 'A006', name: 'Andrés Pacheco',    email: 'andres.p@example.com',   country: 'DO', track: 'Embajador',  photo: photoM(27), joinedAt: '2025-11-20', installs: 142, approved: 78, installs30d: 38, approved30d: 19, commission: 780, streak: 12, xp: 1280, badges: ['genesis','rising','streak7','decimator','half','marathon'] },
  { id: 'A007', name: 'Isabella Núñez',    email: 'isabella.n@example.com', country: 'MX', track: 'Embajador',  photo: photoF(35), joinedAt: '2025-09-28', installs: 198, approved: 109, installs30d: 44, approved30d: 24, commission: 1090, streak: 16, xp: 1980, badges: ['genesis','rising','streak7','decimator','half','centurion','marathon','highroller'] },
  { id: 'A008', name: 'Mateo Rojas',       email: 'mateo.r@example.com',    country: 'CO', track: 'Influencer', photo: photoM(41), joinedAt: '2025-08-22', installs: 287, approved: 152, installs30d: 56, approved30d: 31, commission: 1520, streak: 21, xp: 2580, badges: ['genesis','rising','streak7','decimator','half','centurion','top10','highroller','marathon','influencer'] },
  { id: 'A009', name: 'Lucía Fernández',   email: 'lucia.f@example.com',    country: 'SV', track: 'Embajador',  photo: photoF(51), joinedAt: '2026-01-09', installs: 86, approved: 41, installs30d: 28, approved30d: 14, commission: 410, streak: 7, xp: 720, badges: ['genesis','rising','streak7','decimator'] },
  { id: 'A010', name: 'Samuel Cruz',       email: 'samuel.c@example.com',   country: 'DO', track: 'Embajador',  photo: photoM(56), joinedAt: '2025-12-04', installs: 121, approved: 67, installs30d: 31, approved30d: 17, commission: 670, streak: 11, xp: 1080, badges: ['genesis','rising','streak7','decimator','half','marathon'] },
  { id: 'A011', name: 'Gabriela Ortiz',    email: 'gabi.o@example.com',     country: 'MX', track: 'Influencer', photo: photoF(67), joinedAt: '2025-10-01', installs: 234, approved: 128, installs30d: 47, approved30d: 26, commission: 1280, streak: 19, xp: 2240, badges: ['genesis','rising','streak7','decimator','half','centurion','top10','highroller','marathon','influencer'] },
  { id: 'A012', name: 'Joaquín Morales',   email: 'joaquin.m@example.com',  country: 'GT', track: 'Embajador',  photo: photoM(64), joinedAt: '2025-11-12', installs: 154, approved: 82, installs30d: 36, approved30d: 18, commission: 820, streak: 8, xp: 1380, badges: ['genesis','rising','streak7','decimator','half','marathon'] },
  { id: 'A013', name: 'Renata Vega',       email: 'renata.v@example.com',   country: 'CO', track: 'Embajador',  photo: photoF(78), joinedAt: '2026-02-14', installs: 64, approved: 28, installs30d: 22, approved30d: 11, commission: 280, streak: 5, xp: 480, badges: ['genesis','rising','streak7','decimator'] },
  { id: 'A014', name: 'Emilio Soto',       email: 'emilio.s@example.com',   country: 'HN', track: 'Embajador',  photo: photoM(72), joinedAt: '2026-01-26', installs: 71, approved: 32, installs30d: 24, approved30d: 12, commission: 320, streak: 6, xp: 540, badges: ['genesis','rising','streak7','decimator'] },
  { id: 'A015', name: 'Daniela Herrera',   email: 'dani.h@example.com',     country: 'DO', track: 'Influencer', photo: photoF(81), joinedAt: '2025-07-18', installs: 367, approved: 198, installs30d: 71, approved30d: 38, commission: 1980, streak: 28, xp: 3680, badges: ['genesis','rising','streak7','decimator','half','centurion','top10','top3','highroller','marathon','influencer','cross','lightning'] },
  { id: 'A016', name: 'Tomás Aguilar',     email: 'tomas.a@example.com',    country: 'MX', track: 'Embajador',  photo: photoM(85), joinedAt: '2025-12-22', installs: 98, approved: 51, installs30d: 27, approved30d: 14, commission: 510, streak: 9, xp: 880, badges: ['genesis','rising','streak7','decimator','half'] },
  { id: 'A017', name: 'Natalia Espinoza',  email: 'nat.e@example.com',      country: 'CO', track: 'Embajador',  photo: photoF(89), joinedAt: '2025-10-30', installs: 167, approved: 91, installs30d: 39, approved30d: 21, commission: 910, streak: 15, xp: 1620, badges: ['genesis','rising','streak7','decimator','half','marathon','highroller'] },
  { id: 'A018', name: 'Sebastián Pérez',   email: 'seba.p@example.com',     country: 'SV', track: 'Embajador',  photo: photoM(94), joinedAt: '2025-12-11', installs: 104, approved: 56, installs30d: 29, approved30d: 15, commission: 560, streak: 10, xp: 940, badges: ['genesis','rising','streak7','decimator','half','marathon'] },
  { id: 'A019', name: 'Mariana Quiroga',   email: 'mariana.q@example.com',  country: 'DO', track: 'Embajador',  photo: photoF(92), joinedAt: '2026-02-02', installs: 78, approved: 36, installs30d: 26, approved30d: 13, commission: 360, streak: 6, xp: 620, badges: ['genesis','rising','streak7','decimator'] },
  { id: 'A020', name: 'Alejandro Ríos',    email: 'ale.rios@example.com',   country: 'MX', track: 'Influencer', photo: photoM(45), joinedAt: '2025-09-15', installs: 213, approved: 117, installs30d: 45, approved30d: 25, commission: 1170, streak: 18, xp: 2120, badges: ['genesis','rising','streak7','decimator','half','centurion','top10','highroller','marathon','influencer'] },
  { id: 'A021', name: 'Antonia Méndez',    email: 'antonia.m@example.com',  country: 'GT', track: 'Embajador',  photo: photoF(1),  joinedAt: '2026-01-18', installs: 92, approved: 47, installs30d: 31, approved30d: 16, commission: 470, streak: 8, xp: 820, badges: ['genesis','rising','streak7','decimator'] },
  { id: 'A022', name: 'Felipe Cordero',    email: 'felipe.c@example.com',   country: 'HN', track: 'Embajador',  photo: photoM(4),  joinedAt: '2026-02-09', installs: 58, approved: 26, installs30d: 21, approved30d: 11, commission: 260, streak: 4, xp: 420, badges: ['genesis','rising','streak7','decimator'] },
  { id: 'A023', name: 'Carolina Sánchez',  email: 'caro.s@example.com',     country: 'DO', track: 'Corporativo', photo: photoF(8), joinedAt: '2025-11-05', installs: 142, approved: 88, installs30d: 35, approved30d: 19, commission: 880, streak: 13, xp: 1480, badges: ['genesis','rising','streak7','decimator','half','marathon','corp'] },
  { id: 'A024', name: 'Nicolás Díaz',      email: 'nico.d@example.com',     country: 'MX', track: 'Embajador',  photo: photoM(15), joinedAt: '2026-03-02', installs: 41, approved: 18, installs30d: 18, approved30d: 8, commission: 180, streak: 3, xp: 280, badges: ['genesis','rising','streak7'] }
];

export const AMBASSADORS: Ambassador[] = [...AMBASSADORS_RAW]
  .sort((a, b) => b.commission - a.commission)
  .map((a, i) => ({
    ...a,
    rank: i + 1,
    adjustLink: `https://pana.go.link/${adjustToken(a.id)}`,
    contract: buildContract(a.id, a.joinedAt)
  }));

// === Payment derivation: 6-month payment history per ambassador ===
function priorMonth(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 - n, 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

export function getPayments(amb: Ambassador): Payment[] {
  const months = Array.from({ length: 6 }, (_, i) => priorMonth('2026-04', 5 - i));
  // Distribute commission with declining magnitude into past + current
  const totalApprovedRecent = Math.max(amb.approved30d, 1);
  const baseAvg = Math.max(amb.commission / 6, totalApprovedRecent * 10);
  const out: Payment[] = [];
  months.forEach((m, i) => {
    const isCurrent = m === '2026-04';
    const isFuture = false;
    // Variance: 0.7..1.3 deterministic from id
    const seed = parseInt(amb.id.slice(1)) + i * 7;
    const variance = 0.7 + ((seed * 13) % 60) / 100;
    const accounts = Math.max(0, Math.round(totalApprovedRecent * variance * (0.5 + i * 0.1)));
    const amount = accounts * 10;
    out.push({
      id: `PAY-${m}-${amb.id}`,
      ambassadorId: amb.id,
      month: m,
      amount,
      status: isCurrent ? 'pending' : isFuture ? 'scheduled' : 'paid',
      paidAt: isCurrent ? undefined : `${m}-05`,
      approvedAccounts: accounts
    });
  });
  return out;
}

export const ALL_PAYMENTS: Payment[] = AMBASSADORS.flatMap(getPayments);

export const PAYMENTS_BY_MONTH = (() => {
  const map = new Map<string, { month: string; amount: number; count: number; paid: number; pending: number }>();
  ALL_PAYMENTS.forEach(p => {
    const cur = map.get(p.month) || { month: p.month, amount: 0, count: 0, paid: 0, pending: 0 };
    cur.amount += p.amount;
    cur.count += 1;
    if (p.status === 'paid') cur.paid += p.amount;
    if (p.status === 'pending') cur.pending += p.amount;
    map.set(p.month, cur);
  });
  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
})();

export const TOTALS = {
  ambassadors: AMBASSADORS.length,
  installs: AMBASSADORS.reduce((s, a) => s + a.installs, 0),
  approved: AMBASSADORS.reduce((s, a) => s + a.approved, 0),
  commission: AMBASSADORS.reduce((s, a) => s + a.commission, 0),
  installs30d: AMBASSADORS.reduce((s, a) => s + a.installs30d, 0),
  approved30d: AMBASSADORS.reduce((s, a) => s + a.approved30d, 0)
};

export const COUNTRY_BREAKDOWN = (['DO','MX','CO','GT','HN','SV','US'] as Country[]).map(c => {
  const list = AMBASSADORS.filter(a => a.country === c);
  return {
    country: c,
    name: COUNTRY_NAME[c],
    flag: COUNTRY_FLAG[c],
    ambassadors: list.length,
    installs: list.reduce((s, a) => s + a.installs, 0),
    approved: list.reduce((s, a) => s + a.approved, 0),
    commission: list.reduce((s, a) => s + a.commission, 0)
  };
}).filter(c => c.ambassadors > 0).sort((a,b) => b.commission - a.commission);

// Mock monthly growth — last 8 months
export const MONTHLY_GROWTH = [
  { month: '2025-09', installs: 480, approved: 254, commission: 2540 },
  { month: '2025-10', installs: 612, approved: 332, commission: 3320 },
  { month: '2025-11', installs: 740, approved: 401, commission: 4010 },
  { month: '2025-12', installs: 868, approved: 472, commission: 4720 },
  { month: '2026-01', installs: 992, approved: 538, commission: 5380 },
  { month: '2026-02', installs: 1142, approved: 628, commission: 6280 },
  { month: '2026-03', installs: 1284, approved: 705, commission: 7050 },
  { month: '2026-04', installs: 1108, approved: 605, commission: 6050 }
];

// Activity feed (gamified events) — used in dashboard
export const RECENT_EVENTS = [
  { ts: '2026-04-28T09:14:00Z', type: 'unlock', text: 'desbloqueó Marathon', who: 'Sofía Ramírez', photo: photoF(48) },
  { ts: '2026-04-28T08:42:00Z', type: 'milestone', text: 'llegó a 50 cuentas', who: 'Andrés Pacheco', photo: photoM(27) },
  { ts: '2026-04-27T20:11:00Z', type: 'rank', text: 'subió al Top 3', who: 'Daniela Herrera', photo: photoF(81) },
  { ts: '2026-04-27T16:55:00Z', type: 'unlock', text: 'desbloqueó Lightning', who: 'Camila Álvarez', photo: photoF(12) },
  { ts: '2026-04-27T11:08:00Z', type: 'milestone', text: 'cobró $1,000 USD', who: 'Diego Castro', photo: photoM(33) }
];
