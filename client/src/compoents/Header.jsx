import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link, Outlet,useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


export default function Header() {
  const {currentUser} = useSelector(state=>state.user)
  const [search,setsearch] = useState('')
  const navigate = useNavigate() 
  

  function handlesubmit(e) {
      e.preventDefault()
      const urlparams = new URLSearchParams(window.location.search);
      urlparams.set("searchterms",search);
      const searchquery = urlparams.toString()
      navigate(`/search?${searchquery}`)     
  }

  useEffect(()=>{
    const urlparams = new URLSearchParams(location.search);
    const searchterms = urlparams.get('searchterms')
    if(searchterms){
      setsearch(searchterms)
    }
  },[location.search])

  return (
    <div>
    <header className='bg-slate-300 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>

        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <Link to={'/'}>
            <span className='text-slate-200'>Real</span>
            <span  className='text-slate-500'>Estate</span>
          </Link>
        </h1>

        <form onSubmit={handlesubmit} className='p-3 rounded-lg bg-slate-100 flex items-center '>
            <input type="text" value={search} onChange={e=>setsearch(e.target.value)}
             placeholder='Search....' className='bg-transparent focus:outline-none w-24 sm:w-64' />
            <button>
            <FaSearch className='text-slate-500'/>
            </button>
        </form>

        <ul className='flex gap-3'>
            <li className='hidden sm:inline text-slate-700 hover:underline font-semibold cursor-pointer'><Link to='/'>Home</Link></li>
            <li className='hidden sm:inline text-slate-700 hover:underline font-semibold cursor-pointer'><Link to='/about'>About</Link></li>
            <Link to='/profile'>
            {currentUser ? 
            (
              <img src={currentUser.data.avatar} className='rounded-full w-7 h-7 object-cover' alt='profile' />
              ) 
              :
              (
                <li className='hidden sm:inline text-slate-700 hover:underline font-semibold cursor-pointer'>Signin</li>
                )
              }
          </Link>
        </ul>

        </div>
    </header>
    <Outlet/>
    </div>
  )
}
