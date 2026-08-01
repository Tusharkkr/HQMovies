import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    air: [],
    error: null
}

export let OnAirCall = createAsyncThunk('movie/OnAirCall', async () => {
    let call = await axios.get('https://api.themoviedb.org/3/tv/on_the_air', {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDUxODNlZGQzNDc1NjY0ZGUyMDYzZjUwMTg2Mjg0ZCIsIm5iZiI6MTc4MTkzMDExMy4xLCJzdWIiOiI2YTM2MTg4MTQyZGYzOGE4MjlmMzdjNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HcnURhaZiLgllouKPn07y_hkhmjqo7qt4Df81Mlb9pA`,
            accept: "application/json"
        }
    })
    // console.log("Call",call.data.results)   
    return call.data.results
})

let OnTheAirSlice = createSlice({
    name : 'movie',
    initialState,
    extraReducers : (builder)=>{
        builder.addCase(OnAirCall.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(OnAirCall.fulfilled,(state,action)=>{
            state.loading = false
            state.air = action.payload
            state.error = null
        }),
        builder.addCase(OnAirCall.rejected,(state,action)=>{
            state.loading = false
            state.air = []
            state.error = action.payload    
        })
    }
})

let OnAirReducer = OnTheAirSlice.reducer
export default OnAirReducer