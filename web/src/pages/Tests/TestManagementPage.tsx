import React, { useState } from 'react'
import Badge from '@/components/common/Badge/Badge'
import Button from '@/components/common/Button/Button'

const TESTS = [
  { id: 'ts1', vehicle: '35 MRT 777', plate: '35 MRT 777', approvedBy: 'Mert Ç.', started: '16 Nis 09:00', completed: null, result: null, notes: 'Motor sıcaklığı normal aralıkta' },
  { id: 'ts2', vehicle: '34 AHT 002', plate: '34 AHT 002', approvedBy: 'Mert Ç.', started: '15 Nis 14:30', completed: '15 Nis 14:52', result: 'pass' as const, notes: 'Tüm değerler limit dahilinde' },
  { id: 'ts3', vehicle: '06 KYK 554', plate: '06 KYK 554', approvedBy: 'Mert Ç.', started: '14 Nis 10:00', completed: '14 Nis 10:21', result: 'fail' as const, notes: 'CO oranı yüksek — bakım gerekli' },
  { id: 'ts4', vehicle: '01 ALİ 333', plate: '01 ALİ 333', approvedBy: 'Mert Ç.', started: '12 Nis 08:00', completed: '12 Nis 08:19', result: 'pass' as const, notes: '' },
  { id: 'ts5', vehicle: '34 AHT 001', plate: '34 AHT 001', approvedBy: null, started: null, completed: null, result: null, notes: 'Onay bekleniyor' },
]

const TestManagementPage: React.FC = () => {
  const [approving, setApproving] = useState<string | null>(null)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="page-title" style={{ margin: 0 }}>Egzoz Testleri</div>
        <Button variant="primary">+ Test Oturumu</Button>
      </div>

      {/* PENDING APPROVAL BANNER */}
      {TESTS.some(t => !t.approvedBy) && (
        <div style={{ background: 'var(--color-primary)', border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)', padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-secondary)' }}>Onay Bekleyen Test</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-secondary)', marginTop: 4 }}>34 AHT 001 için egzoz testi onayı gerekiyor</div>
          </div>
          <Button variant="secondary" onClick={() => setApproving('ts5')}>Onayla</Button>
        </div>
      )}

      {/* TABLE */}
      <div style={{ border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--color-bg)' }}>
          <thead>
            <tr style={{ background: 'var(--color-secondary)' }}>
              {['Araç', 'Başlangıç', 'Bitiş', 'Sonuç', 'Onaylayan', 'Not', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid var(--color-border)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TESTS.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--color-surface)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,215,0,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ padding: '12px 14px', fontWeight: 700 }}>{t.plate}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{t.started ?? '—'}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{t.completed ?? <span style={{ color: '#E65C00', fontWeight: 700 }}>Devam Ediyor</span>}</td>
                <td style={{ padding: '12px 14px' }}>
                  {t.result
                    ? <Badge variant={t.result} />
                    : <span style={{ color: '#bbb', fontSize: 11 }}>—</span>
                  }
                </td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{t.approvedBy ?? <span style={{ color: 'var(--color-danger)', fontWeight: 700 }}>Bekliyor</span>}</td>
                <td style={{ padding: '12px 14px', fontSize: 11, color: '#777', maxWidth: 200 }}>{t.notes || '—'}</td>
                <td style={{ padding: '12px 14px' }}>
                  {!t.approvedBy
                    ? <button onClick={() => setApproving(t.id)} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, background: 'var(--color-primary)', border: '1px solid var(--color-border)', padding: '4px 10px', cursor: 'pointer', textTransform: 'uppercase', color: 'var(--color-secondary)' }}>Onayla</button>
                    : <button style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, background: 'none', border: '1px solid var(--color-border)', padding: '4px 10px', cursor: 'pointer', textTransform: 'uppercase' }}>Detay</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* APPROVAL MODAL */}
      {approving && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)', boxShadow: '8px 8px 0px var(--color-secondary)', minWidth: 420 }}>
            <div style={{ background: 'var(--color-secondary)', padding: '16px 20px', borderBottom: '2px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.06em' }}>Test Oturumu Onayla</span>
              <button onClick={() => setApproving(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '24px 20px' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, marginBottom: 16 }}>
                <strong>34 AHT 001</strong> için 20 dakikalık egzoz test oturumunu onaylıyorsunuz. Araç bu süre boyunca test modunda çalışacak.
              </p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Süre</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--color-secondary)', marginBottom: 20 }}>20:00</div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '2px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button variant="ghost" onClick={() => setApproving(null)}>İptal</Button>
              <Button variant="primary" onClick={() => setApproving(null)}>Onayla ve Başlat</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestManagementPage
