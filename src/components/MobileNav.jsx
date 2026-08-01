import { AiFillHome } from 'react-icons/ai'
import { BiSolidMoviePlay } from 'react-icons/bi'
import { IoIosSearch } from 'react-icons/io'
import { IoTv } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/', icon: AiFillHome },
  { label: 'TV Shows', to: '/tv', icon: IoTv },
  { label: 'Movies', to: '/movie', icon: BiSolidMoviePlay },
  { label: 'Search', to: '/search', icon: IoIosSearch },
]

const MobileNav = () => (
  <div className='fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-neutral-950/95 px-3 pb-[env(safe-area-inset-bottom)] text-neutral-400 backdrop-blur-xl md:hidden'>
    <nav className='mx-auto flex h-17 max-w-md items-center justify-around'>
      {navItems.map(({ label, to, icon: Icon }) => (
        <NavLink
          end={to === '/'}
          key={to}
          to={to}
          className={({ isActive }) => `flex min-w-15 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition ${
            isActive ? 'bg-red-500/15 text-red-400' : 'text-neutral-500'
          }`}
        >
          <Icon className='text-xl' />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  </div>
)

export default MobileNav
