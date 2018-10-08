const mongoose = require('mongoose');
const config=require('.././config/config');
mongoose.connect(process.env.MONGODB_URI);