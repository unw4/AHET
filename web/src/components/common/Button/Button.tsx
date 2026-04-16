import React from 'react'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...rest }) => (
  <button className={`${styles.btn} ${styles[variant]} ${className}`} {...rest}>
    {children}
  </button>
)

export default Button
