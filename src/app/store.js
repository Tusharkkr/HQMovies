import { configureStore } from "@reduxjs/toolkit";
import hqMovieReducer from "./BannerApiSlice";
import NowReducer from "./NowPlayingSlice";
import TopReducer from "./TopRatedSlice";
import PopularReducer from "./TvPopularSlice";
import UpReducer from "./UpcomingSlice";
import OnAirReducer from "./OnTheAirSlice";

let store = configureStore({
    reducer : {
        bannerapi : hqMovieReducer,
        nowplaying : NowReducer,
        toprated : TopReducer,
        tvpopular : PopularReducer,
        upcoming : UpReducer,
        onair : OnAirReducer
    }
})

export default store