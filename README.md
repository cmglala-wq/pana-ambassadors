# Pana Ambassadors

Hub oficial del Programa de Embajadores de Pana — landing pública + portal privado del embajador (Google login vía Cloudflare Zero Trust).

## Stack
React 18 · Vite · TypeScript · Tailwind · Cloudflare Pages + Functions.

## Dev
```bash
npm install
npm run dev
```

## Deploy
```bash
npm run deploy
```

## Estructura
- `src/pages/Landing.tsx` — landing pública
- `src/pages/Dashboard.tsx` — portal del embajador (protegido por CF Access)
- `functions/api/feedback.ts` — endpoint de feedback (Pages Function)
