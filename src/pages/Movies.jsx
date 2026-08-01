import axios from 'axios'
import { useEffect, useState } from 'react'
import { FiFilm, FiMonitor, FiRefreshCw } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import TrendingOne from '../components/TrendingOne'

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDUxODNlZGQzNDc1NjY0ZGUyMDYzZjUwMTg2Mjg0ZCIsIm5iZiI6MTc4MTkzMDExMy4xLCJzdWIiOiI2YTM2MTg4MTQyZGYzOGE4MjlmMzdjNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HcnURhaZiLgllouKPn07y_hkhmjqo7qt4Df81Mlb9pA'

const Catalog = ({ mediaType }) => {
  const [titles, setTitles] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const isTv = mediaType === 'tv'

  useEffect(() => {
    const controller = new AbortController()

    const getTitles = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/${mediaType}`, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            accept: 'application/json',
          },
          params: { page },
          signal: controller.signal,
        })

        setTitles((previous) => page === 1 ? response.data.results : [...previous, ...response.data.results])
        setTotalPages(response.data.total_pages)
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError('Unable to load titles right now. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    getTitles()

    return () => controller.abort()
  }, [mediaType, page])

  return (
    <main className='mx-auto max-w-7xl px-5 pt-26 sm:px-8 lg:px-10'>
      <section className='relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/70 px-6 py-8 shadow-xl shadow-black/20 sm:px-9 sm:py-10'>
        <div className='absolute -right-16 -top-24 h-56 w-56 rounded-full bg-red-600/20 blur-3xl' />
        <div className='relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <span className='inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-red-200 uppercase'>
              {isTv ? <FiMonitor aria-hidden='true' /> : <FiFilm aria-hidden='true' />} Browse
            </span>
            <h1 className='mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl'>
              {isTv ? 'Popular TV shows' : 'Popular movies'}
            </h1>
            <p className='mt-3 max-w-xl leading-7 text-zinc-400'>
              Find something worth watching from the titles everyone is talking about.
            </p>
          </div>
          <span className='text-sm font-medium text-zinc-500'>{titles.length} titles loaded</span>
        </div>
      </section>

      {error ? (
        <div className='mt-10 rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center'>
          <p className='text-red-200'>{error}</p>
          <button className='mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500' onClick={() => setPage(1)}>
            <FiRefreshCw aria-hidden='true' /> Try again
          </button>
        </div>
      ) : (
        <>
          <section className='mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5'>
            {titles.map((title) => (
              <TrendingOne data={title} key={title.id} mediaType={mediaType} variant='grid' />
            ))}
          </section>

          {loading && (
            <p className='py-10 text-center text-sm text-zinc-400'>Loading great picks...</p>
          )}

          {!loading && titles.length === 0 && (
            <p className='py-16 text-center text-zinc-400'>No titles are available right now.</p>
          )}

          {!loading && page < totalPages && titles.length > 0 && (
            <div className='flex justify-center py-12'>
              <button
                className='rounded-lg border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:border-red-400/50 hover:bg-red-500'
                onClick={() => setPage((previous) => previous + 1)}
              >
                Load more titles
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}

const Movies = () => {
  const { value } = useParams()
  const mediaType = value === 'tv' ? 'tv' : 'movie'

  return <Catalog key={mediaType} mediaType={mediaType} />
}

export default Movies
