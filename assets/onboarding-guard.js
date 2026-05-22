import { requireAuth } from './auth.js';

const user = await requireAuth('login');
if (user) document.getElementById('ag-hide')?.remove();
