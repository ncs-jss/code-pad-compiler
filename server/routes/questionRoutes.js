const Question= require('../.././app/models/question');
const User= require('../.././app/models/user');
const express=require('express');
const _=require('lodash');
const {c, cpp, node, python, java} = require('compile-run');
const router=express.Router();

router.route('/day/:id')
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
	.post(function(req,res){
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
						var result=await java.runSource(sourcecode,{stdin:ques.input[i]});
						console.log(result);
						if(result.exitCode!=0||result.stdout.trim()!=ques.output[i]){
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
			else if(lang==='c'){
				for(var i=0;i<ques.input.length;i++){
					try{
						var result=await c.runSource(sourcecode,{stdin:ques.input[i]});
						console.log(result);
						if(result.exitCode!=0||result.stdout.trim()!=ques.output[i]){
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
						var result=await cpp.runSource(sourcecode,{stdin:ques.input[i]});
						console.log(result);
						if(result.exitCode!=0||result.stdout.trim()!=ques.output[i]){
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
						var result=await python.runSource(sourcecode,{stdin:ques.input[i]});
						console.log(result.stdout.trim());
						if(result.exitCode!=0||result.stdout.trim()!=ques.output[i]){
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