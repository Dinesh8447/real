import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage,ref, uploadBytes, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { deleteuserfailer, deleteuserstart, deleteusersuccess, signoutuserfailer, signoutuserstart, signoutusersuccess, updateuserfailer,updateuserstart,updateusersuccess } from '../redux/user/userslice'
import axios from 'axios'
import {Link} from 'react-router-dom'
// //firebase storage
// allow read, write: if 
// request.resource.size < 2 * 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')

export default function Profile() {
const {currentUser,loading,error} = useSelector(state=>state.user)
const  dispatch = useDispatch()
const fileref  = useRef(null)
const avatar = currentUser.data.avatar
const username = currentUser.data.username
const email = currentUser.data.email
const id = currentUser.data._id

const [file,setfile] = useState(undefined)
const [filepercentage,setfilepercentage] =useState(0)
const [fileuploaderror,setfileuploaderror] = useState(false)
const [updatesuccess,setupdatesuccess] = useState(false)
const [formdata,setformdata] = useState({})
const [showdataerror,setshowdataerror] = useState(false)
const [detailsdataloaging,setdetailsdataloaging] = useState(false)
const [showdatadetails,setshowdatadetails] = useState([])

console.log(showdatadetails)
// console.log(filepercentage)
// console.log(fileuploaderror)
// console.log(formdata)
// console.log(file)
// console.log(filepercentage)


function handlefileupload(file) {
  const storage = getStorage(app)
  const filename = new Date().getTime() + file.name
  const storageref = ref(storage,filename)
  const uploadtask = uploadBytesResumable(storageref,file)
  uploadtask.on('state_changed',(snapshot)=>{
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    setfilepercentage(Math.round(progress))
  },
  (error) => {
    setfileuploaderror(true)
  },
  ()=>{
    getDownloadURL(uploadtask.snapshot.ref).then((downloadurl)=>setformdata({...formdata,avatar:downloadurl}))
  }
  )
}



useEffect(()=>{
  if(file){
    handlefileupload(file)
  }
},[file])



 function handlechange(e) {
  setformdata({...formdata,[e.target.id]:e.target.value})
}



async function handlesubmit(e) {
  e.preventDefault()
  try {
    dispatch(updateuserstart())
   await axios.post(`/user/update/${id}`,formdata)
        .then((data)=>{
          if(data.success === false){
            dispatch(updateuserfailer(data.message))
            return
          }
          dispatch(updateusersuccess(data))
          setupdatesuccess(true)
        })    
  } catch (error) {
    dispatch(updateuserfailer(error.message))
  }
}

async function handledelete(e) {
  e.preventDefault()
  
  try {
    dispatch(deleteuserstart())
    axios.delete(`/user/delete/${id}`)
    .then((data)=>{
      if(data.success === false){
      dispatch(deleteuserfailer(data.message))
      return
      }
    dispatch(deleteusersuccess(data))
    })

  } catch (error) {
    dispatch(deleteuserfailer(error.message))
  }
  
}


async function signout() {
  try {
    dispatch(signoutuserstart())
    await axios.get('/auth/signout')
  .then((data)=>{
    if(data.success == false){
      dispatch(signoutuserfailer(data.message))
      return
    }
    dispatch(signoutusersuccess(data))
  })
  } catch (error) {
    dispatch(signoutuserfailer(data.error))
  }
}


async function showdetails() {
  try {
    setdetailsdataloaging(true)
    setshowdataerror(false)
    axios.get(`/user/listing/${id}`)
    .then((data)=>setshowdatadetails(data.data))
    .catch((e)=>setshowdataerror(true))
  } catch (error) {
    setshowdataerror(true)
  }
}


async function handledetailsdelete(id) {
  await axios.delete(`/listing/delete/${id}`)
  .then((data)=>{
  if(data.success === false){
  console.log(data.message)
  }
  setshowdatadetails(p=>p.filter(i=>i._id !== id))
  console.log('deleted')
})
  .catch(e=>console.log(e))
}


  return (
    <div className='max-w-lg  mx-auto mt-4'>
      <h1 className='text-center text-3xl font-semibold '>Profile</h1>
      <form action="" onSubmit={handlesubmit} className='flex flex-col gap-4'>
        <input type="file" onChange={e=>setfile(e.target.files[0])} hidden ref={fileref} accept='image/*' />
        <img src={formdata.avatar ||  avatar} onClick={()=>fileref.current.click()}  className='rounded-full w-24 h-24 mt-3 self-center cursor-pointer object-cover' alt="profile" />
        
        <p className='text-center font-semibold'>
        {fileuploaderror ? (<span className='text-red-500'>Error Image Upload(image must be less then 2mb)</span>) 
        :
        filepercentage > 0 && filepercentage < 100 ? 
        (<span className='text-gray-700'>{`Uploading ${filepercentage}% `}</span>)
        :
        filepercentage === 100 ? 
        (<span className='text-green-600 '>Image Successfully Upload</span>)
        :
        ("")
        }
        </p>
        
        <input type="text"  onChange={handlechange} defaultValue={username}  id="username" placeholder='username' className='border text-lg font-semibold p-3  rounded-lg' />
        <input type="email" onChange={handlechange} defaultValue={email}  id="email" placeholder='email' className='border text-lg font-semibold p-3 rounded-lg' />
        <input type="password"  onChange={handlechange} id="password" placeholder='password' className='border text-lg font-semibold p-3  rounded-lg' />
        <button disabled={loading} className='bg-slate-700 p-3 rounded-lg font-semibold hover:opacity-85 text-white uppercase'>
          {loading ? "Loading..." : "Update"}
        </button>
        <Link className='bg-yellow-500 p-3 rounded-lg text-center font-semibold hover:opacity-85 text-white uppercase' to='/listing'>
        {loading ? "Loading..." : "Create Land"}
        </Link>
      </form>
      <div className='flex justify-between mt-3'>
        <span onClick={handledelete} className='text-red-500 font-medium cursor-pointer'>Delete account</span>
        <span onClick={signout} className='text-red-500 font-medium cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-500 font-medium text-center mt-5'>{error ? error : " "}</p>
      <p className='text-green-500 font-medium text-center mt-5'>{updatesuccess ? "User is Updated Successfully" : " "}</p>
      <div className='flex justify-between items-center'>
      <button onClick={showdetails} className='text-green-400  font-semibold '>Show Details</button>
      <p className='text-green-500 font-medium text-center '>{showdataerror ? "there is no Details" : " "}</p>
      </div>
        {showdatadetails && showdatadetails.length > 0 &&
        <div>
          <h1 className='text-center  text-3xl my-4 font-semibold '>Your Details</h1>
         { showdatadetails.map(data=>(
            <div className='border rounded-lg p-3 flex items-center  gap-3 justify-between' key={data._id}>

              <Link to={`/listing/${data._id}`}>
              <img src={data.imgurls} className='h-16 w-16 object-contain' alt="img" srcset="" />
              </Link>

              <Link className='text-slate-600 font-bold truncate hover:underline flex-1 ' to={`/listing/${data._id}`}>
              <p >{data.name}</p>
              </Link>

              <div className='grid gap-1'>
                <button onClick={()=>handledetailsdelete(data._id)} className='text-red-500 hover:text-red-600 font-semibold uppercase'>delete</button>
                <Link to={`/updatelisting/${data._id}`} className='text-gray-500 hover:text-gray-600 font-semibold uppercase'>
                   edit
                </Link>
               
              </div>

            </div>
          ))}
        </div>
        }
    </div>
  )
}
