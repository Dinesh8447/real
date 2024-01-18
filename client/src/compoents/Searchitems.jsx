import { FaBath, FaBed, FaChair, FaLocationDot, FaShare } from "react-icons/fa6";
import { Link } from 'react-router-dom'

export default function Searchitems({ key, data }) {
    return (
        <div key={key} className='bg-white shadow-md  hover:shadow-lg w-[300px]  transition-shadow overflow-hidden rounded-lg'>
            <Link to={`/listing/${data._id}`} >
                <img src={data.imgurls[0]} alt="image"
                    className='h-[250px] w-full  object-cover hover:scale-105 transition-scale duration-300'
                />
                <div className="p-4 ">

                    <div>
                        <p className='truncate text-lg font-semibold text-slate-500'>{data.name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <FaLocationDot className="h-4 w-4 text-green-500" />
                        <p className="text-sm text-gray-500 truncate font-semibold">{data.address}</p>
                    </div>


                    <p className="text-sm text-gray-500 truncate line-clamp-1 font-semibold">{data.description}</p>

                    <p className="font-semibold text-gray-800">
                        {data.offer ? data.discountprice : data.regularprice}Rs
                        {data.type === 'rent' && " /month"}Rs
                    </p>

                    <div className="flex gap-2 items-center">
                        <p className="flex gap-1 items-center font-semibold text-gray-400">
                            <FaBed className="h-4 w-4 text-green-500" />
                            {data.bedrooms > 1 ? `${data.bedrooms} Beds` : `${data.bedrooms} Bed`}
                        </p>

                        <p className="flex gap-1 items-center font-semibold text-gray-400">
                            <FaBath className="h-4 w-4 text-green-500" />
                            {data.bathrooms > 1 ? `${data.bathrooms} Bathrooms` : `${data.bathrooms} Bathroom`}
                        </p>
                        
                    </div>
                </div>
            </Link>
        </div>
    )
}

//address description furnished offer parking regularprice type bathrooms bedrooms name