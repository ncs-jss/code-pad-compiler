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