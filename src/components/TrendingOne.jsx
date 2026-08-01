import { FiCalendar, FiPlay, FiStar } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const TrendingOne = ({ data, mediaType, variant = 'rail' }) => {
  const type = data.media_type || mediaType || 'movie'
  const title = data.title || data.name || 'Untitled'
  const releaseDate = data.release_date || data.first_air_date
  const releaseYear = releaseDate?.slice(0, 4) || 'Coming soon'
  const rating = Number(data.vote_average)
  const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : 'N/A'
  const isGrid = variant === 'grid'

  return (
    <Link
      className={`group block shrink-0 focus:outline-none ${isGrid ? 'w-full' : 'w-36 sm:w-44 md:w-48 lg:w-52'}`}
      to={`/${type}/${data.id}`}
    >
      <article className='overflow-hidden rounded-xl border border-white/10 bg-neutral-900/80 shadow-[0_6px_18px_rgba(0,0,0,0.24)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-red-400/40 group-hover:shadow-[0_12px_28px_rgba(220,38,38,0.16)] group-focus-visible:ring-2 group-focus-visible:ring-red-500'>
        <div className='relative aspect-[2/3] overflow-hidden bg-neutral-800'>
          <img
            alt={`${title} poster`}
            className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]'
            loading='lazy'
            src={data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '/NOIMG.png'}
          />
          <div className='absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent opacity-85' />
          <span className='absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur'>
            {type === 'tv' ? 'TV show' : 'Movie'}
          </span>
          <span className='absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-yellow-300 backdrop-blur'>
            <FiStar aria-hidden='true' className='fill-current' /> {ratingText}
          </span>
          <span className='absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-600/90 text-white opacity-0 shadow-lg transition duration-300 group-hover:scale-110 group-hover:opacity-100'>
            <FiPlay className='ml-0.5' aria-hidden='true' />
          </span>
        </div>
        <div className='p-3.5'>
          <h3 className='truncate font-semibold text-white' title={title}>{title}</h3>
          <p className='mt-1.5 inline-flex items-center gap-1.5 text-xs text-zinc-400'>
            <FiCalendar aria-hidden='true' /> {releaseYear}
          </p>
        </div>
      </article>
    </Link>
  )
}

export default TrendingOne
