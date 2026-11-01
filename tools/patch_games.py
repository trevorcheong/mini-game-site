"""Re-apply the Mini Game Site changes to the original games.

Reads   games_original_backup/*.html  (untouched originals)
Writes  games/*.html                  (versions used by the site)

Every site-specific change to a game lives in this file, so the patched
games can be rebuilt from the originals at any time:
    python3 tools/patch_games.py
Each replacement must match exactly once, so the script fails loudly if an
original game changes.
"""
import sys
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D=os.path.join(ROOT,'games_original_backup')+os.sep; O=os.path.join(ROOT,'games')+os.sep
def patch(fn, css, reps):
    s=open(D+fn,encoding='utf-8').read()
    head='<script src="mgs-bridge.js?v=32"></script>\n<style>/* MGS: mini game site */\n'+css+'\n</style>\n</head>'
    if s.count('</head>')==1: s=s.replace('</head>',head)
    else: s=s.replace('</style>','</style>\n'+head[:-len('</head>')],1)
    for a,b in reps:
        n=s.count(a)
        assert n==1, f'{fn}: {n}x {a[:70]!r}'
        s=s.replace(a,b)
    open(O+fn,'w',encoding='utf-8').write(s); print('ok',fn)

# 1 Chicken Cross: lives=3; overScreen = game over
patch('chicken-cross-game.html', '', [
 ("if (!existing) save(v);", "if (!existing) { save(v); MGS.win({ amount: v.amount, code: v.code, label: money(v.amount) }); }"),
 ("else { S.mode = 'over'; sfx('over'); setTimeout(() => show('overScreen'), 150); }",
  "else { S.mode = 'over'; sfx('over'); MGS.gameOver(); setTimeout(() => show('overScreen'), 150); }"),
 ("$('retryBtn').addEventListener('click', startGame);", "$('retryBtn').addEventListener('click', MGS.paid(startGame));"),
 ("$('againBtn').addEventListener('click', startGame);", "$('againBtn').addEventListener('click', MGS.paid(startGame));"),
])

# 2 Croco Road: 3 tries; retryBtn = free next try, crashReplay = new game (paid)
patch('croc-road.html', '#replayHud{display:none!important}', [
 ("    if (!returning) $('winMsg').textContent = `You won a ${amountLabel(v.amount)} voucher!`;",
  "    if (!returning) { $('winMsg').textContent = `You won a ${amountLabel(v.amount)} voucher!`; MGS.win({ amount: v.amount, code: v.code, label: amountLabel(v.amount) }); }"),
 ("    $('retryBtn').hidden = left <= 0; $('crashReplay').hidden = left > 0;",
  "    $('retryBtn').hidden = left <= 0; $('crashReplay').hidden = left > 0; if (left <= 0) MGS.gameOver();"),
 ("$('againBtn').onclick = replay;", "$('againBtn').onclick = MGS.paid(replay);"),
 ("$('crashReplay').onclick = replay;", "$('crashReplay').onclick = MGS.paid(replay);"),
 ("$('replayHud').onclick = replay;\n", ""),
])

# 3 Catch the Fortune
patch('fortune-catch.html', '', [
 ("  FC.emit('win',{score,voucher:v,url});", "  FC.emit('win',{score,voucher:v,url});\n  MGS.win({ amount: v.amount, code: v.code, label: v.name });"),
 ("$('loseScreen').classList.remove('hidden'); FC.emit('lose'", "$('loseScreen').classList.remove('hidden'); MGS.gameOver(); FC.emit('lose'"),
 ("$('retryBtn').onclick = startGame;", "$('retryBtn').onclick = MGS.paid(startGame);"),
 ("$('againBtn').onclick = startGame;", "$('againBtn').onclick = MGS.paid(startGame);"),
])

# 4 Gold Rush Mines: chances; fresh chances every paid game
patch('gold-rush-mines.html', '#newBtn{display:none!important}\n.ctrls{grid-template-columns:1fr!important}\n/* fit the whole game in short (phone) screens */\n.stage{display:flex;justify-content:center}\n.board{width:min(100%, max(120px, calc(100vh - 400px)));box-sizing:border-box}\n@media (max-height:760px){.app{padding-top:8px!important;padding-bottom:8px!important}}\n@media (max-height:560px){.brand p{display:none}.brand h1{font-size:1.3rem}.top{gap:6px}.meter{padding:8px 12px;gap:4px 10px}.meter .amt{font-size:1.7rem}.stage{padding-top:6px!important;padding-bottom:10px!important}.btn{padding:10px 10px 9px!important;margin-bottom:4px}.board{padding:9px!important}}', [
 ('try{const s=JSON.parse(localStorage.getItem("grm")||"null");if(s&&typeof s.c==="number")chancesLeft=s.c}catch(e){}', ''),
 ('const save=()=>{try{localStorage.setItem("grm",JSON.stringify({c:chancesLeft}))}catch(e){}};', 'const save=()=>{};'),
 ('  $("claimBtn").href=u.toString();\n', '  $("claimBtn").href=u.toString();\n  MGS.win({amount:+amt, code:code, label:"RM"+amt});\n'),
 ('    $("loseModal").hidden=false;', '    $("loseModal").hidden=false; if(!chancesLeft) MGS.gameOver();'),
 ('$("laterBtn").onclick=()=>{$("winModal").hidden=true;newRound()};', '$("laterBtn").onclick=MGS.paid(()=>{$("winModal").hidden=true;chancesLeft=CONFIG.chances;newRound()});'),
 ('$("retryBtn").onclick=()=>{$("loseModal").hidden=true;refill();newRound()};',
  'const _again=()=>{$("loseModal").hidden=true;refill();newRound()}, _paidAgain=MGS.paid(_again);\n$("retryBtn").onclick=()=>{ if(chancesLeft>0) _again(); else _paidAgain(); };'),
])

# 5 Jungle Whack
patch('jungle-whack.html', '#savedBtn{display:none!important}', [
 ("REMEMBER_VOUCHER: true,", "REMEMBER_VOUCHER: false,"),
 ("    save(current);\n", "    save(current);\n    MGS.win({ amount: parseFloat(String(baseOf(current).amount).replace(/[^0-9.]/g,'')), code: current.code, label: baseOf(current).amount });\n"),
 ("  setTimeout(()=>$('#loseScreen').classList.add('show'),450);", "  MGS.gameOver();\n  setTimeout(()=>$('#loseScreen').classList.add('show'),450);"),
 ("$('#replayBtn').onclick=startGame;", "$('#replayBtn').onclick=MGS.paid(startGame);"),
 ("$('#retryBtn').onclick=startGame;", "$('#retryBtn').onclick=MGS.paid(startGame);"),
])

# 6 Neon Rocket: every game ends with a reward
patch('neon-rocket-standalone.html', '', [
 ("if(prev && prev.expiresAt > Date.now() && tier.amounts.includes(prev.amount)){", "if(false){"),
 ("  $('#claimBtn').href = claimUrl(v);\n  show('ticket');", "  $('#claimBtn').href = claimUrl(v);\n  show('ticket');\n  MGS.win({ amount: v.amount, code: v.code, label: CONFIG.CURRENCY + money(v.amount) });"),
 ("$('#playAgainBtn').addEventListener('click', newGame);", "$('#playAgainBtn').addEventListener('click', MGS.paid(newGame));"),
 ("const saved = store.get();\nif(saved && saved.expiresAt > Date.now()){ showTicket(saved); }\nelse { if(saved) store.clear(); show('intro'); }",
  "store.clear(); show('intro'); // MGS: every paid game starts fresh"),
 ("$('#replayBtn').addEventListener('click', () => { store.clear(); newGame(); });", "$('#replayBtn').addEventListener('click', MGS.paid(() => { store.clear(); newGame(); }));"),
])

# 7 Golden Goal (penalty kicks; all code lives inside one IIFE, so hooks go inside it)
patch('golden-goal.html', '/* fill the whole frame */\nbody{padding:0!important}\n.stage{border-radius:0!important;box-shadow:none!important;max-width:none!important;max-height:none!important}', [
 ('  if (aw / ah > 9 / 16) { h = ah; w = h * 9 / 16; }            // PC / landscape: classic 9:16\n  else { w = aw; h = Math.min(ah, w * 19.5 / 9); }             // phones: use the extra height',
  '  h = ah; w = Math.min(aw, ah * 0.9);                          // MGS: fill the frame (cap on very wide screens)'),
 ('  view = { s, ox: (w - W * s) / 2, oy: (h - H * s) / 2, dpr };',
  '  view = { s, ox: (w - W * s) / 2, oy: Math.min((h - H * s) / 2, h - 748 * s), dpr };   // MGS: keep ball + striker on short screens'),
 ('  $("vCode").textContent = code;\n',
  '  $("vCode").textContent = code;\n  MGS.win({ amount: game.cents / 100, code: code, label: "RM" + fmt(game.cents) });\n'),
 ('  if (game.cents <= 0) { $("loseScreen").hidden = false;',
  '  if (game.cents <= 0) { MGS.gameOver(); $("loseScreen").hidden = false;'),
 ('$("againBtn").addEventListener("click", start);', '$("againBtn").addEventListener("click", MGS.paid(start));'),
 ('$("retryBtn").addEventListener("click", start);', '$("retryBtn").addEventListener("click", MGS.paid(start));'),
 # skip the in-game start screen (paid on the site already) + test hook
 ('renderHud(false);\nloadAll.then(() => { fitStage(); requestAnimationFrame(loop); });',
  'renderHud(false);\nloadAll.then(() => { fitStage(); requestAnimationFrame(loop); });\n'
  '/* MGS: skip in-game start screen */\nMGS.onAudioUnlock(audio);\nMGS.boot(function(){ $("startScreen").hidden = true; start(); });\n'
  'window.MGS_TEST = { game: game, endRound: endRound };'),
])

# 8 Pocket Pilot (tap-to-fly; images embedded on import; code inside an IIFE)
patch('pocket-pilot.html', '/* fill the whole frame: stage is 711 tall, its width follows the screen shape (set in fit) */\n#wrap{display:block}\n#stage{position:absolute!important;left:50%;top:50%;margin:-355.5px 0 0 -200px;border-radius:0!important;box-shadow:none!important}\ncanvas{width:100%!important;height:100%!important}\n/* owner: 1 life, no hearts in the HUD */\n#lives{display:none!important}', [
 ('  const amt=G.money,c=code(),win=amt>0;\n',
  '  const amt=G.money,c=code(),win=amt>0;\n  if(win) MGS.win({amount:amt,code:c,label:"RM"+amt.toFixed(2)}); else MGS.gameOver();\n'),
 ('const W=400,H=711,GROUND=694;', 'let W=400;const H=711,GROUND=694;'),
 # background tiles: draw as many as the (now wider) screen needs, not a fixed 3
 ('  for(let k=0;k<3;k++){\n    const x=off+k*bw;', '  for(let k=0;off+k*bw<W+1;k++){\n    const x=off+k*bw;'),
 # safety: repaint the whole canvas each frame so nothing can leave trails
 ('function draw(){\n  ctx.save();', 'function draw(){\n  ctx.fillStyle="#f3cfc4";ctx.fillRect(0,0,W,H);\n  ctx.save();'),
 ('  const s=Math.min(vw/W,vh/H);\n  const phone=vw<520;',
  '  W=Math.max(320,Math.min(900,Math.round(H*vw/vh)));stage.style.width=W+"px";stage.style.marginLeft=(-W/2)+"px";\n  const s=Math.min(vw/W,vh/H);\n  const phone=true;'),
 # owner: difficulty rises little by little through the flight
 #   gap 196 -> 132, spacing 250 -> 205, height swings +-90 -> +-185, speed 150 -> 235 (eased: gentle start, hard end)
 ('  const obs=[];let gy=360;\n  for(let i=0;i<OBST;i++){\n    const t=i/OBST;\n    gy=Math.max(205,Math.min(470,gy+rnd(-150,150)));\n    obs.push({wx:560+i*SP,gy,gap:192-t*30,coin:(i+1)%CFG.GATES_PER_COIN===0,got:false});',
  '  const obs=[];let gy=360,wx=560;\n  for(let i=0;i<OBST;i++){\n    const t=i/(OBST-1),e=Math.pow(t,1.35),sw=90+e*95;\n    gy=Math.max(195,Math.min(480,gy+rnd(-sw,sw)));\n    if(i)wx+=250-e*45;\n    obs.push({wx,gy,gap:196-e*64,coin:(i+1)%CFG.GATES_PER_COIN===0,got:false});'),
 ('function speed(){return 150+Math.min(1,G.dist/(OBST*SP))*45}',
  'function speed(){return 150+Math.pow(Math.min(1,G.dist/G.finishWx),1.2)*85}'),
 # owner: only 1 life
 ('  LIVES:3,', '  LIVES:1,'),
 ('<li><span>♥</span><span>3 lives. You restart where you crashed and keep your money</span></li>', '<li><span>♥</span><span>1 life. One crash ends the flight</span></li>'),
 ('$("againBtn").addEventListener("click",()=>{ensureAudio();replay()});',
  '$("againBtn").addEventListener("click",MGS.paid(()=>{ensureAudio();replay()}));'),
 # skip the in-game start screen (paid on the site already) + test hook
 ('ready.then(()=>requestAnimationFrame(t=>{last=t;frame(t)}));',
  'ready.then(()=>requestAnimationFrame(t=>{last=t;frame(t)}));\n'
  '/* MGS: skip in-game start screen */\nMGS.onAudioUnlock(ensureAudio);\nMGS.boot(function(){ $("start").hidden=true;$("hud").hidden=false;showTap("Tap to fly","Tap or press Space"); });\n'
  'window.MGS_TEST={get G(){return G},showResult:showResult,win:win,crash:crash};'),
])

# 9 Flash Memory: Simon-style memory, 10 levels, up to RM2.00. One wrong light ends the run:
#   total>0 -> voucher (MGS.win), nothing won -> lose card (MGS.gameOver). Code is an IIFE -> test hook MGS_TEST.
patch('flash-memory.html', '/* fill the whole frame */\nbody{padding:0!important}\nbody::after{display:none!important}\n#app{width:100%!important;height:100%!important;border-radius:0!important;box-shadow:none!important}\n/* phones: character and light pads shrink with the frame height so nothing overlaps or gets cut off */\n.arena{padding-bottom:2%!important}\n.console{padding:min(14px,3%)!important}\n.pads{gap:min(14px,4%)!important}\n@media (max-height:560px){.bubble{padding:5px 16px 7px}.bubble .big{font-size:20px}.bubble .sub{font-size:13px}#play{gap:6px}}\n/* result cards are scaled to fit in JS (fitSheets) */', [
  # claim goes through the site (bridge intercepts #claimBtn)
  ('<a class="btn3d shine" id="btnClaim" href="#claim">', '<a class="btn3d shine" id="claimBtn" href="#claim">'),
  ('const claim = $("#btnClaim");', 'const claim = $("#claimBtn");'),
  ('$("#btnClaim").addEventListener("click"', '$("#claimBtn").addEventListener("click"'),
  # report the result to the site
  ('    $("#voucher").hidden = false;\n    pose($("#vMascot")',
   '    $("#voucher").hidden = false;\n    MGS.win({ amount: total, code: $("#vCode").textContent, label: rm(total) });\n    pose($("#vMascot")'),
  ('else { $("#lose").hidden = false; sfx.pop(); }', 'else { $("#lose").hidden = false; fitSheets(); sfx.pop(); MGS.gameOver(); }'),
  # replay after a win or a loss costs TOKEN
  ('$("#btnReplay").onclick = startGame;\n  $("#btnRetry").onclick = startGame;',
   '$("#btnReplay").onclick = MGS.paid(startGame);\n  $("#btnRetry").onclick = MGS.paid(startGame);'),
  # skip the in-game start screen (paid on the site already); start sound on the Start tap; test hook
  # result cards: scale down to fit short phones so CLAIM / PLAY AGAIN stay visible
  ('  function makeCode(){', '  function fitSheets(){ document.querySelectorAll(".overlay:not([hidden]) .sheet").forEach(function(el){ el.style.transform=""; var k=Math.min(1,(innerHeight-24)/el.offsetHeight,(innerWidth-24)/el.offsetWidth); if(k<1){ var dy=(innerHeight-el.offsetHeight*k)/2-el.offsetTop; el.style.transformOrigin="50% 0"; el.style.transform="translateY("+dy.toFixed(1)+"px) scale("+k.toFixed(3)+")"; } }); }\n  addEventListener("resize", fitSheets);\n  function makeCode(){'),
  ('    pose($("#vMascot"), perfect ? "coin" : "thumbs");', '    fitSheets();\n    pose($("#vMascot"), perfect ? "coin" : "thumbs");'),
  ('  window.__fm = {',
   '  /* MGS: real frame height for the layout (iPhone can size dvh oddly inside a frame) */\n  /* character + light pads sized in px from the real frame height (iPhone Safari ignored the CSS version) */\n  function fitPlay(){ var H = innerHeight, ms = Math.max(56, Math.min(265, H * .3 - 60)), cw = Math.max(120, Math.min(innerWidth - 32, 340, H - 236 - ms * .9)); var ar = document.querySelector(".arena"), co = document.querySelector(".console"); ar.style.setProperty("--ms", ms + "px", "important"); co.style.setProperty("width", cw + "px", "important"); var gap = cw >= 260 ? 14 : 10, pd = gap, sz = Math.floor((cw - 2 * pd - gap) / 2); co.style.setProperty("padding", pd + "px", "important"); var pb = document.getElementById("pads"); pb.style.setProperty("grid-template-columns", sz + "px " + sz + "px", "important"); pb.style.setProperty("gap", gap + "px", "important"); pb.style.setProperty("justify-content", "center"); document.querySelectorAll(".pad").forEach(function(el){ el.style.setProperty("width", sz + "px", "important"); el.style.setProperty("height", sz + "px", "important"); el.style.setProperty("aspect-ratio", "auto", "important"); el.style.setProperty("min-width", "0", "important"); }); }\n  fitPlay(); addEventListener("resize", fitPlay); setTimeout(fitPlay, 300);\n  /* MGS: skip in-game start screen */\n  MGS.onAudioUnlock(function(){ try{ ac = ac || new (window.AudioContext||window.webkitAudioContext)(); ac.resume && ac.resume(); }catch(e){} });\n  MGS.boot(startGame);\n  window.MGS_TEST = { finish, fail, setTotal, get level(){return level}, set level(v){level=v} };\n  window.__fm = {'),
])

# ---- 去掉游戏内的开始页面：付了 TOKEN 直接开始 ----
BOOT = {
 # MGS.onAudioUnlock: called by play.html inside the Start tap (iPhone only plays sound after a tap)
 # MGS.boot: in preload mode (?mgs_wait=1) waits for play.html's MGS.startNow(), otherwise runs at once
 'chicken-cross-game.html': "MGS.onAudioUnlock(function(){ if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); AC.resume && AC.resume(); });\nMGS.boot(startGame);",
 'croc-road.html': "MGS.onAudioUnlock(unlockAudio);\nMGS.boot(function(){ startScreen.hidden = true; });",
 'fortune-catch.html': "MGS.onAudioUnlock(function(){ Sound.unlock(); });\nMGS.boot(function(){ $('startScreen').classList.add('hidden'); startGame(); });",
 'gold-rush-mines.html': 'MGS.onAudioUnlock(function(){ try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)(); ac.resume&&ac.resume(); }catch(e){} });\nMGS.boot(function(){ $("startModal").hidden = true; });',
 'jungle-whack.html': "MGS.onAudioUnlock(function(){ try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); actx.resume&&actx.resume(); }catch(e){} });\nMGS.boot(startGame);",
}
for fn, code in BOOT.items():
    s = open(O+fn, encoding='utf-8').read()
    i = s.rindex('</script>')
    s = s[:i] + '\n/* MGS: skip in-game start screen */\n' + code + '\n' + s[i:]
    open(O+fn, 'w', encoding='utf-8').write(s); print('boot', fn)
# Neon: go straight to the LAUNCH screen (no intro), also on paid replay
fn = 'neon-rocket-standalone.html'; s = open(O+fn, encoding='utf-8').read()
for a, b in [("store.clear(); show('intro'); // MGS", "store.clear(); show(null); // MGS"),
             ("resetIdle(); show('intro');\n}", "resetIdle(); show(null);\n}"),
             ("store.clear(); show(null); // MGS", "MGS.onAudioUnlock(function(){ ac(); }); MGS.boot(function(){}); store.clear(); show(null); // MGS")]:
    assert s.count(a) == 1, a; s = s.replace(a, b)
open(O+fn, 'w', encoding='utf-8').write(s); print('boot', fn)
