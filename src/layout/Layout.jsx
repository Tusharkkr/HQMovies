import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'

const Layout = () => (
  <div className='min-h-screen overflow-x-hidden bg-neutral-950 text-white'>
    <Header />
    <div className='min-h-[calc(100vh-18rem)] pb-18 md:pb-0'>
      <Outlet />
    </div>
    <Footer />
    <MobileNav />
  </div>
)

export default Layout
