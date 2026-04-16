import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '@/components/common/Badge/Badge'
import StatusIndicator from '@/components/common/StatusIndicator/StatusIndicator'
import Button from '@/components/common/Button/Button'

const VEHICLES = [
  { id: 'v1', plate: '34 AHT 001', make: 'Ford', model: 'Transit', year: 2021, km: 84200, status: 'online' as const, dtc: 2, lastSync: '10 dk önce', active: true },
  { id: 'v2', plate: '34 AHT 002', make: 'VW', model: 'Crafter', year: 2020, km: 121800, status: 'offline' as const, dtc: 0, lastSync: '3 sa önce', active: true },
  { id: 'v3', plate: '06 KYK 554', make: 'Mercedes', model: 'Sprinter', year: 2022, km: 67400, status: 'online' as const, dtc: 1, lastSync: '2 dk önce', active: true },
  { id: 'v4', plate: '06 KYK 555', make: 'Fiat', model: 'Ducato', year: 2019, km: 203100, status: 'error' as const, dtc: 0, lastSync: '1 gün önce', active: true },
  { id: 'v5', plate: '35 MRT 777', make: 'Renault', model: 'Master', year: 2023, km: 55600, status: 'syncing' as const, dtc: 1, lastSync: 'Şimdi', active: true },
  { id: 'v6', plate: '01 ALİ 333', make: 'Peugeot', model: 'Boxer', year: 2021, km: 98300, status: 'online' as const, dtc: 0, lastSync: '25 dk önce', active: true },
  { id: 'v7', plate: '16 BRS 100', make: 'Iveco', model: 'Daily', year: 2018, km: 312000, status: 'offline' as const, dtc: 0, lastSync: '5 gün önce', active: false },
  { id: 'v8', plate: '34 IST 990', make: 'Citroen', model: 'Jumper', year: 2020, km: 88900, status: 'online' as const, dtc: 0, lastSync: '1 sa önce', active: true },
]

const VehicleListPage: React.FC = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = VEHICLES.filter(v =>
    `${v.plate} ${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="page-title" style={{ margin: 0 }}>Araç Listesi</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Plaka veya marka ara..."
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '8px 12px', border: '2px solid var(--color-border)', background: 'var(--color-surface)', width: 240, outline: 'none' }}
          />
          <Button variant="primary">+ Yeni Araç</Button>
        </div>
      </div>

      <div style={{ border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)', background: 'var(--color-bg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--color-secondary)' }}>
              {['Plaka', 'Marka / Model', 'Yıl', 'KM', 'Son Sync', 'DTC', 'Durum', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid var(--color-border)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid var(--color-surface)', cursor: 'pointer' }}
                onClick={() => navigate(`/vehicles/${v.id}`)}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,215,0,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ padding: '12px 14px', fontWeight: 700 }}>{v.plate}</td>
                <td style={{ padding: '12px 14px' }}>{v.make} {v.model}</td>
                <td style={{ padding: '12px 14px', color: '#666' }}>{v.year}</td>
                <td style={{ padding: '12px 14px' }}>{v.km.toLocaleString('tr-TR')}</td>
                <td style={{ padding: '12px 14px', fontSize: 11, color: '#888' }}>{v.lastSync}</td>
                <td style={{ padding: '12px 14px' }}>
                  {v.dtc > 0
                    ? <span style={{ background: 'var(--color-danger)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, padding: '2px 7px' }}>{v.dtc} Aktif</span>
                    : <span style={{ color: '#aaa', fontSize: 11 }}>—</span>
                  }
                </td>
                <td style={{ padding: '12px 14px' }}><StatusIndicator status={v.status} /></td>
                <td style={{ padding: '12px 14px' }}>
                  <button onClick={e => { e.stopPropagation(); navigate(`/vehicles/${v.id}`) }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, background: 'none', border: '1px solid var(--color-border)', padding: '4px 10px', cursor: 'pointer', textTransform: 'uppercase' }}>
                    Detay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 12 }}>
        {filtered.length} araç gösteriliyor
      </div>
    </div>
  )
}

export default VehicleListPage
