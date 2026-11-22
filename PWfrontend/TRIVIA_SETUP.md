# Trivia game setup

Three pages were added to the site:

| Page | For | |
|---|---|---|
| `/trivia` | Players' phones | Join with a code and team name, answer, "Are you sure?", locked |
| `/trivia/host` | You (login) | See every question and answer, send questions, play songs, score, reveal |
| `/trivia/screen` | Projector | Join code + QR, questions, pictures, answers, scoreboard |

Code lives in `src/components/trivia/` and `src/lib/supabase.ts`. The database setup is `supabase/trivia_setup.sql`.

## One-time setup (about 15 minutes)

### 1. Create the Supabase project
1. Sign up at supabase.com and create a new project (free plan).
2. **SQL Editor → New query**: paste all of `supabase/trivia_setup.sql`, click **Run**.
3. **Authentication → Sign In / Providers**: turn on **Allow anonymous sign-ins** (this is how players join without passwords). Leave Email on.
4. **Authentication → Users → Add user → Create new user**: your email + a password, with **Auto Confirm User** checked.
5. Back in the **SQL Editor**, run this with your email:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

### 2. Connect the website
1. In Supabase, open **Project Settings → API** (may be labeled *API Keys* / *Data API*) and copy:
   - the **Project URL**
   - the **anon / publishable** key (this one is meant to be public; the database rules protect your questions)
2. For local testing, create `PWfrontend/.env.local` (copy `.env.example`) and paste both values.
3. For the live site, add the same two variables in **Cloudflare → your site → Settings → Variables and Secrets** (Production), then redeploy. Vite bakes them in at build time, so a redeploy is required after adding them.

### 3. Install and test
```bash
cd PWfrontend
npm install
npm run dev
```
Open `http://localhost:5173/trivia/host`, sign in, go to **Questions & files**:
1. Load `trivia_questions.csv`.
2. Upload all the pictures and the three MP3s at once (select them all in the file picker).
3. The panel tells you if any picture or song is still missing.

To test as a player, use your phone on the same Wi-Fi at `http://<your-computer's-IP>:5173/trivia` (run `npm run dev -- --host`), or a private/incognito window. Don't join as a player in the same browser window you host from.

## Game night
1. Laptop: `/trivia/host` → **Start a new game** → **Open projector screen**. Drag that window to the projector and click the expand icon in its corner for full screen.
2. Teams scan the QR code or go to `reece-williams.com/trivia` and type the code.
3. For each question: **Send** → (for songs: **Play** the clip on the host page; it plays through the laptop) → watch answers arrive → **Lock answers** → score with ✓ / ½ / ✗ or type points → **Reveal answer** (songs with a chorus file play it automatically) → **Show scoreboard** → **Next**.
4. The tiebreaker sorts guesses by how close they are.
5. **End game** shows final scores everywhere.

## Good to know
- **Free plan sleep:** free Supabase projects pause after a week with no activity. Open the Supabase dashboard (or the host page) the day before game night.
- **Same Wi-Fi limit:** anonymous sign-ins are limited per IP address (30 per hour by default). Phones on one venue Wi-Fi share an IP, so for a big crowd raise it under **Authentication → Rate Limits**.
- **Questions stay hidden:** players can never read the questions table. A phone only receives a question after you send it, and the answer only after you reveal it. Pictures and songs are in private storage and are shared through links that expire after 8 hours.
- **Changing questions:** edit the CSV and load it again (this replaces all questions), or use **Shuffle questions**. Both are disabled while a game is running.
- **Don't commit the CSV to this repo** if the GitHub repo is public. It contains every answer.
