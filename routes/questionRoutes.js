const Question= require('../.././app/models/question');
const User= require('../.././app/models/user');
const express=require('express');
const _=require('lodash');
const jwt=require('jsonwebtoken');
const redis = require('redis');
const {c, cpp, node, python, java} = require('compile-run');
const router=express.Router();
const client = redis.createClient({host:"redis"});
authenticate=function(req,res,next){
	try{

		if(req.header('client-key')===process){

			next();
		}
		else{
			res.status(401).send();	
		}

	}catch(e){
		res.status(401).send();
	}	
};

router.route('/submit')
/**
 * @api {post} /api/question/submit Submit solution
 * @apiGroup Questions
 * @apiParam {String} code Question solution
 * @apiParam {String} lang Language used
 * @apiParam {String} admission_no User Admission No.
 * @apiParam {String} name User name
 * @apiParam {String} ques_id Question id
 * @apiParamExample {json} Input
 *		{
 *			"code":"#include.........",
 *			"lang": "c/cpp/java/python",
 *			"admission_no":"16it028",
 *			"name":"Shobhit Agarwal",
 *			"ques_id":"9875fdnkdnfowur9we93"
 *		}
 * @apiHeader {String} Authorization Token of admin
 * @apiSuccess {String} status Submission Status
 * @apiSuccess {String} message Solution Status
 * @apiSuccessExample {json} Success
 * 	HTTP/1.1 200 OK
*		{
*			"status":"success",
*			"message":"Correct/Wrong"
*		}
* @apiErrorExample {json} Find error
* 	HTTP/1.1 201 ERROR
*		{
*			"error":"nfnfnmlem[mswf",
*			"errorType":"Compile_Time"
*		} 
*/
	.post( async function(req,res){
		// console.log(req.body);
		var admission_no=req.body.admission_no.toUpperCase();
		var name=req.body.name;
		var ques_id=req.body.ques_id;
		var user=await User.findOne({admission_no});
		if(!user){
			user=new User({admission_no,name});
		}
		client.get(ques_id,async function(err,result){
			console.log(result);
			if(result){
				compileCode(req,res,user,result);
			}
			else{
				var ques=await Question.findById(ques_id);
				compileCode(req,res,user,ques);
			}
		});
				

	});

router.route('/submit')
/**
 * @api {post} /api/question/submit Submit solution
 * @apiGroup Questions
 * @apiParam {String} code Question solution
 * @apiParam {String} lang Language used
 * @apiParam {String} admission_no User Admission No.
 * @apiParam {String} name User name
 * @apiParam {String} ques_id Question id
 * @apiParamExample {json} Input
 *		{
 *			"code":"#include.........",
 *			"lang": "c/cpp/java/python",
 *			"admission_no":"16it028",
 *			"name":"Shobhit Agarwal",
 *			"ques_id":"9875fdnkdnfowur9we93"
 *		}
 * @apiHeader {String} Authorization Token of admin
 * @apiSuccess {String} status Submission Status
 * @apiSuccess {String} message Solution Status
 * @apiSuccessExample {json} Success
 * 	HTTP/1.1 200 OK
*		{
*			"status":"success",
*			"message":"Correct/Wrong"
*		}
* @apiErrorExample {json} Find error
* 	HTTP/1.1 201 ERROR
*		{
*			"error":"nfnfnmlem[mswf",
*			"errorType":"Compile_Time"
*		} 
*/
	.post( async function(req,res){
		// console.log(req.body);
		var admission_no=req.body.admission_no.toUpperCase();
		var name=req.body.name;
		var ques_id=req.body.ques_id;
		var user=await User.findOne({admission_no});
		if(!user){
			user=new User({admission_no,name});
		}
		client.get(ques_id,async function(err,result){
			console.log(result);
			if(result){
				compileCode(req,res,user,result);
			}
			else{
				var ques=await Question.findById(ques_id);
				compileCode(req,res,user,ques);
			}
		});
				

	});

const compileCode=async function(req,res,user,ques){
		var sourcecode=req.body.code;
		var lang=req.body.lang;
		var admission_no=req.body.admission_no.toUpperCase();
		var name=req.body.name;
		var ques_id=req.body.ques_id;
		console.log(typeof ques);
		if(typeof ques==='string'){
			ques=JSON.parse(ques);
		}
		if(ques){
		client.set(ques._id,JSON.stringify(ques),redis.print);
			if(lang==='java'){
				for(var i=0;i<ques.input.length;i++){
					try{
						var result=await java.runSource(sourcecode,{stdin:ques.input[i],timeout:2000});
						console.log(result);
						if(result.exitCode!=0){
							var json={
								error:result.stderr.substring(result.stderr.indexOf('error')),
								errorType:result.errorType
							};
							res.status(201).send(json);
							return 0;
						}
						else if(result.stdout.trim()!=ques.output[i].trim()){
							user=await user.save();
							res.send({status:'success',message:'wrong'});
							return 0;
						}	
					}
					catch(error){
						console.log(error);
						res.status(400).send(error);
						return 0;
					}
				}
				if(user.questions_solved.indexOf(ques_id)<0)
					user.questions_solved.push(ques_id);
				try{
					user=await user.save();
					res.send({status:'success',message:'correct'});
				}
				catch(error){
					res.send(400).send(error);
				}
			}
			else if(lang==='c'){
				for(var i=0;i<ques.input.length;i++){
					try{
						var result=await c.runSource(sourcecode,{stdin:ques.input[i],timeout:2000});
						console.log(result);
						if(result.exitCode!=0){
							var json={
								error:result.stderr.substring(result.stderr.indexOf('error')),
								errorType:result.errorType
							};
							res.status(201).send(json);
							return 0;
						}
						else if(result.stdout.trim()!=ques.output[i].trim()){
							user=await user.save();
							res.send({status:'success',message:'wrong'});
							return 0;
						}	
					}
					catch(error){
						console.log(error);
						res.status(400).send(error);
						return 0;
					}
				}
				if(user.questions_solved.indexOf(ques_id)<0)
					user.questions_solved.push(ques_id);
				try{
	
					user=await user.save();
					res.send({status:'success',message:'correct'});
				}
				catch(error){
					res.status(400).send(error);
				}
			}
			else if(lang==='cpp'){
				for(var i=0;i<ques.input.length;i++){
					try{
						var result=await cpp.runSource(sourcecode,{stdin:ques.input[i],timeout:2000});
						console.log(result);
						if(result.exitCode!=0){
							var json={
								error:result.stderr.substring(result.stderr.indexOf('error')),
								errorType:result.errorType
							};
							res.status(201).send(json);
							return 0;
						}
						else if(result.stdout.trim()!=ques.output[i].trim()){
							user=await user.save();
							res.send({status:'success',message:'wrong'});
							return 0;
						}	
					}
					catch(error){
						console.log(error);
						res.status(400).send(error);
						return 0;
					}
				}
				if(user.questions_solved.indexOf(ques_id)<0)
					user.questions_solved.push(ques_id);
				try{
					user=await user.save();
					res.send({status:'success',message:'correct'});
				}
				catch(error){
					res.status(400).send(error);
				}
			}
			else if(lang==='python'){
				for(var i=0;i<ques.input.length;i++){
					try{
						var result=await python.runSource(sourcecode,{stdin:ques.input[i],timeout:2000});
						console.log(result.stdout.trim());
						if(result.exitCode!=0){
							var json={
								error:result.stderr.substring(result.stderr.indexOf('error')),
								errorType:result.errorType
							};
							res.status(201).send(json);
							return 0;
						}
						else if(result.stdout.trim()!=ques.output[i].trim()){
							user=await user.save();
							res.send({status:'success',message:'wrong'});
							return 0;
						}	
					}
					catch(error){
						console.log(error)
						res.status(400).send(error);
						return 0;
					}
				}
				if(user.questions_solved.indexOf(ques_id)<0)
					user.questions_solved.push(ques_id);
				try{

					user=await user.save();
					res.send({status:'success',message:'correct'});			
				}
				catch(error){
					res.status(400).send(error);
				}
			}
		}
		else{
			res.status(404).send({message:'Question Not found'});
		}
}



module.exports=router;
