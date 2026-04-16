import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '@/components/common/Badge/Badge'
import StatusIndicator from '@/components/common/StatusIndicator/StatusIndicator'
import Button from '@/components/common/Button/Button'

const VEHICLE = { id: 'v1', plate: '34 AHT 001', make: 'Ford', model: 'Transit', year: 2021, km: 84200, status: 'online' as const, vin: 'WF0XXXTTGXKA12345' }

const DTCS = [
  { code: 'P0300', desc: 'Rastgele Ateşleme Kaçağı', sev: 'critical' as const, first: '16 Nis 2026', last: '16 Nis 2026', active: true },
  { code: 'P0171', desc: 'Yakıt Sistemi Fakir (Bank 1)', sev: 'high' as const, first: '15 Nis 2026', last: '16 Nis 2026', active: true },
  { code: 'P0420', desc: 'Katalitik Konvertör Verimsiz', sev: 'medium' as const, first: '10 Nis 2026', last: '14 Nis 2026', active: false },
]

const TELEMETRY = [
  { time: '14:32', rpm: 820, temp: 87, km: 84200 },
  { time: '14:00', rpm: 2100, temp: 91, km: 84185 },
  { time: '10:15', rpm: 1800, temp: 88, km: 84100 },
  { time: '08:00', rpm: 750, temp: 78, km: 84050 },
]

const VehicleDetailPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate('/vehicles')} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'none', border: '2px solid var(--color-border)', padding: '6px 12px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', boxShadow: 'var(--shadow-brutalist)' }}>← Geri</button>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1 }}>{VEHICLE.plate}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#666', marginTop: 4 }}>{VEHICLE.make} {VEHICLE.model} · {VEHICLE.year} · VIN: {VEHICLE.vin}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusIndicator status={VEHICLE.status} />
        </div>
      </div>

      {/* KPI ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Toplam KM', value: VEHICLE.km.toLocaleString('tr-TR'), unit: 'km' },
          { label: 'Motor RPM', value: '820', unit: 'rpm' },
          { label: 'Soğutma', value: '87', unit: '°C' },
          { label: 'Aktif DTC', value: '2', unit: 'hata' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)', padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--color-secondary)', lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#aaa', marginTop: 4 }}>{kpi.unit}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        {/* DTC TABLE */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>DTC Geçmişi</div>
          <div style={{ border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'var(--color-secondary)' }}>
                  {['Kod', 'Açıklama', 'Seviye', 'Durum', 'Son Görülme'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DTCS.map(d => (
                  <tr key={d.code} style={{ borderBottom: '1px solid var(--color-surface)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: d.active ? 'var(--color-danger)' : '#aaa' }}>{d.code}</td>
                    <td style={{ padding: '10px 12px', fontSize: 11 }}>{d.desc}</td>
                    <td style={{ padding: '10px 12px' }}><Badge variant={d.sev} /></td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 6px', fontWeight: 700, background: d.active ? 'var(--color-danger)' : 'var(--color-success)', color: '#fff', textTransform: 'uppercase' }}>
                        {d.active ? 'Aktif' : 'Çözüldü'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: '#777' }}>{d.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TELEMETRY LOG */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Telemetri Logu</div>
          <div style={{ border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'var(--color-secondary)' }}>
                  {['Saat', 'RPM', 'Sıcaklık', 'KM'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TELEMETRY.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-surface)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>{t.time}</td>
                    <td style={{ padding: '10px 12px' }}>{t.rpm}</td>
                    <td style={{ padding: '10px 12px' }}>{t.temp}°C</td>
                    <td style={{ padding: '10px 12px' }}>{t.km.toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <Button variant="primary">Bakım Planla</Button>
            <Button variant="secondary">Test Başlat</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetailPage
