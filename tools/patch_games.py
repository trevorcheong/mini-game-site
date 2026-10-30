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
    head='<script src="mgs-bridge.js?v=16"></script>\n<style>/* MGS: mini game site */\n'+css+'\n</style>\n</head>'
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

# ---- 去掉游戏内的开始页面：付了 TOKEN 直接开始 ----
BOOT = {
 'chicken-cross-game.html': "startGame();",
 'croc-road.html': "startScreen.hidden = true;",
 'fortune-catch.html': "$('startScreen').classList.add('hidden'); setTimeout(startGame, 300);\n"
   "/* MGS: shrink result cards to fit short screens (hero art sticks out ~92px above the card) */\n"
   "(function(){ function fit(){ document.querySelectorAll('.overlay .card').forEach(function(c){ var ov=c.closest('.overlay'); if(!ov||ov.classList.contains('hidden')) return;"
   " c.style.scale='1'; c.style.translate='0 0'; var r=c.getBoundingClientRect(); var top=r.top, bot=r.bottom;"
   " c.querySelectorAll('.hero').forEach(function(h){ var hr=h.getBoundingClientRect(); if(hr.height) top=Math.min(top,hr.top); });"
   " var H=bot-top; var s=Math.max(.5,Math.min(1,(innerHeight-20)/H,(innerWidth-20)/r.width)); var cy=(r.top+r.bottom)/2;"
   " var nt=cy-(cy-top)*s, nb=cy+(bot-cy)*s; var dy=innerHeight/2-(nt+nb)/2;"
   " c.style.scale=String(s); c.style.translate='0 '+Math.round(dy)+'px'; }); }"
   " addEventListener('resize',fit); if(window.ResizeObserver){ var ro=new ResizeObserver(fit); document.querySelectorAll('.overlay .card').forEach(function(c){ro.observe(c);}); }"
   " new MutationObserver(fit).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']}); fit(); })();",
 'gold-rush-mines.html': '$("startModal").hidden = true;',
 'jungle-whack.html': "startGame();",
}
for fn, code in BOOT.items():
    s = open(O+fn, encoding='utf-8').read()
    i = s.rindex('</script>')
    s = s[:i] + '\n/* MGS: skip in-game start screen */\n' + code + '\n' + s[i:]
    open(O+fn, 'w', encoding='utf-8').write(s); print('boot', fn)
# Neon: go straight to the LAUNCH screen (no intro), also on paid replay
fn = 'neon-rocket-standalone.html'; s = open(O+fn, encoding='utf-8').read()
for a, b in [("store.clear(); show('intro'); // MGS", "store.clear(); show(null); // MGS"),
             ("resetIdle(); show('intro');\n}", "resetIdle(); show(null);\n}")]:
    assert s.count(a) == 1, a; s = s.replace(a, b)
open(O+fn, 'w', encoding='utf-8').write(s); print('boot', fn)
