import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link,useNavigate } from 'react-router-dom'
import {signinsuccess,signinstart,signinfail} from '../redux/user/userslice'
import Oauth from '../compoents/Oauth'

export default function Signin() {
  const [formdata,setformdata] = useState({})
  // const [error,seterror] = useState(null)
  // const [loading,setloading] = useState(false)
  const {loading,error} = useSelector((state)=>state.user)
  const dispatch = useDispatch()
  const usenavigate = useNavigate()

  function handlechang(e) {
    setformdata({
      ...formdata,
      [e.target.id]:e.target.value
    })
  }

  // console.log(formdata)

 async function handlesubmit(e) {
    e.preventDefault()
    dispatch(signinstart())
     axios.post('/auth/signin',formdata)
    .then((data)=>{
      dispatch(signinsuccess(data))
      usenavigate('/')
    })
    .catch(e=>{
      const success = e.response.data.success 
      const message = e.response.data.message 
      console.log(success,message)
      if(success === false){
        // setloading(false)
        dispatch(signinfail(message))
        // seterror(message)
        return
      }
      // setloading(false)
    })

  }

  return (
    <div className='p-3 max-w-lg m-auto '>
      <h1 className='text-center text-3xl font-semibold'>Sign in</h1>
      <form onSubmit={handlesubmit} className='grid gap-2 mt-5 '>
        <input type="email" id='email' onChange={handlechang} className='border p-3 rounded-lg mt-2 font-semibold' placeholder='email' />
        <input type="password" id='password' onChange={handlechang} className='border p-3 rounded-lg mt-2 font-semibold'  placeholder='password'/>
        <button  className='bg-slate-700 uppercase hover:opacity-95 disabled:opacity-80 text-white p-3 rounded-lg'>
        {loading ? "Loading...": "Sing In"}
        </button>
        <Oauth/>
      </form>
      <div className='mt-2 font-sans'>
      Don't Have An Account?<Link to='/signup' className='text-blue-400 font-mono'> SignUp</Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
