const {PythonShell} = require('python-shell');
const fs = require('fs');
const path = require("path");
const {compile,run} = require('../js-scripts/python')
function run_python({fileName,input,sourceCode,timeout=5000}) {
	return new Promise((resolve,reject)=>{
		let args=[fileName,input];
		if(!fs.existsSync(path.resolve(__dirname, '../../python_code/'+fileName+".py"))){
			fs.writeFileSync(path.resolve(__dirname, '../../python_code/'+fileName+".py"),sourceCode);
		}
		try {
			let resp =run(fileName,input);
			resolve(resp);
		} catch (error) {
				console.trace(error);
				reject(error);
		}
	})
}

// run_python({fileName:'python-1563171061627-16it028',input:"5\n5"}).then(message=>{
// 	console.log(message)
// }).catch(console.log)

module.exports=run_python;
