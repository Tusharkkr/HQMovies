import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NowPlayingCall } from '../app/NowPlayingSlice'
import { OnAirCall } from '../app/OnTheAirSlice'
import { TopRateCall } from '../app/TopRatedSlice'
import { TvCall } from '../app/TvPopularSlice'
import { UpCall } from '../app/UpcomingSlice'
import AllTrending from '../components/AllTrending'
import HomeBanners from '../components/HomeBanners'

const Home = () => {
  const { data } = useSelector((state) => state.bannerapi)
  const { now } = useSelector((state) => state.nowplaying)
  const { top } = useSelector((state) => state.toprated)
  const { tv } = useSelector((state) => state.tvpopular)
  const { up } = useSelector((state) => state.upcoming)
  const { air } = useSelector((state) => state.onair)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(NowPlayingCall())
    dispatch(TopRateCall())
    dispatch(TvCall())
    dispatch(UpCall())
    dispatch(OnAirCall())
  }, [dispatch])

  return (
    <main>
      <HomeBanners />
      <div className='mx-auto max-w-[1600px] px-4 pb-10 sm:px-6 lg:px-8'>
        <AllTrending data={data} name='Trending now' mediaType='movie' />
        <AllTrending data={now} name='Now playing' mediaType='movie' />
        <AllTrending data={top} name='Top rated movies' mediaType='movie' />
        <AllTrending data={tv} name='Popular TV shows' mediaType='tv' />
        <AllTrending data={up} name='Coming soon' mediaType='movie' />
        <AllTrending data={air} name='On the air' mediaType='tv' />
      </div>
    </main>
  )
}

export default Home
