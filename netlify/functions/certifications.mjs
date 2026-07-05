const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };
const WRITE_ACTIONS = new Set(['create', 'update', 'delete', 'bulkCreate']);

function response(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

function getEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Environment variable ${name} belum dikonfigurasi.`);
  return value;
}

function isReadAuthorized(request) {
  const viewPassword = process.env.DASHBOARD_VIEW_PASSWORD;
  if (!viewPassword) return true;
  const supplied = request.headers.get('x-dashboard-password') || '';
  const adminPassword = process.env.DASHBOARD_ADMIN_PASSWORD || '';
  return supplied === viewPassword || (!!adminPassword && supplied === adminPassword);
}

function isWriteAuthorized(request) {
  const expected = process.env.DASHBOARD_ADMIN_PASSWORD;
  if (!expected) return false;
  return (request.headers.get('x-dashboard-password') || '') === expected;
}

async function forwardToAppsScript(payload, method) {
  const url = getEnv('GOOGLE_APPS_SCRIPT_URL');
  const apiKey = getEnv('GOOGLE_APPS_SCRIPT_SECRET');
  const outgoing = { ...payload, apiKey };

  let upstream;
  if (method === 'GET') {
    const requestUrl = new URL(url);
    Object.entries(outgoing).forEach(([key, value]) => requestUrl.searchParams.set(key, String(value)));
    upstream = await fetch(requestUrl, { method: 'GET', redirect: 'follow' });
  } else {
    upstream = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(outgoing),
    });
  }

  const text = await upstream.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error('Apps Script tidak mengembalikan JSON. Pastikan URL yang dipakai adalah URL /exec.');
  }

  if (!upstream.ok || !body.success) {
    const error = new Error(body.message || 'Apps Script menolak permintaan.');
    error.status = upstream.status >= 400 ? upstream.status : 400;
    throw error;
  }

  return body;
}

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });

  try {
    const method = request.method.toUpperCase();
    if (!['GET', 'POST'].includes(method)) {
      return response({ success: false, message: 'Method tidak didukung.' }, 405);
    }

    const payload = method === 'GET'
      ? { action: new URL(request.url).searchParams.get('action') || 'records' }
      : await request.json();
    const action = String(payload.action || 'records');

    if (!isReadAuthorized(request)) {
      return response({ success: false, message: 'Password dashboard tidak valid.' }, 401);
    }
    if (WRITE_ACTIONS.has(action) && !isWriteAuthorized(request)) {
      return response({ success: false, message: 'Password admin tidak valid.' }, 401);
    }

    const result = await forwardToAppsScript(payload, method);
    return response(result);
  } catch (error) {
    console.error('[certifications-api]', error);
    const status = Number(error && error.status) || 500;
    return response({ success: false, message: error instanceof Error ? error.message : 'Server error.' }, status);
  }
};
