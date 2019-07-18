const Question= require('../../app/models/question');
const User= require('../../app/models/user');
const _=require('lodash');
const redis = require('redis');
const utils = require('../utils/compile');
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
function getQuestionByDay(req,res){
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

function runSource(req,res){
	var sourceCode=req.body.code;
	var lang=req.body.lang;
	var input = req.body.input;	
	utils.compileAndRunSource(sourceCode,input,lang).then((resp)=>{
		if(resp.isError){
			return res.status(201).send(resp)
		}
		res.send(resp);
	}).catch(error=>{
		console.log(error)
		res.status(500).send(error);
	})

}

async function submit(req,res){
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
			submitCode(req,res,user,result);
		}
		else{
			var ques=await Question.findById(ques_id);
			submitCode(req,res,user,ques);
		}
	});

}

async function submitCode(req,res,user,ques){
	var sourceCode=req.body.code;
	var lang=req.body.lang;
	var admission_no=req.body.admission_no.toUpperCase();
	var name=req.body.name;
	var ques_id=req.body.ques_id;
	if(typeof ques==='string'){
		ques=JSON.parse(ques);
	}
	if(ques){
		client.set(ques._id,JSON.stringify(ques),redis.print);
		let compileCode = {
			"java":utils.compileJava,
			"c":utils.compileC,
			"cpp":utils.compileCpp,
		}
		let resp={};
		if(lang!='python'){
		 	resp=await compileCode[lang](sourceCode);
			if(resp.isError){
				return res.status(201).send(resp);
			}
		}
		let runCode = {
			"java":utils.runJava,
			"cpp":utils.runCpp,
			"c":utils.runC,
			"python":utils.runPython,
		}
		resp.sourceCode=sourceCode;
		for(var i=0;i<ques.input.length;i++){
			try{
				resp.input=ques.input[i];
				let result=await runCode[lang](resp);
				if(result.isError){
					return res.status(201).send(resp);	
				}
				else if(result.output!=ques.output[i].trim()){
					user.save();
					return res.send({status:'success',message:'wrong'});
				}
			}
			catch(error){
				return res.status(500).send(error);
			}
		}
		if(user.questions_solved.indexOf(ques_id)<0)
			user.questions_solved.push(ques_id);
		try{

			user=await user.save();
			res.send({status:'success',message:'correct'});			
		}
		catch(error){
			return res.status(500).send(error);
		}
	}
	else{
		return res.status(404).send({message:'Question Not found'});
	}
}

module.exports={addQuestion,getQuestionByDay,runSource,submit};