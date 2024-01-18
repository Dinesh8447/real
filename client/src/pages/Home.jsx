import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css/bundle'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation } from 'swiper/modules'
import ListingPage from './ListingPage';
import Listing from './Listing';
import Searchandfilterpage from './Searchandfilterpage';
import Searchitems from '../compoents/Searchitems';

export default function Home() {

  const [offerdata, setofferdata] = useState([])
  const [saledata, setsaledata] = useState([])
  const [rentdata, setrentdata] = useState([])

  // console.log(offerdata)
  // console.log(saledata)
  console.log(rentdata)


  useEffect(() => {

    async function fetchoffer() {

      try {
        await axios.get('/listing/get/?offer=true')
          .then(({ data }) => {
            setofferdata(data)
            fetchrentdata()
          })
          .catch((e) => {
            console.log('axios error', e)
          })
      } catch (e) {
        console.log(e)
      }
    }

    async function fetchrentdata() {

      try {
        await axios.get('/listing/get/?type=rent')
          .then(({ data }) => {
            setrentdata(data)
            fetchsaledata()
          })
          .catch((e) => {
            console.log('axios error', e)
          })
      } catch (e) {
        console.log(e)
      }
    }


    async function fetchsaledata() {

      try {
        await axios.get('/listing/get/?type=sale&limit=4')
          .then(({ data }) => {
            setsaledata(data)
          })
          .catch((e) => {
            console.log('axios error', e)
          })
      } catch (e) {
        console.log(e)
      }
    }



    fetchoffer()

  }, [])



  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-8 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-salte-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-400'>Perfect</span>
          <br />
          please with ease
          <div className='text-gray-400 text-sm mt-5 sm:text-sm'>
            Realestate is the best place to find your next perfect place to live
            <br />
            We have a wide range of properties for you to choose form
            <br />
            <Link to={'/search'} className='text-xs sm:text-sm mt-8 text-blue-500 font-bold hover:underline'>
              Let's start now..
            </Link>

          </div>

        </h1>
      </div>



      {/* swipper */}
      <Swiper
        navigation
        modules={[Navigation]}
      >

        {offerdata && offerdata.length > 0 && offerdata.map((data) => (
          <SwiperSlide>
            <div style={{ background: `url(${data.imgurls[0]}) center no-repeat `, backgroundSize: "cover" }} className='h-[500px]  '>

            </div>
          </SwiperSlide>
        ))

        }

      </Swiper>

      {/* show data */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>

        {/* one */}
        {offerdata && offerdata.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-500'>
                Recent Offer
              </h2>
              <Link className='text-sm font-semibold text-blue-400 hover:underline' to={'/search?offer=true'}>
                Show more offer..
              </Link>
            </div>
            <div className='flex flex-wrap gap-4 '>
              {
                offerdata.map((data) => (
                  <Searchitems data={data} key={data._id} />
                ))
              }
            </div>
          </div>
        )}


        {/* two */}

        {rentdata && rentdata > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-500'>
                Recent Place of rent               </h2>
              <Link className='text-sm font-semibold text-blue-400 hover:underline' to={'/search?type=rent'}>
                Show more...
              </Link>
            </div>
            <div className='flex flex-wrap gap-4 '>
              {
                rentdata.map((data) => (
                  <Searchitems data={data} key={data._id} />
                ))
              }
            </div>
          </div>
        )}

        {/* three */}

        {saledata && saledata.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-500'>
                Recent Places for sales
              </h2>
              <Link className='text-sm font-semibold text-blue-400 hover:underline' to={'/search?type=sale'}>
                Show more offer..
              </Link>
            </div>
            <div className='flex flex-wrap gap-4 '>
              {
                saledata.map((data) => (
                  <Searchitems data={data} key={data._id} />
                ))
              }
            </div>
          </div>
        )}


      </div>

    </div>
  )
}
