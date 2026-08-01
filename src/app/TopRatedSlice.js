import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    top: [],
    error: null
}

export let TopRateCall = createAsyncThunk('movie/TopRateCall', async () => {
    let call = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDUxODNlZGQzNDc1NjY0ZGUyMDYzZjUwMTg2Mjg0ZCIsIm5iZiI6MTc4MTkzMDExMy4xLCJzdWIiOiI2YTM2MTg4MTQyZGYzOGE4MjlmMzdjNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HcnURhaZiLgllouKPn07y_hkhmjqo7qt4Df81Mlb9pA`,
            accept: "application/json"
        }
    })
    // console.log("Call",call.data.results)   
    return call.data.results
})

let TopRatedSlice = createSlice({
    name: 'movie',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(TopRateCall.pending, (state) => {
            state.loading = true
        }),
            builder.addCase(TopRateCall.fulfilled, (state, action) => {
                state.loading = false
                state.top = action.payload
                state.error = null
            }),
            builder.addCase(TopRateCall.rejected, (state, action) => {
                state.loading = false
                state.top = []
                state.error = action.payload
            })
    }
})

let TopReducer = TopRatedSlice.reducer
export default TopReducer