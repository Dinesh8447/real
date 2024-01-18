import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import SwiperCore from 'swiper'
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaLocationDot, FaShare } from "react-icons/fa6";
import { FaParking } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Context from './Context'


export default function Listing() {
    const { id } = useParams()
    const [data, setdata] = useState()
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState(false)
    const [copied, setcopied] = useState(false)
    const [contact, setcontact] = useState(false)
    const {currentUser} = useSelector(state=>state.user)
    // console.log(data.userref)

    useEffect(() => {
        try {
            setloading(true)
            const fetch = async () => {
                axios.get(`/listing/get/${id}`)
                    .then(({ data }) => {
                        setdata(data)
                        setloading(false)
                    })
            }
            fetch()

        } catch (error) {
            seterror(error)
            setloading(false)
        }

    }, [])




    return (
        <main>
            {loading && <p className='text-center text-3xl font-bold'>Loading...</p>}
            {error && <p className='text-center text-3xl font-bold'>Something went worng</p>}
            {data &&
                <div className=''>
                    <Swiper navigation>
                        {data.imgurls.map(url => (
                            <SwiperSlide key={url}>
                                <div className='h-[450px] my-4 rounded-md' style={{ background: `url(${url}) center no-repeat` }} >
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='fixed top-[15%] right-[2%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-blue-400 cursor-pointer'>
                        <FaShare onClick={()=>{
                            navigator.clipboard.writeText(window.location.herf)
                            setcopied(true)
                            setTimeout(()=>{
                                setcopied(false)
                            },2000)
                        }}/>
                    </div>

                    {copied && (<p className='fixed top-[23%] right-[5%] z-10 font-semibold rounded-md text-white  bg-blue-500 p-3'>link copied</p>)}
                    
                    <div className=' max-w-4xl m-auto grid gap-8 p-4 '>
                        <h1 className='text-2xl font-bold'>{data.name}</h1>
                   
                    <div className='flex gap-2 p-4 items-center'>
                        <FaLocationDot className='h-8 w-8 text-green-400' />
                        <p className='font-semibold text-gray-400'>{data.address}</p>
                    </div>

                    <div className='flex gap-2 p-4 items-center'>
                        <p className='bg-red-500 font-semibold text-white text-center p-2 rounded-md'>
                            {data.type === 'rent' ? "For Rent" : "For Sale"}
                        </p>

                        {
                            data.offer && (
                                <p className='bg-green-500  text-white font-semibold text-center p-2 rounded-md'>
                                    {+data.regularprice - +data.discountprice}rs OFF
                                </p>
                            )
                        }

                    </div>

                    <p className='font-medium items-center'>
                        <span className='font-bold text-lg'>Description:</span>
                        {data.description}
                    </p>
                    <ul className='text-green-400 flex gap-4 sm:gap-6 items-center font-semibold text-sm'>
                        <li className='flex gap-2 items-center'>
                            <FaBed className='text-2xl '/>
                            {data.bedrooms > 1 ? `${data.bedrooms} beds` :`${data.bedrooms} bed` }
                        </li>

                        <li className='flex gap-2 items-center'>
                            <FaBath className='text-2xl '/>
                            {data.bathrooms > 1 ? `${data.bathrooms} bathrooms` :`${data.bathrooms} bathroom` }
                        </li>

                        <li className='flex gap-2 items-center'>
                            <FaParking className='text-2xl '/>
                            {data.parking  ? "Parking" :"No Parking" }
                        </li>


                        <li className='flex gap-2 items-center'>
                            <FaChair className='text-2xl '/>
                            {data.furnished  ? "Furnished" :"No furnished" }
                        </li>

                    </ul>
                    {contact && (<Context Listing={data}/>)}
                    {currentUser.data._id && data.userref === currentUser.data._id &&  (
                    <button onClick={()=>setcontact(true)} className='bg-slate-500 p-3 rounded-lg hover:opacity-80 text-white uppercase font-bold'>Contact</button>
                    )}
                    {/* {console.log(data.userref === currentUser.data._id )} */}
                </div>  
            </div>
            }

        </main>
    )
}
