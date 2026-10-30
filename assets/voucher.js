/* =========================================================
   VOUCHER SERVICE — 玩家赢到的所有 voucher
   ---------------------------------------------------------
   演示模式：存在浏览器 localStorage。
   以后接 API：填 token.js 的 API_BASE 后，赢到时会 POST {API_BASE}/vouchers
   body { gameId, amount, code, label }，并用 GET {API_BASE}/vouchers 读回列表。
   CLAIM_URL：玩家回第三方网站领取的地址（留空就不显示 Claim 按钮）
   ========================================================= */
(function () {
  const CONFIG = {
    CURRENCY: "RM",
    CLAIM_URL: ""        // 例: "https://partner-site.com/claim"
  };
  const LS = "mgs.vouchers";
  let memory = [];
  const read = () => { try { return JSON.parse(localStorage.getItem(LS) || "[]"); } catch (e) { return memory; } };
  const write = (list) => { memory = list; try { localStorage.setItem(LS, JSON.stringify(list)); } catch (e) {} };

  const listeners = new Set();
  const emit = (list, added) => listeners.forEach((fn) => fn(list, added));

  const toNum = (a) => { const n = parseFloat(String(a == null ? "" : a).replace(/[^0-9.]/g, "")); return isFinite(n) ? n : 0; };
  const fmt = (n) => CONFIG.CURRENCY + Number(n).toFixed(2);

  window.VoucherService = {
    config: CONFIG,
    fmt,
    onChange(fn) { listeners.add(fn); fn(read(), null); },
    list() { return read(); },
    total() { return read().reduce((s, v) => s + (v.amount || 0), 0); },
    add({ gameId, gameTitle, amount, code, label }) {
      const v = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        gameId, gameTitle,
        amount: toNum(amount),
        label: label || fmt(toNum(amount)),
        code: code || "",
        at: Date.now()
      };
      const list = [v, ...read()];
      write(list);
      emit(list, v);
      // TODO(API): POST {API_BASE}/vouchers
      return v;
    },
    claimUrl(v) {
      if (!CONFIG.CLAIM_URL) return "";
      const u = new URL(CONFIG.CLAIM_URL, location.href);
      if (v) { u.searchParams.set("code", v.code); u.searchParams.set("amount", v.amount.toFixed(2)); }
      return u.toString();
    },
    clearDemo() { write([]); emit([], null); }
  };
})();
