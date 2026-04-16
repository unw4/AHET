import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const NAV = [
  {
    to: '/dashboard', label: 'Dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/><rect x="1" y="9" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/></svg>,
  },
  {
    to: '/vehicles', label: 'Araçlar',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 10V8l2-5h10l2 5v2"/><rect x="0" y="10" width="16" height="3"/><circle cx="3.5" cy="13" r="1.5" fill="currentColor" stroke="none"/><circle cx="12.5" cy="13" r="1.5" fill="currentColor" stroke="none"/></svg>,
  },
  {
    to: '/tasks', label: 'Görevler',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="2" width="3" height="12"/><rect x="6" y="2" width="3" height="9"/><rect x="11" y="2" width="3" height="6"/></svg>,
  },
  {
    to: '/maintenance', label: 'Bakım',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2l-1.5 1.5-1.5-1.5 1.5-1.5L10 2z"/><path d="M8.5 3.5L2 10l-1 3 3-1 6.5-6.5"/><path d="M3 12l1 1"/></svg>,
  },
  {
    to: '/tests', label: 'Egzoz Testleri',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="12" height="12"/><path d="M5 8l2.5 2.5 4-4"/></svg>,
  },
]

const Sidebar: React.FC = () => (
  <aside className={styles.sidebar}>
    <div className={styles.logo}>
      <div className={styles.logoText}>AH@</div>
      <div className={styles.logoSub}>Fleet Manager</div>
    </div>
    <nav className={styles.nav}>
      {NAV.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `${styles.navItem}${isActive ? ` ${styles.active}` : ''}`}
        >
          <span className={styles.navIcon}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
    <div className={styles.footer}>
      <div className={styles.user}>
        <div className={styles.userAvatar}>ME</div>
        <div>
          <div className={styles.userName}>Mert Ç.</div>
          <div className={styles.userRole}>Manager</div>
        </div>
      </div>
    </div>
  </aside>
)

export default Sidebar
