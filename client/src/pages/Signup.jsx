import axios from 'axios'
import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Oauth from '../compoents/Oauth'

export default function Signup() {
  const [formdata,setformdata] = useState({})
  const [error,seterror] = useState(null)
  const [loading,setloading] = useState(false)
  
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
    setloading(true)
     axios.post('/auth/signup',formdata)
    .then(()=>usenavigate('/signin'))
    .catch(e=>{
      const success = e.response.data.success 
      const message = e.response.data.message 
      // console.log(success,message)
      if(success === false){
        setloading(false)
        seterror(message)
        return
      }
      setloading(false)
    })

  }

  return (
    <div className='p-3 max-w-lg m-auto '>
      <h1 className='text-center text-3xl font-semibold'>Sign up</h1>
      <form onSubmit={handlesubmit} className='grid gap-2 mt-5 '>
        <input type="text" id='username' onChange={handlechang}  className='border p-3 rounded-lg mt-2 font-semibold ' placeholder='username' />
        <input type="email" id='email' onChange={handlechang} className='border p-3 rounded-lg mt-2 font-semibold' placeholder='email' />
        <input type="password" id='password' onChange={handlechang} className='border p-3 rounded-lg mt-2 font-semibold'  placeholder='password'/>
        <button disabled={loading} className='bg-slate-700 uppercase hover:opacity-95 disabled:opacity-80 text-white p-3 rounded-lg'>
          {loading ? "Loading...": "Sing Up"}
        </button>
        <Oauth/>
      </form>
      <div className='mt-2 font-sans'>
      Aleardy Have Account?<Link to='/signin' className='text-blue-400 font-mono'> Signin</Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
