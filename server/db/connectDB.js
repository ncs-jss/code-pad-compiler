const mongoose = require('mongoose');
const config=require('.././config/config');
// console.log(process.env);
mongoose.connect(process.env.MONGODB_URI);