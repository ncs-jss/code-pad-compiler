const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();

const questionController = require('../controllers/questionController');
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
		questionController.getQuestionByDay(req,res);
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
		questionController.addQuestion(req,res);
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
		questionController.submit(req,res);
	});
router.route('/run')
/**
 * @api {post} /api/question/run Submit solution
 * @apiGroup Questions
 * @apiParam {String} code Question solution
 * @apiParam {String} lang Language used
 * @apiParam {String} input Custom Input
 * @apiParamExample {json} Input
 *		{
 *			"code":"#include.........",
 *			"lang": "c/cpp/java/python",
 *			"input":"test"
 *		}
 * @apiHeader {String} Authorization Token of admin
 * @apiSuccess {String} status Submission Status
 * @apiSuccess {String} message Solution Status
 * @apiSuccessExample {json} Success
 * 	HTTP/1.1 200 OK
*		{
			"isError":true/false,
*			"output":"output",
*		}
* @apiErrorExample {json} Find error
* 	HTTP/1.1 201 ERROR
*		{
*			"error":"nfnfnmlem[mswf",
*			"errorType":"Compile_Time"
*		} 
*/
	.post( async function(req,res){
		questionController.runSource(req,res);
	});
module.exports=router;
