import { useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import TrendingOne from './TrendingOne'

const AllTrending = ({ data, name, mediaType }) => {
  const scrollRef = useRef(null)
  const titles = (data || []).filter((item) => ['movie', 'tv'].includes(item.media_type || mediaType))

  if (!titles.length) return null

  const scrollBy = (amount) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className='py-8 first:pt-12 sm:py-10'>
      <div className='mb-5 flex items-end justify-between gap-4'>
        <div>
          <p className='mb-1 text-xs font-semibold tracking-[0.18em] text-red-400 uppercase'>HQ picks</p>
          <h2 className='text-2xl font-bold tracking-tight text-white sm:text-3xl'>{name}</h2>
        </div>
        <div className='hidden gap-2 sm:flex'>
          <button aria-label={`Scroll ${name} left`} className='rounded-full border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition hover:border-red-400/50 hover:bg-red-500 hover:text-white' onClick={() => scrollBy(-900)}>
            <FiChevronLeft className='text-lg' />
          </button>
          <button aria-label={`Scroll ${name} right`} className='rounded-full border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition hover:border-red-400/50 hover:bg-red-500 hover:text-white' onClick={() => scrollBy(900)}>
            <FiChevronRight className='text-lg' />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className='no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 py-3 sm:-mx-6 sm:gap-5 sm:px-6 lg:-mx-8 lg:px-8'>
        {titles.map((title) => (
          <TrendingOne data={title} key={`${title.media_type || mediaType}-${title.id}`} mediaType={mediaType} />
        ))}
      </div>
    </section>
  )
}

export default AllTrending
