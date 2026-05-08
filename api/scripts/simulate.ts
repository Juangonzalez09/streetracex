/**
 * simulate.ts — Simulación completa de Street Race X
 * Ejecutar: npx tsx scripts/simulate.ts
 *
 * Flujo: Registro → Login → Vehículos → Matchmaking →
 *        Reto completo → Notificaciones → Admin (si hay token)
 */

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

// ─── Colores ────────────────────────────────────────────────────────────────
const c = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  green:   '\x1b[32m',
  red:     '\x1b[31m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  cyan:    '\x1b[36m',
  magenta: '\x1b[35m',
  gray:    '\x1b[90m',
};

// ─── Estado global ───────────────────────────────────────────────────────────
interface Session {
  accessToken: string;
  refreshToken: string;
  userId: string;
  username: string;
}

let p1: Session = { accessToken: '', refreshToken: '', userId: '', username: '' };
let p2: Session = { accessToken: '', refreshToken: '', userId: '', username: '' };
let adminToken = process.env.ADMIN_TOKEN ?? '';

let vehicleId1 = '';
let vehicleId2 = '';
let challengeId = '';
let trackId     = '';
let notifId     = '';

let passed = 0;
let failed = 0;

// ─── HTTP helper ─────────────────────────────────────────────────────────────
async function req(
  method: string,
  path: string,
  body?: object,
  accessToken?: string,
  cookie?: string,
): Promise<{ status: number; data: any; cookie?: string }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if (cookie)      headers['Cookie'] = cookie;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data  = await res.json().catch(() => ({}));
  const setCookie = res.headers.get('set-cookie') ?? undefined;
  return { status: res.status, data, cookie: setCookie };
}

// ─── Logger ──────────────────────────────────────────────────────────────────
function log(label: string, method: string, path: string, status: number, data?: any) {
  const ok      = status >= 200 && status < 300;
  const color   = ok ? c.green : c.red;
  const icon    = ok ? '✓' : '✗';
  const shortPath = path.length > 55 ? path.slice(0, 52) + '...' : path;

  if (ok) passed++; else failed++;

  console.log(
    `  ${color}${icon}${c.reset} ${c.bold}${method.padEnd(6)}${c.reset}` +
    ` ${c.gray}${shortPath.padEnd(55)}${c.reset}` +
    ` ${color}${status}${c.reset}` +
    ` ${c.dim}${label}${c.reset}`,
  );

  if (data?.data && ok) {
    const preview = JSON.stringify(data.data).slice(0, 100);
    console.log(`         ${c.cyan}↳ ${preview}${preview.length === 100 ? '…' : ''}${c.reset}`);
  }
  if (!ok && data?.message) {
    console.log(`         ${c.red}↳ ${data.message}${c.reset}`);
  }
}

function section(num: string, title: string) {
  console.log(`\n${c.magenta}${'─'.repeat(72)}${c.reset}`);
  console.log(`${c.bold}${c.magenta}  ${num}  ${title.toUpperCase()}${c.reset}`);
  console.log(`${c.magenta}${'─'.repeat(72)}${c.reset}`);
}

function step(msg: string) {
  console.log(`\n  ${c.yellow}▶ ${msg}${c.reset}`);
}

function warn(msg: string) {
  console.log(`  ${c.yellow}⚠ ${msg}${c.reset}`);
}

// ─── SIMULACIÓN ──────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}${c.blue}🏎️  Street Race X — Simulación de usuarios reales${c.reset}`);
  console.log(`${c.gray}   Base URL : ${BASE_URL}${c.reset}`);
  console.log(`${c.gray}   Admin    : ${adminToken ? 'TOKEN PRESENTE' : 'no configurado (sección Admin se omite)'}${c.reset}`);

  // ══════════════════════════════════════════════════════════════════════════
  section('1', 'Registro de pilotos');
  // ══════════════════════════════════════════════════════════════════════════

  step('Registrar Piloto 1 — sim_retador');
  let r = await req('POST', '/api/v1/auth/register', {
    username:    'sim_retador',
    email:       'sim_retador@sx.dev',
    password:    'SimStreet2026!',
    zonaCiudad:  'Bogota',
    zonaEstado:  'Cundinamarca',
    zonaPais:    'Colombia',
  });
  log('Piloto 1 creado', 'POST', '/api/v1/auth/register', r.status, r.data);

  step('Registrar Piloto 2 — sim_retado');
  r = await req('POST', '/api/v1/auth/register', {
    username:    'sim_retado',
    email:       'sim_retado@sx.dev',
    password:    'SimStreet2026!',
    zonaCiudad:  'Medellin',
    zonaEstado:  'Antioquia',
    zonaPais:    'Colombia',
  });
  log('Piloto 2 creado', 'POST', '/api/v1/auth/register', r.status, r.data);

  // ══════════════════════════════════════════════════════════════════════════
  section('2', 'Login');
  // ══════════════════════════════════════════════════════════════════════════

  step('Login Piloto 1');
  r = await req('POST', '/api/v1/auth/login', { email: 'sim_retador@sx.dev', password: 'SimStreet2026!' });
  log('Login P1', 'POST', '/api/v1/auth/login', r.status, r.data);
  if (r.data.data?.accessToken) {
    p1.accessToken  = r.data.data.accessToken;
    p1.userId       = r.data.data.user.id;
    p1.username     = r.data.data.user.username;
    p1.refreshToken = r.cookie ?? '';
  }

  step('Login Piloto 2');
  r = await req('POST', '/api/v1/auth/login', { email: 'sim_retado@sx.dev', password: 'SimStreet2026!' });
  log('Login P2', 'POST', '/api/v1/auth/login', r.status, r.data);
  if (r.data.data?.accessToken) {
    p2.accessToken  = r.data.data.accessToken;
    p2.userId       = r.data.data.user.id;
    p2.username     = r.data.data.user.username;
    p2.refreshToken = r.cookie ?? '';
  }

  if (!p1.accessToken || !p2.accessToken) {
    console.log(`\n${c.red}  Error crítico: no se pudo obtener token de acceso. ¿Está el servidor corriendo en ${BASE_URL}?${c.reset}\n`);
    process.exit(1);
  }

  // ══════════════════════════════════════════════════════════════════════════
  section('3', 'Perfil');
  // ══════════════════════════════════════════════════════════════════════════

  step('P1 — Ver mi perfil');
  r = await req('GET', '/api/v1/profile/me', undefined, p1.accessToken);
  log('Get my profile', 'GET', '/api/v1/profile/me', r.status, r.data);

  step('P1 — Actualizar zona');
  r = await req('PATCH', '/api/v1/profile/me', { zonaLocalidad: 'Chapinero' }, p1.accessToken);
  log('Update profile', 'PATCH', '/api/v1/profile/me', r.status, r.data);

  step('P1 — Ver perfil público de P2');
  r = await req('GET', `/api/v1/profile/${p2.userId}`, undefined, p1.accessToken);
  log('Get public profile P2', 'GET', `/api/v1/profile/:userId`, r.status, r.data);

  // ══════════════════════════════════════════════════════════════════════════
  section('4', 'Vehículos');
  // ══════════════════════════════════════════════════════════════════════════

  step('P1 — Crear vehículo AUTO');
  r = await req('POST', '/api/v1/vehicles', {
    tipoVehiculo: 'AUTO',
    marca:        'Nissan',
    modelo:       'Silvia S15',
    anio:         2000,
    color:        'Negro mate',
    placa:        'SIM001',
  }, p1.accessToken);
  log('Create vehicle P1', 'POST', '/api/v1/vehicles', r.status, r.data);
  vehicleId1 = r.data.data?.id ?? '';

  step('P1 — Activar vehículo');
  r = await req('PATCH', `/api/v1/vehicles/${vehicleId1}/activate`, undefined, p1.accessToken);
  log('Activate vehicle P1', 'PATCH', '/api/v1/vehicles/:id/activate', r.status, r.data);

  step('P1 — Listar mis vehículos');
  r = await req('GET', '/api/v1/vehicles', undefined, p1.accessToken);
  log('List vehicles P1', 'GET', '/api/v1/vehicles', r.status, r.data);

  step('P1 — Actualizar color del vehículo');
  r = await req('PATCH', `/api/v1/vehicles/${vehicleId1}`, { color: 'Gris plata', modificaciones: 'Turbo SR20DET' }, p1.accessToken);
  log('Update vehicle P1', 'PATCH', '/api/v1/vehicles/:id', r.status, r.data);

  step('P2 — Crear vehículo AUTO');
  r = await req('POST', '/api/v1/vehicles', {
    tipoVehiculo: 'AUTO',
    marca:        'Toyota',
    modelo:       'Supra MK4',
    anio:         1998,
    color:        'Blanco perla',
    placa:        'SIM002',
  }, p2.accessToken);
  log('Create vehicle P2', 'POST', '/api/v1/vehicles', r.status, r.data);
  vehicleId2 = r.data.data?.id ?? '';

  step('P2 — Activar vehículo');
  r = await req('PATCH', `/api/v1/vehicles/${vehicleId2}/activate`, undefined, p2.accessToken);
  log('Activate vehicle P2', 'PATCH', '/api/v1/vehicles/:id/activate', r.status, r.data);

  // ══════════════════════════════════════════════════════════════════════════
  section('5', 'Matchmaking');
  // ══════════════════════════════════════════════════════════════════════════

  step('P1 — Buscar pilotos disponibles para retar');
  r = await req('GET', '/api/v1/matchmaking', undefined, p1.accessToken);
  log('Matchmaking', 'GET', '/api/v1/matchmaking', r.status, r.data);

  // ══════════════════════════════════════════════════════════════════════════
  section('6', 'Pistas');
  // ══════════════════════════════════════════════════════════════════════════

  step('Listar pistas activas');
  r = await req('GET', '/api/v1/tracks', undefined, p1.accessToken);
  log('List tracks', 'GET', '/api/v1/tracks', r.status, r.data);
  trackId = r.data.data?.[0]?.id ?? '';

  if (trackId) {
    step(`Detalle de primera pista encontrada`);
    r = await req('GET', `/api/v1/tracks/${trackId}`, undefined, p1.accessToken);
    log('Get track detail', 'GET', '/api/v1/tracks/:id', r.status, r.data);
  } else {
    warn('No hay pistas activas. El reto se creará sin pista (normal si no hay admin configurado).');
  }

  // ══════════════════════════════════════════════════════════════════════════
  section('7', 'Reto — flujo completo PENDIENTE → COMPLETADO');
  // ══════════════════════════════════════════════════════════════════════════

  step('P1 → P2 — Enviar reto (CUARTO_MILLA)');
  r = await req('POST', '/api/v1/challenges', {
    retadoId:      p2.userId,
    tipoCarrera:   'CUARTO_MILLA',
    ...(trackId ? { pistaId: trackId } : {}),
    notas:         'Simulación automática — esta noche en la vía principal',
    fechaAcordada: '2026-06-15T20:00:00.000Z',
  }, p1.accessToken);
  log('Send challenge', 'POST', '/api/v1/challenges', r.status, r.data);
  challengeId = r.data.data?.id ?? '';

  if (!challengeId) {
    warn('No se pudo crear el reto. Verifica que ambos pilotos tengan el mismo rango y vehículo activo.');
  }

  step('P1 — Listar retos enviados');
  r = await req('GET', '/api/v1/challenges?tipo=enviados', undefined, p1.accessToken);
  log('List sent challenges', 'GET', '/api/v1/challenges?tipo=enviados', r.status, r.data);

  step('P2 — Listar retos recibidos');
  r = await req('GET', '/api/v1/challenges?tipo=recibidos&estado=PENDIENTE', undefined, p2.accessToken);
  log('List received challenges', 'GET', '/api/v1/challenges?tipo=recibidos', r.status, r.data);

  if (challengeId) {
    step('P2 — Ver reto por ID');
    r = await req('GET', `/api/v1/challenges/${challengeId}`, undefined, p2.accessToken);
    log('Get challenge by ID', 'GET', '/api/v1/challenges/:id', r.status, r.data);

    step('P2 — ACEPTAR el reto');
    r = await req('PATCH', `/api/v1/challenges/${challengeId}/status`, { estado: 'ACEPTADO' }, p2.accessToken);
    log('Accept challenge', 'PATCH', '/api/v1/challenges/:id/status', r.status, r.data);

    step('P1 — INICIAR la carrera (EN_CURSO)');
    r = await req('PATCH', `/api/v1/challenges/${challengeId}/status`, { estado: 'EN_CURSO' }, p1.accessToken);
    log('Start race', 'PATCH', '/api/v1/challenges/:id/status', r.status, r.data);

    step(`P1 — Reportar resultado: ganador = ${p1.username}`);
    r = await req('PATCH', `/api/v1/challenges/${challengeId}/result`, { ganadorId: p1.userId }, p1.accessToken);
    log('Report result (P1)', 'PATCH', '/api/v1/challenges/:id/result', r.status, r.data);

    step(`P2 — Confirmar resultado: mismo ganador = ${p1.username} → auto COMPLETADO`);
    r = await req('PATCH', `/api/v1/challenges/${challengeId}/result`, { ganadorId: p1.userId }, p2.accessToken);
    log('Confirm result (P2)', 'PATCH', '/api/v1/challenges/:id/result', r.status, r.data);

    step('Verificar estado final del reto (debe ser COMPLETADO)');
    r = await req('GET', `/api/v1/challenges/${challengeId}`, undefined, p1.accessToken);
    log('Final challenge state', 'GET', '/api/v1/challenges/:id', r.status, r.data);
    const estado = r.data.data?.estado;
    if (estado === 'COMPLETADO') {
      console.log(`         ${c.green}↳ Estado: COMPLETADO ✓ — Ganador: ${r.data.data?.ganador?.username ?? p1.username}${c.reset}`);
    } else {
      console.log(`         ${c.red}↳ Estado inesperado: ${estado}${c.reset}`);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  section('8', 'Notificaciones');
  // ══════════════════════════════════════════════════════════════════════════

  step('P2 — Listar todas las notificaciones');
  r = await req('GET', '/api/v1/notifications', undefined, p2.accessToken);
  log('List notifications P2', 'GET', '/api/v1/notifications', r.status, r.data);
  notifId = r.data.data?.[0]?.id ?? '';

  if (notifId) {
    step('P2 — Marcar primera notificación como leída');
    r = await req('PATCH', `/api/v1/notifications/${notifId}/read`, undefined, p2.accessToken);
    log('Mark one read', 'PATCH', '/api/v1/notifications/:id/read', r.status, r.data);
  }

  step('P2 — Listar solo no leídas');
  r = await req('GET', '/api/v1/notifications?soloNoLeidas=true', undefined, p2.accessToken);
  log('List unread', 'GET', '/api/v1/notifications?soloNoLeidas=true', r.status, r.data);

  step('P2 — Marcar todas como leídas');
  r = await req('PATCH', '/api/v1/notifications/read-all', undefined, p2.accessToken);
  log('Mark all read', 'PATCH', '/api/v1/notifications/read-all', r.status, r.data);

  // ══════════════════════════════════════════════════════════════════════════
  section('9', 'Auth avanzado — Refresh & Logout');
  // ══════════════════════════════════════════════════════════════════════════

  step('P1 — Refrescar access token');
  r = await req('POST', '/api/v1/auth/refresh', undefined, undefined, p1.refreshToken);
  log('Refresh token P1', 'POST', '/api/v1/auth/refresh', r.status, r.data);
  if (r.data.data?.accessToken) {
    p1.accessToken = r.data.data.accessToken;
    console.log(`         ${c.cyan}↳ Nuevo accessToken capturado${c.reset}`);
  }

  step('P1 — Logout');
  r = await req('POST', '/api/v1/auth/logout', undefined, p1.accessToken, p1.refreshToken);
  log('Logout P1', 'POST', '/api/v1/auth/logout', r.status, r.data);

  // ══════════════════════════════════════════════════════════════════════════
  section('10', 'Admin (requiere ADMIN_TOKEN en env)');
  // ══════════════════════════════════════════════════════════════════════════

  if (!adminToken) {
    warn('ADMIN_TOKEN no configurado. Ejecutar con: ADMIN_TOKEN=<token> npx tsx scripts/simulate.ts');
  } else {
    step('Admin — Crear pista');
    r = await req('POST', '/api/v1/admin/tracks', {
      nombre:      'Pista Sim Norte',
      descripcion: 'Recta de 400m — simulación',
      tipoCarrera: 'CUARTO_MILLA',
      dificultad:  'MEDIA',
      coordenadas: '4.7110,-74.0721',
    }, adminToken);
    log('Create track', 'POST', '/api/v1/admin/tracks', r.status, r.data);
    const newTrackId = r.data.data?.id ?? '';

    if (newTrackId) {
      step('Admin — Actualizar pista');
      r = await req('PATCH', `/api/v1/admin/tracks/${newTrackId}`, {
        nombre:      'Pista Sim Norte v2',
        dificultad:  'ALTA',
      }, adminToken);
      log('Update track', 'PATCH', '/api/v1/admin/tracks/:id', r.status, r.data);

      step('Admin — Desactivar pista');
      r = await req('PATCH', `/api/v1/admin/tracks/${newTrackId}/deactivate`, undefined, adminToken);
      log('Deactivate track', 'PATCH', '/api/v1/admin/tracks/:id/deactivate', r.status, r.data);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RESUMEN FINAL
  // ══════════════════════════════════════════════════════════════════════════
  const total = passed + failed;
  console.log(`\n${c.magenta}${'═'.repeat(72)}${c.reset}`);
  console.log(`${c.bold}  RESULTADO FINAL${c.reset}`);
  console.log(`${c.magenta}${'═'.repeat(72)}${c.reset}`);
  console.log(`  ${c.cyan}Piloto 1:${c.reset}  ${p1.username || 'sim_retador'} (${p1.userId || 'sin ID'})`);
  console.log(`  ${c.cyan}Piloto 2:${c.reset}  ${p2.username || 'sim_retado'} (${p2.userId || 'sin ID'})`);
  console.log(`  ${c.cyan}Reto ID:${c.reset}   ${challengeId || 'no creado'}`);
  console.log(`  ${c.cyan}Track ID:${c.reset}  ${trackId || 'ninguna'}`);
  console.log(`\n  ${c.green}✓ Pasaron: ${passed}${c.reset}  ${failed > 0 ? c.red : c.gray}✗ Fallaron: ${failed}${c.reset}  ${c.gray}/ ${total} total${c.reset}`);

  if (failed === 0) {
    console.log(`\n  ${c.green}${c.bold}Simulación completada sin errores 🏁${c.reset}\n`);
  } else {
    console.log(`\n  ${c.yellow}${c.bold}Simulación completada con ${failed} errore(s). Revisa los ✗ arriba.${c.reset}\n`);
  }
}

main().catch((err: Error) => {
  console.error(`\n${c.red}${c.bold}Error fatal en la simulación:${c.reset} ${err.message}\n`);
  process.exit(1);
});
