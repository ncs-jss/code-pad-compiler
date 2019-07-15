const Question= require('../.././app/models/question');
const User= require('../.././app/models/user');
const _=require('lodash');
const jwt=require('jsonwebtoken');
const redis = require('redis');
const run_python = require('./python');
const {compile_java,run_java,getClassName} = require('./java');
const {compile_cpp,run_cpp} = require('./cpp');
const {compile_c,run_c} = require('./c');
const client = redis.createClient({host:"127.0.0.1"});


function addQuestion(req,res){
	var body=_.pick(req.body,['question','day','input','output']);
	var question=new Question(body);
	question.save().then(function(ques){
		res.send(ques);
	}).catch(function(err){
		console.log(err);
	});
}
function getQuestionById(req,res){
	var day=req.params.id;
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
}