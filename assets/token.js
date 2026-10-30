/* =========================================================
   TOKEN SERVICE
   ---------------------------------------------------------
   现在是「演示模式」：余额存在浏览器 localStorage，默认 100 TOKEN。
   以后接第三方 API 时，只要填好 API_BASE，并让后端提供：
     GET  {API_BASE}/balance            -> { balance: number }
     POST {API_BASE}/play  {gameId}     -> { balance: number, sessionId: string }
   请求会自动带上  Authorization: Bearer <玩家token>
   玩家 token 来自第三方网站跳转过来的网址：  index.html?token=XXXX
   ========================================================= */
(function () {
  const CONFIG = {
    API_BASE: "",          // 例: "https://api.yoursite.com/v1"  留空 = 演示模式
    DEMO_START_BALANCE: 100,
    DEMO_NAME: "Guest"     // 没有玩家名字时显示
  };

  const LS_BAL = "mgs.demoBalance";
  const SS_TOKEN = "mgs.playerToken";

  function safe(fn, fallback) { try { return fn(); } catch (e) { return fallback; } }

  // 读取第三方带过来的 ?token=
  const urlToken = new URLSearchParams(location.search).get("token");
  if (urlToken) safe(() => sessionStorage.setItem(SS_TOKEN, urlToken));
  const playerToken = () => urlToken || safe(() => sessionStorage.getItem(SS_TOKEN), null);

  // 玩家名字：第三方跳转时带 ?name=Trevor（或由 API /balance 返回 name）
  const SS_NAME = "mgs.playerName";
  const urlName = new URLSearchParams(location.search).get("name");
  if (urlName) safe(() => sessionStorage.setItem(SS_NAME, urlName.slice(0, 40)));
  let apiName = null;
  const playerName = () => apiName || urlName || safe(() => sessionStorage.getItem(SS_NAME), null) || CONFIG.DEMO_NAME;

  let demoMemory = CONFIG.DEMO_START_BALANCE;
  const demoGet = () => {
    const v = safe(() => localStorage.getItem(LS_BAL), null);
    return v === null ? demoMemory : Number(v);
  };
  const demoSet = (n) => { demoMemory = n; safe(() => localStorage.setItem(LS_BAL, String(n))); };

  async function api(path, opts = {}) {
    const res = await fetch(CONFIG.API_BASE + path, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (playerToken() || ""),
        ...(opts.headers || {})
      }
    });
    if (!res.ok) throw new Error((await res.text()) || res.statusText);
    return res.json();
  }

  const listeners = new Set();
  const emit = (b) => listeners.forEach((fn) => fn(b));

  window.TokenService = {
    isDemo: !CONFIG.API_BASE,
    playerName,
    onChange(fn) { listeners.add(fn); },

    async getBalance() {
      let b;
      if (CONFIG.API_BASE) {
        const r = await api("/balance");
        b = r.balance;
        if (r.name) { apiName = String(r.name).slice(0, 40); safe(() => sessionStorage.setItem(SS_NAME, apiName)); }
      } else b = demoGet();
      emit(b);
      return b;
    },

    /** 扣 TOKEN 开一局。成功返回新余额，不足会抛出 Error("INSUFFICIENT") */
    async spend(gameId, cost) {
      let b;
      if (CONFIG.API_BASE) {
        b = (await api("/play", { method: "POST", body: JSON.stringify({ gameId }) })).balance;
      } else {
        const cur = demoGet();
        if (cur < cost) throw new Error("INSUFFICIENT");
        b = cur - cost;
        demoSet(b);
      }
      emit(b);
      return b;
    },

    /** 演示用：重置余额 */
    resetDemo() { demoSet(CONFIG.DEMO_START_BALANCE); emit(CONFIG.DEMO_START_BALANCE); }
  };
})();
