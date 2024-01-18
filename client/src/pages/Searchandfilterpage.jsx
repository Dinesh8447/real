import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Searchitems from '../compoents/Searchitems'

export default function Searchandfilterpage() {
    const [sidebardata, setsidebardata] = useState({
        searchterms: '',
        type: 'alt',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'create_At',
        order: 'desc',
    })
    const [loadind, setloading] = useState(false)
    const [urlsearchdata, seturlsearchdata] = useState([])
    const [showmore, setshowmore] = useState(false)
    const navigate = useNavigate()

    // console.log(sidebardata)
    // console.log(urlsearchdata)

    async function handlechange(e) {
        // e.preventDefault()
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setsidebardata({ ...sidebardata, type: e.target.id })
        }

        if (e.target.id === 'searchterms') {
            setsidebardata({ ...sidebardata, searchterms: e.target.value })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setsidebardata({ ...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'create_At'
            const order = e.target.value.split('_')[1] || 'desc'
            setsidebardata({ ...sidebardata, sort, order })
        }

    }

    useEffect(() => {
        const urlparms = new URLSearchParams(location.search)
        const searchtermsurl = urlparms.get('searchterms')
        const typeurl = urlparms.get('type')
        const parkingurl = urlparms.get('parking')
        const furnishedurl = urlparms.get('furnished')
        const offerurl = urlparms.get('offer')
        const sorturl = urlparms.get('sort')
        const orderurl = urlparms.get('order')

        if (searchtermsurl || typeurl || parkingurl || furnishedurl || offerurl || sorturl || orderurl) {
            setsidebardata({
                searchterms: searchtermsurl || '',
                type: typeurl || 'alt',
                parking: parkingurl === "true" ? true : false,
                furnished: furnishedurl === "true" ? true : false,
                offer: offerurl === "true" ? true : false,
                sort: sorturl || 'create_At',
                order: orderurl || 'desc',
            })
        }


        async function fetch() {
            setloading(true)
        //     setshowmore(false)
            const searchquery = urlparms.toString()
            console.log(searchquery)

         const res = await axios.get(`/listing/get?${searchquery}`)
         .then(({data})=>{
            setloading(false)
            seturlsearchdata(data)
            console.log(data)
         })
        }

        fetch()

    }, [location.search])



    function handlesubmit(e) {
        e.preventDefault()
        const urlparms = new URLSearchParams()
        urlparms.set('furnished', sidebardata.furnished)
        urlparms.set('searchterms', sidebardata.searchterms)
        urlparms.set('parking', sidebardata.parking)
        urlparms.set('offer', sidebardata.offer)
        urlparms.set('sort', sidebardata.sort)
        urlparms.set('type', sidebardata.type)
        urlparms.set('order', sidebardata.order)
        const searchquery = urlparms.toString()
        // console.log(searchquery)
        navigate(`/search?${searchquery}`)
    }



    

   async function handleshowmore(e) {
        e.preventDefault()
        const numberofdata = urlsearchdata.length
        const startindex = numberofdata
        const urlparams = new URLSearchParams(location.search)
        urlparams.set('startindex',startindex)
        const searchquery = urlparams.toString()
        axios.get(`/listing/get?${searchquery}`)
        .then(({data})=>{
            if(data > 9){
                setshowmore(false)
            }
            seturlsearchdata([...urlsearchdata,...data])
        })


    
    }


    return (
        <div className='flex flex-col md:flex-row ' >
            {/* filter side cols-1 */}
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen '>
                <form onSubmit={handlesubmit} className='grid gap-8'>
                    {/* search section */}
                    <div className=' flex gap-2 items-center'>
                        <span className='whitespace-nowrap font-semibold '>search:</span>
                        <input type="text" name="" value={sidebardata.searchterms} onChange={handlechange} id="searchterms" placeholder='Search...' className='p-2 border rounded-md' />
                    </div>

                    {/* type section  */}
                    <div className='flex flex-col flex-wrap  gap-2'>
                        <label className='font-semibold'>Type:</label>
                        {/* div one */}
                        <div className='flex gap-2'>
                            {/* rent and sale chech box */}
                            <div className='flex gap-2'>
                                <input type="checkbox" value={sidebardata.type === 'all'} onChange={handlechange} name="" className='w-5' id="all" />
                                <span>Rent & Sale</span>
                            </div>

                            {/* rent check box */}
                            <div className='flex gap-2'>
                                <input type="checkbox" value={sidebardata.type === 'rent'} onChange={handlechange} name="" className='w-5' id="rent" />
                                <span>Rent</span>
                            </div>

                        </div>

                        {/* div one */}
                        <div className='flex gap-2'>
                            {/* sale chech box */}
                            <div className='flex gap-2'>
                                <input type="checkbox" value={sidebardata.type === 'sale'} onChange={handlechange} name="" className='w-5' id="sale" />
                                <span>Sale</span>
                            </div>

                            {/* offer chech box */}
                            <div className='flex gap-2'>
                                <input type="checkbox" value={sidebardata.offer} onChange={handlechange} name="" className='w-5' id="offer" />
                                <span>Offer</span>
                            </div>
                        </div>


                    </div>

                    {/* other section  */}
                    <div className='flex flex-col flex-wrap  gap-2'>
                        <label className='font-semibold'>Other:</label>
                        {/* div one */}
                        <div className='flex gap-2'>
                            {/* rent and sale chech box */}
                            <div className='flex gap-2'>
                                <input type="checkbox" value={sidebardata.parking} onChange={handlechange} name="" className='w-5' id="parking" />
                                <span>Parking</span>
                            </div>

                            {/* rent check box */}
                            <div className='flex gap-2'>
                                <input type="checkbox" value={sidebardata.furnished} onChange={handlechange} name="" className='w-5' id="furnished" />
                                <span>Furnished</span>
                            </div>

                        </div>

                    </div>

                    {/* sort section */}
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <select onChange={handlechange} defaultValue={'create_at_dec'} className='border rounded-lg p-2 font-medium' id="sort_order">
                            <option value="regularprice_desc" className='font-semibold'>Price high to low</option>
                            <option value="regularprice_asc" className='font-semibold' >Price low to high</option>
                            <option value="createdAt_desc" className='font-semibold' >Latest</option>
                            <option value="createdAt_asc" className='font-semibold' >Oldest</option>
                        </select>
                    </div>
                    {/* search button */}
                    <button className='bg-yellow-400  p-2 text-xl font-semibold text-white hover:opacity-85 rounded-lg'>
                        Search
                    </button>
                </form>
            </div>

            {/* show result side cols-2 */}
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold mt-5 text-slate-800 p-3 border-b'>Results:</h1>
                <div className='p-7 flex flex-wrap justify-center gap-5'>
                    {
                        !loadind && urlsearchdata.length === 0 &&
                        (<p className='text-2xl font-bold'>Not Found!</p>)
                    }

                    {loadind && (
                        <p className='text-xl text-slate-700 text-center font-extrabold'>Loading....</p>
                    )
                    }

                    {!loadind && urlsearchdata && urlsearchdata.map((data) => (
                        <Searchitems key={data._id} data={data} />
                    ))}

                </div>
                {showmore && (
                    <button
                        className='text-green-700 hover:underline font-semibold p-7 text-center'
                        onClick={handleshowmore}>
                        Showmore
                    </button>
                )}
            </div>
        </div>
    )

}