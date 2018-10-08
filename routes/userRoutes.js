const Question= require('../.././app/models/question');
const User= require('../.././app/models/user');
const config=require('.././config/config');
const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();


authenticate=function(req,res,next){
	try{

		decoded= jwt.verify(req.header('x-auth'),process.env.JWT_SECRET);
		if(decoded.username==process.env.USERNAME&&decoded.password==process.env.PASSWORD){

			next();
		}
		else{
			res.status(401).send();	
		}

	}catch(e){
		res.status(401).send();
	}	
};

router.route('/leaderboard')


/**
 * @api {get} /api/user/leaderboard Return leaderboard
 * @apiGroup Users
 * @apiHeader {String} Authorization Token of admin
 * @apiHeaderExample {json} Header
 * {"x-auth": "JWT xyz.abc.123.hgf"}
 * @apiSuccess {String[]} users User list
 * @apiSuccess {String} users.name User name
 * @apiSuccess {String[]} users.admission_no User admission_no
 * @apiSuccess {String[]} users.questions_solved User Questions Solved
 * @apiSuccessExample {json} Success
 * 	HTTP/1.1 200 OK
 *		[{
 *		        "name": "Shubham",
 *		        "admission_no": "17EC060",
 *		        "questions_solved": 3
 *		}]
 * @apiErrorExample {json} Find error
 * 	HTTP/1.1 401 NOT Authenticated
*/
	.get(authenticate, async function(req,res){
		var users=await User.find();
		users.sort(function (a, b) {
		  return b.questions_solved.length - a.questions_solved.length;
		});
		users=users.map(user=>{
			var json={
				name:user.name,
				admission_no:user.admission_no,
				questions_solved:user.questions_solved.length
			};
			return json;
		})
		res.send(users);
	});

router.route('/login')

/**
 * @api {post} /api/user/login Login Users
 * @apiGroup Users
 * @apiParam {String} username User username
 * @apiParam {String} password User password
 * @apiParamExample {json} Input
 *		{
 *			"username":"username",
 *			"password":"password"
 *		}
 * @apiSuccess {String} message Login Status
 * @apiSuccessExample {json} Success
 * 	HTTP/1.1 200 OK Header {"x-auth": "JWT xyz.abc.123.hgf"}
 *		{
 *			"message":"Successful/Invalid Credentials"
 *		}
 * 	
 * @apiErrorExample {json} Find error
 * 	HTTP/1.1 401 Unauthorised
*/
	.post(function(req,res){
		var username=req.body.username;
		var password=req.body.password;
		if(username===process.env.USERNAME && password===process.env.PASSWORD){

			var token = jwt.sign({username,password},process.env.JWT_SECRET).toString();
			res.header('x-auth',token).send({message:"Successful"});

		}
		else{
			res.status(401).send({message:'Invalid Credentials'});
		}
	});

module.exports=router;