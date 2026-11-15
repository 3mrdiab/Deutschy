# Deutschy

منصة لتعلّم الألماني بكل مستوياته، من A1 لحد C2، بالصور والألعاب وشرح بالعربي المصري.

## Levels
The data model and navigation cover all six CEFR levels (`src/lib/levels.ts`). A1 is live first; A2, B1, B2, C1 and C2 are marked as upcoming and are opened only when their content is written and reviewed.

## What it is
- Next.js (static export) front end, Hono API as Cloudflare Pages Functions (`functions/api`).
- Sign in with Google (server-side OAuth in Hono, signed HttpOnly session cookie).
- Lessons by level and topic. Each card has a real photo, the article (der/die/das), the plural and an Egyptian Arabic translation.
- Basics page: greetings, numbers, weekdays, months, colours, `sein`, `haben`, articles.
- Games hub: flashcards, picture quiz, der/die/das, spelling, memory. XP, levels, day streak and a local leaderboard (stored on the device).
- Admin dashboard at `/admin`, only for the owner account, with a themes system.
- Pronunciation: ElevenLabs through `/api/tts` when a key is configured, otherwise the browser's German voice. Nothing plays automatically.

## Content rules
- Every word and Arabic translation is entered by hand in `data/vocab-source*.txt`.
- Every photo is a real photo from Wikimedia Commons with its license and author recorded in `data/vocab.json` and shown on `/credits`. Words without a clearly matching photo are left out until one is found (`data/pending-photos.json`).
- No audio files and no vocabulary counts are invented.

## Develop
```bash
npm install
npm run build        # outputs ./out
npm run verify       # checks content integrity
```
Cloudflare Pages: build command `npm run build`, output directory `out`.

### Environment (Cloudflare Pages secrets)
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`, optional `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`.
