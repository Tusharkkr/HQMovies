import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    now: [],
    error: null
}

export let TvCompCall = createAsyncThunk('movie/TvCompCall', async () => {
    let call = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDUxODNlZGQzNDc1NjY0ZGUyMDYzZjUwMTg2Mjg0ZCIsIm5iZiI6MTc4MTkzMDExMy4xLCJzdWIiOiI2YTM2MTg4MTQyZGYzOGE4MjlmMzdjNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HcnURhaZiLgllouKPn07y_hkhmjqo7qt4Df81Mlb9pA`,
            accept: "application/json"
        },
        params: {
          page: 1,
        }
    })
    // console.log("Call",call.data.results)   
    return call.data.results
})

let TvSlice = createSlice({
    name : 'movie',
    initialState,
    extraReducers : (builder)=>{
        builder.addCase(TvCompCall.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(TvCompCall.fulfilled,(state,action)=>{
            state.loading = false
            state.now = action.payload
            state.error = null
        }),
        builder.addCase(TvCompCall.rejected,(state,action)=>{
            state.loading = false
            state.now = []
            state.error = action.payload    
        })
    }
})

let AllTvReducer = TvSlice.reducer
export default AllTvReducer