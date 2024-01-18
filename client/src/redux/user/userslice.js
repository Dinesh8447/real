import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    error:null,
    loading:false,
}

const userslice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signinstart:(state) =>{
            state.loading = true
        },
        signinsuccess:(state,action) =>{
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signinfail:(state,action) =>{
            state.error = action.payload
            state.loading = false
        },
        updateuserstart:(state)=>{
            state.loading = true
        },
        updateusersuccess: (state,action) =>{
            state.currentUser = action.payload
            state.loading = false
            state.error = null 
        },
        updateuserfailer:(state,action) =>{
            state.error = action.payload
            state.loading = false
        },
        deleteuserstart:(state) =>{
            state.loading=true
        },
        deleteusersuccess:(state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteuserfailer:(state,action) =>{
            state.error = action.payload
            state.loading = false
        },
        signoutuserstart:(state) =>{
            state.loading=true
        },
        signoutusersuccess:(state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        signoutuserfailer:(state,action) =>{
            state.error = action.payload
            state.loading = false
        }
    }    
    
})

export const {
    signinsuccess,
    signinstart,
    signinfail,
    updateuserstart,
    updateuserfailer,
    updateusersuccess,
    deleteuserfailer,
    deleteuserstart,
    deleteusersuccess,
    signoutuserfailer,
    signoutuserstart,
    signoutusersuccess,
    } = userslice.actions

export default userslice.reducer

