/* =========================================================
   I18N — 网站外框的语言（大厅、游戏页的外框、My Vouchers、弹窗）
   ---------------------------------------------------------
   目前有：en（英文，预设）、zh（中文）。游戏本身（iframe 里）还是英文。
   语言来源（优先顺序）：网址 ?lang=zh / ?lang=en → 玩家上次选的（localStorage）→ en
   加新语言：在 DICT 加一组同样的 key，并在 LANGS 加上名字。
   游戏玩法的中文在 games.config.js 的 howTo_zh。
   ========================================================= */
(function () {
  const LS = "mgs.lang";
  const LANGS = { en: "EN", zh: "中文" };
  const DICT = {
    en: {
      tagline: "PLAY · WIN · CLAIM",
      tokenTitle: "Your token balance",
      introH1: "Play games, <em>win vouchers.</em>",
      introP: "Pick a game, spend tokens to play, and claim your voucher back on your site.",
      allGames: "All Games",
      search: "Search games",
      noGames: "No games found.",
      sortAZ: "A–Z",
      sortTitle: "Sort games A to Z",
      langTitle: "Language",
      playAria: "Play {t}",
      howAria: "How to play {t}",
      playCost: "Play · {n} TOKEN",
      footer: "Play responsibly · T&amp;Cs apply",
      demoMode: "Demo mode",
      resetDemo: "reset demo",
      demoReset: "Demo tokens & vouchers reset",
      perPlay: "{n} TOKEN per play",
      player: "PLAYER",
      playerToast: "Player: {n}",
      close: "Close",
      done: "Done",
      gotIt: "Got it",
      copy: "COPY",
      copied: "COPIED",
      copiedToast: "Copied: {c}",
      copyManual: "Code: {c} (copy manually)",
      copyAria: "Copy voucher code {c}",
      claim: "CLAIM",
      claimed: "CLAIMED",
      claimTitle: "Claim {v}",
      claimGoing: "Taking you to claim {v}…",
      claimBody: "Your voucher is saved in <b>My Vouchers</b>. Use this code on the partner site to claim it.",
      voucher: "Voucher",
      myVouchers: "My Vouchers",
      myVouchersCaps: "MY VOUCHERS",
      viewAll: "View all",
      viewAllAria: "View all vouchers",
      vEmpty: "No vouchers yet. Win one in any game!",
      vChipsEmpty: "Win a game to collect vouchers here",
      vCount: "{n} voucher{s} · Total <b class=\"gold\">{t}</b>",
      justNow: "just now",
      mAgo: "{n}m ago",
      hAgo: "{n}h ago",
      /* play.html */
      back: "Back to games",
      loading: "Loading…",
      howTo: "How to play",
      playAgain: "Play again",
      cost: "COST",
      yourBalance: "YOUR BALANCE",
      howToCaps: "HOW TO PLAY",
      notFound: "Game not found",
      loadingGame: "Loading game…",
      startUse: "Start · use {n} TOKEN",
      notEnough: "Not enough TOKEN",
      notEnoughDot: "Not enough TOKEN.",
      starting: "Starting…",
      startFail: "Could not start the game. Please try again.",
      startFailShort: "Could not start. Try again.",
      spendSub: "Balance: {b} TOKEN · Good luck!",
      inProgress: "Game in progress",
      leaveNote: "This game isn't finished yet. If you leave now, the <b class=\"gold\">{n} TOKEN</b> you used <b>will not be returned</b>.",
      restartNote: "This game isn't finished yet. If you restart now, the <b class=\"gold\">{n} TOKEN</b> you used <b>will not be returned</b>.",
      leaveAnyway: "Leave anyway",
      keepPlaying: "Keep playing",
      cancel: "Cancel",
      playAgainQ: "Play again for <span class=\"coin sm\">T</span> {n} TOKEN?",
      playAgainBtn: "Play again · {n}",
      yourBalanceSub: "Your balance: <span class=\"coin sm\">T</span> {b} TOKEN",
      playAgainQ2: "Play again for <b class=\"gold\">{n} TOKEN</b>?",
      needMore: "You need <b class=\"gold\">{n} TOKEN</b> to play again.",
      youWon: "You won {v}!",
      voucherSaved: "Voucher saved to My Vouchers"
    },
    zh: {
      tagline: "玩游戏 · 赢奖励 · 领取",
      tokenTitle: "你的 TOKEN 余额",
      introH1: "玩游戏，<em>赢现金券。</em>",
      introP: "选一个游戏，用 TOKEN 来玩，赢到的现金券回到你的网站领取。",
      allGames: "全部游戏",
      search: "搜索游戏",
      noGames: "找不到游戏。",
      sortAZ: "A–Z",
      sortTitle: "按 A 到 Z 排序",
      langTitle: "语言",
      playAria: "开始玩 {t}",
      howAria: "{t} 怎么玩",
      playCost: "开始玩 · {n} TOKEN",
      footer: "理性游戏 · 适用条款与条件",
      demoMode: "演示模式",
      resetDemo: "重置演示",
      demoReset: "演示 TOKEN 和现金券已重置",
      perPlay: "每次 {n} TOKEN",
      player: "玩家",
      playerToast: "玩家：{n}",
      close: "关闭",
      done: "好的",
      gotIt: "知道了",
      copy: "复制",
      copied: "已复制",
      copiedToast: "已复制：{c}",
      copyManual: "代码：{c}（请手动复制）",
      copyAria: "复制现金券代码 {c}",
      claim: "领取",
      claimed: "已领取",
      claimTitle: "领取 {v}",
      claimGoing: "正在前往领取 {v}…",
      claimBody: "你的现金券已存在 <b>我的现金券</b>。在合作网站输入这个代码即可领取。",
      voucher: "现金券",
      myVouchers: "我的现金券",
      myVouchersCaps: "我的现金券",
      viewAll: "查看全部",
      viewAllAria: "查看全部现金券",
      vEmpty: "还没有现金券，去玩游戏赢一张吧！",
      vChipsEmpty: "赢了游戏，现金券会出现在这里",
      vCount: "{n} 张现金券 · 合计 <b class=\"gold\">{t}</b>",
      justNow: "刚刚",
      mAgo: "{n} 分钟前",
      hAgo: "{n} 小时前",
      back: "返回游戏大厅",
      loading: "载入中…",
      howTo: "怎么玩",
      playAgain: "再玩一次",
      cost: "费用",
      yourBalance: "你的余额",
      howToCaps: "怎么玩",
      notFound: "找不到这个游戏",
      loadingGame: "游戏载入中…",
      startUse: "开始 · 使用 {n} TOKEN",
      notEnough: "TOKEN 不足",
      notEnoughDot: "TOKEN 不足。",
      starting: "开始中…",
      startFail: "无法开始游戏，请再试一次。",
      startFailShort: "无法开始，请再试一次。",
      spendSub: "余额：{b} TOKEN · 祝你好运！",
      inProgress: "游戏进行中",
      leaveNote: "这局游戏还没结束。现在离开的话，已使用的 <b class=\"gold\">{n} TOKEN</b> <b>不会退还</b>。",
      restartNote: "这局游戏还没结束。现在重新开始的话，已使用的 <b class=\"gold\">{n} TOKEN</b> <b>不会退还</b>。",
      leaveAnyway: "仍然离开",
      keepPlaying: "继续玩",
      cancel: "取消",
      playAgainQ: "用 <span class=\"coin sm\">T</span> {n} TOKEN 再玩一次？",
      playAgainBtn: "再玩一次 · {n}",
      yourBalanceSub: "你的余额：<span class=\"coin sm\">T</span> {b} TOKEN",
      playAgainQ2: "用 <b class=\"gold\">{n} TOKEN</b> 再玩一次？",
      needMore: "需要 <b class=\"gold\">{n} TOKEN</b> 才能再玩。",
      youWon: "你赢了 {v}！",
      voucherSaved: "现金券已存入「我的现金券」"
    }
  };

  const safe = (fn, fb) => { try { return fn(); } catch (e) { return fb; } };
  const fromUrl = new URLSearchParams(location.search).get("lang");
  let lang = (fromUrl && DICT[fromUrl]) ? fromUrl : safe(() => localStorage.getItem(LS), null);
  if (!DICT[lang]) lang = "en";
  if (fromUrl && DICT[fromUrl]) safe(() => localStorage.setItem(LS, fromUrl));
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  const listeners = new Set();
  function t(key, vars) {
    let s = (DICT[lang] && DICT[lang][key]) != null ? DICT[lang][key] : (DICT.en[key] != null ? DICT.en[key] : key);
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  }

  window.I18N = {
    LANGS,
    get lang() { return lang; },
    t,
    /** 游戏玩法：中文有 howTo_zh 就用它 */
    howTo(g) { return (lang === "zh" && g.howTo_zh) || g.howTo || []; },
    set(l) {
      if (!DICT[l] || l === lang) return;
      lang = l;
      safe(() => localStorage.setItem(LS, l));
      document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
      listeners.forEach((fn) => fn(l));
    },
    onChange(fn) { listeners.add(fn); },
    /** 把页面上有 data-i18n（文字）/ data-i18n-html（HTML）/ data-i18n-ph（placeholder）/ data-i18n-title / data-i18n-aria 的元素换成目前语言 */
    apply(root) {
      (root || document).querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
      (root || document).querySelectorAll("[data-i18n-html]").forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
      (root || document).querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
      (root || document).querySelectorAll("[data-i18n-title]").forEach((el) => (el.title = t(el.dataset.i18nTitle)));
      (root || document).querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    }
  };
})();
