import { supabase, getChannel } from './auth.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');

// No id → bounce to dashboard. App-guard already handled auth.
if (!id) {
  location.replace('dashboard.html');
} else {
  // Wait for an auth session before querying — RLS requires it.
  // app-guard.js has already kicked the redirect to login if needed; we just
  // avoid issuing an anon request that would noisily 401.
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const channel = await getChannel(id).catch(() => null);
    if (!channel) {
      location.replace('dashboard.html');
    } else {
      // Feed the channel name into the sidebar placeholder before partials.js
      // renders it. Both this script and partials.js run before DOMContentLoaded;
      // module top-level-await delays DCL so this finishes first.
      document.querySelectorAll('[data-include="sidebar-channel"]').forEach(el => {
        el.dataset.channelName = channel.name;
      });

      // Title: replace any old hardcoded channel reference with the real name.
      const old = /Gold (?:&|&amp;) Silver News/g;
      const t = document.querySelector('title');
      if (t) t.textContent = t.textContent.replace(old, channel.name);

      // Breadcrumb labels like "Channel · Gold & Silver News".
      document.querySelectorAll('.label-up').forEach(el => {
        if (old.test(el.textContent)) {
          el.textContent = el.textContent.replace(old, channel.name);
          old.lastIndex = 0;
        }
      });

      // Page-level fields opted in via data-channel-field.
      document.querySelectorAll('[data-channel-field="name"]').forEach(el => {
        if ('value' in el) el.value = channel.name; else el.textContent = channel.name;
      });
      document.querySelectorAll('[data-channel-field="description"]').forEach(el => {
        if ('value' in el) el.value = channel.description || ''; else el.textContent = channel.description || '';
      });

      // Expose for any page-specific scripts that want to read it.
      window.__channel = channel;

      // ── Channel-settings DB persistence: mirror DB → per-channel
      //    localStorage cache (migration 0014). The post-editor engine
      //    reads `anynews_logo_state_v1` synchronously at parse time;
      //    a pre-engine bridge in post-editor.html copies the
      //    per-channel cache key into the legacy global key right
      //    before that read, so the engine picks up channel-correct
      //    logo defaults. Writing the cache here means EVERY nav into
      //    a channel-* page refreshes the cache from DB, so a setting
      //    change in one tab shows up correctly in another.
      try {
        const cacheKey = `anynews_logo_state_v1:${id}`;
        const cached = {
          source:      channel.logo_source       ?? 'text',
          style:       channel.logo_style        ?? 'chip',
          accent:      channel.logo_accent       ?? '#DC143C',
          squareImage: channel.logo_square_image ?? null,
          wideImage:   channel.logo_wide_image   ?? null,
          text:        channel.hashtag           ?? '#AnyNews',
          showLogo:    channel.show_logo         !== false,
        };
        localStorage.setItem(cacheKey, JSON.stringify(cached));
      } catch {}

      // Best-effort retrofit of the engine for PRESET_FIELDS-supported
      // subset (logoSource/logoStyle/logoAccent — the only logo fields
      // in the allowlist; logoText / logoSquareImage / logoWideImage are
      // NOT, so they must travel via the synchronous bridge above).
      // setStateSnapshot is idempotent and safe to call even when the
      // post-editor isn't on screen.
      try {
        if (window.__cardEngine?.setStateSnapshot) {
          window.__cardEngine.setStateSnapshot({
            logoSource: channel.logo_source || 'text',
            logoStyle:  channel.logo_style  || 'chip',
            logoAccent: channel.logo_accent || '#DC143C',
          });
        }
      } catch {}
    }
  }
}
