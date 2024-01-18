const express = require('express');
const { updateuser,deleteuser,listing,getuser} = require('../controllers/usercontrol');
const { verifytoken } =  require( '../utils/verifiyuser');

const routes = express.Router()


// routes.get('/post', user)
routes.post('/update/:id',verifytoken, updateuser )
routes.delete('/delete/:id',verifytoken, deleteuser )
routes.get('/listing/:id',verifytoken, listing )
routes.get('/:id',verifytoken, getuser )


module.exports = routes;