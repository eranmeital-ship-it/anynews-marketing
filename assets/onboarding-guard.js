import { requireAuth } from './auth.js';

const user = await requireAuth('login.html');
if (user) document.getElementById('ag-hide')?.remove();
