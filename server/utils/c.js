const {PythonShell} = require('python-shell');
const fs = require('fs');
const path = require("path");

function compile_c({fileName,sourceCode}) {
	return new Promise((resolve,reject)=>{
		let args=[fileName];
		if(!fs.existsSync(path.resolve(__dirname, '../../c_code/'+fileName+".c"))){
			fs.writeFileSync(path.resolve(__dirname, '../../c_code/'+fileName+".c"),sourceCode);
		}
		try {
			const pyshell = new PythonShell('python-scripts/compile_c.py', {
				args
			});
			pyshell.on('message', message => {
				// received a message sent from the Python script (a simple "print" statement)
				message=JSON.parse(message)
				let data=fs.readFileSync(path.resolve(__dirname, '../../'+message.path),"utf8");
				message.output=data;
				delete message.path;
				resolve(message);
			});
		} catch (error) {
				console.trace(error);
				reject(error);
		}
	})
}

function run_c({fileName,input,timeout=3000}) {
	return new Promise((resolve,reject)=>{
		let args=[fileName,input];
		try {
			const pyshell = new PythonShell('python-scripts/run_c.py', {
				args
			});
			pyshell.on('message', message => {
				// received a message sent from the Python script (a simple "print" statement)
				message=JSON.parse(message)
				let data=fs.readFileSync(path.resolve(__dirname, '../../'+message.path),"utf8");
				message.output=data;
				delete message.path;
				resolve(message);
			});
			const stTime = setTimeout(function(){
				resolve({exitCode:3,output:'Time Limit Exceeded'});
			},timeout);
		} catch (error) {
				console.trace(error);
				reject(error);
		}
	})
}



// compile_java({fileName:'abc',folderName:'java-158138229-16it028',sourceCode:"public class abc{public static void main(String argss[]){System.out.println(\"Hello World\");}}"}).then(message=>{
// 	console.log(message)
// 	run_java({fileName:'abc',folderName:'java-158138229-16it028',input:"5"}).then(console.log);
// }).catch(console.log)

module.exports={
compile_c,
run_c,
};
