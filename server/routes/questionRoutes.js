const Question= require('../.././app/models/question');
const User= require('../.././app/models/user');
const express=require('express');
const _=require('lodash');
const jwt=require('jsonwebtoken');
const {c, cpp, node, python, java} = require('compile-run');
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
		console.log(req.body);
		var sourcecode=req.body.code;
		var lang=req.body.lang;
		var admission_no=req.body.admission_no.toUpperCase();
		var name=req.body.name;
		var ques_id=req.body.ques_id;
		var user=await User.findOne({admission_no});
		if(!user){
			user=new User({admission_no,name});
		}
		var ques=await Question.findById(ques_id);
		if(ques){
			if(lang==='java'){
				for(var i=0;i<ques.input.length;i++){
					try{
						var result=await java.runSource(sourcecode,{stdin:ques.input[i],timeout:2000});
						console.log(result);
						if(result.exitCode!=0){
							res.status(201).send(_.pick(result,['error','errorType']));
							return 0;
						}
						else if(result.stdout.trim()!=ques.output[i]){
							user=await user.save();
							res.send({status:'success',message:'wrong'});
							return 0;
						}	
					}
					catch(error){
						console.log(error);
						res.status(400).send(err);
					}
				}
				if(user.questions_solved.indexOf(ques_id)<0)
					user.questions_solved.push(ques_id);

				user=await user.save();
				res.send({status:'success',message:'correct'});
			}
			else if(lang==='c'){
				for(var i=0;i<ques.input.length;i++){
					try{
						var result=await c.runSource(sourcecode,{stdin:ques.input[i],timeout:2000});
						console.log(result);
						if(result.exitCode!=0){
							res.status(201).send(_.pick(result,['error','errorType']));
							return 0;
						}
						else if(result.stdout.trim()!=ques.output[i]){
							user=await user.save();
							res.send({status:'success',message:'wrong'});
							return 0;
						}	
					}
					catch(error){
						console.log(error);
						res.status(400).send();
					}
				}
				if(user.questions_solved.indexOf(ques_id)<0)
					user.questions_solved.push(ques_id);
				user=await user.save();
				res.send({status:'success',message:'correct'});
			}
			else if(lang==='cpp'){
				for(var i=0;i<ques.input.length;i++){
					try{
						var result=await cpp.runSource(sourcecode,{stdin:ques.input[i],timeout:2000});
						console.log(result);
						if(result.exitCode!=0){
							res.status(201).send(_.pick(result,['error','errorType']));
							return 0;
						}
						else if(result.stdout.trim()!=ques.output[i]){
							user=await user.save();
							res.send({status:'success',message:'wrong'});
							return 0;
						}	
					}
					catch(error){
						console.log(error);
						res.status(400).send();
					}
				}
				if(user.questions_solved.indexOf(ques_id)<0)
					user.questions_solved.push(ques_id);

				user=await user.save();
				res.send({status:'success',message:'correct'});
			}
			else if(lang==='python'){
				for(var i=0;i<ques.input.length;i++){
					try{
						var result=await python.runSource(sourcecode,{stdin:ques.input[i],timeout:2000});
						console.log(result.stdout.trim());
						if(result.exitCode!=0){
							res.status(201).send(_.pick(result,['error','errorType']));
							return 0;
						}
						else if(result.stdout.trim()!=ques.output[i]){
							user=await user.save();
							res.send({status:'success',message:'wrong'});
							return 0;
						}	
					}
					catch(error){
						console.log(error)
						res.status(400).send();
					}
				}
				if(user.questions_solved.indexOf(ques_id)<0)
					user.questions_solved.push(ques_id);

				user=await user.save();
				res.send({status:'success',message:'correct'});			
			}
		}
		else{
			res.status(404).send({message:'Question Not found'});
		}
	});
module.exports=router;