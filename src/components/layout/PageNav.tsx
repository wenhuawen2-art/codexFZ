import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { APP_PAGES } from '../../constants/routes'

function PageNav() {
  return (
    <nav className="grid shrink-0 grid-cols-3 gap-1" aria-label="页面切换">
      {APP_PAGES.map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            clsx(
              'hud-btn flex h-auto min-h-[18px] items-center justify-center px-0.5 py-0.5 text-center leading-tight',
              isActive && 'border-hud-accent text-hud-accent',
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default PageNav
