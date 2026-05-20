import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = ''; // TODO: set to cloud URL when backend deploys
const SUPABASE_PUBLISHABLE_KEY = ''; // TODO: set to cloud anon key when backend deploys

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'anynews-auth',
  },
});

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signUp({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName ?? null },
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function requireAuth(loginPath = '/login.html') {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    window.location.replace(loginPath);
    return null;
  }
  return data.user;
}

export async function getProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, full_name, plan, onboarding_complete')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function completeOnboarding() {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) throw userErr || new Error('Not signed in');
  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_complete: true })
    .eq('id', userRes.user.id);
  if (error) throw error;
}

export async function requestPasswordReset(email, redirectTo) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);
  if (error) throw error;
}

export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function listChannels() {
  const { data, error } = await supabase
    .from('channels')
    .select('id, name, description, status, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createChannel({ name, description }) {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) throw userErr || new Error('Not signed in');
  const { data, error } = await supabase
    .from('channels')
    .insert({ owner: userRes.user.id, name, description: description || null })
    .select('id, name, description, status, created_at')
    .single();
  if (error) throw error;
  return data;
}

// Columns selected by getChannel. The original 5 fields stay first so
// any existing callers reading channel.name / channel.status continue
// to work; the 9 settings columns (migration 0014) follow. Centralised
// so the channel-settings load path and channel-context.js bootstrap
// both pull the same shape.
const CHANNEL_COLS =
  'id, name, description, status, created_at, ' +
  'logo_source, logo_style, logo_accent, logo_square_image, logo_wide_image, ' +
  'hashtag, show_logo, content_language, content_direction';

export async function getChannel(id) {
  const { data, error } = await supabase
    .from('channels')
    .select(CHANNEL_COLS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Partial-update wrapper for channel rows. Used by channel-settings.html
// (DB-persistence migration) and any future callers. Validates that the
// patch only contains writeable columns — guards against an injected
// id/owner/created_at update.
const CHANNEL_WRITEABLE = new Set([
  'name', 'description', 'status', 'enabled_platforms', 'bundle_team_id',
  'logo_source', 'logo_style', 'logo_accent', 'logo_square_image', 'logo_wide_image',
  'hashtag', 'show_logo', 'content_language', 'content_direction',
]);
export async function updateChannel(channelId, patch) {
  if (!channelId) throw new Error('updateChannel: channelId is required');
  if (!patch || typeof patch !== 'object') throw new Error('updateChannel: patch must be an object');
  const clean = {};
  for (const k of Object.keys(patch)) {
    if (CHANNEL_WRITEABLE.has(k)) clean[k] = patch[k];
  }
  if (!Object.keys(clean).length) return null;
  const { data, error } = await supabase
    .from('channels')
    .update(clean)
    .eq('id', channelId)
    .select(CHANNEL_COLS)
    .single();
  if (error) throw error;
  return data;
}

// ── Channel platforms (which of the 5 socials this channel posts to) ──

export const ALL_PLATFORMS = ['instagram', 'facebook', 'x', 'linkedin', 'pinterest'];

export async function getChannelPlatforms(channelId) {
  const { data, error } = await supabase
    .from('channels')
    .select('enabled_platforms')
    .eq('id', channelId)
    .maybeSingle();
  if (error) throw error;
  return data?.enabled_platforms ?? [];
}

export async function setChannelPlatforms(channelId, platforms) {
  // Normalise: keep order canonical, drop unknowns, dedupe.
  const canonical = ALL_PLATFORMS.filter(p => platforms.includes(p));
  const { data, error } = await supabase
    .from('channels')
    .update({ enabled_platforms: canonical })
    .eq('id', channelId)
    .select('enabled_platforms')
    .single();
  if (error) throw error;
  return data.enabled_platforms;
}

export async function toggleChannelPlatform(channelId, platform, enabled) {
  if (!ALL_PLATFORMS.includes(platform)) throw new Error(`Unknown platform: ${platform}`);
  const current = await getChannelPlatforms(channelId);
  const next = enabled
    ? Array.from(new Set([...current, platform]))
    : current.filter(p => p !== platform);
  return setChannelPlatforms(channelId, next);
}

const SOURCE_COLS = 'id, channel_id, type, url, label, active, include_keywords, exclude_keywords, created_at, last_checked_at';

export async function listSources(channelId) {
  const { data, error } = await supabase
    .from('sources')
    .select(SOURCE_COLS)
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getSource(id) {
  const { data, error } = await supabase
    .from('sources')
    .select(SOURCE_COLS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Clean + validate a source URL. Strips any leading characters (icons,
// stray whitespace, emoji decorations) before the http(s):// scheme.
// Throws a user-readable error if the value still isn't a usable URL.
// For X / YouTube sources, also accepts a bare @handle — those types let
// the user paste either form per the placeholder.
export function sanitizeSourceUrl(rawUrl, type) {
  const s = String(rawUrl ?? '').trim();
  if (!s) throw new Error('URL is required.');
  if ((type === 'x' || type === 'youtube') && /^@[A-Za-z0-9_.-]+$/.test(s)) {
    return s;
  }
  // Strip anything before the scheme — covers emoji prefixes ("🌐 https://…"),
  // leading whitespace, stray "URL:" labels, etc.
  const m = s.match(/https?:\/\/.+/i);
  if (!m) throw new Error('Enter a valid URL starting with https://');
  const cleaned = m[0].trim();
  let u;
  try { u = new URL(cleaned); } catch { throw new Error('That doesn’t look like a valid URL.'); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('URL must start with http:// or https://');
  if (!u.host || !u.host.includes('.')) throw new Error('URL must include a real domain.');
  return cleaned;
}

export async function createSource({ channelId, type, url, label, includeKeywords, excludeKeywords }) {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) throw userErr || new Error('Not signed in');
  const cleanUrl = sanitizeSourceUrl(url, type);
  const { data, error } = await supabase
    .from('sources')
    .insert({
      channel_id: channelId,
      owner: userRes.user.id,
      type, url: cleanUrl, label: label || null,
      include_keywords: includeKeywords || [],
      exclude_keywords: excludeKeywords || [],
    })
    .select(SOURCE_COLS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateSource(id, patch) {
  // If the caller is updating the URL, sanitize it the same way createSource
  // does. patch.type may not be present on a partial update — pass it when
  // available so X/YouTube @handle inputs aren't rejected.
  const cleaned = { ...patch };
  if (Object.prototype.hasOwnProperty.call(cleaned, 'url')) {
    cleaned.url = sanitizeSourceUrl(cleaned.url, cleaned.type);
  }
  const { data, error } = await supabase
    .from('sources')
    .update(cleaned)
    .eq('id', id)
    .select(SOURCE_COLS)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSource(id) {
  const { error } = await supabase.from('sources').delete().eq('id', id);
  if (error) throw error;
}

const SIGNAL_COLS = 'id, channel_id, source_id, title, content, raw_url, image_url, status, score, category, published_at, captured_at, created_at';

export async function listSignals(channelId) {
  const { data, error } = await supabase
    .from('signals')
    .select(SIGNAL_COLS)
    .eq('channel_id', channelId)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('captured_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateSignal(id, patch) {
  const { data, error } = await supabase
    .from('signals')
    .update(patch)
    .eq('id', id)
    .select(SIGNAL_COLS)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSignal(id) {
  const { error } = await supabase.from('signals').delete().eq('id', id);
  if (error) throw error;
}

// Cleanup signals older than `daysThreshold` for a channel.
// Protections:
//   1. Skip signals that have been turned into a post (any posts row with
//      signal_id = sig.id). RLS scopes both signals and posts to the same
//      owner, so this only looks at the caller's data.
//   2. Skip signals the user has given feedback on (any signal_feedback
//      row referencing the signal). Same RLS guarantee — caller's data only.
// Manual trigger only — no scheduler wiring here (next pass).
export async function cleanupOldSignals(channelId, daysThreshold = 30) {
  const cutoff = new Date(Date.now() - daysThreshold * 86400000).toISOString();
  const { data: old, error: oldErr } = await supabase
    .from('signals')
    .select('id')
    .eq('channel_id', channelId)
    .lt('captured_at', cutoff);
  if (oldErr) throw oldErr;
  if (!old?.length) return { candidates: 0, deleted: 0, kept_referenced: 0, kept_feedback: 0 };

  const candidateIds = old.map((s) => s.id);

  const [{ data: linked, error: linkedErr }, { data: rated, error: ratedErr }] = await Promise.all([
    supabase.from('posts').select('signal_id').in('signal_id', candidateIds),
    supabase.from('signal_feedback').select('signal_id').in('signal_id', candidateIds),
  ]);
  if (linkedErr) throw linkedErr;
  if (ratedErr) throw ratedErr;

  const linkedSet  = new Set((linked ?? []).map((p) => p.signal_id).filter(Boolean));
  const ratedSet   = new Set((rated  ?? []).map((r) => r.signal_id).filter(Boolean));
  const keptUnion  = new Set([...linkedSet, ...ratedSet]);

  const toDelete = candidateIds.filter((id) => !keptUnion.has(id));
  if (toDelete.length) {
    const { error: delErr } = await supabase
      .from('signals')
      .delete()
      .in('id', toDelete);
    if (delErr) throw delErr;
  }
  return {
    candidates:      candidateIds.length,
    deleted:         toDelete.length,
    kept_referenced: linkedSet.size,
    kept_feedback:   ratedSet.size,
  };
}

// ── Signal feedback ─────────────────────────────────────────────────────

// Upsert a user's verdict for a signal. Re-calling with the other verdict
// flips it; calling with the same verdict + a new note updates the note.
export async function setSignalFeedback({ signalId, channelId, verdict, note = null }) {
  if (verdict !== 'good' && verdict !== 'bad') throw new Error('verdict must be "good" or "bad"');
  const { data: userRes, error: uErr } = await supabase.auth.getUser();
  if (uErr || !userRes?.user) throw uErr || new Error('Not signed in');
  const { data, error } = await supabase
    .from('signal_feedback')
    .upsert(
      {
        signal_id: signalId,
        channel_id: channelId,
        owner: userRes.user.id,
        verdict,
        note,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'signal_id,owner' },
    )
    .select('id, signal_id, verdict, note, created_at, updated_at')
    .single();
  if (error) throw error;
  return data;
}

// Remove a user's verdict for a signal (un-rate).
export async function clearSignalFeedback(signalId) {
  const { error } = await supabase
    .from('signal_feedback')
    .delete()
    .eq('signal_id', signalId);
  if (error) throw error;
}

// Load all of the current user's feedback for a channel. Returned shape:
// { [signal_id]: { verdict, note, created_at } } — easy lookup keyed by row.
export async function getChannelFeedbackMap(channelId) {
  const { data, error } = await supabase
    .from('signal_feedback')
    .select('signal_id, verdict, note, created_at, updated_at')
    .eq('channel_id', channelId);
  if (error) throw error;
  const out = {};
  for (const row of data ?? []) out[row.signal_id] = row;
  return out;
}

async function callFetchSignals(payload) {
  const { data: sess } = await supabase.auth.getSession();
  if (!sess?.session) throw new Error('Not signed in');
  const url = '/functions/v1/fetch-signals';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sess.session.access_token,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `Fetcher returned ${res.status}`);
  return json;
}

export async function fetchSignalsNow(channelId) {
  return callFetchSignals({ channelId });
}

export async function fetchSignalFromUrl(channelId, url, type = 'website') {
  return callFetchSignals({ channelId, url, type });
}

// Fetch an image via the local proxy-image Edge Function and return a data URL.
// Used by the post-editor export to inline cross-origin images right before
// rasterization (browsers can display cross-origin images without CORS, but
// reading their bytes — which html-to-image needs — requires CORS, and most
// news-site CDNs don't send those headers).
export async function proxyImageToDataUrl(externalUrl) {
  const { data: sess } = await supabase.auth.getSession();
  const token = sess?.session?.access_token;
  if (!token) throw new Error('Not signed in');
  const proxyUrl = '/functions/v1/proxy-image?url=' + encodeURIComponent(externalUrl);
  const res = await fetch(proxyUrl, { headers: { Authorization: 'Bearer ' + token } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`proxy-image ${res.status}: ${text.slice(0, 200)}`);
  }
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

// ─── Bundle.social (publishing POC, slice 1) ────────────────────────────────
// Thin wrappers around the bundle-connect Edge Function. The function does
// the actual Bundle.social calls server-side; the API key never reaches
// the browser.
async function bundleConnectCall(op, payload) {
  const token = (await supabase.auth.getSession())?.data?.session?.access_token;
  if (!token) throw new Error('Not signed in');
  const res = await fetch('/functions/v1/bundle-connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ op, ...payload }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.error || `bundle-connect ${res.status}`;
    const err = new Error(msg);
    err.bundle = body?.bundle;
    throw err;
  }
  return body;
}

export async function getBundlePortalLink(channelId, redirectUrl, socialAccountTypes = ['INSTAGRAM']) {
  return bundleConnectCall('createPortalLink', { channelId, redirectUrl, socialAccountTypes });
}

export async function getBundleConnection(channelId, type = 'INSTAGRAM') {
  return bundleConnectCall('getConnection', { channelId, type });
}

// bundle-publish has the same shape as bundle-connect (POST + JSON op-routing)
// but lives at its own URL — keep them separate so each can evolve.
async function bundlePublishCall(op, payload) {
  const token = (await supabase.auth.getSession())?.data?.session?.access_token;
  if (!token) throw new Error('Not signed in');
  const res = await fetch('/functions/v1/bundle-publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ op, ...payload }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.error || `bundle-publish ${res.status}`;
    const err = new Error(msg);
    err.bundle = body?.bundle;
    throw err;
  }
  return body;
}

export async function publishPostToInstagram(postId) {
  return bundlePublishCall('publishInstagram', { postId });
}

// Slice 3 — publish the rendered branded card from the post-editor.
// `blob` is a PNG Blob produced by renderCardToBlob in the editor.
// Per platform, one call.
export async function publishPostWithBytes({ postId, platform, caption, blob, filename }) {
  const token = (await supabase.auth.getSession())?.data?.session?.access_token;
  if (!token) throw new Error('Not signed in');
  const fd = new FormData();
  fd.append('op', 'publishWithBytes');
  fd.append('postId', String(postId));
  fd.append('platform', String(platform).toUpperCase());
  fd.append('caption', String(caption ?? ''));
  fd.append('file', blob, filename || `card-${String(platform).toLowerCase()}.png`);
  const res = await fetch('/functions/v1/bundle-publish', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },  // no Content-Type — let the browser set the multipart boundary
    body: fd,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body?.error || `bundle-publish ${res.status}`);
    err.bundle = body?.bundle;
    throw err;
  }
  return body;
}

const POST_COLS = 'id, channel_id, signal_id, title, content, image_url, source_url, status, created_at, updated_at, headline_highlights, secondary_headline, captions, hashtags, engine_state';

export async function listPosts(channelId) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_COLS)
    .eq('channel_id', channelId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPost(id) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_COLS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createPost({ channelId, signalId, title, content, imageUrl, sourceUrl, status, autoGenerate = true }) {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) throw userErr || new Error('Not signed in');
  const { data, error } = await supabase
    .from('posts')
    .insert({
      channel_id: channelId,
      owner: userRes.user.id,
      signal_id: signalId || null,
      title: title || null,
      content: content || null,
      image_url: imageUrl || null,
      source_url: sourceUrl || null,
      status: status || 'draft',
    })
    .select(POST_COLS)
    .single();
  if (error) throw error;

  // Auto-trigger copy generation in the background — don't await, so
  // createPost returns quickly. If generation fails or is capped, the
  // post still exists and the user can hit Regenerate later. Skip the
  // auto-fire when the caller is creating a blank post (no signal +
  // no title) — there's nothing to generate from.
  if (autoGenerate && (signalId || title)) {
    generatePostCopy(data.id).catch(err => console.warn('auto-generate failed:', err?.message ?? err));
  }
  return data;
}

export async function updatePost(id, patch) {
  const { data, error } = await supabase
    .from('posts')
    .update(patch)
    .eq('id', id)
    .select(POST_COLS)
    .single();
  if (error) throw error;
  return data;
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

// ── User presets ───────────────────────────────────────────────────────

export async function listUserPresets(templateKey) {
  let q = supabase
    .from('user_presets')
    .select('id, template_key, name, settings, created_at, updated_at')
    .order('created_at', { ascending: true });
  if (templateKey) q = q.eq('template_key', templateKey);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function saveUserPreset({ templateKey, name, settings }) {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) throw userErr || new Error('Not signed in');
  // upsert on (owner, template_key, name) — re-saving the same name overwrites
  const { data, error } = await supabase
    .from('user_presets')
    .upsert(
      { owner: userRes.user.id, template_key: templateKey, name, settings, updated_at: new Date().toISOString() },
      { onConflict: 'owner,template_key,name' },
    )
    .select('id, template_key, name, settings, created_at, updated_at')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteUserPreset(id) {
  const { error } = await supabase.from('user_presets').delete().eq('id', id);
  if (error) throw error;
}

export async function generatePostCopy(postId) {
  const { data: sess } = await supabase.auth.getSession();
  if (!sess?.session) throw new Error('Not signed in');
  const url = '/functions/v1/generate-post-copy';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sess.session.access_token,
    },
    body: JSON.stringify({ postId }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `Copy generator returned ${res.status}`);
  return json;  // { ok, enabled, headline_highlights, secondary_headline, captions, hashtags, daily }
}

export async function scoreSignalsNow(channelId, opts = {}) {
  const { data: sess } = await supabase.auth.getSession();
  if (!sess?.session) throw new Error('Not signed in');
  const url = '/functions/v1/score-signals';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sess.session.access_token,
    },
    body: JSON.stringify({ channelId, ...opts }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `Scorer returned ${res.status}`);
  return json;
}

// ── Ops / scheduled-refresh dashboard ──────────────────────────────────

export async function getOpsStatus() {
  const [settingsRes, todayRes] = await Promise.all([
    supabase.from('ops_app_settings_v').select('key, value, updated_at'),
    supabase.from('ops_daily_score_counter_v').select('date_utc, count')
            .eq('date_utc', new Date().toISOString().slice(0, 10))
            .maybeSingle(),
  ]);
  if (settingsRes.error) throw settingsRes.error;
  const map = {};
  for (const row of settingsRes.data ?? []) map[row.key] = row.value;
  return {
    cron_enabled: map.cron_enabled === true,
    daily_score_cap: typeof map.daily_score_cap === 'number' ? map.daily_score_cap : 500,
    today_score_count: todayRes?.data?.count ?? 0,
  };
}

export async function listCronRuns(limit = 20) {
  const { data, error } = await supabase
    .from('ops_cron_runs_v')
    .select('id, started_at, ended_at, status, channels_processed, signals_fetched, signals_scored, daily_cap_hit, errors')
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function setCronEnabled(enabled) {
  const { data, error } = await supabase.rpc('set_cron_enabled', { enabled });
  if (error) throw error;
  return data;
}

export async function triggerCronRefresh() {
  const { data, error } = await supabase.rpc('trigger_cron_refresh');
  if (error) throw error;
  return data;  // pg_net request id; the run itself completes asynchronously
}

// Expose for non-module callers (e.g. legacy inline scripts).
window.anynewsAuth = { supabase, getSession, signUp, signIn, signOut, requireAuth, getProfile, completeOnboarding, requestPasswordReset, updatePassword, listChannels, createChannel, getChannel, updateChannel, listSources, getSource, createSource, updateSource, deleteSource, sanitizeSourceUrl, listSignals, updateSignal, deleteSignal, cleanupOldSignals, fetchSignalsNow, fetchSignalFromUrl, scoreSignalsNow, proxyImageToDataUrl, listPosts, getPost, createPost, updatePost, deletePost, getOpsStatus, listCronRuns, setCronEnabled, triggerCronRefresh, getChannelPlatforms, setChannelPlatforms, toggleChannelPlatform, ALL_PLATFORMS, generatePostCopy, setSignalFeedback, clearSignalFeedback, getChannelFeedbackMap, listUserPresets, saveUserPreset, deleteUserPreset, getBundlePortalLink, getBundleConnection, publishPostToInstagram, publishPostWithBytes };
