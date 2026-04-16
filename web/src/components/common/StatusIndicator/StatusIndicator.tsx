import React from 'react'
import styles from './StatusIndicator.module.css'

type Status = 'online' | 'offline' | 'error' | 'syncing'
interface Props { status: Status; showLabel?: boolean }

const LABELS: Record<Status, string> = {
  online: 'Çevrimiçi', offline: 'Çevrimdışı', error: 'Hata', syncing: 'Sync',
}

const StatusIndicator: React.FC<Props> = ({ status, showLabel = true }) => (
  <span className={styles.wrap}>
    <span className={`${styles.dot} ${styles[status]}`} />
    {showLabel && <span className={styles.label}>{LABELS[status]}</span>}
  </span>
)

export default StatusIndicator
