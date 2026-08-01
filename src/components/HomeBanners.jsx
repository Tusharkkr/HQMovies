import { useEffect, useRef, useState } from 'react'
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlay, FiStar } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BannerCall } from '../app/BannerApiSlice'

const HomeBanners = () => {
  const { data } = useSelector((state) => state.bannerapi)
  const dispatch = useDispatch()
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const banners = (data || []).filter((item) => ['movie', 'tv'].includes(item.media_type || 'movie'))
  const activeIndex = banners.length ? currentIndex % banners.length : 0

  useEffect(() => {
    dispatch(BannerCall())
  }, [dispatch])

  useEffect(() => {
    if (banners.length < 2) return undefined

    const interval = setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % banners.length)
    }, 6500)

    return () => clearInterval(interval)
  }, [banners.length])

  if (!banners.length) {
    return <div className='h-[72svh] min-h-125 animate-pulse bg-neutral-900' />
  }

  const changeSlide = (direction) => {
    setCurrentIndex((previous) => (previous + direction + banners.length) % banners.length)
  }

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event) => {
    const swipeDistance = event.changedTouches[0].clientX - touchStartX.current

    if (Math.abs(swipeDistance) < 50) return

    changeSlide(swipeDistance > 0 ? -1 : 1)
  }

  return (
    <section className='relative h-[calc(78svh+60px)] min-h-150 overflow-hidden bg-neutral-950 pt-18 sm:h-[calc(78svh+32px)] sm:min-h-[652px]'>
      <div
        className='flex h-full touch-pan-y transition-transform duration-700 ease-out'
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {banners.map((title) => {
          const mediaType = title.media_type || 'movie'
          const releaseDate = title.release_date || title.first_air_date

          return (
            <article className='relative min-w-full overflow-hidden' key={`${mediaType}-${title.id}`}>
              <img
                alt=''
                className='h-full w-full scale-105 object-cover'
                src={`https://image.tmdb.org/t/p/original${title.backdrop_path || title.poster_path}`}
              />
              <div className='absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/75 to-transparent' />
              <div className='absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-black/20' />

              <div className='absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-18 sm:px-8 md:pb-22 lg:px-10'>
                <div className='max-w-2xl'>
                  <span className='inline-flex rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-xs font-semibold tracking-wider text-red-200 uppercase'>
                    Featured {mediaType === 'tv' ? 'series' : 'movie'}
                  </span>
                  <h1 className='mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl'>
                    {title.title || title.name}
                  </h1>
                  <div className='mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-300'>
                    <span className='inline-flex items-center gap-1.5 font-semibold text-yellow-400'>
                      <FiStar aria-hidden='true' /> {Number(title.vote_average).toFixed(1)}
                    </span>
                    {releaseDate && (
                      <span className='inline-flex items-center gap-1.5'>
                        <FiCalendar aria-hidden='true' /> {releaseDate.slice(0, 4)}
                      </span>
                    )}
                  </div>
                  <p className='mt-5 line-clamp-3 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base'>
                    {title.overview || 'Discover this featured title on HQMovies.'}
                  </p>
                  <Link
                    className='mt-7 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white shadow-lg shadow-red-950/40 transition hover:-translate-y-0.5 hover:bg-red-500'
                    to={`/${mediaType}/${title.id}`}
                  >
                    <FiPlay aria-hidden='true' /> Explore title
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {banners.length > 1 && (
        <>
          <button aria-label='Previous featured title' className='absolute left-5 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-white backdrop-blur transition hover:bg-white/15 md:block' onClick={() => changeSlide(-1)}>
            <FiChevronLeft className='text-2xl' />
          </button>
          <button aria-label='Next featured title' className='absolute right-5 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-white backdrop-blur transition hover:bg-white/15 md:block' onClick={() => changeSlide(1)}>
            <FiChevronRight className='text-2xl' />
          </button>
          <div className='absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2'>
            {banners.slice(0, 8).map((title, index) => (
              <button
                aria-label={`Show ${title.title || title.name}`}
                className={`h-1.5 rounded-full transition ${index === activeIndex ? 'w-7 bg-red-500' : 'w-2 bg-white/45 hover:bg-white/80'}`}
                key={title.id}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default HomeBanners
