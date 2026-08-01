import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className='border-t border-white/10 bg-black/40 px-6 py-10'>
    <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left'>
      <div>
        <Link className='inline-flex' to='/'>
          <img src='/HQmovies-transparent.png' alt='HQMovies' className='h-9 w-auto object-contain' />
        </Link>
        <p className='mt-2 max-w-sm text-sm leading-6 text-zinc-500'>Your next movie night starts here. Explore films and TV shows without the clutter.</p>
      </div>
      <div className='flex items-center gap-5 text-sm text-zinc-400'>
        <Link className='transition hover:text-white' to='/movie'>Movies</Link>
        <Link className='transition hover:text-white' to='/tv'>TV Shows</Link>
        <Link className='transition hover:text-white' to='/search'>Search</Link>
      </div>
      <p className='text-sm text-zinc-600'>© {new Date().getFullYear()} HQMovies</p>
    </div>
  </footer>
)

export default Footer
