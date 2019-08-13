const {PythonShell} = require('python-shell');
const fs = require('fs');
const path = require("path");
const {compile,run} = require('../js-scripts/java')

function compile_java({fileName,folderName,sourceCode,timeout=600000}) {
	return new Promise((resolve,reject)=>{
		let args=[folderName,fileName];
		if(!fs.existsSync(path.resolve(__dirname, '../../java_code/'+folderName))){
			fs.mkdirSync(path.resolve(__dirname, '../../java_code/'+folderName))
			fs.writeFileSync(path.resolve(__dirname, '../../java_code/'+folderName+'/'+fileName+".java"),sourceCode);
		}
		try {
			let resp =compile(folderName,fileName);
			resolve(resp);
			
		} catch (error) {
				console.trace(error);
				reject(error);
		}
	})
}

function run_java({fileName,folderName,input,timeout=3000}) {
	return new Promise((resolve,reject)=>{
		let args=[folderName,fileName,input];
		try {
			let resp=run(folderName,fileName,input);
			resolve(resp);
		} catch (error) {
				console.trace(error);
				reject(error);
		}
	})
}

function getClassName(code){
	var re = /class\s([A-Za-z0-9]+)\s*{/gm;
    var res = re.exec(code);
    console.log(res);
    if (res) {
        return res[1];
    }
    else {
        throw {
            error: 'Invalid Class Name',
            errorType: 'pre-compile-time'
        };
    }
}
module.exports={
	compile_java,
	run_java,
	getClassName,
};
