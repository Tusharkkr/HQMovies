import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    tv: [],
    error: null
}

export let TvCall = createAsyncThunk('movie/TvCall', async () => {
    let call = await axios.get('https://api.themoviedb.org/3/tv/popular', {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDUxODNlZGQzNDc1NjY0ZGUyMDYzZjUwMTg2Mjg0ZCIsIm5iZiI6MTc4MTkzMDExMy4xLCJzdWIiOiI2YTM2MTg4MTQyZGYzOGE4MjlmMzdjNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HcnURhaZiLgllouKPn07y_hkhmjqo7qt4Df81Mlb9pA`,
            accept: "application/json"
        }
    })
    // console.log("Call",call.data.results)   
    return call.data.results
})

let TvPopularSlice = createSlice({
    name: 'movie',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(TvCall.pending, (state) => {
            state.loading = true
        }),
            builder.addCase(TvCall.fulfilled, (state, action) => {
                state.loading = false
                state.tv = action.payload
                state.error = null
            }),
            builder.addCase(TvCall.rejected, (state, action) => {
                state.loading = false
                state.tv = []
                state.error = action.payload
            })
    }
})

let PopularReducer = TvPopularSlice.reducer
export default PopularReducer