const { errorhandler } = require('../utils/error')
const listingdb = require('../models/listingmodel')



const createlisting = async (req, res, next) => {

    try {
        const listing = await listingdb.create(req.body)
        res.json(listing)
    } catch (error) {
        res.json(error)
    }

}

const deletelisting = async (req, res, next) => {
    const { id } = req.params

    const listing = await listingdb.findById(id)

    if(!listing) return next(errorhandler(404,'Data not found'))
    if(req.user.id !== listing.userref) return next(errorhandler(401,'you can only delete your own data'))

    try {
        await listingdb.findByIdAndDelete(id)
        res.json('deleted')
    } catch (error) {
        next(error)
    }
}


const updatelisting = async (req, res, next) => {
    const { id } = req.params
    const listing = await listingdb.findById(id)
    
    if(!listing) return next(errorhandler(404,'Data not found'))
    if(req.user.id !== listing.userref) return next(errorhandler(401,'you can only delete your own data'))

    try {
        await listingdb.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json('updated')
    } catch (err) {
        next(err)
    }
}

const getlisting = async (req, res, next) => {
    const { id } = req.params
    try {
    const listing = await listingdb.findById(id)
    if(!listing) return next(errorhandler(404,'Data not found'))
        // await listingdb.findById(id,req.body,{new:true})
        res.status(200).json(listing)
    } catch (err) {
        next(err)
    }
}


const getlistings = async (req, res, next) => {
    try {
    const limit = parseInt(req.query.limit) || 9;
    const startindex = parseInt(req.query.startindex) || 9;
    
    let offer = req.query.offer
    if(offer ===undefined || offer === false){
        offer = {$in: [false,true]}
    }

    let furnished = req.query.furnished
    if(furnished ===undefined || furnished === false){
        furnished = {$in: [false,true]}
    }

    let parking = req.query.parking
    if(parking ===undefined || parking === false){
        parking = {$in: [false,true]}
    }
    
    let type = req.query.type
    if(type ===undefined || type === 'all'){
        type = {$in: ['sale','rent']}
    }


    const  searchterms = req.query.searchterms || '' ;

    const sort = req.query.sort || 'createAt'
    const order = req.query.order || 'desc'

    const listing = await listingdb.find({
        name:{$regex:searchterms,$options:"i"},
        offer,
        parking,
        type,
        furnished
    })
    .sort({[sort]:order})
    .limit(limit)
    // .skip(startindex)

   return  res.status(200).json(listing)
 

    } catch (err) {
        next(err)
    }
}




module.exports = { createlisting, deletelisting,updatelisting,getlisting,getlistings} 