/* =========================================================
   MGS Bridge — 让游戏和外层网站（play.html）沟通
   ---------------------------------------------------------
   新游戏接入方法（在游戏 HTML 里加 <script src="mgs-bridge.js"></script>）：
     MGS.win({ amount: 0.5, code: "ABC-123", label: "RM0.50" })   玩家赢了 voucher
     MGS.gameOver()                                                整局输了（没命/没机会了）
     btn.onclick = MGS.paid(restartFn)                             这个按钮要先扣 TOKEN 才执行
   领取：游戏里 id="claimBtn" 或有 data-mgs-claim 属性的按钮/链接，在网站里会被接管，
   改由网站的领取接口处理（跳回合作方网站），不会再开新窗口到游戏自己写死的网址。
   游戏单独打开（不在网站里）时：win/gameOver 不做事，paid 直接执行。

   声音：浏览器要求玩家在游戏里点一下才可以播放。这里会记录游戏建立的所有
   AudioContext，玩家第一次点击/触碰时把它们全部启动（iPhone 静音键开着也尽量播放）。
   这个 script 要放在游戏自己的 script 之前。

   预载 + 同一下点击启动声音（iPhone 只有「点一下」才准播放声音，拖动不算）：
     play.html 会先用 ?mgs_wait=1 在后台载入游戏，游戏用 MGS.boot(fn) 登记开局动作但先不执行；
     玩家按网站的 Start 时，网站在同一下点击里呼叫 MGS.unlockAudio()（执行 MGS.onAudioUnlock 登记的
     声音启动函数），扣完 TOKEN 再呼叫 MGS.startNow() 开局。
   ========================================================= */
(function () {
  var embedded = window.parent !== window;
  var pending = null, seq = 0;

  /* ---------- 声音解锁 ---------- */
  var contexts = [];
  ["AudioContext", "webkitAudioContext"].forEach(function (name) {
    var Orig = window[name];
    if (!Orig || Orig.__mgs) return;
    var Wrapped = function () {
      var ctx = new (Function.prototype.bind.apply(Orig, [null].concat([].slice.call(arguments))))();
      contexts.push(ctx);
      return ctx;
    };
    Wrapped.prototype = Orig.prototype;
    Wrapped.__mgs = true;
    try { Object.setPrototypeOf(Wrapped, Orig); } catch (e) {}
    window[name] = Wrapped;
  });
  var unlockHooks = [];
  function wakeAudio() {
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    contexts.forEach(function (ctx) {
      if (ctx.state !== "running" && ctx.state !== "closed") {
        try {
          ctx.resume();
          var src = ctx.createBufferSource(); src.buffer = ctx.createBuffer(1, 1, 22050);
          src.connect(ctx.destination); src.start(0);
        } catch (e) {}
      }
    });
  }
  ["pointerdown", "pointerup", "touchstart", "touchend", "mousedown", "click", "keydown"].forEach(function (ev) {
    window.addEventListener(ev, wakeAudio, { capture: true, passive: true });
  });

  /* ---------- 预载：等网站说开始才开局 ---------- */
  var waiting = embedded && /[?&]mgs_wait=1(&|$)/.test(location.search);
  var bootFns = [];
  function startNow() {
    waiting = false;
    var fns = bootFns; bootFns = [];
    fns.forEach(function (fn) { try { fn(); } catch (e) { setTimeout(function () { throw e; }); } });
  }
  function unlockAudio() {
    unlockHooks.forEach(function (fn) { try { fn(); } catch (e) {} });
    wakeAudio();
  }

  /* ---------- 领取：接管 CLAIM NOW ---------- */
  var lastWin = null;
  if (embedded) {
    window.addEventListener("click", function (e) {
      var el = e.target && e.target.closest && e.target.closest("#claimBtn, [data-mgs-claim]");
      if (!el) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      post({ type: "claim", amount: lastWin && lastWin.amount, code: lastWin && lastWin.code, label: lastWin && lastWin.label });
    }, true);
  }

  /* ---------- 和外层网站沟通 ---------- */
  function post(msg) {
    if (!embedded) return;
    msg.mgs = 1;
    try { window.parent.postMessage(msg, "*"); } catch (e) {}
  }

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || d.mgs !== 1) return;
    if (d.type === "start") { unlockAudio(); startNow(); return; }   // 跨来源时的后备做法
    if (!pending || d.id !== pending.id) return;
    var fn = pending.fn;
    pending = null;
    if (d.type === "replay-ok") fn();
  });

  window.MGS = {
    embedded: embedded,
    win: function (v) {
      v = v || {};
      lastWin = { amount: v.amount, code: v.code, label: v.label };
      post({ type: "win", amount: v.amount, code: v.code, label: v.label });
    },
    gameOver: function () { post({ type: "over" }); },
    boot: function (fn) { if (waiting) bootFns.push(fn); else fn(); },
    startNow: startNow,
    onAudioUnlock: function (fn) { unlockHooks.push(fn); },
    unlockAudio: unlockAudio,
    get waiting() { return waiting; },
    get audioStates() { return contexts.map(function (c) { return c.state; }); },
    paid: function (fn) {
      return function () {
        var self = this, args = arguments;
        var run = function () { return fn.apply(self, args); };
        if (!embedded) return run();
        pending = { id: ++seq, fn: run };
        post({ type: "replay-request", id: pending.id });
      };
    }
  };
})();
