import React, { useState } from 'react'
import Badge from '@/components/common/Badge/Badge'
import Button from '@/components/common/Button/Button'
import { useNavigate } from 'react-router-dom'

type SessionStatus = 'active' | 'done' | 'pending'

interface Finding {
  code: string
  desc: string
  severity: 'urgent' | 'high' | 'medium' | 'low'
}

interface Session {
  id: string
  plate: string
  mechanic: string
  startedAt: string
  duration?: string
  status: SessionStatus
  findings: Finding[]
  repairCost?: number
  taskCreated: boolean
  notes: string
}

const SESSIONS: Session[] = [
  {
    id: 's1',
    plate: '34 AHT 001',
    mechanic: 'Ali K.',
    startedAt: '16 Nis 09:15',
    duration: '22 dk',
    status: 'done',
    findings: [
      { code: 'P0300', desc: 'Ateşleme kaçağı — buji seti değişmeli', severity: 'urgent' },
      { code: 'P0171', desc: 'Yakıt karışımı fakir — MAF sensörü kirli', severity: 'high' },
    ],
    repairCost: 1850,
    taskCreated: true,
    notes: 'Buji seti + MAF temizliği öncelikli. Araç haftaya hazır.',
  },
  {
    id: 's2',
    plate: '06 KYK 554',
    mechanic: 'Berk T.',
    startedAt: '15 Nis 14:00',
    duration: '18 dk',
    status: 'done',
    findings: [
      { code: 'P0420', desc: 'Katalitik konvertör verimliliği düşük', severity: 'medium' },
    ],
    repairCost: 4200,
    taskCreated: true,
    notes: 'Kat. değişimi gerekiyor. Şimdilik sürülebilir durumda.',
  },
  {
    id: 's3',
    plate: '35 MRT 777',
    mechanic: 'Ali K.',
    startedAt: '16 Nis 11:30',
    duration: undefined,
    status: 'active',
    findings: [],
    repairCost: undefined,
    taskCreated: false,
    notes: 'Tanı devam ediyor...',
  },
  {
    id: 's4',
    plate: '34 AHT 002',
    mechanic: '—',
    startedAt: '—',
    duration: undefined,
    status: 'pending',
    findings: [],
    repairCost: undefined,
    taskCreated: false,
    notes: 'Sürücü yavaş ivmelenme şikayeti bildirdi.',
  },
]

const SEV_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 }

const STATUS_LABEL: Record<SessionStatus, string> = {
  active: 'Devam Ediyor',
  done: 'Tamamlandı',
  pending: 'Bekliyor',
}

const STATUS_COLOR: Record<SessionStatus, string> = {
  active: '#E65C00',
  done: 'var(--color-success)',
  pending: '#888',
}

const TestManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const [starting, setStarting] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)

  const detail = SESSIONS.find(s => s.id === detailId)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="page-title" style={{ margin: 0 }}>Tanı Oturumları</div>
        <Button variant="primary" onClick={() => setStarting('new')}>+ Tanı Başlat</Button>
      </div>

      {/* ACTIVE SESSION BANNER */}
      {SESSIONS.some(s => s.status === 'active') && (
        <div style={{ background: '#E65C00', border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)', padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 10, height: 10, background: '#fff', display: 'inline-block', animation: 'none', opacity: 0.9 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff' }}>Aktif Tanı — 35 MRT 777</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>Ali K. · 11:30'dan beri çalışıyor · OBD-II verisi okunuyor</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" onClick={() => setDetailId('s3')}>Canlı Veri</Button>
          </div>
        </div>
      )}

      {/* SUMMARY ROW */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Bu Ay Tanı', value: '14', color: 'var(--color-secondary)' },
          { label: 'Toplam Tasarruf', value: '₺28.4K', color: 'var(--color-success)' },
          { label: 'Ortalama Süre', value: '19 dk', color: '#555' },
          { label: 'Açık Tamir', value: '3', color: '#E65C00' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)', padding: '12px 20px', flex: 1, boxShadow: '3px 3px 0px var(--color-border)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* SESSION TABLE */}
      <div style={{ border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-brutalist)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--color-bg)' }}>
          <thead>
            <tr style={{ background: 'var(--color-secondary)' }}>
              {['Araç', 'Teknisyen', 'Başlangıç', 'Süre', 'Bulunan Sorunlar', 'Tamir Maliyet', 'Durum', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid var(--color-border)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SESSIONS.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--color-surface)', cursor: 'pointer' }}
                onClick={() => setDetailId(s.id)}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,215,0,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ padding: '12px 14px', fontWeight: 700 }}>{s.plate}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{s.mechanic}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#777' }}>{s.startedAt}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#777' }}>{s.duration ?? (s.status === 'active' ? <span style={{ color: '#E65C00', fontWeight: 700 }}>↻ Devam</span> : '—')}</td>
                <td style={{ padding: '12px 14px' }}>
                  {s.findings.length === 0
                    ? <span style={{ color: '#bbb', fontSize: 11 }}>—</span>
                    : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {[...s.findings].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]).map(f => (
                          <div key={f.code} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Badge variant={f.severity} label={f.code} />
                            <span style={{ fontSize: 11, color: '#555' }}>{f.desc}</span>
                          </div>
                        ))}
                      </div>
                    )
                  }
                </td>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: s.repairCost ? 'var(--color-secondary)' : '#bbb' }}>
                  {s.repairCost ? `₺${s.repairCost.toLocaleString('tr-TR')}` : '—'}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: STATUS_COLOR[s.status] }}>
                    {STATUS_LABEL[s.status]}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {s.status === 'pending'
                    ? <Button variant="primary" onClick={e => { e.stopPropagation(); setStarting(s.id) }}>Başlat</Button>
                    : <button onClick={e => { e.stopPropagation(); setDetailId(s.id) }}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, background: 'none', border: '1px solid var(--color-border)', padding: '4px 10px', cursor: 'pointer', textTransform: 'uppercase' }}>
                        Detay
                      </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* START SESSION MODAL */}
      {starting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)', boxShadow: '8px 8px 0px var(--color-secondary)', width: 460 }}>
            <div style={{ background: 'var(--color-secondary)', padding: '16px 20px', borderBottom: '2px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.06em' }}>Tanı Oturumu Başlat</span>
              <button onClick={() => setStarting(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '24px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Araç</label>
                  <select style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '8px 10px', border: '2px solid var(--color-border)', background: 'var(--color-surface)', outline: 'none' }}>
                    <option>34 AHT 002</option>
                    <option>06 KYK 555</option>
                    <option>35 MRT 777</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Teknisyen</label>
                  <select style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '8px 10px', border: '2px solid var(--color-border)', background: 'var(--color-surface)', outline: 'none' }}>
                    <option>Ali K.</option>
                    <option>Berk T.</option>
                    <option>Mert Ç.</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Şikayet / Not</label>
                <textarea style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '8px 10px', border: '2px solid var(--color-border)', background: 'var(--color-surface)', outline: 'none', resize: 'vertical', minHeight: 64, boxSizing: 'border-box' }} placeholder="Sürücü şikayeti veya gözlem..." />
              </div>
              <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid var(--color-primary)', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-secondary)' }}>
                Araç <strong>çalışır durumdayken</strong> OBD-II / CAN verisi okunacak. Teknisyen araç yanında olmalı.
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '2px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button variant="ghost" onClick={() => setStarting(null)}>İptal</Button>
              <Button variant="primary" onClick={() => setStarting(null)}>Tanıyı Başlat</Button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)', boxShadow: '8px 8px 0px var(--color-secondary)', width: 560 }}>
            <div style={{ background: 'var(--color-secondary)', padding: '16px 20px', borderBottom: '2px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.06em' }}>{detail.plate} — Tanı Detayı</span>
              <button onClick={() => setDetailId(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '20px' }}>
              {/* OBD-II LIVE DATA (active) or summary */}
              {detail.status === 'active' ? (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, color: '#E65C00' }}>— Canlı OBD-II Verisi —</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                    {[
                      { label: 'Motor RPM', value: '1.240' },
                      { label: 'Soğutma', value: '89°C' },
                      { label: 'Yakıt Trim (ST)', value: '+8.2%' },
                      { label: 'O2 Sensör', value: '0.41V' },
                      { label: 'Motor Yükü', value: '%34' },
                      { label: 'Hız', value: '0 km/h' },
                    ].map(d => (
                      <div key={d.label} style={{ background: 'var(--color-surface)', padding: '10px 12px', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{d.label}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--color-secondary)' }}>{d.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#888', textAlign: 'center' }}>DTC tarama devam ediyor...</div>
                </div>
              ) : (
                <div>
                  {detail.findings.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Bulunan Sorunlar</div>
                      {detail.findings.map(f => (
                        <div key={f.code} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', border: '1px solid var(--color-border)', marginBottom: 6, background: 'var(--color-surface)' }}>
                          <Badge variant={f.severity} label={f.code} />
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13 }}>{f.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div style={{ background: 'var(--color-surface)', padding: '12px 14px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Tamir Maliyeti</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--color-secondary)' }}>
                        {detail.repairCost ? `₺${detail.repairCost.toLocaleString('tr-TR')}` : '—'}
                      </div>
                    </div>
                    <div style={{ background: 'var(--color-surface)', padding: '12px 14px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Teknisyen</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--color-secondary)' }}>{detail.mechanic}</div>
                    </div>
                  </div>
                  {detail.notes && (
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#555', background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '10px 14px', marginBottom: 4 }}>
                      {detail.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ padding: '14px 20px', borderTop: '2px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button variant="ghost" onClick={() => setDetailId(null)}>Kapat</Button>
              {detail.findings.length > 0 && !detail.taskCreated && (
                <Button variant="primary" onClick={() => { setDetailId(null); navigate('/tasks') }}>
                  Tamir Görevi Oluştur
                </Button>
              )}
              {detail.taskCreated && (
                <Button variant="secondary" onClick={() => { setDetailId(null); navigate('/tasks') }}>
                  Göreve Git →
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestManagementPage
