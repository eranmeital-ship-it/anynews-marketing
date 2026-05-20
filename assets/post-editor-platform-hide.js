// post-editor-platform-hide.js — pre-engine card filter.
//
// Reads channels.enabled_platforms for the current channel and hides
// the platform-card-wraps + focus-tabs that aren't enabled. Static
// CSS (`#pe-pre-hide` in the post-editor head) hides the strip until
// this module finishes its work — guarantees no flash of all-5 cards
// before settling on the enabled subset.
//
// ZERO engine modifications: only DOM display toggles + class flips.
// The engine script (lines 2882-5700 of post-editor.html) still
// iterates whatever .card-canvas elements it finds — hidden ones get
// the same applyAll pass but their 0×0 getBoundingClientRect values
// feed setProperty(..., 'NaNpx') calls which CSS silently rejects.
// No visible artifact.
//
// Edge case: zero enabled platforms → render an inline empty state
// with a link back to the channel-connections page; do NOT fall back
// to showing all 5.

import { supabase } from './auth.js';

// Map between channel platform key and DOM hooks.
const PLATFORM_WRAP = {
  instagram: 'ig',
  facebook:  'fb',
  x:         'x',
  linkedin:  'li',
  pinterest: 'pin',
};
const ALL_KEYS = Object.keys(PLATFORM_WRAP);

const params = new URLSearchParams(location.search);
const channelId = params.get('id');

try {
  if (channelId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      let enabled = null;
      try {
        const { data } = await supabase
          .from('channels')
          .select('enabled_platforms')
          .eq('id', channelId)
          .maybeSingle();
        enabled = data?.enabled_platforms ?? null;
      } catch (e) {
        console.warn('post-editor-platform-hide: read failed', e?.message ?? e);
      }

      // Bridge code (download menu, copy panel) reads this after the
      // engine has booted to know which platforms to honor.
      window.__enabledPlatforms = enabled;

      if (Array.isArray(enabled) && enabled.length === 0) {
        renderZeroPlatformsState();
      } else if (Array.isArray(enabled)) {
        hideDisabledCards(enabled);
      }
    }
  }
} finally {
  // ALWAYS remove the pre-hide style at the end — even if the read
  // failed, even in manual mode, the editor needs to be visible.
  document.getElementById('pe-pre-hide')?.remove();
}

function hideDisabledCards(enabledKeys) {
  const enabledSet = new Set(enabledKeys);
  const strip = document.getElementById('platform-strip');
  let firstEnabledNet = null;

  for (const key of ALL_KEYS) {
    const net = PLATFORM_WRAP[key];
    const wrap = strip?.querySelector(`.platform-card-wrap.${net}`);
    const tab  = document.querySelector(`#focus-tabs .focus-tab[data-net="${net}"]`);
    if (enabledSet.has(key)) {
      if (!firstEnabledNet) firstEnabledNet = net;
    } else {
      // display:none keeps the element in querySelectorAll's results
      // (so the engine's positional stripIndex lookups still resolve
      // to the right card) but removes it from layout — invisible,
      // exportless.
      if (wrap) wrap.style.display = 'none';
      if (tab)  tab.style.display  = 'none';
    }
  }

  // Update the strip's data-count so the CSS grid uses the right
  // number of visible columns. The engine sets data-count="5" at
  // parse time from the count of .platform-card-wrap children
  // (it counts hidden ones too); overwrite with the enabled count.
  if (strip) strip.setAttribute('data-count', String(enabledKeys.length));

  // If the default-active focus tab (IG) is disabled, activate the
  // first enabled one instead. The engine's click handler is already
  // registered on every tab; .click() goes through applyFocusTab.
  const currentActive = document.querySelector('#focus-tabs .focus-tab.active');
  if (currentActive && currentActive.style.display === 'none' && firstEnabledNet) {
    const newActive = document.querySelector(`#focus-tabs .focus-tab[data-net="${firstEnabledNet}"]`);
    if (newActive) {
      currentActive.classList.remove('active');
      // Defer to next frame so the engine has finished its initial
      // applyAll and the click handler is fully wired.
      requestAnimationFrame(() => newActive.click());
    }
  }
}

function renderZeroPlatformsState() {
  const install = () => {
    const main = document.querySelector('.app-main') || document.body;
    [...main.children].forEach(el => { el.style.display = 'none'; });

    const empty = document.createElement('div');
    empty.id = 'pe-empty-state';
    empty.style.cssText = `
      max-width: 560px; margin: 80px auto; padding: 40px;
      background: #fff; border: 1px solid var(--border, #e4e4e7);
      border-radius: 16px; text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.04);
    `;
    const cnxHref = `channel-connections.html?id=${encodeURIComponent(channelId)}`;
    empty.innerHTML = `
      <div style="width:56px;height:56px;border-radius:14px;margin:0 auto 18px;background:var(--brand-grad,linear-gradient(135deg,#7E22CE,#EC4899));display:flex;align-items:center;justify-content:center;color:#fff;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:600;">No platforms enabled for this channel</h2>
      <p style="margin:0 0 24px;color:var(--text-secondary,#666);font-size:14px;line-height:1.55;">
        Enable at least one platform in <strong>Connected socials</strong> to start building cards.
        Disabled platforms don't get a card, a caption, or an exported image.
      </p>
      <a href="${cnxHref}" class="btn btn-primary" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;">
        Open channel connections
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    `;
    main.appendChild(empty);

    // Block the bridge's post-load wiring — its #cp-tabs etc. would
    // break against the now-hidden mc-* elements.
    window.__zeroPlatforms = true;
  };
  if (document.body) install();
  else document.addEventListener('DOMContentLoaded', install, { once: true });
}
