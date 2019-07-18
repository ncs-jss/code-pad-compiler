const {PythonShell} = require('python-shell');
const fs = require('fs');
const path = require("path");

function run_python({fileName,input,sourceCode,timeout=5000}) {
	return new Promise((resolve,reject)=>{
		let args=[fileName,input];
		if(!fs.existsSync(path.resolve(__dirname, '../../python_code/'+fileName+".py"))){
			fs.writeFileSync(path.resolve(__dirname, '../../python_code/'+fileName+".py"),sourceCode);
		}
		try {
			const pyshell = new PythonShell('python-scripts/run_python.py', {
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

// run_python({fileName:'python-1563171061627-16it028',input:"5\n5"}).then(message=>{
// 	console.log(message)
// }).catch(console.log)

module.exports=run_python;
