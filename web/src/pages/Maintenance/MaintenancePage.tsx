import React from 'react'
import Badge from '@/components/common/Badge/Badge'
import Button from '@/components/common/Button/Button'

const ITEMS = [
  { id: 'm1', vehicle: '34 AHT 002', plate: '34 AHT 002', type: 'Yağ Değişimi', date: '20 Nis 2026', km: 130000, status: 'scheduled' as const, assignee: 'Ali K.' },
  { id: 'm2', vehicle: '06 KYK 555', plate: '06 KYK 555', type: 'Fren Servisi', date: '16 Nis 2026', km: null, status: 'in_progress' as const, assignee: 'Ali K.' },
  { id: 'm3', vehicle: '16 BRS 100', plate: '16 BRS 100', type: 'Genel Servis', date: '10 Nis 2026', km: 310000, status: 'overdue' as const, assignee: 'Berk T.' },
  { id: 'm4', vehicle: '34 AHT 001', plate: '34 AHT 001', type: 'Lastik Rotasyonu', date: '08 Nis 2026', km: null, status: 'done' as const, assignee: 'Ali K.' },
  { id: 'm5', vehicle: '35 MRT 777', plate: '35 MRT 777', type: 'Egzoz Testi Ön Bakım', date: '25 Nis 2026', km: null, status: 'scheduled' as const, assignee: 'Mert Ç.' },
  { id: 'm6', vehicle: '01 ALİ 333', plate: '01 ALİ 333', type: 'Filtre Değişimi', date: '30 Nis 2026', km: 110000, status: 'scheduled' as const, assignee: 'Berk T.' },
]

const STATUS_LABEL: Record<string, string> = {
  scheduled: 'Planlandı', in_progress: 'Devam Ediyor', overdue: 'Gecikti', done: 'Tamamlandı',
}

const MaintenancePage: React.FC = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <div className="page-title" style={{ margin: 0 }}>Bakım Takvimi</div>
      <Button variant="primary">+ Bakım Planla</Button>
    </div>

    {/* SUMMARY PILLS */}
    <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
      {[
        { label: 'Planlanan', count: 3, bg: 'var(--color-surface)', color: 'var(--color-text-primary)' },
        { label: 'Devam Eden', count: 1, bg: '#E65C00', color: '#fff' },
        { label: 'Geciken', count: 1, bg: 'var(--color-danger)', color: '#fff' },
        { label: 'Tamamlanan', count: 1, bg: 'var(--color-success)', color: '#fff' },
      ].map(p => (
        <div key={p.label} style={{ background: p.bg, color: p.color, border: '2px solid var(--color-border)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700 }}>{p.count}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: p.bg === 'var(--color-surface)' ? 0.7 : 0.9 }}>{p.label}</span>
        </div>
      ))}
    </div>

    {/* TABLE */}
    <div style={{ border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--color-bg)' }}>
        <thead>
          <tr style={{ background: 'var(--color-secondary)' }}>
            {['Araç', 'Bakım Türü', 'Tarih', 'KM Eşiği', 'Sorumlu', 'Durum', ''].map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid var(--color-border)', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ITEMS.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid var(--color-surface)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,215,0,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <td style={{ padding: '12px 14px', fontWeight: 700 }}>{item.plate}</td>
              <td style={{ padding: '12px 14px' }}>{item.type}</td>
              <td style={{ padding: '12px 14px', color: item.status === 'overdue' ? 'var(--color-danger)' : 'inherit', fontWeight: item.status === 'overdue' ? 700 : 400 }}>{item.date}</td>
              <td style={{ padding: '12px 14px', color: '#888' }}>{item.km ? `${item.km.toLocaleString('tr-TR')} km` : '—'}</td>
              <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{item.assignee}</td>
              <td style={{ padding: '12px 14px' }}><Badge variant={item.status === 'in_progress' ? 'in_progress' : item.status} label={STATUS_LABEL[item.status]} /></td>
              <td style={{ padding: '12px 14px' }}>
                {item.status !== 'done' && (
                  <button style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, background: 'none', border: '1px solid var(--color-border)', padding: '4px 10px', cursor: 'pointer', textTransform: 'uppercase' }}>
                    Düzenle
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default MaintenancePage
