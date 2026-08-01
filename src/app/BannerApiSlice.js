import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    data: [],
    error: null
}

export let BannerCall = createAsyncThunk('movie/BannerCall', async () => {
    let call = await axios.get('https://api.themoviedb.org/3/trending/all/week', {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDUxODNlZGQzNDc1NjY0ZGUyMDYzZjUwMTg2Mjg0ZCIsIm5iZiI6MTc4MTkzMDExMy4xLCJzdWIiOiI2YTM2MTg4MTQyZGYzOGE4MjlmMzdjNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HcnURhaZiLgllouKPn07y_hkhmjqo7qt4Df81Mlb9pA`,
            accept: "application/json"
        }
    })
    // console.log("Call",call.data.results)
    return call.data.results
})

let BannerApiSlice = createSlice({
    name : 'movie',
    initialState,
    extraReducers : (builder)=>{
        builder.addCase(BannerCall.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(BannerCall.fulfilled,(state,action)=>{
            state.loading = false
            state.data = action.payload
            state.error = null
        }),
        builder.addCase(BannerCall.rejected,(state,action)=>{
            state.loading = false
            state.data = []
            state.error = action.payload    
        })
    }
})

let hqMovieReducer = BannerApiSlice.reducer
export default hqMovieReducer