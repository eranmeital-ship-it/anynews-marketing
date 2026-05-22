// AnyNews shared partials — top nav, footer, sidebar.
// Sidebar has TWO MODES:
//   - workspace: shown on dashboard, analytics, usage, account pages
//   - channel: shown when you're inside a specific channel

const ICONS = {
  // AnyNews.ai mark — a broadcast "play" triangle emitting concentric signal
  // pulses. Reads as "detect a signal → broadcast it everywhere".
  logo: `<svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 20 L14 8 L21 20" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="14" cy="17" r="2" fill="#fff"/>
    <path d="M8.5 14.5 L14 14.5 M14 14.5 L19.5 14.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  </svg>`,
  arrow: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  play: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
};

// ────────── logo ──────────
function logo(href = '../index') {
  return `
    <a href="${href}" class="logo">
      <span class="logo-mark">${ICONS.logo}</span>
      <span>AnyNews<span class="gradient-text">.ai</span></span>
    </a>`;
}

// ────────── marketing top nav ──────────
function topnav(activePage = '') {
  const link = (page, label) => {
    const active = activePage === page ? ' active' : '';
    return `<a class="topnav-link${active}" href="${page}">${label}</a>`;
  };
  return `
    <div class="topnav">
      <div class="topnav-left">
        ${logo('index')}
        <nav class="topnav-nav">
          ${link('index', 'Product')}
          ${link('how-it-works', 'How it works')}
          ${link('pricing', 'Pricing')}
          ${link('about', 'About')}
          ${link('contact', 'Contact')}
        </nav>
      </div>
      <div class="topnav-right">
        <a class="topnav-link" href="app/signin">Sign in</a>
        <a class="btn btn-primary btn-sm" href="app/signup">Start free ${ICONS.arrow}</a>
      </div>
    </div>`;
}

// ────────── footer (marketing) ──────────
function footer() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            ${logo('index')}
            <p class="body mt-4 muted" style="max-width: 320px;">
              Run your own AI newsroom. Pick any topic, publish to every social.
            </p>
          </div>
          <div>
            <h4 class="footer-col-title">Product</h4>
            <div class="footer-links">
              <a href="index">Home</a>
              <a href="how-it-works">How it works</a>
              <a href="pricing">Pricing</a>
              <a href="app/signup">Get started</a>
            </div>
          </div>
          <div>
            <h4 class="footer-col-title">Company</h4>
            <div class="footer-links">
              <a href="about">About</a>
              <a href="contact">Contact</a>
              <a href="#">Press</a>
              <a href="#">Careers</a>
            </div>
          </div>
          <div>
            <h4 class="footer-col-title">Legal</h4>
            <div class="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
              <a href="#">Status</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 AnyNews.ai — All rights reserved</span>
          <span>Made with care</span>
        </div>
      </div>
    </footer>`;
}

// ────────── icon set used by both sidebars ──────────
const SIDEBAR_ICO = {
  home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  channels: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  analytics: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 12 4-4 4 4 5-5"/></svg>',
  billing: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
  account: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  signal: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  posts: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  sources: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>',
  connections: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  voice: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  design: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  templates: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
  ops: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  signout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
};

// ────────── WORKSPACE SIDEBAR ──────────
function sidebarWorkspace(activeItem = 'dashboard') {
  const item = (key, label, ico, href) => {
    const active = activeItem === key ? ' active' : '';
    return `<a class="sidebar-item${active}" href="${href}">
      <span class="ico">${ico}</span>
      <span>${label}</span>
    </a>`;
  };
  return `
    <aside class="sidebar">
      ${logo('../index')}

      <div class="sidebar-section-title">Workspace</div>
      ${item('dashboard', 'Dashboard', SIDEBAR_ICO.home, 'dashboard')}
      ${item('channels', 'News channels', SIDEBAR_ICO.channels, 'dashboard')}
      ${item('analytics', 'Analytics', SIDEBAR_ICO.analytics, 'analytics')}
      ${item('templates', 'Templates', SIDEBAR_ICO.templates, 'templates')}

      <div class="sidebar-section-title">Account</div>
      ${item('billing', 'Usage & billing', SIDEBAR_ICO.billing, 'billing')}
      ${item('account', 'Account', SIDEBAR_ICO.account, 'account')}
      ${item('ops', 'Scheduled refresh', SIDEBAR_ICO.ops, 'ops')}

      <div class="sidebar-spacer"></div>
      <a href="#" class="sidebar-item sb-signout">
        <span class="ico">${SIDEBAR_ICO.signout}</span>
        <span>Sign out</span>
      </a>
      <a href="account" class="sidebar-user">
        <span class="avatar sb-avatar">··</span>
        <div style="display: flex; flex-direction: column; line-height: 1.2;">
          <span class="sb-name" style="font-size: 13px; font-weight: 600; color: var(--text-primary);">&nbsp;</span>
          <span class="sb-plan" style="font-size: 11px; color: var(--text-tertiary);">&nbsp;</span>
        </div>
      </a>
    </aside>`;
}

// ────────── CHANNEL SIDEBAR ──────────
// channelSlug — used to scope sub-page URLs. activeItem matches the section key.
function sidebarChannel(channelName = 'Gold & Silver News', channelSlug = 'gold-silver-news', activeItem = 'signal-room') {
  // Preserve the ?id=<uuid> across channel-scoped page navigation.
  const qs = (() => {
    try {
      const u = new URLSearchParams(location.search);
      const id = u.get('id');
      return id ? '?id=' + encodeURIComponent(id) : '';
    } catch (e) { return ''; }
  })();
  const item = (key, label, ico, page) => {
    const active = activeItem === key ? ' active' : '';
    return `<a class="sidebar-item${active}" href="${page}${qs}">
      <span class="ico">${ico}</span>
      <span>${label}</span>
    </a>`;
  };

  return `
    <aside class="sidebar">
      ${logo('../index')}

      <a href="dashboard" class="sidebar-item" style="margin-bottom: 8px; color: var(--text-tertiary);">
        ${SIDEBAR_ICO.back}
        <span style="font-size: 13px;">All news channels</span>
      </a>

      <div style="padding: 12px 12px 8px; display: flex; gap: 10px; align-items: center;">
        <div style="width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #7E22CE, #EC4899); flex-shrink: 0;"></div>
        <span style="font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1.2;">${channelName}</span>
      </div>

      <div class="sidebar-section-title">Channel</div>
      ${item('signal-room', 'Signal Room', SIDEBAR_ICO.signal, 'channel-signal-room')}
      ${item('posts', 'Posts', SIDEBAR_ICO.posts, 'channel-posts')}
      ${item('sources', 'Sources', SIDEBAR_ICO.sources, 'channel-sources')}
      ${item('connections', 'Connected socials', SIDEBAR_ICO.connections, 'channel-connections')}

      <div class="sidebar-section-title">Brand</div>
      ${item('voice', 'Brand voice', SIDEBAR_ICO.voice, 'channel-brand-voice')}
      ${item('design', 'Design', SIDEBAR_ICO.design, 'channel-design')}

      <div class="sidebar-section-title">Insights</div>
      ${item('analytics', 'Analytics', SIDEBAR_ICO.analytics, 'channel-analytics')}
      ${item('settings', 'Channel settings', SIDEBAR_ICO.settings, 'channel-settings')}

      <div class="sidebar-spacer"></div>
      <a href="#" class="sidebar-item sb-signout">
        <span class="ico">${SIDEBAR_ICO.signout}</span>
        <span>Sign out</span>
      </a>
      <a href="account" class="sidebar-user">
        <span class="avatar sb-avatar">··</span>
        <div style="display: flex; flex-direction: column; line-height: 1.2;">
          <span class="sb-name" style="font-size: 13px; font-weight: 600; color: var(--text-primary);">&nbsp;</span>
          <span class="sb-plan" style="font-size: 11px; color: var(--text-tertiary);">&nbsp;</span>
        </div>
      </a>
    </aside>`;
}

// Boot — replace placeholder elements with rendered HTML
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-include="topnav"]').forEach(el => {
    el.outerHTML = topnav(el.dataset.active || '');
  });
  document.querySelectorAll('[data-include="footer"]').forEach(el => {
    el.outerHTML = footer();
  });
  document.querySelectorAll('[data-include="sidebar-workspace"]').forEach(el => {
    el.outerHTML = sidebarWorkspace(el.dataset.active || 'dashboard');
  });
  document.querySelectorAll('[data-include="sidebar-channel"]').forEach(el => {
    el.outerHTML = sidebarChannel(
      el.dataset.channelName || 'Gold & Silver News',
      el.dataset.channelSlug || 'gold-silver-news',
      el.dataset.active || 'signal-room'
    );
  });
  // Legacy support — if any old pages still use this, fall back to workspace sidebar
  document.querySelectorAll('[data-include="sidebar"]').forEach(el => {
    el.outerHTML = sidebarWorkspace(el.dataset.active || 'dashboard');
  });

  // Hydrate sidebar identity + sign-out (only on app pages where auth.js is loaded)
  if (window.anynewsAuth) {
    const initials = s => {
      if (!s) return '··';
      const parts = String(s).trim().split(/\s+/).filter(Boolean);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return s.slice(0, 2).toUpperCase();
    };
    const titlecase = s => s ? s[0].toUpperCase() + s.slice(1) : '';

    (async () => {
      try {
        const profile = await window.anynewsAuth.getProfile().catch(() => null);
        let displayName = profile?.full_name || profile?.email || '';
        let plan = profile?.plan ? titlecase(profile.plan) + ' plan' : '';
        if (!displayName) {
          const session = await window.anynewsAuth.getSession().catch(() => null);
          displayName = session?.user?.email || '';
        }
        document.querySelectorAll('.sb-avatar').forEach(el => { el.textContent = initials(displayName); });
        document.querySelectorAll('.sb-name').forEach(el => { el.textContent = displayName || ''; });
        document.querySelectorAll('.sb-plan').forEach(el => { el.textContent = plan; });
      } catch (e) { /* leave slots blank on failure */ }
    })();

    document.querySelectorAll('.sb-signout').forEach(el => {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        try { await window.anynewsAuth.signOut(); } catch (err) { /* fall through to redirect */ }
        window.location.replace('../login');
      });
    });
  }
});

// ────────── Reusable color picker wiring ──────────
// Call window.wireColorPicker(element, onChange)
// onChange receives { color, end, gradient, opacity }
window.wireColorPicker = function(root, onChange) {
  const trigger = root.querySelector('.cpick-trigger');
  const triggerChip = root.querySelector('.cpick-trigger-chip');
  const triggerHex = root.querySelector('.cpick-trigger-hex');
  const panel = root.querySelector('.cpick-panel');

  // Big preview bar + its hidden native color input
  const previewBar = root.querySelector('.cpick-preview-bar');
  const colorInput = root.querySelector('.cpick-color-input');

  // Presets (palette grid)
  const presets = root.querySelectorAll('.cpick-preset');

  // Hex input (main color)
  const hexInput = root.querySelector('.cpick-hex:not(.end-hex)');

  // Gradient end (optional)
  const endSwatch = root.querySelector('.cpick-end-swatch');
  const endColorInput = root.querySelector('.cpick-color-input-end');
  const endHexInput = root.querySelector('.cpick-hex.end-hex');
  const gradientToggle = root.querySelector('.cpick-gradient-toggle input[type=checkbox]');

  // Opacity (optional)
  const opacityRange = root.querySelector('.cpick-opacity-section input[type=range]');
  const opacityVal = root.querySelector('.cpick-opacity-val');

  // Normalize a hex string for storage — always 6-char uppercase with leading #
  function normalizeHex(v) {
    if (!v) return null;
    let s = String(v).trim().replace(/^#/, '').toUpperCase();
    if (s.length === 3) s = s[0]+s[0]+s[1]+s[1]+s[2]+s[2];
    if (!/^[0-9A-F]{6}$/.test(s)) return null;
    return '#' + s;
  }

  // Internal state — kept as authoritative values
  let mainColor = normalizeHex(hexInput && hexInput.value) || '#000000';
  let endColor = normalizeHex(endHexInput && endHexInput.value) || '#FBB034';
  let isGradient = !!(gradientToggle && gradientToggle.checked);
  let opacity = opacityRange ? parseInt(opacityRange.value) : 100;

  function getState() {
    return { color: mainColor, end: endColor, gradient: isGradient, opacity };
  }

  function syncUI() {
    // Update the trigger chip
    if (triggerChip) {
      triggerChip.style.background = isGradient
        ? `linear-gradient(135deg, ${mainColor}, ${endColor})`
        : mainColor;
    }
    if (triggerHex) {
      triggerHex.textContent = isGradient
        ? `${mainColor} → ${endColor.replace('#','')}`
        : mainColor;
    }

    // Update the big preview bar (use a CSS variable so the bar can show solid or gradient)
    if (previewBar) {
      previewBar.style.background = isGradient
        ? `linear-gradient(135deg, ${mainColor}, ${endColor})`
        : mainColor;
    }

    // Sync native color inputs
    if (colorInput) colorInput.value = mainColor;
    if (endColorInput) endColorInput.value = endColor;

    // Sync end swatch
    if (endSwatch) endSwatch.style.background = endColor;

    // Sync hex inputs (strip the #, uppercase)
    if (hexInput && document.activeElement !== hexInput) {
      hexInput.value = mainColor.replace('#', '');
    }
    if (endHexInput && document.activeElement !== endHexInput) {
      endHexInput.value = endColor.replace('#', '');
    }

    // Mark active preset
    presets.forEach(p => {
      const c = normalizeHex(p.dataset.c);
      p.classList.toggle('active', c === mainColor);
    });

    // Apply gradient-on class to the inner .cpick element (not root wrapper)
    // so CSS selector `.cpick.gradient-on .cpick-end-row` matches correctly.
    const cpickEl = root.querySelector('.cpick') || root;
    cpickEl.classList.toggle('gradient-on', isGradient);
  }

  function setMain(hex) {
    const n = normalizeHex(hex);
    if (!n) return;
    mainColor = n;
    syncUI();
    if (onChange) onChange(getState());
  }

  function setEnd(hex) {
    const n = normalizeHex(hex);
    if (!n) return;
    endColor = n;
    syncUI();
    if (onChange) onChange(getState());
  }

  // ── Popup open/close ──
  if (trigger && panel) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !panel.hasAttribute('hidden');
      // Close all other open pickers
      document.querySelectorAll('.cpick-panel').forEach(p => {
        if (p !== panel) p.setAttribute('hidden', '');
      });
      document.querySelectorAll('.cpick-trigger.open').forEach(t => {
        if (t !== trigger) t.classList.remove('open');
      });
      if (isOpen) {
        panel.setAttribute('hidden', '');
        trigger.classList.remove('open');
      } else {
        panel.removeAttribute('hidden');
        trigger.classList.add('open');
      }
    });
    panel.addEventListener('click', (e) => e.stopPropagation());
  }

  // ── Preset clicks ──
  presets.forEach(p => {
    p.addEventListener('click', (e) => {
      e.preventDefault();
      setMain(p.dataset.c);
    });
  });

  // ── Native color picker on big preview bar (main color) ──
  if (colorInput) {
    colorInput.addEventListener('input', (e) => setMain(e.target.value));
  }

  // ── Native color picker on end swatch (gradient end) ──
  if (endColorInput) {
    endColorInput.addEventListener('input', (e) => setEnd(e.target.value));
  }

  // ── Hex inputs — live update on every keystroke ──
  if (hexInput) {
    hexInput.addEventListener('input', (e) => {
      // Strip any # the user types, uppercase, validate
      let v = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase().slice(0, 6);
      e.target.value = v;
      if (v.length === 6) setMain('#' + v);
    });
    hexInput.addEventListener('blur', () => {
      // On blur, force-sync to ensure displayed value matches state
      syncUI();
    });
  }
  if (endHexInput) {
    endHexInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase().slice(0, 6);
      e.target.value = v;
      if (v.length === 6) setEnd('#' + v);
    });
    endHexInput.addEventListener('blur', () => syncUI());
  }

  // ── Gradient toggle ──
  if (gradientToggle) {
    gradientToggle.addEventListener('change', () => {
      isGradient = gradientToggle.checked;
      syncUI();
      if (onChange) onChange(getState());
    });
  }

  // ── Opacity slider ──
  if (opacityRange) {
    opacityRange.addEventListener('input', () => {
      opacity = parseInt(opacityRange.value);
      if (opacityVal) opacityVal.textContent = opacity + '%';
      if (onChange) onChange(getState());
    });
  }

  // Initial sync
  syncUI();
  if (onChange) onChange(getState());

  return { getState };
};

// Global click handler — close all open color picker popups on outside click
document.addEventListener('click', (e) => {
  if (e.target.closest('.cpick')) return;
  document.querySelectorAll('.cpick-panel').forEach(p => p.setAttribute('hidden', ''));
  document.querySelectorAll('.cpick-trigger.open').forEach(t => t.classList.remove('open'));
});
// Also close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.cpick-panel').forEach(p => p.setAttribute('hidden', ''));
    document.querySelectorAll('.cpick-trigger.open').forEach(t => t.classList.remove('open'));
  }
});

// Helper for creating a color picker HTML string with polished markup
window.cpickHTML = function(opts) {
  // opts: { value, presets, gradient: bool, gradientValue, gradientOn, opacity: 0-100|null, alignRight }
  const value = (opts.value || '#000000').toUpperCase();
  const valueHex = value.replace('#', '');
  // Default palette — 8 swatches
  const presets = opts.presets || ['#FFFFFF', '#0E0E0E', '#FFD700', '#FBB034', '#7E22CE', '#EC4899', '#3B82F6', '#00FFA3'];
  const hasGradient = !!opts.gradient;
  const gradientValue = (opts.gradientValue || '#FBB034').toUpperCase();
  const gradientHex = gradientValue.replace('#', '');
  const opacity = (typeof opts.opacity === 'number') ? opts.opacity : null;
  const gradientOn = !!opts.gradientOn;
  const alignRight = !!opts.alignRight;

  const presetHTML = presets.map(c => {
    const cu = c.toUpperCase();
    return `<button type="button" class="cpick-preset ${cu === value ? 'active' : ''}" data-c="${cu}" style="background:${cu}" title="${cu}"></button>`;
  }).join('');

  const gradientSectionHTML = hasGradient ? `
    <div class="cpick-section cpick-gradient-section">
      <label class="cpick-gradient-toggle">
        <input type="checkbox" ${gradientOn ? 'checked' : ''} />
        <span>Fade to second color</span>
      </label>
      <div class="cpick-hex-row cpick-end-row">
        <span class="cpick-end-swatch" style="background:${gradientValue}">
          <input type="color" class="cpick-color-input-end" value="${gradientValue}" />
        </span>
        <span class="cpick-hex-prefix">#</span>
        <input type="text" class="cpick-hex end-hex" value="${gradientHex}" maxlength="6" spellcheck="false" />
      </div>
    </div>
  ` : '';

  const opacitySectionHTML = (opacity !== null) ? `
    <div class="cpick-section cpick-opacity-section">
      <div class="cpick-section-label">Opacity <span class="cpick-opacity-val">${opacity}%</span></div>
      <input type="range" min="0" max="100" value="${opacity}" />
    </div>
  ` : '';

  // Trigger preview chip — shows the active color (or gradient strip if gradient on)
  const triggerBg = (hasGradient && gradientOn)
    ? `linear-gradient(135deg, ${value}, ${gradientValue})`
    : value;
  const triggerLabel = (hasGradient && gradientOn) ? `${value} → ${gradientHex}` : value;

  // Preview bar background
  const previewBg = (hasGradient && gradientOn)
    ? `linear-gradient(135deg, ${value}, ${gradientValue})`
    : value;

  return `
    <div class="cpick ${hasGradient ? 'with-gradient' : ''} ${gradientOn ? 'gradient-on' : ''} ${alignRight ? 'align-right' : ''}">
      <button type="button" class="cpick-trigger">
        <span class="cpick-trigger-chip" style="background:${triggerBg}"></span>
        <span class="cpick-trigger-hex">${triggerLabel}</span>
        <svg class="cpick-trigger-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="cpick-panel" hidden>
        <div class="cpick-preview-bar" style="background:${previewBg}">
          <span class="cpick-preview-label">Click for picker</span>
          <input type="color" class="cpick-color-input" value="${value}" />
        </div>

        <div class="cpick-section">
          <div class="cpick-section-label">Palette</div>
          <div class="cpick-presets">${presetHTML}</div>
        </div>

        <div class="cpick-section">
          <div class="cpick-section-label">Hex</div>
          <div class="cpick-hex-row">
            <span class="cpick-hex-prefix">#</span>
            <input type="text" class="cpick-hex" value="${valueHex}" maxlength="6" spellcheck="false" autocomplete="off" />
          </div>
        </div>

        ${gradientSectionHTML}
        ${opacitySectionHTML}
      </div>
    </div>
  `;
};
