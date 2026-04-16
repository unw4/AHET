import React from 'react'
import styles from './Badge.module.css'

type BadgeVariant =
  | 'todo' | 'in_progress' | 'done' | 'cancelled'
  | 'low' | 'medium' | 'high' | 'urgent' | 'critical'
  | 'pass' | 'fail' | 'incomplete'
  | 'scheduled' | 'overdue' | 'completed'

interface BadgeProps { variant: BadgeVariant; label?: string }

const LABELS: Record<BadgeVariant, string> = {
  todo: 'Bekliyor', in_progress: 'Devam Ediyor', done: 'Tamam', cancelled: 'İptal',
  low: 'Düşük', medium: 'Orta', high: 'Yüksek', urgent: 'Acil', critical: 'Kritik',
  pass: 'Geçti', fail: 'Kaldı', incomplete: 'Yarım',
  scheduled: 'Planlandı', overdue: 'Gecikti', completed: 'Tamamlandı',
}

const Badge: React.FC<BadgeProps> = ({ variant, label }) => (
  <span className={`${styles.badge} ${styles[variant]}`}>
    {label ?? LABELS[variant]}
  </span>
)

export default Badge
