/* =========================================================
   MGS Bridge — 让游戏和外层网站（play.html）沟通
   ---------------------------------------------------------
   新游戏接入方法（在游戏 HTML 里加 <script src="mgs-bridge.js"></script>）：
     MGS.win({ amount: 0.5, code: "ABC-123", label: "RM0.50" })   玩家赢了 voucher
     MGS.gameOver()                                                整局输了（没命/没机会了）
     btn.onclick = MGS.paid(restartFn)                             这个按钮要先扣 TOKEN 才执行
   游戏单独打开（不在网站里）时：win/gameOver 不做事，paid 直接执行。
   ========================================================= */
(function () {
  var embedded = window.parent !== window;
  var pending = null, seq = 0;

  function post(msg) {
    if (!embedded) return;
    msg.mgs = 1;
    try { window.parent.postMessage(msg, "*"); } catch (e) {}
  }

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || d.mgs !== 1 || !pending || d.id !== pending.id) return;
    var fn = pending.fn;
    pending = null;
    if (d.type === "replay-ok") fn();
  });

  window.MGS = {
    embedded: embedded,
    win: function (v) {
      v = v || {};
      post({ type: "win", amount: v.amount, code: v.code, label: v.label });
    },
    gameOver: function () { post({ type: "over" }); },
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
