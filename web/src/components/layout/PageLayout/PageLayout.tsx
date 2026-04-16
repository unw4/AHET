import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import TopBar from '../TopBar/TopBar'
import styles from './PageLayout.module.css'

const PageLayout: React.FC = () => (
  <div className={styles.root}>
    <Sidebar />
    <div className={styles.body}>
      <TopBar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  </div>
)

export default PageLayout
