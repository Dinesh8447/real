const express = require('express');
const { createlisting ,deletelisting,updatelisting,getlisting,getlistings} = require('../controllers/listingcontrol');
const { verifytoken } = require('../utils/verifiyuser');

const routes = express.Router()



routes.post('/create',verifytoken, createlisting)
routes.delete('/delete/:id',verifytoken, deletelisting)
routes.post('/update/:id',verifytoken, updatelisting)
routes.get('/get/:id', getlisting)
routes.get('/get', getlistings)



module.exports = routes;