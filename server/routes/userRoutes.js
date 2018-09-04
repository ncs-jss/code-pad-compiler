const Question= require('../.././app/models/question');
const User= require('../.././app/models/user');
const express=require('express');
const router=express.Router();

router.route('/leaderboard')
	.get(async function(req,res){
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

module.exports=router;