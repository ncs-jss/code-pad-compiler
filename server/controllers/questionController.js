const _=require('lodash');
const utils = require('../utils/compile');


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
module.exports={runSource};