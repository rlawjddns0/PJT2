const path=require('path');
const bcrypt=require('bcrypt')
const DB=require('../config/DBconfig')
const saltRounds=10
const express = require('express');
var app = express();
const router=express.Router()
const user=require('./user')
const mode=require('./mode')
const intruders=require('./intruders')
const belongings=require('./belongings')



router.use('/api/user',user)
router.use('/api/belongings',belongings)
router.use('/api/mode',mode)
router.use('/api/intruders',intruders)

module.exports=router;