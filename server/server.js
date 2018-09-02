var express =	require('express');
var app		=	express();
var bodyParser = require('body-parser');
var url = require('url');
const {c, cpp, node, python, java} = require('compile-run');
// var {authenticate} = require('./middleware/authenticate');


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,content-type, Accept , x-auth');
    // res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

var port= process.env.PORT||8000;

var router = express.Router();

router.use(function(req, res, next) {

    console.log('Something is happening.');
    next(); 
});


router.get('/',function(req,res){
	res.json({message : 'welcome'});
});



router.route('/compile')
	.post(function(req,res){
		var sourcecode=req.body.code;
		var lang=req.body.lang;
		if(lang==='java'){
			java.runSource(sourcecode).then(result => {
		        console.log(result);
		        res.send(result);
		    })
		    .catch(err => {
		        console.log(err);
		    });
		}
		else if(lang==='c'){
			c.runSource(sourcecode,).then(result => {
		        console.log(result);
		        	res.send(result);
		    })
		    .catch(err => {
		        console.log(err);
		    });
		}
		else if(lang==='python'){
			python.runSource(sourcecode).then(result => {
		        console.log(result);
		        res.send(result);
		    })
		    .catch(err => {
		        console.log(err);
		    });
		}
	});
app.use(express.static('./public'));
app.use('/api',router);
app.listen(port);
console.log('Running on Port '+ port);