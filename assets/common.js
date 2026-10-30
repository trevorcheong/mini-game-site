/* 大厅和游戏页共用的小工具 */
(function () {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (t) => t.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();

  const ICON = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r=".6" fill="currentColor"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  /** 缩略图：有图用图，加载失败自动换成渐变占位 */
  function thumbImg(g, cls = "") {
    const ph = `<div class="ph" style="--c:${esc(g.color || "#7c5cff")}">${esc(g.title)}</div>`;
    if (!g.thumb) return ph;
    return `<img class="${cls}" src="${esc(g.thumb)}" alt="${esc(g.title)}" loading="lazy"
      onerror="this.outerHTML=this.nextElementSibling.innerHTML"><template>${ph}</template>`;
  }

  /** 顶部 TOKEN 显示 */
  function bindTokenPill() {
    const pill = document.getElementById("tokenPill");
    const num = document.getElementById("tokenNum");
    let last = null;
    TokenService.onChange((b) => {
      num.textContent = Number(b).toLocaleString();
      if (last !== null && last !== b) {
        pill.classList.remove("bump"); void pill.offsetWidth; pill.classList.add("bump");
        // 在 TOKEN 旁边飘出 −5 / +5
        const d = document.createElement("span");
        d.className = "pill-delta " + (b < last ? "minus" : "plus");
        d.textContent = (b < last ? "−" : "+") + Math.abs(b - last);
        pill.appendChild(d); setTimeout(() => d.remove(), 1600);
      }
      last = b;
    });
    return TokenService.getBalance().catch(() => { num.textContent = "—"; });
  }

  /** 顶部显眼通知。kind: "spend" | "win" */
  let noticeTimer;
  function notify({ kind = "spend", title = "", sub = "" } = {}) {
    let el = document.getElementById("notice");
    if (!el) { el = document.createElement("div"); el.id = "notice"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    const bar = document.querySelector(".topbar");
    el.style.top = ((bar ? bar.getBoundingClientRect().bottom : 0) + 12) + "px";
    const ico = kind === "win" ? '<span class="notice-ico win">🎉</span>' : '<span class="coin notice-coin">T</span>';
    el.className = "notice " + kind;
    el.innerHTML = `${ico}<span class="notice-txt"><b>${title}</b>${sub ? `<span>${sub}</span>` : ""}</span>`;
    void el.offsetWidth; el.classList.add("show");
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  let toastTimer;
  function toast(msg) {
    let el = document.getElementById("toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
  }

  /** 玩法弹窗。actions: [{label, cls, onClick}] */
  function openModal(g, { actions = [], subtitle, body, onClose } = {}) {
    modalOnClose = onClose || null;
    let m = document.getElementById("modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "modal"; m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
      document.body.appendChild(m);
    }
    const head = g.icon
      ? g.icon
      : g.thumb
      ? `<img src="${esc(g.thumb)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'mini-ph'}))">`
      : `<div class="mini-ph"></div>`;
    m.innerHTML = `
      <div class="modal-bg" data-close></div>
      <div class="modal-box">
        <button class="modal-close" data-close aria-label="Close">${ICON.close}</button>
        <div class="modal-head">${head}
          <div><h3>${esc(g.title)}</h3>
          <p>${subtitle || `<span class="coin sm">T</span> ${g.cost} TOKEN per play`}</p></div>
        </div>
        ${body != null ? body : `<ul class="howto">${(g.howTo || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`}
        <div class="modal-foot">${actions.map((a, i) => `<button class="btn ${a.cls || "btn-ghost"}" data-act="${i}" ${a.disabled ? "disabled" : ""}>${a.label}</button>`).join("")}</div>
      </div>`;
    m.querySelectorAll("[data-close]").forEach((el) => (el.onclick = closeModal));
    m.querySelectorAll("[data-act]").forEach((el) => (el.onclick = () => actions[+el.dataset.act].onClick()));
    m.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  let modalOnClose = null;
  function closeModal() {
    const m = document.getElementById("modal");
    if (m) m.classList.remove("open");
    document.body.style.overflow = "";
    const fn = modalOnClose; modalOnClose = null;
    if (fn) fn();
  }

  /* ---------- My Vouchers 栏 ---------- */
  const TICKET_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2.2"/></svg>';
  const timeAgo = (t) => {
    const s = Math.round((Date.now() - t) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    return new Date(t).toLocaleDateString();
  };

  const COPY_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5"/></svg>';
  const CHECK_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const gameOf = (id) => (window.GAMES || []).find((x) => x.id === id) || {};

  /** 复制文字（file:// 或旧浏览器没有 clipboard API 时用后备方法） */
  function copyText(text) {
    const legacy = () => new Promise((res, rej) => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      let ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
      ta.remove(); ok ? res() : rej();
    });
    try {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(legacy);
    } catch (e) {}
    return legacy();
  }
  /** 给复制按钮：复制 + 图标变 ✓ */
  function bindCopy(root) {
    root.querySelectorAll("[data-copy]").forEach((b) => (b.onclick = (e) => {
      e.stopPropagation();
      const code = b.dataset.copy;
      copyText(code).then(() => {
        toast("Copied: " + code);
        const ico = b.querySelector(".cp-ico");
        const lbl = b.querySelector(".cp-lbl");
        if (ico) { ico.innerHTML = CHECK_ICO; if (lbl) lbl.textContent = "COPIED"; b.classList.add("copied"); clearTimeout(b._t);
          b._t = setTimeout(() => { ico.innerHTML = COPY_ICO; if (lbl) lbl.textContent = "COPY"; b.classList.remove("copied"); }, 1600); }
      }, () => toast("Code: " + code + " (copy manually)"));
    }));
  }

  function openVoucherList() {
    const list = VoucherService.list();
    const fmt = VoucherService.fmt;
    const rows = list.length
      ? list.map((v) => `
        <li class="vrow">
          <div class="vrow-amt">${gameOf(v.gameId).thumb ? `<img src="${esc(gameOf(v.gameId).thumb)}" alt="">` : ""}<span>${esc(v.label)}</span></div>
          <div class="vrow-info"><b>${esc(v.gameTitle || "")}</b>${v.code ? `<code>${esc(v.code)}</code>` : ""}<span>${timeAgo(v.at)}</span></div>
          ${v.code ? `<button class="copy-btn" type="button" data-copy="${esc(v.code)}" aria-label="Copy voucher code ${esc(v.code)}"><span class="cp-ico">${COPY_ICO}</span><span class="cp-lbl">COPY</span></button>` : ""}
        </li>`).join("")
      : `<li class="vempty">No vouchers yet. Win one in any game!</li>`;
    const claim = VoucherService.claimUrl();
    openModal(
      { title: "My Vouchers", icon: `<div class="vbig-ico">${TICKET_ICO}</div>` },
      {
        subtitle: `${list.length} voucher${list.length === 1 ? "" : "s"} · Total <b class="gold">${fmt(VoucherService.total())}</b>`,
        body: `<ul class="vlist">${rows}</ul>`,
        actions: claim
          ? [{ label: "Claim on partner site", cls: "btn-gold", onClick: () => window.open(claim, "_blank", "noopener") }]
          : [{ label: "Close", onClick: closeModal }]
      }
    );
    bindCopy(document.getElementById("modal"));
  }

  /** 在 el 里放 My Vouchers 栏。hideEmpty=true 时没有 voucher 就隐藏 */
  function mountVoucherBar(el, { hideEmpty = false } = {}) {
    el.classList.add("vbar");
    el.innerHTML = `
      <div class="vbar-in">
        <button class="vbar-sum" type="button" aria-label="View all vouchers">
          <span class="vbar-ico">${TICKET_ICO}</span>
          <span class="vbar-txt"><small>MY VOUCHERS</small><b><span data-total>RM0.00</span><i data-count>0</i></b></span>
        </button>
        <div class="vchips" data-chips></div>
        <button class="vbar-all" type="button">View all</button>
      </div>`;
    const chips = el.querySelector("[data-chips]");
    el.querySelector(".vbar-sum").onclick = openVoucherList;
    el.querySelector(".vbar-all").onclick = openVoucherList;
    chips.onclick = (e) => { if (e.target.closest(".vchip-main")) openVoucherList(); };

    VoucherService.onChange((list, added) => {
      el.classList.toggle("hidden", hideEmpty && !list.length);
      el.querySelector("[data-total]").textContent = VoucherService.fmt(VoucherService.total());
      el.querySelector("[data-count]").textContent = list.length;
      chips.innerHTML = list.length
        ? list.slice(0, 30).map((v) => `
          <div class="vchip ${added && v.id === added.id ? "new" : ""}">
            <button class="vchip-main" type="button" title="${esc(v.gameTitle || "")}">
              ${gameOf(v.gameId).thumb ? `<img class="vchip-ico" src="${esc(gameOf(v.gameId).thumb)}" alt="">` : `<span class="vchip-ico ph-ico">${TICKET_ICO}</span>`}
              <span class="vchip-txt"><b>${esc(v.label)}</b><span>${esc(v.gameTitle || "")}</span></span>
            </button>
            ${v.code ? `<button class="copy-btn sm" type="button" data-copy="${esc(v.code)}" title="Copy ${esc(v.code)}" aria-label="Copy voucher code ${esc(v.code)}"><span class="cp-ico">${COPY_ICO}</span><span class="cp-lbl">COPY</span></button>` : ""}
          </div>`).join("")
        : `<span class="vchips-empty">Win a game to collect vouchers here</span>`;
      bindCopy(chips);
      if (added) {
        chips.scrollTo({ left: 0, behavior: "smooth" });
        el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
      }
    });
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  window.UI = { esc, initials, ICON, thumbImg, bindTokenPill, toast, openModal, closeModal, mountVoucherBar, openVoucherList, copyText, notify };
})();
