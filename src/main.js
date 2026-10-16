import './style.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA3wKUK1K-gtxwnizrRn8YCE3LHPH7yn-k",
  authDomain: "gad-operaciones.firebaseapp.com",
  projectId: "gad-operaciones",
  storageBucket: "gad-operaciones.firebasestorage.app",
  messagingSenderId: "100151993615",
  appId: "1:100151993615:web:f43215c799a10bc5da0a7a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLORES_PASTELES_BASES = {
  "GAD ESCOBAR": "#93c5fd", "GAD ZARATE CAMPANA": "#7dd3fc", "GAD PILAR": "#38bdf8",
  "GAD CONURBANO NORTE": "#99f6e4", "GAD SAN MARTIN": "#5eead4", "GAD TRES DE FEBRERO": "#2dd4bf",
  "GAD LA MATANZA": "#fef08a", "GAD MORON": "#fde047", "GAD MORENO": "#facc15", "GAD MERLO": "#ca8a04",
  "GAD QUILMES": "#fecdd3", "GAD AVELLANEDA": "#fda4af", "GAD LANUS": "#fb7185", "GAD ALTE. BROWN": "#e9d5ff",
  "GAD LOMAS DE ZAMORA": "#d8b4fe", "GAD EZEIZA": "#a855f7", "GAD SAN VICENTE": "#bbf7d0", "GAD LA PLATA": "#86efac",
  "GAD ENSENADA": "#4ade80", "GAD PTE. PERON": "#16a34a", "GAD MAR DEL PLATA": "#a5f3fc", "GAD LA COSTA": "#67e8f9",
  "GAD CHASCOMUS": "#22d3ee", "GAD PINAMAR-VILLA GESELL": "#06b6d4", "GAD DOLORES": "#0891b2",
  "GAD BAHIA BLANCA": "#fed7aa", "GAD GUAMINI": "#fb923c", "GAD NECOCHEA": "#f97316", "GAD GRAL. ALVEAR": "#ccfbf1",
  "GAD AZUL/ OLAVARRIA": "#fef9c3", "GAD 25 DE MAYO": "#fae8ff", "GAD TANDIL": "#f3e8ff", "GAD CHIVILCOY": "#fbcfe8",
  "GAD MERCEDES": "#f472b6", "GAD PERGAMINO": "#ec4899", "GAD EXALTACION DE LA CRUZ": "#ffe4e6",
  "GAD SAN NICOLAS": "#ffccd5", "GAD SAN PEDRO": "#fca5a5", "GAD JUNIN": "#e9d5ff", "GAD SALTO": "#d8b4fe",
  "GAD CHACABUCO": "#c026d3", "GAD LINCOLN": "#ecfccb", "GAD 9 DE JULIO/ BRAGADO": "#d9f99d",
  "GAD TRENQUE LAUQUEN": "#bef264", "GAD PEHUAJO": "#a3e635"
};

const BASES_GAD = [
  { id: "gad-escobar", user: "gad.escobar", pass: "escobar2026", nombre: "GAD ESCOBAR", coordina: "AMBA NORTE I", lat: -34.426, lng: -58.741, partidos: ["ESCOBAR"] },
  { id: "gad-zaratecampana", user: "gad.zaratecampana", pass: "zaratecampana2026", nombre: "GAD ZARATE CAMPANA", coordina: "AMBA NORTE I", lat: -34.164, lng: -58.959, partidos: ["CAMPANA", "ZARATE"] },
  { id: "gad-pilar", user: "gad.pilar", pass: "pilar2026", nombre: "GAD PILAR", coordina: "AMBA NORTE I", lat: -34.458, lng: -58.914, partidos: ["PILAR"] },
  { id: "gad-conurbanonorte", user: "gad.conurbanonorte", pass: "conurbanonorte2026", nombre: "GAD CONURBANO NORTE", coordina: "AMBA NORTE II", lat: -34.536, lng: -58.498, partidos: ["VICENTE LOPEZ", "SAN ISIDRO", "SAN FERNANDO", "TIGRE"] },
  { id: "gad-sanmartin", user: "gad.sanmartin", pass: "sanmartin2026", nombre: "GAD SAN MARTIN", coordina: "AMBA NORTE II", lat: -34.550, lng: -58.558, partidos: ["GENERAL SAN MARTIN", "SAN MARTIN", "SAN MIGUEL", "JOSE C. PAZ", "MALVINAS ARGENTINAS"] },
  { id: "gad-tresdefebrero", user: "gad.tresdefebrero", pass: "tresdefebrero2026", nombre: "GAD TRES DE FEBRERO", coordina: "AMBA NORTE II", lat: -34.606, lng: -58.566, partidos: ["TRES DE FEBRERO"] },
  { id: "gad-lamatanza", user: "gad.lamatanza", pass: "lamatanza2026", nombre: "GAD LA MATANZA", coordina: "AMBA OESTE", lat: -34.673, lng: -58.563, partidos: ["LA MATANZA"] },
  { id: "gad-moron", user: "gad.moron", pass: "moron2026", nombre: "GAD MORON", coordina: "AMBA OESTE", lat: -34.653, lng: -58.619, partidos: ["MORON", "HURLINGHAM", "ITUZAINGO"] },
  { id: "gad-moreno", user: "gad.moreno", pass: "moreno2026", nombre: "GAD MORENO", coordina: "AMBA OESTE", lat: -34.650, lng: -58.791, partidos: ["MORENO", "GENERAL RODRIGUEZ", "LUJAN"] },
  { id: "gad-merlo", user: "gad.merlo", pass: "merlo2026", nombre: "GAD MERLO", coordina: "AMBA OESTE", lat: -34.665, lng: -58.728, partidos: ["MERLO", "MARCOS PAZ", "GENERAL LAS HERAS"] },
  { id: "gad-quilmes", user: "gad.quilmes", pass: "quilmes2026", nombre: "GAD QUILMES", coordina: "AMBA SUR I", lat: -34.724, lng: -58.252, partidos: ["QUILMES", "BERAZATEGUI", "FLORENCIO VARELA"] },
  { id: "gad-avellaneda", user: "gad.avellaneda", pass: "avellaneda2026", nombre: "GAD AVELLANEDA", coordina: "AMBA SUR I", lat: -34.662, lng: -58.364, partidos: ["AVELLANEDA"] },
  { id: "gad-lanus", user: "gad.lanus", pass: "lanus2026", nombre: "GAD LANUS", coordina: "AMBA SUR I", lat: -34.704, lng: -58.396, partidos: ["LANUS"] },
  { id: "gad-altebrown", user: "gad.altebrown", pass: "altebrown2026", nombre: "GAD ALTE. BROWN", coordina: "AMBA SUR II", lat: -34.798, lng: -58.396, partidos: ["ALMIRANTE BROWN"] },
  { id: "gad-lomasdezamora", user: "gad.lomasdezamora", pass: "lomasdezamora2026", nombre: "GAD LOMAS DE ZAMORA", coordina: "AMBA SUR II", lat: -34.760, lng: -58.406, partidos: ["LOMAS DE ZAMORA"] },
  { id: "gad-ezeiza", user: "gad.ezeiza", pass: "ezeiza2026", nombre: "GAD EZEIZA", coordina: "AMBA SUR II", lat: -34.819, lng: -58.522, partidos: ["EZEIZA", "ESTEBAN ECHEVERRIA"] },
  { id: "gad-sanvicente", user: "gad.sanvicente", pass: "sanvicente2026", nombre: "GAD SAN VICENTE", coordina: "REGION CAPITAL", lat: -35.024, lng: -58.422, partidos: ["SAN VICENTE", "CAÑUELAS", "BRANDSEN", "MONTE", "GENERAL PAZ", "LOBOS"] },
  { id: "gad-laplata", user: "gad.laplata", pass: "laplata2026", nombre: "GAD LA PLATA", coordina: "REGION CAPITAL", lat: -34.921, lng: -57.954, partidos: ["LA PLATA", "MAGDALENA", "PUNTA INDIO"] },
  { id: "gad-ensenada", user: "gad.ensenada", pass: "ensenada2026", nombre: "GAD ENSENADA", coordina: "REGION CAPITAL", lat: -34.858, lng: -57.906, partidos: ["ENSENADA", "BERISSO"] },
  { id: "gad-pteperon", user: "gad.pteperon", pass: "pteperon2026", nombre: "GAD PTE. PERON", coordina: "REGION CAPITAL", lat: -34.925, lng: -58.384, partidos: ["PRESIDENTE PERON"] },
  { id: "gad-mardelplata", user: "gad.mardelplata", pass: "mardelplata2026", nombre: "GAD MAR DEL PLATA", coordina: "REGION ATLANTICA", lat: -38.005, lng: -57.556, partidos: ["GENERAL PUEYRREDON", "GRAL. PUEYRREDON", "MAR CHIQUITA", "GENERAL ALVARADO", "BALCARCE"] },
  { id: "gad-lacosta", user: "gad.lacosta", pass: "lacosta2026", nombre: "GAD LA COSTA", coordina: "REGION ATLANTICA", lat: -36.541, lng: -56.691, partidos: ["LA COSTA", "GENERAL LAVALLE"] },
  { id: "gad-chascomus", user: "gad.chascomus", pass: "chascomus2026", nombre: "GAD CHASCOMUS", coordina: "REGION ATLANTICA", lat: -35.578, lng: -58.012, partidos: ["CHASCOMUS", "LEZAMA", "GENERAL BELGRANO", "PILA"] },
  { id: "gad-pinamarvillagesell", user: "gad.pinamarvillagesell", pass: "pinamarvillagesell2026", nombre: "GAD PINAMAR-VILLA GESELL", coordina: "REGION ATLANTICA", lat: -37.264, lng: -56.973, partidos: ["PINAMAR", "VILLA GESELL", "GENERAL MADARIAGA", "GENERAL JUAN MADARIAGA"] },
  { id: "gad-dolores", user: "gad.dolores", pass: "dolores2026", nombre: "GAD DOLORES", coordina: "REGION ATLANTICA", lat: -36.313, lng: -57.679, partidos: ["DOLORES", "CASTELLI", "TORDILLO", "GENERAL GUIDO", "MAIPU"] },
  { id: "gad-bahiablanca", user: "gad.bahiablanca", pass: "bahiablanca2026", nombre: "GAD BAHIA BLANCA", coordina: "REGION INTERIOR SUR", lat: -38.718, lng: -62.266, partidos: ["BAHIA BLANCA", "CORONEL ROSALES", "CORONEL DE MARINA LEONARDO ROSALES", "VILLARINO", "PATAGONES", "TORNQUIST", "CORONEL DORREGO", "MONTE HERMOSO", "CORONEL PRINGLES", "SAAVEDRA", "CORONEL SUAREZ", "PUAN", "TRES ARROYOS", "GONZALES CHAVES", "ADOLFO GONZALES CHAVES"] },
  { id: "gad-guamini", user: "gad.guamini", pass: "guamini2026", nombre: "GAD GUAMINI", coordina: "REGION INTERIOR SUR", lat: -37.033, lng: -62.416, partidos: ["GUAMINI", "ADOLFO ALSINA", "SALLIQUELO", "TRES LOMAS", "DAIREAUX"] },
  { id: "gad-necochea", user: "gad.necochea", pass: "necochea2026", nombre: "GAD NECOCHEA", coordina: "REGION INTERIOR SUR", lat: -38.554, lng: -58.739, partidos: ["NECOCHEA", "LOBERIA", "SAN CAYETANO"] },
  { id: "gad-gralalvear", user: "gad.gralalvear", pass: "gralalvear2026", nombre: "GAD GRAL. ALVEAR", coordina: "REGION INTERIOR CENTRO", lat: -36.033, lng: -60.016, partidos: ["GENERAL ALVEAR", "TAPALQUE", "LAS FLORES", "SALADILLO"] },
  { id: "gad-azulolavarria", user: "gad.azulolavarria", pass: "azulolavarria2026", nombre: "GAD AZUL/ OLAVARRIA", coordina: "REGION INTERIOR CENTRO", lat: -36.783, lng: -59.866, partidos: ["AZUL", "OLAVARRIA", "BOLIVAR", "GENERAL LA MADRID", "LAPRIDA"] },
  { id: "gad-25demayo", user: "gad.25demayo", pass: "25demayo2026", nombre: "GAD 25 DE MAYO", coordina: "REGION INTERIOR CENTRO", lat: -35.433, lng: -60.166, partidos: ["25 DE MAYO", "VEINTICINCO DE MAYO", "ROQUE PEREZ"] },
  { id: "gad-tandil", user: "gad.tandil", pass: "tandil2026", nombre: "GAD TANDIL", coordina: "REGION INTERIOR CENTRO", lat: -37.316, lng: -59.133, partidos: ["TANDIL", "AYACUCHO", "RAUCH", "BENITO JUAREZ"] },
  { id: "gad-chivilcoy", user: "gad.chivilcoy", pass: "chivilcoy2026", nombre: "GAD CHIVILCOY", coordina: "REGION INTERIOR NORTE I", lat: -34.896, lng: -60.016, partidos: ["CHIVILCOY", "ALBERTI"] },
  { id: "gad-mercedes", user: "gad.mercedes", pass: "mercedes2026", nombre: "GAD MERCEDES", coordina: "REGION INTERIOR NORTE I", lat: -34.651, lng: -59.431, partidos: ["MERCEDES", "SUIPACHA", "NAVARRO"] },
  { id: "gad-pergamino", user: "gad.pergamino", pass: "pergamino2026", nombre: "GAD PERGAMINO", coordina: "REGION INTERIOR NORTE I", lat: -33.889, lng: -60.573, partidos: ["PERGAMINO", "COLON", "ROJAS"] },
  { id: "gad-exaltaciondelacruz", user: "gad.exaltaciondelacruz", pass: "exaltaciondelacruz2026", nombre: "GAD EXALTACION DE LA CRUZ", coordina: "REGION INTERIOR NORTE I", lat: -34.293, lng: -59.103, partidos: ["EXALTACION DE LA CRUZ", "SAN ANTONIO DE ARECO", "SAN ANDRES DE GILES", "CARMEN DE ARECO"] },
  { id: "gad-sannicolas", user: "gad.sannicolas", pass: "sannicolas2026", nombre: "GAD SAN NICOLAS", coordina: "REGION INTERIOR NORTE I", lat: -33.333, lng: -60.216, partidos: ["SAN NICOLAS", "RAMALLO"] },
  { id: "gad-sanpedro", user: "gad.sanpedro", pass: "sanpedro2026", nombre: "GAD SAN PEDRO", coordina: "REGION INTERIOR NORTE I", lat: -33.683, lng: -59.666, partidos: ["SAN PEDRO", "BARADERO"] },
  { id: "gad-junin", user: "gad.junin", pass: "junin2026", nombre: "GAD JUNIN", coordina: "REGION INTERIOR NORTE I", lat: -34.583, lng: -60.949, partidos: ["JUNIN", "GENERAL ARENALES", "LEANDRO N. ALEM", "GENERAL VIAMONTE"] },
  { id: "gad-salto", user: "gad.salto", pass: "salto2026", nombre: "GAD SALTO", coordina: "REGION INTERIOR NORTE I", lat: -34.293, lng: -60.254, partidos: ["SALTO", "ARRECIFES"] },
  { id: "gad-chacabuco", user: "gad.chacabuco", pass: "chacabuco2026", nombre: "GAD CHACABUCO", coordina: "REGION INTERIOR NORTE I", lat: -34.641, lng: -60.472, partidos: ["CHACABUCO"] },
  { id: "gad-lincoln", user: "gad.lincoln", pass: "lincoln2026", nombre: "GAD LINCOLN", coordina: "REGION INTERIOR NORTE II", lat: -34.866, lng: -61.533, partidos: ["LINCOLN", "GENERAL PINTO", "FLORENTINO AMEGHINO", "GENERAL VILLEGAS"] },
  { id: "gad-9dejulio", user: "gad.9dejulio", pass: "9dejulio2026", nombre: "GAD 9 DE JULIO/ BRAGADO", coordina: "REGION INTERIOR NORTE II", lat: -35.449, lng: -60.884, partidos: ["9 DE JULIO", "NUEVE DE JULIO", "BRAGADO", "CARLOS CASARES"] },
  { id: "gad-trenquelauquen", user: "gad.trenquelauquen", pass: "trenquelauquen2026", nombre: "GAD TRENQUE LAUQUEN", coordina: "REGION INTERIOR NORTE II", lat: -35.966, lng: -62.733, partidos: ["TRENQUE LAUQUEN", "PELLEGRINI", "RIVADAVIA", "CARLOS TEJEDOR"] },
  { id: "gad-pehuajo", user: "gad.pehuajo", pass: "pehuajo2026", nombre: "GAD PEHUAJO", coordina: "REGION INTERIOR NORTE II", lat: -35.816, lng: -61.899, partidos: ["PEHUAJO", "HIPOLITO YRIGOYEN"] }
];

let sesionActual = null, map = null, gpsInterval = null, watchId = null, ultimaCoordenada = null;
let serviciosActivos = {}, cuentasUsuarios = {}, pinesBases = {}, lineasRecorrido = {};
let baseDetalleAbierta = null, primerCargaServicios = true;

function quitarAcentos(str) { return (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim(); }
function resolverAsignacionBase(nombrePartido, center) {
  const norm = quitarAcentos(nombrePartido);
  for (const b of BASES_GAD) { if (b.partidos.some(p => norm === quitarAcentos(p) || norm.includes(quitarAcentos(p)))) return b; }
  if (center) { let m = BASES_GAD[0], dMin = Infinity; BASES_GAD.forEach(b => { const d = Math.hypot(b.lat - center.lat, b.lng - center.lng); if (d < dMin) { dMin = d; m = b; } }); return m; }
  return BASES_GAD[0];
}
function normalizarUsuario(input) { return input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/@gad-operaciones\.com$/, '').replace(/\/$/, ''); }

async function asegurarCuentasIniciales() {
  cuentasUsuarios['superadmin'] = { user: 'superadmin', pass: 'cambiar123', rol: 'SUPERADMIN', baseId: '', activo: true };
  cuentasUsuarios['admin'] = { user: 'admin', pass: 'admin2026', rol: 'ADMIN', baseId: '', activo: true };
  BASES_GAD.forEach(b => { cuentasUsuarios[b.user] = { user: b.user, pass: b.pass, rol: 'BASE', baseId: b.id, activo: true }; });
  try {
    const snap = await getDocs(collection(db, 'usuariosGad'));
    if (snap.empty) { for (const k of Object.keys(cuentasUsuarios)) { await setDoc(doc(db, 'usuariosGad', k), cuentasUsuarios[k]); } }
    else { snap.forEach(d => { cuentasUsuarios[d.id] = d.data(); }); }
  } catch (e) {}
  onSnapshot(collection(db, 'usuariosGad'), (snap) => {
    const temp = {}; snap.forEach(d => { temp[d.id] = d.data(); });
    if (Object.keys(temp).length > 0) cuentasUsuarios = temp;
    renderTablaUsuarios();
  });
}
asegurarCuentasIniciales();

document.getElementById('btnLogin').addEventListener('click', () => {
  const cleanUser = normalizarUsuario(document.getElementById('loginUser').value);
  const pass = document.getElementById('loginPass').value.trim();
  const errorBox = document.getElementById('loginError'); errorBox.innerText = '';
  const cuenta = cuentasUsuarios[cleanUser];
  if (!cuenta || cuenta.pass !== pass) { errorBox.innerText = 'Usuario o contraseña incorrectos.'; return; }
  if (!cuenta.activo) { errorBox.innerText = 'Cuenta desactivada.'; return; }
  sesionActual = cuenta; localStorage.setItem('gad_sesion_activa', JSON.stringify(cuenta));
  iniciarInterfazPorRol();
});

function iniciarInterfazPorRol() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('baseMobileView').style.display = 'none';
  document.getElementById('desktopDashboard').style.display = 'none';
  if (sesionActual.rol === 'BASE') {
    const baseObj = BASES_GAD.find(b => b.id === sesionActual.baseId) || BASES_GAD[0];
    sesionActual.baseObj = baseObj; document.getElementById('mobileBaseTitle').innerText = baseObj.nombre;
    document.getElementById('baseMobileView').style.display = 'flex';
    verificarServicioActivoBase(baseObj.id);
  } else {
    document.getElementById('desktopDashboard').style.display = 'flex';
    const esSuper = sesionActual.rol === 'SUPERADMIN';
    document.getElementById('roleIndicator').innerText = esSuper ? 'SUPERADMIN' : 'ADMIN';
    document.getElementById('btnOpenUsers').style.display = esSuper ? 'inline-block' : 'none';
    poblarSelectBasesUsuario(); iniciarMapaOperativo(); escucharServiciosEnVivo();
  }
}

const sesionGuardada = localStorage.getItem('gad_sesion_activa');
if (sesionGuardada) { try { sesionActual = JSON.parse(sesionGuardada); iniciarInterfazPorRol(); } catch (e) {} }

async function verificarServicioActivoBase(baseId) {
  try {
    const srvSnap = await getDocs(collection(db, 'serviciosActivos'));
    srvSnap.forEach(d => {
      if (d.id === baseId) {
        const data = d.data();
        document.getElementById('inpDgado').value = data.dgado || '';
        document.getElementById('inpServicio').value = data.servicio || '';
        document.getElementById('inpLugar').value = data.lugar || '';
        document.getElementById('inpHorario').value = data.horario || '';
        document.getElementById('inpACargo').value = data.aCargo || '';
        document.getElementById('inpTelefono').value = data.telefono || '';
        document.getElementById('btnIniciarServicio').style.display = 'none';
        document.getElementById('btnFinalizarServicio').style.display = 'block';
        const banner = document.getElementById('mobileStatusBanner');
        banner.className = 'status-banner status-red-bg';
        banner.innerText = 'EN SERVICIO - ACTIVO (EN CURSO)';
      }
    });
  } catch (e) {}
}

function cerrarSesion() {
  if (gpsInterval) clearInterval(gpsInterval); if (watchId) navigator.geolocation.clearWatch(watchId);
  localStorage.removeItem('gad_sesion_activa'); sesionActual = null; location.reload();
}
document.getElementById('btnLogoutDesk').addEventListener('click', cerrarSesion);
document.getElementById('btnLogoutMobile').addEventListener('click', cerrarSesion);

document.getElementById('btnIniciarServicio').addEventListener('click', async () => {
  const dgado = document.getElementById('inpDgado').value.trim(), servicio = document.getElementById('inpServicio').value.trim();
  const lugar = document.getElementById('inpLugar').value.trim(), horario = document.getElementById('inpHorario').value.trim();
  const aCargo = document.getElementById('inpACargo').value.trim(), telefono = document.getElementById('inpTelefono').value.trim();
  if (!dgado || !servicio || !lugar || !horario || !aCargo || !telefono) return alert('Completá los 6 campos.');
  const baseObj = sesionActual.baseObj || BASES_GAD[0];
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const puntoInicial = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: Math.round(pos.coords.accuracy || 10) };
      ultimaCoordenada = puntoInicial;
      await registrarServicioFirestore(baseObj, dgado, servicio, lugar, horario, aCargo, telefono, puntoInicial);
    }, async () => {
      const puntoInicial = { lat: baseObj.lat, lng: baseObj.lng, accuracy: 15 };
      ultimaCoordenada = puntoInicial;
      await registrarServicioFirestore(baseObj, dgado, servicio, lugar, horario, aCargo, telefono, puntoInicial);
    }, { enableHighAccuracy: true, timeout: 10000 });
  } else {
    const puntoInicial = { lat: baseObj.lat, lng: baseObj.lng, accuracy: 15 };
    ultimaCoordenada = puntoInicial;
    await registrarServicioFirestore(baseObj, dgado, servicio, lugar, horario, aCargo, telefono, puntoInicial);
  }
});

async function registrarServicioFirestore(baseObj, dgado, servicio, lugar, horario, aCargo, telefono, puntoInicial) {
  await setDoc(doc(db, 'serviciosActivos', baseObj.id), {
    baseId: baseObj.id, baseNombre: baseObj.nombre, dgado, servicio, lugar, horario, aCargo, telefono,
    inicioTimestamp: Date.now(), ultimaActualizacion: Date.now(), ubicacionActual: puntoInicial, precision: puntoInicial.accuracy, recorrido: [puntoInicial]
  });
  document.getElementById('btnIniciarServicio').style.display = 'none';
  document.getElementById('btnFinalizarServicio').style.display = 'block';
  const banner = document.getElementById('mobileStatusBanner'); banner.className = 'status-banner status-red-bg'; banner.innerText = 'EN SERVICIO - ACTIVO';
  
  const transmitir = async (coords) => {
    const p = { lat: coords.latitude, lng: coords.longitude, accuracy: Math.round(coords.accuracy || 10) };
    ultimaCoordenada = p; const docAct = serviciosActivos[baseObj.id];
    const hist = docAct && Array.isArray(docAct.recorrido) ? [...docAct.recorrido, p] : [p];
    await updateDoc(doc(db, 'serviciosActivos', baseObj.id), { ubicacionActual: p, precision: p.accuracy, ultimaActualizacion: Date.now(), recorrido: hist });
  };
  if (navigator.geolocation) { watchId = navigator.geolocation.watchPosition((pos) => transmitir(pos.coords), () => {}, { enableHighAccuracy: true, maximumAge: 0 }); }
  gpsInterval = setInterval(() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition((pos) => transmitir(pos.coords), async () => { if (ultimaCoordenada) await updateDoc(doc(db, 'serviciosActivos', baseObj.id), { ultimaActualizacion: Date.now() }); }, { enableHighAccuracy: true, timeout: 10000 }); } }, 15000);
}

document.getElementById('btnFinalizarServicio').addEventListener('click', async () => {
  if (gpsInterval) clearInterval(gpsInterval); if (watchId) navigator.geolocation.clearWatch(watchId);
  const baseObj = sesionActual.baseObj || BASES_GAD[0]; await deleteDoc(doc(db, 'serviciosActivos', baseObj.id));
  document.getElementById('btnIniciarServicio').style.display = 'block'; document.getElementById('btnFinalizarServicio').style.display = 'none';
  const banner = document.getElementById('mobileStatusBanner'); banner.className = 'status-banner status-green-bg'; banner.innerText = 'EN BASE - DISPONIBLE';
  document.getElementById('frmServicioBase').reset();
});

function obtenerEstadoBase(baseId) {
  const srv = serviciosActivos[baseId]; if (!srv) return 'VERDE';
  return (Date.now() - (srv.ultimaActualizacion || srv.inicioTimestamp || Date.now())) > 120000 ? 'AMARILLO' : 'ROJO';
}

function formatearHaceCuanto(ms) {
  if (!ms) return 'Hace instantes'; const m = Math.max(0, Math.floor((Date.now() - ms) / 60000));
  if (m < 1) return 'Hace < 1 min'; if (m < 60) return `Hace ${m} min`;
  return `Hace ${Math.floor(m / 60)}h ${m % 60}m`;
}

function iniciarMapaOperativo() {
  if (map) return;
  map = L.map('map').setView([-36.1, -59.4], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'GAD - División Operaciones'
  }).addTo(map);

  if (window.omnivore) {
    omnivore.kml('/limite_partidos.kml.xml', null, L.geoJson(null, {
      filter: (feature) => feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'),
      onEachFeature: (feature, layer) => {
        const props = feature.properties || {}, nombreP = props.name || props.fna || 'Partido';
        const center = layer.getBounds ? layer.getBounds().getCenter() : null;
        const baseA = resolverAsignacionBase(nombreP, center);
        const colorBasePastel = COLORES_PASTELES_BASES[baseA.nombre] || '#cbd5e1';

        layer.setStyle({ fillColor: colorBasePastel, weight: 1.5, opacity: 0.9, color: '#334155', fillOpacity: 0.45 });
        layer.bindTooltip(`<div style="line-height:1.4;"><strong style="color:#b8860b;">PARTIDO: ${nombreP.toUpperCase()}</strong><br><b>BASE GAD:</b> ${baseA.nombre}<br><span style="font-size:0.7rem; color:#64748b;">Coordinación: ${baseA.coordina}</span></div>`, { sticky: true, className: 'partido-tooltip' });
        layer.on({
          mouseover: (e) => e.target.setStyle({ weight: 2.8, color: '#b8860b', fillOpacity: 0.7 }),
          mouseout: (e) => e.target.setStyle({ weight: 1.5, color: '#334155', fillOpacity: 0.45 }),
          click: () => mostrarDetalleBase(baseA, true)
        });
      }
    })).addTo(map);
  }
  actualizarPinesMapa();
}

function escucharServiciosEnVivo() {
  onSnapshot(collection(db, 'serviciosActivos'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data(), id = change.doc.id;
      if (change.type === 'added' && !primerCargaServicios) { if (navigator.vibrate) navigator.vibrate([400, 200, 400]); }
      if (change.type === 'added' || change.type === 'modified') {
        serviciosActivos[id] = data;
        // CORRECCIÓN EXACTA GPS EN VIVO: Mueve el marcador exactamente a la lat/lng del móvil en tiempo real
        if (map && data.ubicacionActual && pinesBases[id]) {
          pinesBases[id].setLatLng([data.ubicacionActual.lat, data.ubicacionActual.lng]);
          pinesBases[id].setIcon(L.divIcon({ className: 'pin-red', iconSize: [26, 26] }));
        }
      }
      if (change.type === 'removed') {
        delete serviciosActivos[id];
        if (lineasRecorrido[id] && map) { map.removeLayer(lineasRecorrido[id]); delete lineasRecorrido[id]; }
        refrescarVistaCompleta();
      }
    });
    primerCargaServicios = false; refrescarVistaCompleta();
  });
  setInterval(() => refrescarVistaCompleta(), 10000);
}

function refrescarVistaCompleta() { renderListaBases(document.getElementById('inpSearchBase')?.value || ''); actualizarPinesMapa(); if (baseDetalleAbierta) mostrarDetalleBase(baseDetalleAbierta, false); }

function renderListaBases(filtro = '') {
  const cont = document.getElementById('basesListContainer'); if (!cont) return; cont.innerHTML = '';
  let disp = 0; BASES_GAD.forEach(b => { if (obtenerEstadoBase(b.id) === 'VERDE') disp++; });
  document.getElementById('contadorDisponibles').innerText = `${disp}/45 DISPONIBLES`;
  const q = filtro.toLowerCase().trim();

  BASES_GAD.forEach(base => {
    const srv = serviciosActivos[base.id], estado = obtenerEstadoBase(base.id);
    const coincide = !q || base.nombre.toLowerCase().includes(q) || base.coordina.toLowerCase().includes(q) || base.partidos.some(p => p.toLowerCase().includes(q)) || (srv && srv.lugar.toLowerCase().includes(q));
    if (!coincide) return;
    let bClass = 'tag-green', bText = 'DISPONIBLE', dCol = '#10b981';
    let info = `<div class="base-sub-info" style="color:#64748b; font-size:0.68rem;">${base.coordina} • Jurisdicción: ${base.partidos.join(', ')}</div>`;
    if (estado === 'ROJO' && srv) {
      bClass = 'tag-red'; bText = 'EN SERVICIO'; dCol = '#ef4444';
      info += `<div class="base-sub-info">📍 <strong>${srv.lugar}</strong> • ⏱ Salió ${formatearHaceCuanto(srv.inicioTimestamp)}</div>`;
    } else if (estado === 'AMARILLO' && srv) {
      bClass = 'tag-yellow'; bText = 'CORTE SEÑAL'; dCol = '#f59e0b';
      info += `<div class="base-sub-info" style="color:#d97706;">⚠️ Sin señal (${formatearHaceCuanto(srv.ultimaActualizacion)})</div>`;
    }
    const card = document.createElement('div'); card.className = 'base-row-card'; card.style.borderLeft = `4px solid ${dCol}`;
    card.innerHTML = `<div class="base-row-top"><div class="base-name-txt"><span style="width:10px; height:10px; border-radius:50%; background:${dCol}; display:inline-block;"></span>${base.nombre}</div><span class="status-tag ${bClass}">${bText}</span></div>${info}`;
    card.onclick = () => mostrarDetalleBase(base, true); cont.appendChild(card);
  });
}

document.getElementById('inpSearchBase').addEventListener('input', (e) => renderListaBases(e.target.value));

function actualizarPinesMapa() {
  if (!map) return;
  BASES_GAD.forEach(base => {
    const srv = serviciosActivos[base.id];
    const estado = obtenerEstadoBase(base.id);
    const coords = srv && srv.ubicacionActual ? [srv.ubicacionActual.lat, srv.ubicacionActual.lng] : [base.lat, base.lng];
    const iconClass = estado === 'VERDE' ? 'pin-green' : (estado === 'AMARILLO' ? 'pin-yellow' : 'pin-red');
    const icon = L.divIcon({ className: iconClass, iconSize: [24, 24] });

    if (pinesBases[base.id]) {
      pinesBases[base.id].setLatLng(coords); pinesBases[base.id].setIcon(icon);
    } else {
      pinesBases[base.id] = L.marker(coords, { icon }).addTo(map);
      pinesBases[base.id].on('click', () => mostrarDetalleBase(base, true));
    }
    pinesBases[base.id].bindPopup(`<strong style="color:#b8860b;">${base.nombre}</strong><br><span style="font-size:0.72rem; color:#64748b;">${base.coordina}</span><br><b>Jurisdicción:</b> ${base.partidos.join(', ')}`);
  });
}

function mostrarDetalleBase(base, centrar = true) {
  baseDetalleAbierta = base; document.getElementById('listSection').style.display = 'none';
  document.getElementById('usersSection').style.display = 'none'; const detail = document.getElementById('detailSection'); detail.style.display = 'flex';
  const srv = serviciosActivos[base.id], estado = obtenerEstadoBase(base.id);
  const coords = srv && srv.ubicacionActual ? srv.ubicacionActual : { lat: base.lat, lng: base.lng };
  if (centrar && map) map.flyTo([coords.lat, coords.lng], 12, { duration: 1.2 });
  const dgado = srv ? srv.dgado : 'Sin servicio', servicio = srv ? srv.servicio : 'DISPONIBLE', lugar = srv ? srv.lugar : 'En base';
  const horario = srv ? `${srv.horario} hs (${formatearHaceCuanto(srv.inicioTimestamp)})` : '-';
  const aCargo = srv ? srv.aCargo : 'Guardia', tel = srv ? srv.telefono : '', telLimpio = tel.replace(/\D/g, '');
  const mLink = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
  const wA = `Hola ${aCargo} (${base.nombre}). Comando GAD por servicio "${servicio}" (D.G.A.D.O: ${dgado}) en ${lugar}. Informá situación. Ubicación: ${mLink}`;
  const wC = `⚠️ ALERTA SEÑAL - GAD: Atención ${aCargo} (${base.nombre}), se cortó la señal GPS hace >2 min en ${lugar}. Reportá situación. Posición: ${mLink}`;
  const wGen = `Comando GAD - Control Operativo`;

  // SOLUCIÓN EXACTA WHATSAPP WEB: Llama a la función global para forzar web.whatsapp.com en pestaña limpia sin abrir app de escritorio
  let bWa = '';
  if (estado === 'ROJO') {
    bWa = `<button class="btn-action btn-wa-red" id="btnWaAction" style="width:100%; cursor:pointer;">💬 ENVIAR WHATSAPP WEB (MENSAJE A)</button>`;
  } else if (estado === 'AMARILLO') {
    bWa = `<button class="btn-action btn-wa-yellow" id="btnWaAction" style="width:100%; cursor:pointer;">⚠️ ENVIAR WHATSAPP WEB (MENSAJE C)</button>`;
  } else {
    bWa = `<button class="btn-action btn-wa-general" id="btnWaAction" style="width:100%; cursor:pointer;">💬 WHATSAPP WEB A LA BASE</button>`;
  }

  detail.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
      <button id="bBack" class="btn-logout">← Volver</button>
      <span class="status-tag ${estado === 'VERDE' ? 'tag-green' : (estado === 'AMARILLO' ? 'tag-yellow' : 'tag-red')}">${estado}</span>
    </div>
    <div class="detail-box">
      <h3 style="color:#b8860b; margin-bottom:4px;">${base.nombre}</h3>
      <p style="font-size:0.72rem; color:#64748b; margin-bottom:10px;">${base.coordina} • Jurisdicción: ${base.partidos.join(', ')}</p>
      <div class="detail-item"><span>D.G.A.D.O:</span><strong>${dgado}</strong></div>
      <div class="detail-item"><span>SERVICIO:</span><strong>${servicio}</strong></div>
      <div class="detail-item"><span>LUGAR:</span><strong>${lugar}</strong></div>
      <div class="detail-item"><span>HORARIO:</span><strong>${horario}</strong></div>
      <div class="detail-item"><span>A CARGO:</span><strong>${aCargo}</strong></div>
      <div class="detail-item"><span>TELÉFONO:</span><strong>${tel || 'No cargado'}</strong></div>
    </div>
    <div class="action-buttons-stack">
      ${bWa}
      <button class="btn-action btn-call-direct" id="bCall">📞 LLAMAR (CON GUIÓN)</button>
      <button class="btn-action btn-route-view" id="bRoute">🗺️ VER RECORRIDO</button>
    </div>
  `;

  document.getElementById('bBack').onclick = () => { baseDetalleAbierta = null; detail.style.display = 'none'; document.getElementById('listSection').style.display = 'flex'; };
  
  // Vinculación segura del botón de WhatsApp Web
  document.getElementById('btnWaAction').onclick = () => {
    let msgFinal = wGen;
    if (estado === 'ROJO') msgFinal = wA;
    if (estado === 'AMARILLO') msgFinal = wC;
    window.abrirWhatsAppWeb(telLimpio, msgFinal);
  };

  document.getElementById('bCall').onclick = () => {
    document.getElementById('callScriptText').innerText = `"Hola ${aCargo}, Comando GAD - Operaciones por Orden D.G.A.D.O ${dgado} (${servicio}) en ${lugar}. Informá novedad actual."`;
    document.getElementById('btnConfirmCall').href = telLimpio ? `tel:${telLimpio}` : '#'; document.getElementById('callModal').style.display = 'flex';
  };
  document.getElementById('bRoute').onclick = () => {
    if (!srv || !srv.recorrido || srv.recorrido.length === 0) return alert('Sin recorrido activo.');
    if (lineasRecorrido[base.id]) map.removeLayer(lineasRecorrido[base.id]);
    lineasRecorrido[base.id] = L.polyline([[base.lat, base.lng], ...srv.recorrido.map(p => [p.lat, p.lng])], { color: estado === 'AMARILLO' ? '#f59e0b' : '#ef4444', weight: 4, dashArray: '6, 8' }).addTo(map);
    map.fitBounds(lineasRecorrido[base.id].getBounds(), { padding: [40, 40] });
  };
}

document.getElementById('btnCloseModal').addEventListener('click', () => { document.getElementById('callModal').style.display = 'none'; });

function poblarSelectBasesUsuario() {
  const sel = document.getElementById('usrInputBaseId'); if (!sel) return; sel.innerHTML = '<option value="">-- Vincular a Base --</option>';
  BASES_GAD.forEach(b => { const opt = document.createElement('option'); opt.value = b.id; opt.innerText = `${b.nombre} (${b.user})`; sel.appendChild(opt); });
}
document.getElementById('btnOpenUsers').addEventListener('click', () => { baseDetalleAbierta = null; document.getElementById('listSection').style.display = 'none'; document.getElementById('detailSection').style.display = 'none'; document.getElementById('usersSection').style.display = 'flex'; renderTablaUsuarios(); });
document.getElementById('btnCloseUsers').addEventListener('click', () => { document.getElementById('usersSection').style.display = 'none'; document.getElementById('listSection').style.display = 'flex'; });

document.getElementById('btnSaveUserAccount').addEventListener('click', async () => {
  const user = normalizarUsuario(document.getElementById('usrInputName').value), pass = document.getElementById('usrInputPass').value.trim(), rol = document.getElementById('usrInputRole').value;
  let baseId = document.getElementById('usrInputBaseId').value;
  if (!user || !pass) return alert('Completá usuario y contraseña.');
  if (rol === 'BASE' && !baseId) { const e = BASES_GAD.find(b => b.user === user); baseId = e ? e.id : BASES_GAD[0].id; }
  const obj = { user, pass, rol, baseId: baseId || '', activo: true }; cuentasUsuarios[user] = obj;
  await setDoc(doc(db, 'usuariosGad', user), obj); renderTablaUsuarios(); alert(`Usuario "${user}" guardado.`);
});

function renderTablaUsuarios() {
  const tbody = document.getElementById('usersTableBody'); if (!tbody) return; tbody.innerHTML = '';
  Object.values(cuentasUsuarios).forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="padding:6px;"><strong>${u.user}</strong></td><td style="padding:6px; color:#b8860b; font-family:monospace;">${u.pass}</td><td style="padding:6px;">${u.rol}</td><td style="padding:6px; color:${u.activo ? '#10b981' : '#ef4444'}">${u.activo ? 'ACTIVO' : 'INACTIVO'}</td><td style="padding:6px; display:flex; gap:4px;"><button class="btn-logout" style="padding:2px 5px;" data-edit="${u.user}">Editar</button><button class="btn-logout" style="padding:2px 5px;" data-toggle="${u.user}">${u.activo ? 'Desactivar' : 'Activar'}</button>${u.user !== 'superadmin' ? `<button class="btn-logout" style="padding:2px 5px; color:#ff1744;" data-del="${u.user}">Eliminar</button>` : ''}</td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-edit]').forEach(b => { b.onclick = () => { const c = cuentasUsuarios[b.dataset.edit]; document.getElementById('usrInputName').value = c.user; document.getElementById('usrInputPass').value = c.pass; document.getElementById('usrInputRole').value = c.rol; document.getElementById('usrInputBaseId').value = c.baseId || ''; }; });
  tbody.querySelectorAll('[data-toggle]').forEach(b => { b.onclick = async () => { const c = cuentasUsuarios[b.dataset.toggle]; c.activo = !c.activo; await setDoc(doc(db, 'usuariosGad', c.user), c); }; });
  tbody.querySelectorAll('[data-del]').forEach(b => { b.onclick = async () => { const usr = b.dataset.del; if (!confirm(`¿Eliminar ${usr}?`)) return; delete cuentasUsuarios[usr]; await deleteDoc(doc(db, 'usuariosGad', usr)); renderTablaUsuarios(); }; });
}