import React, { useEffect, useState } from 'react'
import { app } from '../firebase'
import axios from 'axios'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function UpdateListingPage() {
    const [files, setfiles] = useState([])
    const { currentUser } = useSelector(state => state.user)
    const [formdata, setformdata] = useState({
        imgurls: [],
        name: '',
        description: '',
        address: '',
        regularprice: 500,
        discountprice: 0,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        type: 'rent',
        offer: false,
        userref: currentUser.data._id
    })
    const [imageuploaderror, setimageuploaderror] = useState(false)
    const [uploading, setuploading] = useState(false)
    const [progess, setprogess] = useState(null)
    const [error, seterror] = useState(false)
    const [loading, setloading] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    async function handlesubmit(e) {
        e.preventDefault()
        try {
            if (formdata.imgurls.length < 1) return seterror('you must upload at least one image')
            if (formdata.regularprice < formdata.discountprice) return seterror('Discount price must be lower then regular price')
            setloading(true)
            seterror(false)
            await axios.post(`/listing/update/${id}`, formdata)
                .then((data) => {
                    setloading(false)
                    if (data.success === false) {
                        seterror(error.message)
                    }
                    console.log('update')
                    navigate(`/profile`)
                })
        } catch (error) {
            seterror(error.message)
            setloading(false)
        }

    }


    function handleimgupload() {
        // e.preventDefault()
        if (files.length > 0 && files.length < 6) {
            setuploading(true)
            setimageuploaderror(false)
            const promises = []
            for (let i = 0; i < files.length; i++) {
                promises.push(storeimage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                setformdata({ ...formdata, imgurls: urls })
                setimageuploaderror(false)
                setuploading(false)
            }).catch(err => {
                setimageuploaderror("image upload failed (2mb max per image)")
                setuploading(false)
            })

        } else {
            setimageuploaderror("you can only upload 6 images")
            setuploading(false)
        }

    }

    async function storeimage(file) {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const filename = new Date().getTime() + file.name
            const storageref = ref(storage, filename)
            const uploadtask = uploadBytesResumable(storageref, file)
            uploadtask.on(
                "state_changed",
                (snapshot) => {
                    const progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    const per = Math.round(progess)
                    setprogess(per)
                    // setprogess("Uploading " + per + " %")
                    // console.log("upload" + per + "%")
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadtask.snapshot.ref).then((downloadurl) => {
                        resolve(downloadurl)
                    })
                }
            )
        })
    }

    function handledelete(index) {
        setformdata({
            ...formdata,
            imgurls: formdata.imgurls.filter((_, i) => i !== index)
        })
    }


    function handlechange(e) {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setformdata({
                ...formdata,
                type: e.target.id
            })
        }

        if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
            setformdata({
                ...formdata,
                [e.target.id]: e.target.checked
            })
        }
        if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
            setformdata({
                ...formdata,
                [e.target.id]: e.target.value
            })
        }
    }

    useEffect(() => {
        async function fetch() {

            await axios.get(`/listing/get/${id}`)
                .then((data) => {
                    if (data.success === false) {
                        seterror(data.message)
                        return
                    }
                    setformdata(data.data)
                })
                .catch(e => console.log(e))
        }

        fetch()
    }, [])


    return (
        <main className=' max-w-4xl m-auto p-6 '>
            <h1 className='text-3xl font-semibold text-center '>Update Details</h1>
            <form onSubmit={handlesubmit} className='grid gap-7 mt-5  lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1  '>
                {/* 1 col */}
                <div className='grid gap-7 '>
                    <input type="text" placeholder='Name' onChange={handlechange} value={formdata.name} required id="name" className='border p-2 font-semibold rounded-lg' maxLength={62} minLength={5} />
                    <textarea type="text" placeholder='Description' onChange={handlechange} value={formdata.description} rows={3} required id="description" className='border p-2 font-semibold rounded-lg' />
                    <input type="text" placeholder='Address' required onChange={handlechange} value={formdata.address} id="address" className='border p-2 font-semibold rounded-lg' />
                    {/* checkboxs */}
                    <div className='flex gap-6 font-bold flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" onChange={handlechange} checked={formdata.type === 'sale'} className='w-5 h-5 cursor-pointer' id="sale" /><span>sell</span>
                        </div>
                        <div className='flex gap-2' >
                            <input type="checkbox" className='w-5 h-5 cursor-pointer' onChange={handlechange} checked={formdata.type === 'rent'} id="rent" /><span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" className='w-5 h-5 cursor-pointer' onChange={handlechange} checked={formdata.parking} id="parking" /><span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" className='w-5 h-5 cursor-pointer' onChange={handlechange} checked={formdata.furnished} id="furnished" /><span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" className='w-5 h-5 cursor-pointer' onChange={handlechange} checked={formdata.offer} id="offer" /> <span>Offer</span>
                        </div>
                    </div>

                    {/* number box */}
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2 items-center">
                            <input type="number" onChange={handlechange} value={formdata.bedrooms} className='p-2 border border-gray-300 rounded-lg' max={10} min={1} name="" id="bedrooms" />
                            <p className='font-bold'>Beds</p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <input type="number" onChange={handlechange} value={formdata.bathrooms} className='p-2 border border-gray-300 rounded-lg' max={10} min={1} name="" id="bathrooms" />
                            <p className='font-bold'>Baths</p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <input type="number" onChange={handlechange} value={formdata.regularprice} className='p-2 border border-gray-300 rounded-lg' max={100000} min={500} name="" id="regularprice" />

                            <div className='flex flex-col items-center'>
                                <p className='font-bold'>Regularprice</p>
                                <span className='text-sm'>(RS / month)</span>
                            </div>
                        </div>
                        {formdata.offer && (

                            <div className="flex gap-2 items-center">
                                <input type="number" onChange={handlechange} value={formdata.discountprice} className='p-2 border border-gray-300 rounded-lg' max={100000} min={0} name="" id="discountprice" />
                                <div className='flex flex-col items-center'>
                                    <p className='font-bold'>Discountprice</p>
                                    <span className='text-sm'>(RS / month)</span>
                                </div>
                            </div>

                        )}

                    </div>

                </div>
                {/* 2 col */}
                <div className='flex flex-col gap-3' >
                    <p className='font-thin'><span className='font-semibold'>Images:</span> the first image will be the cover (max 6)  </p>
                    <div className='grid gap-4 items-center '>
                        <input type="file" onChange={e => setfiles(e.target.files)} id='imgurls' multiple placeholder='Name' className='border border-gray-400 w-full mt-4 p-3 font-semibold rounded-lg' />
                        <button type='button' disabled={uploading} onClick={handleimgupload} className='border border-green-500 p-3  uppercase hover:shadow-lg  font-semibold rounded-lg text-green-500'>
                            {uploading ? `uploading ${progess}%` : " upload"}
                        </button>

                        <p className='text-red-600 text-center font-semibold'>{imageuploaderror && imageuploaderror}</p>
                        {
                            formdata.imgurls && formdata.imgurls.map((url, index) => (
                                <div key={url} className='flex justify-between border p-1 rounded-lg items-center '>
                                    <img src={url} alt="upload img" className='w-40 h-20 object-cover rounded-lg' />
                                    <button type='button' onClick={() => handledelete(index)} className='text-red-500 uppercase hover:opacity-80 font-semibold'>
                                        Delete
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                    <button disabled={loading || uploading} className='p-3 bg-black uppercase disabled:opacity-75 text-white font-bold  rounded-lg'>
                        {loading ? "updating.." : "update"}
                    </button>
                    {error && <p className='text-red-500 font-semibold '>{error}</p>}
                </div>
            </form>
        </main>
    )
}
