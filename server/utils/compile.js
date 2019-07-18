const run_python = require('./python');
const {compile_java,run_java,getClassName} = require('./java');
const {compile_cpp,run_cpp} = require('./cpp');
const {compile_c,run_c} = require('./c');
async function compileJava(sourceCode) {
	try{
	 	let fileName = getClassName(sourceCode);
		const folderName = "java-"+new Date().getTime()+"-"+Math.floor(1000 + Math.random() * 9000);
		let message=await compile_java({fileName,folderName,sourceCode});
		if(message.exitCode!=0){
			var json={
				isError:true,
				error:message.output,
				errorType:"Compile-Time"
			};

			return json;
		}
		else{
			return {
				isError:false,
				fileName,
				folderName
			};
		}
	}
	catch(error){
		throw new Error(error);
	}
}

async function runJava({fileName,folderName,input}){
	try{
		let message=await run_java({fileName,folderName,input});
		if(message.exitCode!=0){
			var json={
				isError:true,
				error:message.output,
				errorType:"Run-Time"
			};
			return json;
		}
		else{
			var json = {
				isError:false,
				output: message.output.trim()
			};
			return json;
		}
	}
	catch(error){
		throw new Error(error);
	}
}

async function compileAndRunJava({sourceCode,input}){
	try{
		let resp=await compileJava(sourceCode);
		if(resp.isError){
			return resp
		}
		let response=await runJava({fileName:resp.fileName,folderName:resp.folderName,input});
		return response;
	}
	catch(error){
		console.log(error);
		throw new Error(error);
	}
}

async function compileC(sourceCode){

	try{
	 	const fileName = "c-"+new Date().getTime()+"-"+Math.floor(1000 + Math.random() * 9000);
		let message=await compile_c({fileName,sourceCode});
		if(message.exitCode!=0){
			var json={
				isError:true,
				error:message.output,
				errorType:"Compile-Time"
			};

			return json;
		}
		else{
			return {
				isError:false,
				fileName
			};
		}
	}
	catch(error){
		throw new Error(error);
	}

}

async function runC({fileName,input}){
	try{
		let message=await run_c({fileName,input});
		if(message.exitCode!=0){
			var json={
				isError:true,
				error:message.output,
				errorType:"Run-Time"
			};
			return json;
		}
		else{
			var json = {
				isError:false,
				output: message.output.trim()
			};
			return json;
		}
	}
	catch(error){
		throw new Error(error);
	}
}

async function compileAndRunC({sourceCode,input}){
	try{
		let resp=await compileC(sourceCode);
		if(resp.isError){
			return resp
		}
		let response=await runC({fileName:resp.fileName,input});
		return response;
	}
	catch(error){
		throw new Error(error);
	}
}


async function compileCpp(sourceCode){

	try{
	 	const fileName = "cpp-"+new Date().getTime()+"-"+Math.floor(1000 + Math.random() * 9000);
		let message=await compile_cpp({fileName,sourceCode});
		if(message.exitCode!=0){
			var json={
				isError:true,
				error:message.output,
				errorType:"Compile-Time"
			};

			return json;
		}
		else{
			return {
				isError:false,
				fileName
			};
		}
	}
	catch(error){
		throw new Error(error);
	}

}

async function runCpp({fileName,input}){
	try{
		let message=await run_cpp({fileName,input});
		if(message.exitCode!=0){
			var json={
				isError:true,
				error:message.output,
				errorType:"Run-Time"
			};
			return json;
		}
		else{
			var json = {
				isError:false,
				output: message.output.trim()
			};
			return json;
		}
	}
	catch(error){
		throw new Error(error);
	}
}

async function compileAndRunCpp({sourceCode,input}){
	try{
		let resp=await compileCpp(sourceCode);
		if(resp.isError){
			return resp
		}
		let response=await runCpp({fileName:resp.fileName,input});
		return response;
	}
	catch(error){
		throw new Error(error);
	}
}

async function runPython({sourceCode,input}){
	try{
		let fileName="python-"+new Date().getTime()+"-"+Math.floor(1000 + Math.random() * 9000);
		let message=await run_python({fileName,input,sourceCode});
		if(message.exitCode!=0){
			var json={
				isError:true,
				error:message.output,
				errorType:"Run-Time"
			};
			return json;
		}
		else{
			var json = {
				isError:false,
				output: message.output.trim()
			};
			return json;
		}
	}
	catch(error){
		throw new Error(error);
	}
}

async function compileAndRunSource(sourceCode,input,lang){
	const map={
		"java":compileAndRunJava,
		"cpp":compileAndRunCpp,
		"c":compileAndRunC,
		"python":runPython,
	}
	return await map[lang]({sourceCode,input});
}

module.exports={compileAndRunSource,compileJava,runJava,compileC,runC,compileCpp,runCpp, runPython};

