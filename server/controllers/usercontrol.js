const { errorhandler } = require('../utils/error')
const bcryptjs = require('bcryptjs')
const userdb = require('../models/usermodels')
const listingdb = require('../models/listingmodel')



const updateuser = async (req, res, next) => {
    // const {password} = req.body
    const { id } = req.params
    if (req.user.id !== id) return next(errorhandler(401, "you can only update your own account"))

    try {
        if (req.body.password) {
            bcryptjs.hashSync(req.body.password, 10)
        }

        const updateuser = await userdb.findByIdAndUpdate(id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })

        const { password, ...rest } = updateuser._doc

        res.status(200).json(rest)

    } catch (error) {
        next(error)
    }
}



const deleteuser = async (req, res, next) => {
    const { id } = req.params
    if (req.user.id !== id) return next(errorhandler(401, "you can only update your own account"))

    try {
        await userdb.findByIdAndDelete(id)
        res.clearCookie('accesstoken')
        res.status(200).json("user has been deleted")

    } catch (error) {
        next(error)
    }
}



const listing = async (req, res, next) => {
    const { id } = req.params
    if (req.user.id === id) {
        try {
            const listing = await listingdb.find({ userref: id })
            res.status(200).json(listing)
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorhandler(401, "you can only view your own Details"))

    }
}


const getuser = async (req, res, next) => {
    const { id } = req.params   
    const data = await userdb.findById(id)
    res.json(data)
}




module.exports = { updateuser, deleteuser, listing,getuser } 