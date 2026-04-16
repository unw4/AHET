import React, { useState } from 'react'
import Badge from '@/components/common/Badge/Badge'
import Button from '@/components/common/Button/Button'

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
type Priority = 'low' | 'medium' | 'high' | 'urgent'

interface Task {
  id: string; title: string; vehicle?: string; assignee: string; priority: Priority; due?: string
}

const TASKS: Record<Status, Task[]> = {
  TODO: [
    { id: 't1', title: 'P0300 hata kodunu incele', vehicle: '34 AHT 001', assignee: 'Ali K.', priority: 'urgent', due: '17 Nis' },
    { id: 't2', title: 'Yağ değişimi planla', vehicle: '34 AHT 002', assignee: 'Mert Ç.', priority: 'medium', due: '20 Nis' },
    { id: 't3', title: 'Lastik rotasyonu', vehicle: '06 KYK 554', assignee: 'Berk T.', priority: 'low' },
  ],
  IN_PROGRESS: [
    { id: 't4', title: 'Fren sistemi kontrolü', vehicle: '06 KYK 555', assignee: 'Ali K.', priority: 'high', due: '16 Nis' },
    { id: 't5', title: 'SD kart formatla — v4', vehicle: '06 KYK 555', assignee: 'Mert Ç.', priority: 'medium' },
  ],
  DONE: [
    { id: 't6', title: 'Egzoz testi #1124 onaylandı', vehicle: '35 MRT 777', assignee: 'Ali K.', priority: 'high' },
    { id: 't7', title: 'Haftalık rapor gönderildi', assignee: 'Mert Ç.', priority: 'low' },
    { id: 't8', title: 'Firmware güncelleme — v2.3.1', vehicle: '34 AHT 001', assignee: 'Berk T.', priority: 'medium' },
  ],
  CANCELLED: [
    { id: 't9', title: 'Manuel log aktarımı', vehicle: '16 BRS 100', assignee: 'Ali K.', priority: 'low' },
  ],
}

const COL_CONFIG: { key: Status; label: string; color: string }[] = [
  { key: 'TODO',        label: 'Bekliyor',       color: '#888' },
  { key: 'IN_PROGRESS', label: 'Devam Ediyor',   color: '#E65C00' },
  { key: 'DONE',        label: 'Tamamlandı',     color: 'var(--color-success)' },
  { key: 'CANCELLED',   label: 'İptal',          color: '#555' },
]

const PRIORITY_LABEL: Record<Priority, React.ReactElement> = {
  low:    <Badge variant="low" />,
  medium: <Badge variant="medium" />,
  high:   <Badge variant="high" />,
  urgent: <Badge variant="urgent" />,
}

const TaskBoardPage: React.FC = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <div className="page-title" style={{ margin: 0 }}>Görev Panosu</div>
      <Button variant="primary">+ Yeni Görev</Button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
      {COL_CONFIG.map(col => (
        <div key={col.key}>
          {/* COLUMN HEADER */}
          <div style={{ background: col.color, border: '2px solid var(--color-border)', padding: '8px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff' }}>{col.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#fff', opacity: 0.8 }}>{TASKS[col.key].length}</span>
          </div>

          {/* CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TASKS[col.key].map(task => (
              <div key={task.id}
                style={{ background: 'var(--color-bg)', border: '2px solid var(--color-border)', boxShadow: '3px 3px 0px var(--color-secondary)', padding: 14, cursor: 'pointer', transition: 'transform 80ms' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translate(-2px,-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>{task.title}</div>
                {task.vehicle && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-secondary)', background: 'rgba(0,31,91,0.08)', padding: '2px 6px', display: 'inline-block', marginBottom: 8, fontWeight: 700 }}>{task.vehicle}</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                  {PRIORITY_LABEL[task.priority]}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#999' }}>{task.assignee}</span>
                </div>
                {task.due && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#bbb', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Son: {task.due}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default TaskBoardPage
