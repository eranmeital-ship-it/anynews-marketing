import { requireAuth, getProfile } from './auth.js';

const user = await requireAuth('../login');
if (user) {
  let onboarded = true;
  try {
    const profile = await getProfile();
    if (profile && profile.onboarding_complete === false) onboarded = false;
  } catch (e) { /* on failure, don't trap — let the page render */ }

  if (!onboarded) {
    window.location.replace('../onboarding');
  } else {
    document.getElementById('ag-hide')?.remove();
  }
}
