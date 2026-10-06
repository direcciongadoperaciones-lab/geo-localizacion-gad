import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';

const STORAGE_KEYS = {
  users: 'gad_users_v1',
  trackers: 'gad_trackers_v1',
  session: 'gad_session_v1',
  messages: 'gad_messages_v1',
};

const defaultBaseLocations = [
  {
    id: 'escobar',
    name: 'GAD ESCOBAR',
    username: 'gadescobar',
    password: 'escobar1234',
    phone: '5491123456789',
    position: [-34.553, -58.535],
  },
  {
    id: 'sanjose',
    name: 'GAD SAN JOSÉ',
    username: 'gadsanjose',
    password: 'sanjose1234',
    phone: '5491187654321',
    position: [-34.62, -58.45],
  },
  {
    id: 'centro',
    name: 'GAD CENTRO',
    username: 'gadcentro',
    password: 'centro1234',
    phone: '5491198765432',
    position: [-34.58, -58.39],
  },
];

const adminUser = {
  id: 'admin',
  role: 'admin',
  username: 'admin',
  password: 'admin1234',
  name: 'Administrador GAD',
  baseName: 'Sede central',
  phone: '5491100000000',
};

const durationOptions = [1, 2, 4, 6, 24];

const FIELD_LABELS = {
  fullName: 'Nombre completo',
  phone: 'Teléfono',
  activity: 'Actividad',
  location: 'Ubicación actual',
  notes: 'Observaciones',
};

const blankForm = {
  fullName: '',
  phone: '',
  activity: '',
  location: '',
  notes: '',
};

function createSeedUsers() {
  const users = [adminUser];
  defaultBaseLocations.forEach((base) => {
    users.push({
      id: `operator-${base.id}`,
      role: 'operator',
      username: base.username,
      password: base.password,
      name: base.name,
      baseId: base.id,
      baseName: base.name,
      phone: base.phone,
      department: 'Base operativa',
    });
  });
  return users;
}

function loadUsers() {
  const raw = localStorage.getItem(STORAGE_KEYS.users);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(createSeedUsers()));
    return createSeedUsers();
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seed = createSeedUsers();
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(seed));
      return seed;
    }
    return parsed;
  } catch {
    const seed = createSeedUsers();
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(seed));
    return seed;
  }
}

function loadTrackers() {
  const raw = localStorage.getItem(STORAGE_KEYS.trackers);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.trackers, JSON.stringify([]));
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEYS.trackers, JSON.stringify([]));
    return [];
  }
}

function loadMessages() {
  const raw = localStorage.getItem(STORAGE_KEYS.messages);
  if (!raw) {
    const initial = [
      {
        id: 'welcome',
        sender: 'Sistema',
        text: 'Sistema de GEOLOCALIZACIÓN GAD iniciado correctamente',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const fallback = [];
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(fallback));
    return fallback;
  }
}

function getBaseById(id) {
  return defaultBaseLocations.find((base) => base.id === id);
}

function hasRequiredFields(values) {
  return ['fullName', 'phone', 'activity', 'location'].every((key) => {
    const value = values[key]?.toString().trim();
    return Boolean(value);
  });
}

function formatDateTime(value) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getTrackerForUser(userId) {
  const trackers = loadTrackers();
  return trackers.find((tracker) => tracker.userId === userId);
}

function getAllActiveTrackers() {
  return loadTrackers().filter((tracker) => {
    const expiresAt = new Date(tracker.expiresAt || 0).getTime();
    return tracker.active && expiresAt > Date.now();
  });
}

function getCurrentLocationLabel(latLng) {
  if (!latLng) return 'Sin ubicación';
  const [lat, lng] = latLng;
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function getUserById(userId) {
  const users = loadUsers();
  return users.find((user) => user.id === userId);
}

function CreateMessageButton({ label, onClick, tone = 'primary' }) {
  return (
    <button className={`action-button ${tone}`} onClick={onClick} type="button">
      {label}
    </button>
  );
}

function MapView({ user, trackers, currentLocation, adminVisibleUsers }) {
  const mapCenter = useMemo(() => {
    if (user?.role === 'admin') {
      return [-34.59, -58.48];
    }
    const tracker = getTrackerForUser(user?.id);
    if (tracker?.location?.length === 2) {
      return tracker.location;
    }
    const base = getBaseById(user?.baseId);
    return base?.position || [-34.59, -58.48];
  }, [user, trackers]);

  function MapAutoCenter() {
    const map = useMap();
    useEffect(() => {
      map.setView(mapCenter, 11);
    }, [map, mapCenter]);
    return null;
  }

  const visibleTrackers = user?.role === 'admin' ? adminVisibleUsers : [getTrackerForUser(user?.id)].filter(Boolean);

  return (
    <div className="map-wrap">
      <MapContainer center={mapCenter} zoom={11} scrollWheelZoom={true} className="map-root">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapAutoCenter />

        {defaultBaseLocations.map((base) => (
          <Marker key={base.id} position={base.position} icon={new L.Icon.Default()}>
            <Popup>
              <strong>{base.name}</strong>
              <br />
              {base.username}
            </Popup>
          </Marker>
        ))}

        {visibleTrackers.map((tracker) => {
          const userData = getUserById(tracker.userId);
          const tempLocation = tracker.location || getBaseById(userData?.baseId)?.position;
          if (!userData || !tempLocation) return null;

          return (
            <CircleMarker
              key={tracker.userId}
              center={tempLocation}
              radius={11}
              pathOptions={{
                color: userData.role === 'admin' ? '#1f6feb' : '#2ecc71',
                fillColor: '#2ecc71',
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <strong>{userData.name}</strong>
                <br />
                {userData.baseName || 'Base operativa'}
                <br />
                Ubicación: {getCurrentLocationLabel(tempLocation)}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.session);
    return saved ? JSON.parse(saved) : null;
  });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [formData, setFormData] = useState(blankForm);
  const [trackingHours, setTrackingHours] = useState(1);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState('');
  const [users, setUsers] = useState(loadUsers());
  const [trackers, setTrackers] = useState(loadTrackers());
  const [messages, setMessages] = useState(loadMessages());
  const [messageText, setMessageText] = useState('');
  const [newBase, setNewBase] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
  });
  const geoWatcherRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.trackers, JSON.stringify(trackers));
  }, [trackers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.session);
    }
  }, [session]);

  useEffect(() => {
    const handle = setInterval(() => {
      const updated = loadTrackers().map((tracker) => {
        const expiresAt = new Date(tracker.expiresAt || 0).getTime();
        if (tracker.active && expiresAt <= Date.now()) {
          return { ...tracker, active: false, expiresAt: null, status: 'Expirado' };
        }
        return tracker;
      });

      const expired = updated.filter((tracker) => {
        const expiresAt = new Date(tracker.expiresAt || 0).getTime();
        return tracker.active && expiresAt <= Date.now();
      });

      if (expired.length > 0) {
        setNotifications('La ubicación activada llegó a su fin y se desactivó automáticamente.');
      }

      setTrackers(updated);
    }, 5000);

    return () => clearInterval(handle);
  }, []);

  useEffect(() => {
    if (!session || session.user.role !== 'operator') return;

    if (!navigator.geolocation) {
      setNotifications('Tu navegador no admite geolocalización.');
      return;
    }

    geoWatcherRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const userId = session.user.id;
        const nextLocation = [coords.latitude, coords.longitude];
        const list = loadTrackers();

        const exists = list.find((item) => item.userId === userId);
        if (exists) {
          const updated = list.map((item) => {
            if (item.userId !== userId) return item;
            return { ...item, location: nextLocation, updatedAt: new Date().toISOString() };
          });
          setTrackers(updated);
        }
      },
      () => {
        setNotifications('No se pudo leer la ubicación del operador.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 15000 }
    );

    return () => {
      if (geoWatcherRef.current) {
        navigator.geolocation.clearWatch(geoWatcherRef.current);
      }
    };
  }, [session]);

  const currentFormValidity = useMemo(() => hasRequiredFields(formData), [formData]);

  const adminVisibleUsers = getAllActiveTrackers().map((tracker) => tracker);

  const operatorTracker = session?.user ? getTrackerForUser(session.user.id) : null;

  const handleLogin = (event) => {
    event.preventDefault();
    const loginUser = users.find(
      (user) =>
        user.username.toLowerCase() === loginData.username.trim().toLowerCase() &&
        user.password === loginData.password
    );

    if (!loginUser) {
      setError('Credenciales inválidas. Revisá el nombre de usuario y la contraseña.');
      return;
    }

    setError('');
    setSession({ user: loginUser, loggedAt: new Date().toISOString() });
  };

  const handleLogout = () => {
    setSession(null);
    setFormData(blankForm);
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((current) => ({ ...current, [fieldName]: value }));
  };

  const saveForm = () => {
    if (!session?.user || session.user.role !== 'operator') return;

    if (!currentFormValidity) {
      setNotifications('Completá todos los campos obligatorios antes de guardar.');
      return;
    }

    const base = getBaseById(session.user.baseId);
    const record = {
      userId: session.user.id,
      baseName: base?.name || session.user.baseName,
      form: { ...formData },
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('gad_forms_v1') || '[]');
    localStorage.setItem('gad_forms_v1', JSON.stringify([record, ...existing]));
    setNotifications('Formulario guardado correctamente. La ubicación será visible según el tiempo activo.');
  };

  const handleTrackingToggle = () => {
    if (!session || session.user.role !== 'operator') return;

    const userId = session.user.id;
    const list = loadTrackers();
    const active = list.find((tracker) => tracker.userId === userId);

    const expiresAt = new Date(Date.now() + Number(trackingHours) * 60 * 60 * 1000).toISOString();

    const nextOn = {
      userId,
      active: true,
      expiresAt,
      status: `${trackingHours} hora(s)`,
      updatedAt: new Date().toISOString(),
      location: active?.location || getBaseById(session.user.baseId)?.position || [-34.59, -58.48],
    };

    const updated = active ? list.map((item) => (item.userId === userId ? nextOn : item)) : [...list, nextOn];
    setTrackers(updated);
    setNotifications(`Ubicación activa por ${trackingHours} hora(s).`);
  };

  const handleStopTracking = () => {
    if (!session || session.user.role !== 'operator') return;
    const list = loadTrackers();
    const updated = list.map((tracker) =>
      tracker.userId === session.user.id
        ? { ...tracker, active: false, expiresAt: null, status: 'Detenida', updatedAt: new Date().toISOString() }
        : tracker
    );
    setTrackers(updated);
    setNotifications('Ubicación detenida manualmente.');
  };

  const addInternalMessage = () => {
    if (!messageText.trim()) return;
    const nextMessage = {
      id: `msg-${Date.now()}`,
      sender: session?.user?.name || 'Sistema',
      text: messageText.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [nextMessage, ...current]);
    setMessageText('');
  };

  const addBase = () => {
    if (!newBase.name.trim() || !newBase.username.trim() || !newBase.password.trim()) return;

    const existing = users.some((user) => user.username.toLowerCase() === newBase.username.trim().toLowerCase());
    if (existing) {
      setNotifications('Ese nombre de usuario ya existe. Elegí otro.');
      return;
    }

    const baseId = `base-${Date.now()}`;
    const createdUser = {
      id: `operator-${baseId}`,
      role: 'operator',
      username: newBase.username.trim(),
      password: newBase.password.trim(),
      name: newBase.name.trim(),
      baseId,
      baseName: newBase.name.trim(),
      phone: newBase.phone.trim() || 'Sin teléfono',
      department: 'Base operativa',
    };

    const baseSeed = {
      id: baseId,
      name: newBase.name.trim(),
      username: newBase.username.trim(),
      password: newBase.password.trim(),
      phone: newBase.phone.trim() || 'Sin teléfono',
      position: [-34.6, -58.4],
    };

    defaultBaseLocations.push(baseSeed);
    setUsers((current) => [...current, createdUser]);
    setNewBase({ name: '', username: '', password: '', phone: '' });
    setNotifications(`Base ${newBase.name.trim()} creada correctamente.`);
  };

  const renderAdminView = () => (
    <div className="content-grid two-columns">
      <div className="panel">
        <h3>Panel administrativo</h3>
        <div className="admin-summary">
          <span>{users.filter((user) => user.role === 'operator').length} bases</span>
          <span>{getAllActiveTrackers().length} ubicaciones activas</span>
        </div>

        <div className="form-card compact">
          <h4>Agregar base</h4>
          <input
            value={newBase.name}
            onChange={(e) => setNewBase((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre de la base"
          />
          <input
            value={newBase.username}
            onChange={(e) => setNewBase((prev) => ({ ...prev, username: e.target.value }))}
            placeholder="Usuario"
          />
          <input
            type="password"
            value={newBase.password}
            onChange={(e) => setNewBase((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Contraseña"
          />
          <input
            value={newBase.phone}
            onChange={(e) => setNewBase((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="Teléfono"
          />
          <CreateMessageButton label="Crear base" onClick={addBase} tone="primary" />
        </div>

        <div className="admin-list">
          {users.filter((user) => user.role === 'operator').map((user) => {
            const tracker = getTrackerForUser(user.id);
            return (
              <div className="user-row" key={user.id}>
                <div>
                  <strong>{user.baseName}</strong>
                  <div>{user.username}</div>
                </div>
                <div className={`status-pill ${tracker?.active ? 'active' : 'inactive'}`}>
                  {tracker?.active ? 'En movimiento' : 'Sin seguimiento'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel">
        <h3>Mapa general</h3>
        <MapView user={session.user} trackers={trackers} currentLocation={null} adminVisibleUsers={adminVisibleUsers} />
      </div>

      <div className="panel full-width">
        <h3>Mensajes internos</h3>
        <div className="message-box">
          <input
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Escribí un mensaje interno..."
          />
          <CreateMessageButton label="Enviar" onClick={addInternalMessage} tone="secondary" />
        </div>

        <div className="message-list">
          {messages.map((message) => (
            <div key={message.id} className="message-item">
              <div className="message-meta">
                <strong>{message.sender}</strong>
                <span>{formatDateTime(message.createdAt)}</span>
              </div>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOperatorView = () => {
    const tracker = getTrackerForUser(session.user.id);
    const requiredFields = Object.keys(FIELD_LABELS);
    const statusClass = (key) => {
      const value = formData[key]?.toString().trim();
      return value ? 'status-green' : 'status-red';
    };

    return (
      <div className="content-grid two-columns">
        <div className="panel">
          <h3>Formulario obligatorio</h3>
          <div className="required-indicator">
            {requiredFields.map((field) => (
              <span key={field} className={`status-chip ${statusClass(field)}`}>
                {FIELD_LABELS[field]}
              </span>
            ))}
          </div>

          <div className="form-card">
            <label className={statusClass('fullName')}>
              <span>{FIELD_LABELS.fullName}</span>
              <input
                value={formData.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                placeholder="Nombre y apellido"
              />
            </label>

            <label className={statusClass('phone')}>
              <span>{FIELD_LABELS.phone}</span>
              <input
                value={formData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="Ej: +54 9 11 1234 5678"
              />
            </label>

            <label className={statusClass('activity')}>
              <span>{FIELD_LABELS.activity}</span>
              <input
                value={formData.activity}
                onChange={(e) => handleFieldChange('activity', e.target.value)}
                placeholder="Actividad que realiza"
              />
            </label>

            <label className={statusClass('location')}>
              <span>{FIELD_LABELS.location}</span>
              <input
                value={formData.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                placeholder="Destino o lugar actual"
              />
            </label>

            <label className={statusClass('notes')}>
              <span>{FIELD_LABELS.notes}</span>
              <textarea
                value={formData.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="Observaciones"
              />
            </label>

            <CreateMessageButton
              label="Guardar formulario"
              onClick={saveForm}
              tone={currentFormValidity ? 'primary' : 'disabled'}
            />
          </div>

          <div className="tracking-box">
            <h4>Activar ubicación</h4>
            <div className="duration-select">
              {durationOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={trackingHours === option ? 'time-pill selected' : 'time-pill'}
                  onClick={() => setTrackingHours(option)}
                >
                  {option}h
                </button>
              ))}
            </div>

            <div className="tracking-actions">
              <CreateMessageButton label="Iniciar" onClick={handleTrackingToggle} tone="primary" />
              <CreateMessageButton label="Detener" onClick={handleStopTracking} tone="secondary" />
            </div>

            <div className="tracker-state">
              {tracker?.active ? (
                <>
                  <strong>Ubicación activa</strong>
                  <span>Finaliza: {tracker.expiresAt ? formatDateTime(tracker.expiresAt) : '—'}</span>
                </>
              ) : (
                <>
                  <strong>Ubicación desactivada</strong>
                  <span>Sin seguimiento activo</span>
                </>
              )}
            </div>
          </div>

          <div className="contact-buttons">
            <a href={`https://wa.me/${session.user.phone}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={`tel:${session.user.phone}`}>Llamar</a>
          </div>
        </div>

        <div className="panel">
          <h3>Mapa de ubicación</h3>
          <MapView user={session.user} trackers={trackers} currentLocation={null} adminVisibleUsers={adminVisibleUsers} />
        </div>
      </div>
    );
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Sistema de seguimiento</p>
          <h1>GEOLOCALIZACIÓN GAD</h1>
        </div>
        {session && (
          <div className="session-info">
            <span>{session.user.name}</span>
            <button className="ghost-button" onClick={handleLogout} type="button">
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      {notifications && <div className="notification-banner">{notifications}</div>}

      {!session ? (
        <div className="login-shell">
          <div className="login-card">
            <h2>Ingresar al sistema</h2>
            <p>Acceso por usuario y contraseña de base</p>
            <form onSubmit={handleLogin} className="login-form">
              <input
                value={loginData.username}
                onChange={(event) => setLoginData((current) => ({ ...current, username: event.target.value }))}
                placeholder="Usuario"
              />
              <input
                type="password"
                value={loginData.password}
                onChange={(event) => setLoginData((current) => ({ ...current, password: event.target.value }))}
                placeholder="Contraseña"
              />
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="primary-full">Ingresar</button>
            </form>
            <div className="demo-accounts">
              <small>Usuario administrador: admin / admin1234</small>
              <small>Usuario base: gadescobar / escobar1234</small>
            </div>
          </div>
        </div>
      ) : session.user.role === 'admin' ? (
        renderAdminView()
      ) : (
        renderOperatorView()
      )}
    </div>
  );
}

export default App;
