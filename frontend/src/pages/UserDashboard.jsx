import React, { useEffect, useState } from 'react';
import api from '../api';
import OfflineService from '../services/offlineService';

const TIPOS = [
  { key: 'entrada', label: 'Entrada' },
  { key: 'intervalo-saida', label: 'Saída para intervalo' },
  { key: 'intervalo-volta', label: 'Volta do intervalo' },
  { key: 'saida', label: 'Saída final' }
];

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [lastRegistro, setLastRegistro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchLast();
    OfflineService.syncPending();
    window.addEventListener('online', () => {
      setMsg('Online - tentando sincronizar...');
      OfflineService.syncPending().then(() => setMsg('Sincronização concluída'));
    });
  }, []);

  async function fetchLast() {
    try {
      const res = await api.get(`/registros/${user.id}`);
      setLastRegistro(res.data[0] || null);
    } catch (e) {
      console.error(e);
    }
  }

  async function registrar(tipo) {
    setMsg('');
    if (!navigator.geolocation) {
      setMsg('Geolocalização não suportada pelo navegador');
      return;
    }

    setLoading(true);

    const getPosition = () => new Promise((resolve, reject) => {
      const options = { enableHighAccuracy: true, timeout: 10000 };
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

    try {
      const pos = await getPosition();
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      const payload = { tipo, latitude, longitude, timestamp: new Date().toISOString() };

      if (!navigator.onLine) {
        await OfflineService.savePending(payload);
        setMsg('Você está offline. Registro salvo localmente e será sincronizado quando online.');
      } else {
        await api.post('/registro', payload);
        setMsg('Registro enviado com sucesso');
      }
      await fetchLast();
    } catch (err) {
      console.error('erro gps ou rede', err);
      setMsg('Erro ao obter GPS ou enviar registro. Se estiver offline, o registro foi salvo localmente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Dashboard do Usuário</h2>
      <div>
        {TIPOS.map(t => (
          <button key={t.key} onClick={() => registrar(t.key)} disabled={loading} style={{ marginRight: 8 }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <strong>Último registro:</strong>
        {lastRegistro ? (
          <div>
            <div>Tipo: {lastRegistro.tipo}</div>
            <div>Horário: {new Date(lastRegistro.timestamp).toLocaleString()}</div>
            <div>Coordenadas: {lastRegistro.latitude}, {lastRegistro.longitude}</div>
          </div>
        ) : <div>Nenhum registro</div>}
      </div>
      {msg && <div style={{ marginTop: 10, color: 'blue' }}>{msg}</div>}
    </div>
  );
}