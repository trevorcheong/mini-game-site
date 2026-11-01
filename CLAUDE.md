# Mini Game Site

A mini game lobby. Partner (third-party) sites send players here with a token.
Players spend TOKEN to play mini games, win vouchers, and claim them back on the partner site.
Pure static site with no build step: plain HTML/CSS/JS, hosted on GitHub Pages.

- Live: https://trevorcheong.github.io/mini-game-site/
- Repo: trevorcheong/mini-game-site, branch `main`. Pages deploys from `main` / root.
- Owner's local copy: `E:\CLAUDE\MINI GAME SIDE` (Windows). Keep it identical to the repo.
- The owner writes in Chinese. Reply in Chinese unless they write in English.
- Player-facing UI text is English, to match the games.

## Layout

```
index.html            Lobby: game grid, search, TOKEN pill, player name, My Vouchers bar
play.html             Game page (play.html?game=<id>): pay-to-start card, game iframe, header
games.config.js       ★ List of games (id, title, file, thumb, cost, tag, color, howTo)
assets/style.css      Shared styles (dark theme, cards, modals, voucher bar, notices)
assets/common.js      Shared UI: modal, toast, top notice, token pill, player chip,
                      My Vouchers bar/list, copy button, claimVoucher()
assets/token.js       TokenService: balance, spend, player token/name (demo = localStorage)
assets/voucher.js     VoucherService: won vouchers + claim interface (demo = localStorage)
games/*.html          Self-contained games (big files, base64 assets inside), patched for the site
games/mgs-bridge.js   Bridge loaded by every game: win / gameOver / paid replay / claim / audio unlock
games_original_backup/  Untouched original games — never edit
tools/patch_games.py  Rebuilds games/*.html from the originals (all game changes live here)
thumbs/*.jpg          512px square thumbnails (generated with Magnific)
README.md             Owner-facing guide in Chinese (adding games, API, claim parameters)
```

## How the pieces talk

- The game runs in an iframe on play.html. Games call `window.MGS` (from mgs-bridge.js),
  which `postMessage`s to the parent:
  - `MGS.win({amount, code, label})` → parent adds the voucher, ends the paid session, shows the win notice
  - `MGS.gameOver()` → parent ends the paid session (no "leave?" warning after this)
  - `btn.onclick = MGS.paid(fn)` → parent shows the "Play again for N TOKEN?" modal,
    charges, then replies `replay-ok` and the game runs `fn`
  - Clicks on `#claimBtn` / `[data-mgs-claim]` are intercepted → parent `UI.claimVoucher()`
  - Audio: the bridge wraps `AudioContext` and resumes every context on the first touch/click.
    iOS only allows audio on a **tap** (not a drag), so the sound is started by the Start tap itself:
    play.html preloads the game hidden with `?mgs_wait=1` while the start card shows. The game
    registers its opening with `MGS.boot(fn)` (held while waiting) and its sound setup with
    `MGS.onAudioUnlock(fn)`. In the Start click handler play.html synchronously calls
    `frame.contentWindow.MGS.unlockAudio()` (same origin), then after charging calls `MGS.startNow()`.
    Cross-origin (file://) falls back to postMessage `{mgs:1,type:"start"}`. `MGS.audioStates` helps tests.
- The bridge must load **before** the game's own scripts (patch_games.py inserts it in `<head>`).

## Game rules (agreed with the owner)

- Every game costs **1 TOKEN** (`cost` in games.config.js).
- Pressing Start on play.html charges TOKEN and goes straight into the game.
  The games' own start screens are skipped (BOOT block in patch_games.py).
- Replay after a **win** or after a full **loss** is paid (`MGS.paid`).
  "Try again" while lives/chances remain inside the same game is free.
- 8 games: Chicken Cross, Croco Road, Catch the Fortune, Gold Rush Mines, Jungle Whack, Neon Rocket, Golden Goal,
  Pocket Pilot.
- Free mid-game restarts are hidden: Croco Road ↻ (`#replayHud`), Gold Rush "New dig" (`#newBtn`).
- Leaving play.html mid-game shows a warning that TOKEN is not refunded.
  A `sessionStorage` ticket stops a refresh from charging twice. Going back to the lobby clears tickets.
- Games that saved vouchers in localStorage were changed so every paid game is fresh
  (Neon Rocket, Jungle Whack, Gold Rush chances).

## Claim interface

The partner link can carry `?token=…&name=…&claim_url=https://partner/claim`.
Claim redirects the **same tab** to:
`claim_url?code=&amount=&currency=MYR&voucher_id=&game=&token=`.
With no `claim_url` and no `CLAIM_URL` in voucher.js, a modal shows the code to copy instead.
Never let a game open its own hard-coded claim URL or a new window.

## Backend (not built yet)

Demo mode stores balance and vouchers in the browser, so players can edit them.
Set `API_BASE` in assets/token.js to switch to the API.
Endpoints are expected but not yet implemented:
- `GET /balance` → `{balance, name}`
- `POST /play {gameId}`
- `POST /vouchers`
- `POST /vouchers/{id}/claim`

Do not treat the site as production-safe until these exist.

## Adding a game

1. Put the original HTML in `games_original_backup/` and a 1:1 thumbnail in `thumbs/`.
   Games often come from the owner's claude.ai artifacts (Artifact tool, `read`).
   If an artifact loads separate files (e.g. `assets/*.png`), embed them as data URIs into one
   self-contained HTML before saving it as the original (done for Pocket Pilot).
2. In `tools/patch_games.py`, add a `patch(...)` entry. It must:
   - call `MGS.win` on win and `MGS.gameOver` on final loss
   - wrap replay buttons with `MGS.paid`
   - give the claim button `id="claimBtn"`
   - add a BOOT line that skips the in-game start screen, wrapped as `MGS.boot(function(){ … })`,
     plus `MGS.onAudioUnlock(<the game's own audio init/resume>)` so music starts on the Start tap
     (if the game's code is wrapped in an IIFE, put the start call inside it with a replacement instead —
     see the Golden Goal entry)
3. Run `python3 tools/patch_games.py`.
4. Add the game to `games.config.js`.
5. Test win, loss, paid replay, and claim (see Testing).

## Editing rules

- Edit games through `tools/patch_games.py`, then rerun it. Do not hand-edit `games/*.html`.
  The script rebuilds them from the originals and overwrites hand edits.
  Each replacement must match exactly once, so the script fails if an original changes.
- **Cache-busting:** GitHub Pages caches pages for about 10 minutes, and phones keep old copies.
  After a change, bump the version everywhere it appears:
  - `?v=N` on assets in index.html and play.html
  - the `p.set("v", "N")` play link in index.html
  - the iframe `v=N` in play.html
  - `mgs-bridge.js?v=N` in patch_games.py
  - the `vN` label in the lobby footer
  - `build vN` in the play.html debug overlay

  Then tell the owner to open `…/?v=N`.
- **Phone height:** play.html sizes itself from `window.innerHeight` (`--app-h`, `html.app-h`)
  and forces `min-height:0`. iOS Safari resolves `100vh` to the whole screen (e.g. 932 vs 721
  visible), which pushed games under the toolbar. Don't reintroduce `100vh` / `min-height:100vh`
  on play.html.
- Debug overlay: `play.html?game=<id>&debug=1` shows heights, frame position and UA.
  Ask the owner for a screenshot of it when a phone layout problem can't be reproduced.
- Keep this file current: when a change alters the rules, structure, game list or workflow above,
  update CLAUDE.md in the same commit.
- After every change:
  1. Commit and push to `main`.
  2. Copy the same changed files to `E:\CLAUDE\MINI GAME SIDE` when that computer is connected.

## Testing

No test suite. Verify with Playwright (Chromium is preinstalled in the cloud session):
- Phone viewports such as 430×721 (iPhone, visible area), 375×560 (iPhone SE), 412×780 (Android).
- Use an iPhone user agent to exercise the `ios-safari` path.
- For each game: after Start, `MGS.audioStates` in the frame is all `"running"` (serve over http so the
  frame is same-origin); start → win → voucher appears; final loss → paid replay modal;
  CLAIM with and without `claim_url`; no new tabs open.
- Trigger game states from the console. These function names are used by the existing tests:
  - Chicken: `showWin(0.5,false)`
  - Croco Road: `showVoucher({...},false,7)`
  - Fortune: `win()` / `lose()`
  - Gold Rush: `found=4;over=false;cashOut()`
  - Jungle: `showWin()`, then click `.box`
  - Neon: `openReward(true,1)`
  - Golden Goal: its code is wrapped in an IIFE, so the patch exposes `window.MGS_TEST`:
    `MGS_TEST.game.cents=70; MGS_TEST.endRound()` (cents 0 → loss screen)
  - Pocket Pilot: also an IIFE → `MGS_TEST.G.money=0.7; MGS_TEST.G.state='over'; MGS_TEST.showResult()`
    (money 0 → loss), `MGS_TEST.win()` reaches the finish (RM2.00)
- Games must **fill the whole frame** (owner asked: no empty bands left/right or top/bottom) and keep
  their controls visible on short phones. Games built as a fixed 9:16 stage need a patch:
  Pocket Pilot widens its world (`W` follows the screen shape, height stays 711);
  Golden Goal sizes the stage to the frame and keeps the ball/striker in view (`oy` clamp).
  Check stage rect == frame size at 390×650, 375×489 and the desktop frame (~478×705).
