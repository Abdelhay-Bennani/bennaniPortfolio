# Portfolio — Abdelhay Bennani

Portfolio multilingue (FR / EN / AR) construit avec Next.js 16 (App Router), Tailwind CSS v4, GSAP, Lenis et three.js.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000 → redirige vers /fr
npm run build    # build de production
npm run start    # serveur de production
npm run lint
```

## Structure

- `src/app/[locale]/` — layout racine, pages `/`, `/about`, `/contact`, page 404
- `src/proxy.ts` — redirection vers la langue (cookie `locale`, puis `Accept-Language`, sinon `fr`)
- `src/i18n/` — configuration des langues, dictionnaires `messages/{fr,en,ar}.ts`, `LocaleProvider`
- `src/lib/data.ts` — projets, expériences, formation, compétences (textes localisés)
- `src/lib/site.ts` — coordonnées (email, téléphone, WhatsApp, LinkedIn, URL)
- `src/components/scene/` — mécanisme d'animation :
  - `SmoothScrollScene` : loader avec pourcentage, scroll fluide Lenis synchronisé avec GSAP ScrollTrigger, scène three.js de fond réactive au scroll et au thème (chargée en idle, désactivée sur mobile et en `prefers-reduced-motion`)
  - `ScrollReveal` : révélation mot par mot pilotée par le scroll (fondu, montée, flou, surbrillance)
  - `ScrambledText` : effet de texte brouillé à l'arrivée sur la page
  - `NameCanvas` : nom en particules interactives (pointeur, clic)
- `src/components/layout/` — header (navigation, langues, thème, WhatsApp), footer, thème sombre/clair
- `src/components/sections/home.tsx` — sections réutilisées par les pages
- `public/projects/` — captures des projets

## Modifier le contenu

- Textes d'interface : `src/i18n/messages/*.ts`
- Projets / parcours / compétences : `src/lib/data.ts`
- Coordonnées : `src/lib/site.ts`
