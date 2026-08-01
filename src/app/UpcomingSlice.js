import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    up: [],
    error: null
}

export let UpCall = createAsyncThunk('movie/UpCall', async () => {
    let call = await axios.get('https://api.themoviedb.org/3/movie/upcoming', {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDUxODNlZGQzNDc1NjY0ZGUyMDYzZjUwMTg2Mjg0ZCIsIm5iZiI6MTc4MTkzMDExMy4xLCJzdWIiOiI2YTM2MTg4MTQyZGYzOGE4MjlmMzdjNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HcnURhaZiLgllouKPn07y_hkhmjqo7qt4Df81Mlb9pA`,
            accept: "application/json"
        }
    })
    // console.log("Call",call.data.results)   
    return call.data.results
})

let UpcomingSlice = createSlice({
    name : 'movie',
    initialState,
    extraReducers : (builder)=>{
        builder.addCase(UpCall.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(UpCall.fulfilled,(state,action)=>{
            state.loading = false
            state.up = action.payload
            state.error = null
        }),
        builder.addCase(UpCall.rejected,(state,action)=>{
            state.loading = false
            state.up = []
            state.error = action.payload    
        })
    }
})

let UpReducer = UpcomingSlice.reducer
export default UpReducer