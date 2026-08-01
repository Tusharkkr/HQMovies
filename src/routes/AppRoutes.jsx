import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../layout/Layout'
import Home from '../pages/Home'
import Movies from '../pages/Movies'
// import Tv from '../pages/Tv'
import Search from '../pages/Search'
import Detailed from '../pages/Detailed'

const AppRoutes = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route path='' element={<Home />} />
                    <Route path='/:value' element={<Movies />} />
                    {/* <Route path='/:value' element={<Tv />} /> */}
                    <Route path=':explore/:id' element={<Detailed />} />
                    <Route path='search' element={<Search />} />
                </Route>
            </Routes>
        </div>
    )
}

export default AppRoutes
