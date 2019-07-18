const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();

const questionController = require('../controllers/questionController');
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
