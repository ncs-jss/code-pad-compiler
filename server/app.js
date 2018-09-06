const path= require('path');
const publicPath = path.join(__dirname,'../public');
const express=require('express');
const helmet=require('helmet');
const  app=express();
const bodyParser=require('body-parser');
const questionRoutes=require('./routes/questionRoutes');
const userRoutes=require('./routes/userRoutes');
const router=express.Router();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use(helmet());
app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,content-type, Accept , x-auth');
  
	next();
});
router.use('/question',questionRoutes);
router.use('/user',userRoutes);
app.use('/api',router);

module.exports=app;