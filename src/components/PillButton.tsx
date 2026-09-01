import type { MouseEventHandler, ReactNode, Ref } from 'react'

interface PillButtonProps {
  children: ReactNode
  className?: string
  href?: string
  target?: string
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  ariaLabel?: string
  buttonRef?: Ref<HTMLButtonElement>
}

export function PillButton({
  children,
  className,
  href,
  target,
  rel,
  type = 'button',
  onClick,
  ariaLabel,
  buttonRef,
}: PillButtonProps) {
  const classes = className ? `pill-button ${className}` : 'pill-button'

  if (href) {
    return (
      <a className={classes} href={href} target={target} rel={rel}>
        {children}
      </a>
    )
  }

  return (
    <button ref={buttonRef} className={classes} type={type} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
