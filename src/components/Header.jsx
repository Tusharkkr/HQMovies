import { useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${isActive
    ? 'bg-white/10 text-white'
    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
  }`

const SearchBox = ({ query }) => {
  const [searchValue, setSearchValue] = useState(query)
  const navigate = useNavigate()

  const submitSearch = (event) => {
    event.preventDefault()
    const nextQuery = searchValue.trim()
    navigate(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : '/search')
  }

  return (
    <form className='hidden w-full max-w-sm md:block' onSubmit={submitSearch}>
      <div className='flex items-center rounded-lg border border-white/10 bg-white/5 px-3 transition focus-within:border-red-500/70 focus-within:bg-white/10'>
        <FiSearch className='shrink-0 text-zinc-400' aria-hidden='true' />
        <input
          className='w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500'
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder='Search movies and TV shows'
          type='text'
          value={searchValue}
        />
        {searchValue && (
          <button aria-label='Clear search' className='text-zinc-400 transition hover:text-white' onClick={() => setSearchValue('')} type='button'>
            <FiX />
          </button>
        )}
      </div>
    </form>
  )
}

const Header = () => {
  const location = useLocation()
  const locationSearch = new URLSearchParams(location.search).get('q') || ''

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl'>
      <div className='mx-auto flex h-18 w-full max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-5'>
          <NavLink to='/' className='flex items-center'>
            <img src='/HQmovies-transparent.png' alt='HQMovies' className='h-8 w-auto object-contain sm:h-9' />
          </NavLink>
          <nav className='hidden items-center gap-1 md:flex'>
            <NavLink className={navLinkClass} to='/tv'>TV Shows</NavLink>
            <NavLink className={navLinkClass} to='/movie'>Movies</NavLink>
          </nav>
        </div>

        <SearchBox key={locationSearch} query={locationSearch} />

        <NavLink aria-label='Search' className='rounded-lg p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white md:hidden' to='/search'>
          <FiSearch className='text-xl' />
        </NavLink>
      </div>
    </header>
  )
}

export default Header
