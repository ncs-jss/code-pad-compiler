const {PythonShell} = require('python-shell');
const fs = require('fs');
const path = require("path");
const {compile,run} = require('../js-scripts/cpp')
function compile_cpp({fileName,sourceCode,timeout=60000}) {
	return new Promise((resolve,reject)=>{
		let args=[fileName];
		if(!fs.existsSync(path.resolve(__dirname, '../../cpp_code/'+fileName+".cpp"))){
			fs.writeFileSync(path.resolve(__dirname, '../../cpp_code/'+fileName+".cpp"),sourceCode);
		}
		try {
			let resp =compile(fileName);
			resolve(resp);
			
		} catch (error) {
				console.trace(error);
				reject(error);
		}
	})
}

function run_cpp({fileName,input,timeout=3000}) {
	return new Promise((resolve,reject)=>{
		let args=[fileName,input];
		try {
			let resp =run(fileName,input);
			resolve(resp);
			
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
compile_cpp,
run_cpp,
};
