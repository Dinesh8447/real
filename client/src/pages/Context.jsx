import axios from 'axios'
import {Link} from 'react-router-dom'
import React, { useEffect, useState } from 'react'

export default function Context({ Listing }) {
    const [details, setdetails] = useState([])
    const [message, setmessage] = useState('')

    // console.log(Listing)
    // console.log(details)


    useEffect(() => {
        async function fetch() {
            try {
                axios.get(`/user/${Listing.userref}`)
                    .then((d) => {
                        setdetails(d.data)
                    })
            } catch (error) {
                console.log(error)
            }
        }

        fetch()
    }, [Listing.userref])




    return (
        <>
            {details && (
                <div className='grid gap-3'>
                    <p className='font-bold text-lg'>Contact:
                        <span className='font-semibold'> {details.username} </span>
                        for
                        <span className='font-semibold lowercase'> {Listing.name}</span>
                    </p>

                    <textarea 
                    value={message} 
                    onChange={e=>setmessage(e.target.value)} 
                    name="message" id="message" 
                    placeholder='enter your message'  
                    rows="2"
                    className='w-full border p-3 rounded-lg'
                    ></textarea>
                    <Link to={`mailto:${details.email}?subject=Regarding ${Listing.name}&body=${message}`}
                        className='bg-blue-500 p-3 rounded-lg text-center text-white font-semibold'
                    >
                     Send message
                    </Link>
                </div>
            )}

        </>
    )
}
