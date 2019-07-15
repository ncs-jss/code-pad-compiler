const Question= require('../.././app/models/question');
const User= require('../.././app/models/user');
const express=require('express');
const _=require('lodash');
const jwt=require('jsonwebtoken');
const redis = require('redis');
const run_python = require('../utils/python');
const {compile_java,run_java,getClassName} = require('../utils/java');
const {compile_cpp,run_cpp} = require('../utils/cpp');
const {compile_c,run_c} = require('../utils/c');
const {c, cpp, node, python, java} = require('compile-run');
const router=express.Router();
const client = redis.createClient({host:"127.0.0.1"});
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

router.route('/day/:id')

/**
 * @api {get} /api/question/day/day_no. Return the questions for the day
 * @apiGroup Questions
 * @apiSuccess {Object[]} questions Question list
 * @apiSuccess {String} questions._id Question id
 * @apiSuccess {String} questions.question Question statement
 * @apiSuccess {String[]} questions.input Question input
 * @apiSuccess {String[]} questions.output Question output
 * @apiSuccess {Number} questions.day Question day
 * @apiSuccessExample {json} Success
 * 	HTTP/1.1 200 OK
*		[{
*			"_id":"5b8d2e908a54035801ae7564",
*			"question":"WAP to input two numbers and print sum.",
*			"input":["5\n5","5\n4","5\n3"],
*			"output":["10","9","8"],
*			"day":1
*		}]
 * @apiErrorExample {json} Find error
 * 	HTTP/1.1 404 NOT FOUND
*/
	.get(function(req,res) {
		var day=req.params.id;
		console.log(day);
		Question.find({day}).then(function(ques){
			if(ques){
				res.send(ques);
			}
			else{
				res.status(404).send('Not Found');
			}
		}).catch(function(err){
			console.log(err);
		});
	});
router.route('/add')
/**
 * @api {post} /api/question/add Add questions
 * @apiGroup Questions
 * @apiParam {String} question Question statement
 * @apiParam {String[]} input Question input
 * @apiParam {String[]} output Question output
 * @apiParam {Number} day Question day
 * @apiParamExample {json} Input
 *		{
 *			"question":"WAP to input two numbers and print sum.",
 *			"input":["5\n5","5\n4","5\n3"],
 *			"output":["10","9","8"],
 *			"day":1
 *		}
 * @apiHeader {String} Authorization Token of admin
 * @apiHeaderExample {json} Header
 * {"x-auth": "JWT xyz.abc.123.hgf"}
 * @apiSuccess {String} questions._id Question id
 * @apiSuccess {String} questions.question Question statement
 * @apiSuccess {String[]} questions.input Question input
 * @apiSuccess {String[]} questions.output Question output
 * @apiSuccess {String} questions.day Question day
 * @apiSuccessExample {json} Success
 * 	HTTP/1.1 200 OK
*		{
*			"_id":"5b8d2e908a54035801ae7564",
*			"question":"WAP to input two numbers and print sum.",
*			"input":["5\n5","5\n4","5\n3"],
*			"output":["10","9","8"],
*			"day":1
*		}
 * @apiErrorExample {json} Find error
 * 	HTTP/1.1 401 Unauthorised
*/
	.post(authenticate, function(req,res){
		console.log(req.body);
		var body=_.pick(req.body,['question','day','input','output']);
		var question=new Question(body);
		question.save().then(function(ques){
			res.send(ques);
		}).catch(function(err){
			console.log(err);
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
				console.log(getClassName);
				let fileName;
				try{
				 fileName = getClassName(sourcecode);
				}
				catch(error){
					res.status(201).send(error);
					return 0;
				}
				const folderName = "java-"+new Date().getTime()+"-"+admission_no;
				let message=await compile_java({fileName,folderName,sourceCode:sourcecode});
				if(message.exitCode!=0){
					var json={
						error:message.output,
						errorType:"Compile-Time"
					};
					res.status(201).send(json);
					return 0;
				}
				for(var i=0;i<ques.input.length;i++){
					try{
						let message=await run_java({fileName,folderName,input:ques.input[i]});
						if(message.exitCode!=0){
							var json={
								error:message.output,
								errorType:"Run-Time"
							};
							res.status(201).send(json);
							return 0;
						}
						else if(message.output.trim()!=ques.output[i].trim()){
							user.save();
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
				
				const fileName = "c-"+new Date().getTime()+"-"+admission_no;
				let message=await compile_c({fileName,sourceCode:sourcecode});
				if(message.exitCode!=0){
					var json={
						error:message.output,
						errorType:"Compile-Time"
					};
					res.status(201).send(json);
					return 0;
				}
				for(var i=0;i<ques.input.length;i++){
					try{
						let message=await run_c({fileName,input:ques.input[i]});
						if(message.exitCode!=0){
							var json={
								error:message.output,
								errorType:"Run-Time"
							};
							res.status(201).send(json);
							return 0;
						}
						else if(message.output.trim()!=ques.output[i].trim()){
							user.save();
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
				const fileName = "cpp-"+new Date().getTime()+"-"+admission_no;
				let message=await compile_cpp({fileName,sourceCode:sourcecode});
				if(message.exitCode!=0){
					var json={
						error:message.output,
						errorType:"Compile-Time"
					};
					res.status(201).send(json);
					return 0;
				}
				for(var i=0;i<ques.input.length;i++){
					try{
						let message=await run_cpp({fileName,input:ques.input[i]});
						if(message.exitCode!=0){
							var json={
								error:message.output,
								errorType:"Run-Time"
							};
							res.status(201).send(json);
							return 0;
						}
						else if(message.output.trim()!=ques.output[i].trim()){
							user.save();
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
				let fileName="python-"+new Date().getTime()+"-"+admission_no;
				for(var i=0;i<ques.input.length;i++){
					try{
						let message=await run_python({fileName,input:ques.input[i],sourceCode:sourcecode});
						if(message.exitCode!=0){
							var json={
								error:message.output,
								errorType:"Run-Time"
							};
							res.status(201).send(json);
							return 0;
						}
						else if(message.output.trim()!=ques.output[i].trim()){
							user.save();
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
