import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { signinsuccess } from '../redux/user/userslice'
import { useNavigate } from 'react-router-dom'

export default function Oauth() {
   const dispatch = useDispatch()  
   const navigate = useNavigate()
    async function handlegoogleclick() {
        try {

            const provider =  new GoogleAuthProvider()
            const auth = getAuth(app)
            const result =await signInWithPopup(auth,provider)

            const data = await axios.post('/auth/google',{name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
            dispatch(signinsuccess(data))
            navigate('/')
            console.log(result)
        } catch (error) {
            console.log("couldn't sign in with google",error)
        }      
    }


  return (
    <button onClick={handlegoogleclick} className='uppercase bg-red-500 text-white p-3 rounded-lg hover:opacity-85'>
        continu with google
    </button>
  )
}
