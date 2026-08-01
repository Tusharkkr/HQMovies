import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiGlobe,
  FiPlay,
  FiStar,
  FiUsers,
} from 'react-icons/fi'
import { FaYoutube } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import TrendingOne from '../components/TrendingOne'

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDUxODNlZGQzNDc1NjY0ZGUyMDYzZjUwMTg2Mjg0ZCIsIm5iZiI6MTc4MTkzMDExMy4xLCJzdWIiOiI2YTM2MTg4MTQyZGYzOGE4MjlmMzdjNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HcnURhaZiLgllouKPn07y_hkhmjqo7qt4Df81Mlb9pA'
const IMAGE_URL = 'https://image.tmdb.org/t/p'

const formatDate = (date) => {
  if (!date) return 'Not available'

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

const formatCurrency = (value) => {
  if (!value) return 'Not available'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

const imageUrl = (path, size = 'w500') => path ? `${IMAGE_URL}/${size}${path}` : '/NOIMG.png'

const DetailFact = ({ icon, label, value }) => (
  <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
    <div className='flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase'>
      {icon}
      {label}
    </div>
    <p className='mt-2 font-medium text-zinc-100'>{value || 'Not available'}</p>
  </div>
)

const Detailed = () => {
  const { explore, id } = useParams()
  const mediaType = explore === 'tv' ? 'tv' : 'movie'
  const [data, setData] = useState(null)
  const [credits, setCredits] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [mediaType, id])

  useEffect(() => {
    const controller = new AbortController()

    const getDetails = async () => {
      setLoading(true)
      setError('')

      const config = {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          accept: 'application/json',
        },
        signal: controller.signal,
      }

      try {
        const [detailResponse, creditResponse] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/${mediaType}/${id}?append_to_response=videos,recommendations,similar`,
            config,
          ),
          axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}/credits`, config),
        ])
        setData(detailResponse.data)
        setCredits(creditResponse.data)
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError('We could not load this title. Please try again in a moment.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    getDetails()

    return () => controller.abort()
  }, [mediaType, id])

  const trailer = useMemo(() => {
    const videos = data?.videos?.results || []
    return videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer')
      || videos.find((video) => video.site === 'YouTube')
  }, [data])

  const directorOrCreator = useMemo(() => {
    if (mediaType === 'tv') return data?.created_by?.map((person) => person.name).join(', ')

    return credits?.crew
      ?.filter((person) => person.job === 'Director')
      .map((person) => person.name)
      .join(', ')
  }, [credits, data, mediaType])

  const relatedTitles = useMemo(() => {
    const recommendations = data?.recommendations?.results || []
    const similar = data?.similar?.results || []
    return (recommendations.length ? recommendations : similar).slice(0, 10)
  }, [data])

  if (loading) {
    return <div className='grid min-h-screen place-items-center bg-neutral-950 text-zinc-400'>Loading title details...</div>
  }

  if (error || !data) {
    return (
      <div className='grid min-h-screen place-items-center bg-neutral-950 px-6 text-center'>
        <div>
          <h1 className='text-2xl font-bold text-white'>Unable to load this title</h1>
          <p className='mt-3 max-w-md text-zinc-400'>{error || 'Please try another title.'}</p>
          <Link className='mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500' to='/'>
            <FiArrowLeft aria-hidden='true' /> Back to home
          </Link>
        </div>
      </div>
    )
  }

  const title = data.title || data.name
  const releaseDate = data.release_date || data.first_air_date
  const runtime = data.runtime || data.episode_run_time?.[0]
  const cast = credits?.cast?.slice(0, 15) || []
  const countries = data.production_countries?.map((country) => country.name).join(', ') || data.origin_country?.join(', ')
  const facts = [
    { icon: <FiCalendar />, label: mediaType === 'tv' ? 'First aired' : 'Release date', value: formatDate(releaseDate) },
    { icon: <FiClock />, label: mediaType === 'tv' ? 'Episode runtime' : 'Runtime', value: runtime ? `${runtime} min` : 'Not available' },
    { icon: <FiGlobe />, label: 'Original language', value: data.original_language?.toUpperCase() },
    { icon: <FiUsers />, label: mediaType === 'tv' ? 'Created by' : 'Director', value: directorOrCreator },
    { label: 'Status', value: data.status },
    { label: 'Countries', value: countries },
  ]

  if (mediaType === 'tv') {
    facts.push({ label: 'Seasons & episodes', value: `${data.number_of_seasons || 0} seasons · ${data.number_of_episodes || 0} episodes` })
  } else {
    facts.push({ icon: <FiDollarSign />, label: 'Budget', value: formatCurrency(data.budget) })
    facts.push({ icon: <FiDollarSign />, label: 'Revenue', value: formatCurrency(data.revenue) })
  }

  return (
    <main className='min-h-screen bg-neutral-950 pb-16 pt-18 text-white'>
      <section
        className='relative overflow-hidden bg-neutral-900 bg-cover bg-top'
        style={data.backdrop_path ? { backgroundImage: `url(${imageUrl(data.backdrop_path, 'original')})` } : undefined}
      >
        <div className='absolute inset-0 bg-black/20' />
        <div className='absolute inset-x-0 bottom-0 h-112 bg-linear-to-t from-neutral-950 via-black/70 to-transparent' />

        <div className='relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:py-16 lg:flex-row lg:gap-12 lg:px-10'>
          <div className='w-60 shrink-0 self-center md:w-68 lg:self-start'>
            <img alt={`${title} poster`} className='w-full rounded-2xl object-cover shadow-2xl shadow-black/60' src={imageUrl(data.poster_path)} />
            {trailer && (
              <a
                className='mt-4 inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#ff0000] px-5 py-3 font-semibold text-white shadow-lg shadow-red-950/60 transition hover:-translate-y-0.5 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-neutral-950'
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                rel='noreferrer'
                target='_blank'
              >
                <FaYoutube className='text-2xl' aria-hidden='true' /> Watch trailer
              </a>
            )}
          </div>

          <div className='max-w-3xl flex-1 self-center'>
            {data.tagline && <p className='mb-3 text-sm font-semibold tracking-[0.15em] text-red-300 uppercase'>{data.tagline}</p>}
            <h1 className='text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl'>{title}</h1>
            <div className='mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-zinc-300'>
              <span className='inline-flex items-center gap-1.5 font-bold text-yellow-400'><FiStar aria-hidden='true' /> {data.vote_average?.toFixed(1) || 'N/A'} / 10</span>
              <span>{data.vote_count?.toLocaleString() || 0} ratings</span>
              {releaseDate && <span>{releaseDate.slice(0, 4)}</span>}
              {runtime && <span>{runtime} min</span>}
            </div>
            {data.genres?.length > 0 && (
              <div className='mt-5 flex flex-wrap gap-2'>
                {data.genres.map((genre) => (
                  <span className='rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-sm text-zinc-100 backdrop-blur' key={genre.id}>{genre.name}</span>
                ))}
              </div>
            )}
            <p className='mt-6 max-w-3xl text-base leading-8 text-zinc-200'>
              {data.overview || 'No synopsis is available for this title yet.'}
            </p>
            <a
              className='mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-red-300'
              href={`https://www.themoviedb.org/${mediaType}/${id}`}
              rel='noreferrer'
              target='_blank'
            >
              <FiPlay aria-hidden='true' /> View on TMDB
            </a>
          </div>
        </div>
      </section>

      <div className='mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10'>
        <section>
          <div className='mb-6'>
            <p className='text-xs font-semibold tracking-[0.18em] text-red-400 uppercase'>The essentials</p>
            <h2 className='mt-1 text-2xl font-bold text-white'>Title information</h2>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {facts.map((fact) => <DetailFact {...fact} key={fact.label} />)}
          </div>
        </section>

        {cast.length > 0 && (
          <section className='mt-14'>
            <div className='flex items-end justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold tracking-[0.18em] text-red-400 uppercase'>On screen</p>
                <h2 className='mt-1 text-2xl font-bold text-white'>Top cast</h2>
              </div>
              <span className='text-sm text-zinc-500'>{credits.cast.length} cast members</span>
            </div>
            <div className='no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-3'>
              {cast.map((actor) => (
                <article className='w-36 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 sm:w-40' key={actor.credit_id || actor.id}>
                  <img alt={actor.name} className='h-48 w-full object-cover sm:h-52' loading='lazy' src={imageUrl(actor.profile_path, 'w342')} />
                  <div className='p-3'>
                    <h3 className='truncate font-semibold text-white' title={actor.name}>{actor.name}</h3>
                    <p className='mt-1 line-clamp-2 text-sm text-zinc-400'>{actor.character || 'Cast member'}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {data.production_companies?.length > 0 && (
          <section className='mt-14'>
            <p className='text-xs font-semibold tracking-[0.18em] text-red-400 uppercase'>Behind the scenes</p>
            <h2 className='mt-1 text-2xl font-bold text-white'>Production companies</h2>
            <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {data.production_companies.slice(0, 8).map((company) => (
                <article className='flex min-h-34 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-5 text-center' key={company.id}>
                  {company.logo_path ? (
                    <img alt={`${company.name} logo`} className='h-14 max-w-40 rounded bg-white p-2 object-contain' loading='lazy' src={imageUrl(company.logo_path, 'w300')} />
                  ) : (
                    <span className='text-sm text-zinc-500'>No logo available</span>
                  )}
                  <h3 className='mt-4 font-medium text-zinc-200'>{company.name}</h3>
                </article>
              ))}
            </div>
          </section>
        )}

        {relatedTitles.length > 0 && (
          <section className='mt-14'>
            <p className='text-xs font-semibold tracking-[0.18em] text-red-400 uppercase'>Keep exploring</p>
            <h2 className='mt-1 text-2xl font-bold text-white'>More like this</h2>
            <div className='no-scrollbar -mx-5 mt-6 flex gap-4 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10'>
              {relatedTitles.map((title) => (
                <TrendingOne data={title} key={title.id} mediaType={mediaType} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default Detailed
