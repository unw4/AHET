import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './TopBar.module.css'

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/vehicles': 'Araç Listesi',
  '/tasks': 'Görev Panosu',
  '/maintenance': 'Bakım Takvimi',
  '/tests': 'Tanı Oturumları',
}

const TopBar: React.FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const title = TITLES[pathname] ?? TITLES[Object.keys(TITLES).find(k => pathname.startsWith(k)) ?? ''] ?? 'AH@'

  return (
    <div className={styles.topbar}>
      <span className={styles.title}>{title}</span>
      <div className={styles.actions}>
        <button className={styles.notifBtn} title="Bildirimler">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 1a5 5 0 0 1 5 5v3l1 2H2l1-2V6a5 5 0 0 1 5-5z"/>
            <path d="M6.5 13a1.5 1.5 0 0 0 3 0"/>
          </svg>
          <span className={styles.notifBadge}>3</span>
        </button>
        <button className={styles.logoutBtn} onClick={() => navigate('/login')}>
          Çıkış
        </button>
      </div>
    </div>
  )
}

export default TopBar
