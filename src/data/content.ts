// Mock content submissions — videos / posts created by ambassadors
// under the Embajador + Influencer track. Replace with backend (D1/KV)
// when tech defines the storage + approval workflow.

export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter';
export type ContentStatus = 'pending_review' | 'approved' | 'rejected' | 'paid';

export interface ContentSubmission {
  id: string;
  ambassadorId: string;
  ambassadorName: string;
  ambassadorPhoto: string;
  platform: Platform;
  url: string;
  thumbnail: string;
  title: string;
  caption: string;
  submittedAt: string; // ISO
  status: ContentStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  payoutUsd?: number;
  paidAt?: string;
  views?: number;
  likes?: number;
}

export const PLATFORM_META: Record<Platform, { label: string; color: string; bg: string; icon: string }> = {
  tiktok:    { label: 'TikTok',    color: '#fff',     bg: '#000000', icon: 'tiktok' },
  instagram: { label: 'Instagram', color: '#fff',     bg: 'linear-gradient(135deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)', icon: 'instagram' },
  youtube:   { label: 'YouTube',   color: '#fff',     bg: '#FF0000', icon: 'youtube' },
  twitter:   { label: 'X',         color: '#fff',     bg: '#000000', icon: 'twitter' }
};

export const STATUS_META: Record<ContentStatus, { label: string; color: string; bg: string; ring: string }> = {
  pending_review: { label: 'En revisión', color: 'text-amber-300',  bg: 'bg-amber-300/10',     ring: 'border-amber-300/30' },
  approved:       { label: 'Aprobado',    color: 'text-pana-lime',  bg: 'bg-pana-lime/10',     ring: 'border-pana-lime/30' },
  rejected:       { label: 'Rechazado',   color: 'text-red-400',    bg: 'bg-red-400/10',       ring: 'border-red-400/30' },
  paid:           { label: 'Pagado',      color: 'text-fuchsia-300',bg: 'bg-fuchsia-500/10',   ring: 'border-fuchsia-500/40' }
};

const photoF = (n: number) => `https://randomuser.me/api/portraits/women/${n}.jpg`;
const photoM = (n: number) => `https://randomuser.me/api/portraits/men/${n}.jpg`;

// Seed-based thumbnails for content (Picsum — stable, no external API key needed)
const thumb = (seed: string) => `https://picsum.photos/seed/${seed}/640/800`;

export const CONTENT_SUBMISSIONS: ContentSubmission[] = [
  {
    id: 'C-2026-001',
    ambassadorId: 'AMB-clippers-flow',
    ambassadorName: 'Clippers Flow',
    ambassadorPhoto: photoM(33),
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@clippersflow/video/7234567890',
    thumbnail: thumb('clippers-1'),
    title: '¿Cómo recibo pagos en USD sin tener cuenta gringa?',
    caption: 'Le mostré a mi audiencia cómo abrí mi cuenta US con Pana en 5 minutos. Con link en bio.',
    submittedAt: '2026-05-04T14:22:00Z',
    status: 'approved',
    reviewedAt: '2026-05-05T10:15:00Z',
    reviewedBy: 'marketing@getpana.app',
    payoutUsd: 250,
    views: 42800,
    likes: 3120
  },
  {
    id: 'C-2026-002',
    ambassadorId: 'AMB-alex-trujillo',
    ambassadorName: 'Alex Trujillo',
    ambassadorPhoto: photoM(45),
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/Cxyz123/',
    thumbnail: thumb('alex-1'),
    title: 'Mi setup financiero como freelancer LATAM',
    caption: 'Tres apps que no pueden faltar si recibes pagos del exterior. Pana es la #1 por la cuenta US gratis.',
    submittedAt: '2026-05-02T09:11:00Z',
    status: 'paid',
    reviewedAt: '2026-05-03T11:30:00Z',
    reviewedBy: 'marketing@getpana.app',
    payoutUsd: 200,
    paidAt: '2026-05-06T08:00:00Z',
    views: 28400,
    likes: 1850
  },
  {
    id: 'C-2026-003',
    ambassadorId: 'AMB-gustavo-duran',
    ambassadorName: 'Gustavo Duran',
    ambassadorPhoto: photoM(56),
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=abc123',
    thumbnail: thumb('gustavo-1'),
    title: 'Pana review honesto: 30 días usándola como mi cuenta principal',
    caption: 'Mi experiencia real con Pana en R. Dominicana. Lo bueno, lo regular y lo que mejorarían.',
    submittedAt: '2026-05-06T16:45:00Z',
    status: 'pending_review',
    views: 0,
    likes: 0
  },
  {
    id: 'C-2026-004',
    ambassadorId: 'AMB-anonymous-trader',
    ambassadorName: 'Anonymous Trader',
    ambassadorPhoto: photoM(72),
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@anonymoustrader/video/7234567891',
    thumbnail: thumb('anon-1'),
    title: '3 errores al recibir pagos del exterior',
    caption: 'Costos escondidos que tu banco te cobra y no te dice. Solución al final.',
    submittedAt: '2026-05-05T20:30:00Z',
    status: 'approved',
    reviewedAt: '2026-05-06T09:00:00Z',
    reviewedBy: 'marketing@getpana.app',
    payoutUsd: 180,
    views: 18200,
    likes: 945
  },
  {
    id: 'C-2026-005',
    ambassadorId: 'AMB-clippers-flow',
    ambassadorName: 'Clippers Flow',
    ambassadorPhoto: photoM(33),
    platform: 'instagram',
    url: 'https://www.instagram.com/p/Cabc456/',
    thumbnail: thumb('clippers-2'),
    title: 'Carrusel: Cómo pagar a freelancers en Latam con Pana',
    caption: '6 slides explicando el proceso paso a paso.',
    submittedAt: '2026-05-01T13:00:00Z',
    status: 'paid',
    reviewedAt: '2026-05-02T10:00:00Z',
    reviewedBy: 'marketing@getpana.app',
    payoutUsd: 150,
    paidAt: '2026-05-06T08:00:00Z',
    views: 12300,
    likes: 720
  },
  {
    id: 'C-2026-006',
    ambassadorId: 'AMB-joely-melendez',
    ambassadorName: 'Joely Melendez',
    ambassadorPhoto: photoF(48),
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@joelymelendez/video/7234567892',
    thumbnail: thumb('joely-1'),
    title: 'Recibí mi primer pago en USD así',
    caption: 'Mi reacción al ver el primer depósito en mi cuenta US gracias a Pana.',
    submittedAt: '2026-05-03T18:15:00Z',
    status: 'approved',
    reviewedAt: '2026-05-04T11:20:00Z',
    reviewedBy: 'marketing@getpana.app',
    payoutUsd: 220,
    views: 35100,
    likes: 2440
  },
  {
    id: 'C-2026-007',
    ambassadorId: 'AMB-giannymartinez',
    ambassadorName: 'GiannyMartinez',
    ambassadorPhoto: photoF(67),
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/Cdef789/',
    thumbnail: thumb('gianny-1'),
    title: 'Le mando $200 a mi mamá: Pana vs banco',
    caption: 'Comparativa real de cuánto llega vs cuánto se queda el banco. Spoiler: increíble.',
    submittedAt: '2026-05-06T11:00:00Z',
    status: 'pending_review'
  },
  {
    id: 'C-2026-008',
    ambassadorId: 'AMB-globmi---gerardo-rojas-',
    ambassadorName: 'Globmi (Gerardo Rojas)',
    ambassadorPhoto: photoM(85),
    platform: 'youtube',
    url: 'https://www.youtube.com/shorts/xyz789',
    thumbnail: thumb('globmi-1'),
    title: 'Mi cuenta US sin papeleo gringo (en 5 min)',
    caption: 'Demo en vivo: abrí la cuenta, hice mi primer envío y mostré las comisiones.',
    submittedAt: '2026-04-28T14:00:00Z',
    status: 'rejected',
    reviewedAt: '2026-04-29T16:30:00Z',
    reviewedBy: 'marketing@getpana.app',
    rejectionReason: 'Mostraste tarjeta + datos personales. Por favor blureados antes de re-publicar.'
  },
  {
    id: 'C-2026-009',
    ambassadorId: 'AMB-ronny-alberto-mercedes',
    ambassadorName: 'Ronny Alberto Mercedes',
    ambassadorPhoto: photoM(27),
    platform: 'twitter',
    url: 'https://x.com/ronnymercedes/status/123456',
    thumbnail: thumb('ronny-1'),
    title: 'Hilo: 5 razones por las que dejé mi banco tradicional',
    caption: 'Hilo de 8 tweets explicando ventajas reales de Pana en R. Dominicana.',
    submittedAt: '2026-05-04T08:30:00Z',
    status: 'approved',
    reviewedAt: '2026-05-04T15:45:00Z',
    reviewedBy: 'marketing@getpana.app',
    payoutUsd: 120,
    views: 8400,
    likes: 320
  },
  {
    id: 'C-2026-010',
    ambassadorId: 'AMB-clippers-flow',
    ambassadorName: 'Clippers Flow',
    ambassadorPhoto: photoM(33),
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@clippersflow/video/7234567893',
    thumbnail: thumb('clippers-3'),
    title: 'Stitch reaccionando a "no se puede tener cuenta US sin SSN"',
    caption: 'Respuesta a este viral. Sí se puede, así lo hice.',
    submittedAt: '2026-05-07T07:00:00Z',
    status: 'pending_review'
  },
  {
    id: 'C-2026-011',
    ambassadorId: 'AMB-alex-trujillo',
    ambassadorName: 'Alex Trujillo',
    ambassadorPhoto: photoM(45),
    platform: 'youtube',
    url: 'https://www.youtube.com/shorts/abc999',
    thumbnail: thumb('alex-2'),
    title: 'POV: Cliente gringo te paga $1,500 USD',
    caption: 'Visualización de cómo recibo pagos sin perder en cambio.',
    submittedAt: '2026-04-30T20:00:00Z',
    status: 'approved',
    reviewedAt: '2026-05-01T11:00:00Z',
    reviewedBy: 'marketing@getpana.app',
    payoutUsd: 200,
    views: 15600,
    likes: 980
  },
  {
    id: 'C-2026-012',
    ambassadorId: 'AMB-gustavo-duran',
    ambassadorName: 'Gustavo Duran',
    ambassadorPhoto: photoM(56),
    platform: 'instagram',
    url: 'https://www.instagram.com/p/Cghi456/',
    thumbnail: thumb('gustavo-2'),
    title: 'One pager corporativo: Pana para tu compañía',
    caption: 'Versión personalizada para mi empresa. Link de descarga en bio.',
    submittedAt: '2026-05-05T15:00:00Z',
    status: 'paid',
    reviewedAt: '2026-05-05T17:30:00Z',
    reviewedBy: 'marketing@getpana.app',
    payoutUsd: 180,
    paidAt: '2026-05-06T08:00:00Z',
    views: 4200,
    likes: 280
  }
];

export const CONTENT_TOTALS = {
  total: CONTENT_SUBMISSIONS.length,
  pending: CONTENT_SUBMISSIONS.filter(c => c.status === 'pending_review').length,
  approved: CONTENT_SUBMISSIONS.filter(c => c.status === 'approved').length,
  rejected: CONTENT_SUBMISSIONS.filter(c => c.status === 'rejected').length,
  paid: CONTENT_SUBMISSIONS.filter(c => c.status === 'paid').length,
  totalPayout: CONTENT_SUBMISSIONS.filter(c => c.status === 'paid').reduce((s, c) => s + (c.payoutUsd || 0), 0),
  pendingPayout: CONTENT_SUBMISSIONS.filter(c => c.status === 'approved').reduce((s, c) => s + (c.payoutUsd || 0), 0),
  totalViews: CONTENT_SUBMISSIONS.reduce((s, c) => s + (c.views || 0), 0)
};
