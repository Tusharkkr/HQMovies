import axios from 'axios'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import TrendingOne from '../components/TrendingOne'

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDUxODNlZGQzNDc1NjY0ZGUyMDYzZjUwMTg2Mjg0ZCIsIm5iZiI6MTc4MTkzMDExMy4xLCJzdWIiOiI2YTM2MTg4MTQyZGYzOGE4MjlmMzdjNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HcnURhaZiLgllouKPn07y_hkhmjqo7qt4Df81Mlb9pA'

const SearchForm = ({ query }) => {
  const [value, setValue] = useState(query)
  const navigate = useNavigate()

  const submitSearch = (event) => {
    event.preventDefault()
    const nextQuery = value.trim()
    navigate(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : '/search')
  }

  return (
    <form className='mt-7' onSubmit={submitSearch}>
      <div className='flex items-center rounded-xl border border-white/10 bg-white/5 p-1.5 shadow-lg shadow-black/20 transition focus-within:border-red-500/70'>
        <FiSearch className='ml-3 text-lg text-zinc-400' aria-hidden='true' />
        <input
          autoFocus
          className='min-w-0 flex-1 bg-transparent px-3 py-3 text-white outline-none placeholder:text-zinc-500'
          onChange={(event) => setValue(event.target.value)}
          placeholder='Try “The Last of Us”, “Inception”...'
          type='search'
          value={value}
        />
        <button className='rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 sm:px-5' type='submit'>
          Search
        </button>
      </div>
    </form>
  )
}

const SearchResults = ({ query }) => {
  const [titles, setTitles] = useState([])
  const [loading, setLoading] = useState(Boolean(query))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) return undefined

    const controller = new AbortController()

    const getResults = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await axios.get('https://api.themoviedb.org/3/search/multi', {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            accept: 'application/json',
          },
          params: { query },
          signal: controller.signal,
        })
        setTitles(response.data.results.filter((item) => item.media_type === 'movie' || item.media_type === 'tv'))
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError('Search is unavailable right now. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    getResults()

    return () => controller.abort()
  }, [query])

  if (!query) {
    return <p className='py-16 text-center text-zinc-500'>Search for any movie or TV show to get started.</p>
  }

  if (loading) {
    return <p className='py-16 text-center text-zinc-400'>Searching the catalogue...</p>
  }

  if (error) {
    return <p className='rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center text-red-200'>{error}</p>
  }

  if (!titles.length) {
    return <p className='py-16 text-center text-zinc-500'>No movies or TV shows found for “{query}”.</p>
  }

  return (
    <section className='mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5'>
      {titles.map((title) => (
        <TrendingOne data={title} key={`${title.media_type}-${title.id}`} mediaType={title.media_type} variant='grid' />
      ))}
    </section>
  )
}

const Search = () => {
  const location = useLocation()
  const query = (new URLSearchParams(location.search).get('q') || '').trim()

  return (
    <main className='mx-auto max-w-7xl px-5 pt-26 pb-6 sm:px-8 lg:px-10'>
      <section className='mx-auto max-w-3xl text-center'>
        <span className='inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-red-200 uppercase'>Discover more</span>
        <h1 className='mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl'>Search the catalogue</h1>
        <p className='mt-3 text-zinc-400'>Explore thousands of movies and TV shows in one place.</p>
        <SearchForm key={query} query={query} />
      </section>

      <div className='mt-12'>
        {query && <h2 className='text-xl font-bold text-white sm:text-2xl'>Results for <span className='text-red-400'>“{query}”</span></h2>}
        <SearchResults key={query} query={query} />
      </div>
    </main>
  )
}

export default Search
