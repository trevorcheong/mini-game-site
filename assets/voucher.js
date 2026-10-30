/* =========================================================
   VOUCHER SERVICE — 玩家赢到的所有 voucher + 领取（CLAIM）接口
   ---------------------------------------------------------
   演示模式：voucher 存在浏览器 localStorage。

   ★ 领取接口（CLAIM）
   玩家按游戏里的 CLAIM NOW，或 My Vouchers 里的 Claim，网站会在「同一个窗口」
   跳回合作方网站的领取网址，并带上这些参数：

     {claim_url}?code=CROC-7KQ2PX      voucher code
                &amount=0.70           金额
                &currency=MYR          货币
                &voucher_id=lx2k9a1b   本网站的 voucher 编号（防重复领取用）
                &game=croc-road        哪个游戏赢的
                &token=<玩家token>     第三方带过来的玩家 token（识别玩家）

   领取网址的来源（优先顺序）：
     1. 合作方跳过来时带在网址：index.html?token=XXX&claim_url=https://partner.com/claim
     2. 下面 CONFIG.CLAIM_URL 的默认值
   两个都没有时，CLAIM 会显示 voucher code 让玩家复制。

   以后接 API（token.js 填好 API_BASE）：赢到时 POST {API_BASE}/vouchers，
   领取前 POST {API_BASE}/vouchers/{voucher_id}/claim，由后端确认没被领过。
   ========================================================= */
(function () {
  const CONFIG = {
    CURRENCY: "RM",
    CURRENCY_CODE: "MYR",
    CLAIM_URL: ""        // 默认领取网址，例: "https://partner-site.com/claim"
  };
  const LS = "mgs.vouchers";
  const SS_CLAIM = "mgs.claimUrl";
  let memory = [];
  const safe = (fn, fb) => { try { return fn(); } catch (e) { return fb; } };
  const read = () => safe(() => JSON.parse(localStorage.getItem(LS) || "[]"), memory);
  const write = (list) => { memory = list; safe(() => localStorage.setItem(LS, JSON.stringify(list))); };

  // 合作方带来的领取网址（只接受 http/https）
  const urlClaim = new URLSearchParams(location.search).get("claim_url");
  if (urlClaim && /^https?:\/\//i.test(urlClaim)) safe(() => sessionStorage.setItem(SS_CLAIM, urlClaim));
  const claimBase = () => safe(() => sessionStorage.getItem(SS_CLAIM), null) || CONFIG.CLAIM_URL || "";

  const listeners = new Set();
  const emit = (list, added) => listeners.forEach((fn) => fn(list, added));

  const toNum = (a) => { const n = parseFloat(String(a == null ? "" : a).replace(/[^0-9.]/g, "")); return isFinite(n) ? n : 0; };
  const fmt = (n) => CONFIG.CURRENCY + Number(n).toFixed(2);

  window.VoucherService = {
    config: CONFIG,
    fmt,
    onChange(fn) { listeners.add(fn); fn(read(), null); },
    list() { return read(); },
    get(id) { return read().find((v) => v.id === id) || null; },
    total() { return read().reduce((s, v) => s + (v.amount || 0), 0); },
    add({ gameId, gameTitle, amount, code, label }) {
      const v = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        gameId, gameTitle,
        amount: toNum(amount),
        label: label || fmt(toNum(amount)),
        code: code || "",
        at: Date.now(),
        claimed: false
      };
      const list = [v, ...read()];
      write(list);
      emit(list, v);
      // TODO(API): POST {API_BASE}/vouchers
      return v;
    },

    /** 是否已设定领取网址 */
    canClaim() { return !!claimBase(); },

    /** 组出领取网址（没有设定时回传 ""） */
    claimUrl(v) {
      const base = claimBase();
      if (!base) return "";
      const u = new URL(base, location.href);
      if (v) {
        u.searchParams.set("code", v.code || "");
        u.searchParams.set("amount", Number(v.amount || 0).toFixed(2));
        u.searchParams.set("currency", CONFIG.CURRENCY_CODE);
        u.searchParams.set("voucher_id", v.id);
        if (v.gameId) u.searchParams.set("game", v.gameId);
        const t = window.TokenService && TokenService.playerToken && TokenService.playerToken();
        if (t) u.searchParams.set("token", t);
      }
      return u.toString();
    },

    /** 领取：标记已领取，然后在同一个窗口跳到合作方网站。没有领取网址时回传 false */
    claim(v) {
      if (!v) return false;
      const url = this.claimUrl(v);
      if (!url) return false;
      // TODO(API): await POST {API_BASE}/vouchers/{v.id}/claim
      const list = read().map((x) => (x.id === v.id ? Object.assign({}, x, { claimed: true, claimedAt: Date.now() }) : x));
      write(list); emit(list, null);
      window.top.location.href = url;
      return true;
    },

    clearDemo() { write([]); emit([], null); }
  };
})();
