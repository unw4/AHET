import React from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '@/components/common/Badge/Badge'
import StatusIndicator from '@/components/common/StatusIndicator/StatusIndicator'

const stat = (label: string, value: string | number, accent?: boolean): React.CSSProperties => ({})

const STATS = [
  { label: 'Toplam Araç', value: '12', color: 'var(--color-secondary)' },
  { label: 'Aktif DTC', value: '4', color: 'var(--color-danger)' },
  { label: 'Bekleyen Görev', value: '7', color: '#E65C00' },
  { label: 'Bugün Test', value: '2', color: 'var(--color-success)' },
]

const VEHICLES = [
  { id: 'v1', plate: '34 AHT 001', make: 'Ford Transit', km: 84_200, dtc: 2, status: 'online' as const, lastSync: '10 dk önce' },
  { id: 'v2', plate: '34 AHT 002', make: 'VW Crafter', km: 121_800, dtc: 0, status: 'offline' as const, lastSync: '3 sa önce' },
  { id: 'v3', plate: '06 KYK 554', make: 'Mercedes Sprinter', km: 67_400, dtc: 1, status: 'online' as const, lastSync: '2 dk önce' },
  { id: 'v4', plate: '06 KYK 555', make: 'Fiat Ducato', km: 203_100, dtc: 0, status: 'error' as const, lastSync: '1 gün önce' },
  { id: 'v5', plate: '35 MRT 777', make: 'Renault Master', km: 55_600, dtc: 1, status: 'syncing' as const, lastSync: 'Şimdi' },
  { id: 'v6', plate: '01 ALİ 333', make: 'Peugeot Boxer', km: 98_300, dtc: 0, status: 'online' as const, lastSync: '25 dk önce' },
]

const DTC_ALERTS = [
  { plate: '34 AHT 001', code: 'P0300', desc: 'Rastgele Ateşleme Kaçağı', sev: 'critical' as const, time: '10 dk önce' },
  { plate: '34 AHT 001', code: 'P0171', desc: 'Yakıt Sistemi Fakir (Bank 1)', sev: 'high' as const, time: '10 dk önce' },
  { plate: '06 KYK 554', code: 'P0420', desc: 'Katalitik Konvertör Verimsiz', sev: 'medium' as const, time: '2 dk önce' },
  { plate: '35 MRT 777', code: 'U0100', desc: 'ECM/PCM İletişim Kaybı', sev: 'high' as const, time: '5 dk önce' },
]

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div>
      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: s.color, border: '2px solid var(--color-border)', boxShadow: '4px 4px 0px var(--color-border)', padding: '20px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: s.color === 'var(--color-secondary)' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* VEHICLE GRID */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Araç Durumu</span>
            <button onClick={() => navigate('/vehicles')} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'none', border: '1px solid var(--color-border)', padding: '3px 10px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase' }}>Tümünü Gör →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {VEHICLES.map(v => (
              <div key={v.id} onClick={() => navigate(`/vehicles/${v.id}`)}
                style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)', padding: 14, cursor: 'pointer', transition: 'transform 80ms' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translate(-2px,-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>{v.plate}</span>
                  <StatusIndicator status={v.status} showLabel={false} />
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#555', marginBottom: 8 }}>{v.make}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#777' }}>{v.km.toLocaleString('tr-TR')} km</span>
                  {v.dtc > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'var(--color-danger)', color: '#fff', padding: '1px 6px', fontWeight: 700 }}>{v.dtc} DTC</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#aaa', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sync: {v.lastSync}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DTC ALERTS */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Aktif DTC Uyarıları</div>
          <div style={{ border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)', background: 'var(--color-bg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'var(--color-secondary)' }}>
                  {['Plaka', 'Kod', 'Açıklama', 'Seviye'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DTC_ALERTS.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-surface)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>{d.plate}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--color-danger)', fontWeight: 700 }}>{d.code}</td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: '#444' }}>{d.desc}</td>
                    <td style={{ padding: '10px 12px' }}><Badge variant={d.sev} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* QUICK STATS ROW */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Bu Haftaki Özet</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[
                { label: 'Tamamlanan Görev', value: '14' },
                { label: 'Bakım Yapıldı', value: '3' },
                { label: 'Test Geçti', value: '5/6' },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--color-secondary)' }}>{item.value}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
