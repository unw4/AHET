import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const s: Record<string, React.CSSProperties> = {
  page:   { minHeight: '100vh', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card:   { background: 'var(--color-bg)', border: 'var(--border-width) solid var(--color-border)', boxShadow: '8px 8px 0px var(--color-primary)', width: 380, padding: 0 },
  header: { background: 'var(--color-primary)', padding: '24px 28px', borderBottom: '2px solid var(--color-border)' },
  logo:   { fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--color-secondary)', letterSpacing: '0.05em' },
  sub:    { fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4, opacity: 0.7 },
  body:   { padding: '28px' },
  label:  { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 },
  input:  { width: '100%', padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 14, border: '2px solid var(--color-border)', background: 'var(--color-surface)', outline: 'none', marginBottom: 16, boxSizing: 'border-box' as const },
  btn:    { width: '100%', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'var(--color-secondary)', color: 'var(--color-primary)', border: '2px solid var(--color-border)', cursor: 'pointer', boxShadow: 'var(--shadow-brutalist)', transition: 'transform 80ms, box-shadow 80ms', marginTop: 8 },
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('manager@ahet.dev')
  const [password, setPassword] = useState('••••••••')

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.logo}>AH@</div>
          <div style={s.sub}>Fleet Management System</div>
        </div>
        <div style={s.body}>
          <label style={s.label}>E-posta</label>
          <input style={s.input} value={email} onChange={e => setEmail(e.target.value)} />
          <label style={s.label}>Şifre</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button style={s.btn} onClick={() => navigate('/dashboard')}>
            Giriş Yap
          </button>
          <div style={{ marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
            Demo: manager@ahet.dev / admin123
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
