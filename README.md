# Deutschy

منصة لتعلّم الألماني (A1) بالصور والألعاب، بشرح بالعربي المصري.

**Live:** https://deutschy.pages.dev

## What it is
- Next.js (static export) front end, Hono API as Cloudflare Pages Functions (`functions/api`).
- Sign in with Google (server-side OAuth in Hono, signed HttpOnly session cookie).
- 12 lessons that follow the Menschen A1 topics: each card has a real photo, the article (der/die/das), the plural and an Egyptian Arabic translation.
- A1 basics page: greetings, numbers, weekdays, months, colours, `sein`, `haben`, articles.
- Games hub: flashcards, picture quiz, der/die/das, spelling, memory. XP, levels, day streak and a local leaderboard (stored on the device).
- Admin dashboard at `/admin`, only for the owner account, with a themes system.
- Pronunciation: ElevenLabs through `/api/tts` when a key is configured, otherwise the browser's German voice. Nothing plays automatically.

## Content rules
- Every word and Arabic translation is entered by hand in `data/vocab-source.txt`.
- Every photo is a real photo from Wikimedia Commons with its license and author recorded in `data/vocab.json` and shown on `/credits`. Words without a clearly matching photo are left out until one is found (`data/pending-photos.json`).
- No audio files and no vocabulary counts are invented.

## Develop
```bash
npm install
npm run build        # outputs ./out
npm run verify       # checks content integrity
```
Build command for Cloudflare Pages: `npm run build`, output directory: `out`.

### Environment (Cloudflare Pages secrets)
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`, optional `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`.
The Google OAuth redirect URI is `https://deutschy.pages.dev/api/auth/callback`.
