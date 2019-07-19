const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

function compile(folderName,fileName,timeout=60000){

	let folder_path='java_code/'+folderName;
	let file_path = folder_path+"/"+fileName+'.java'
	const cmd = `docker run -i --memory=256m --memory-swap=256m -v  "$PWD"/${folder_path}/:/usr/src/myapp -w /usr/src/myapp openjdk:8 javac ${fileName}.java`;

	const result = shell.exec(cmd,{timeout});
	const jsonResp = {};
	jsonResp.exitCode=result.code;
	if(result.code!=0){
		if(result.stderr===''){
			result.stderr='Time Limit Exceeded';
		}
		jsonResp.output=result.stderr;
		return jsonResp;
	}
	jsonResp.output=result.stdout;
	return jsonResp;

}

function run(folderName,fileName,input,timeout=10000){
	let folder_path='java_code/'+folderName;
	let file_path = folder_path+"/"+fileName+'.java'
	let input_path = folder_path+"/"+fileName+'_input.txt'
	fs.writeFileSync(path.resolve(__dirname, `../../${input_path}`),input);
	const cmd = `docker run -i --memory=256m --memory-swap=256m -v  "$PWD"/${folder_path}/:/usr/src/myapp -w /usr/src/myapp openjdk:8 java -Xmx1024M -Xms128M ${fileName} < "$PWD"/${input_path}`;
	const result = shell.exec(cmd,{timeout});
	const jsonResp = {};
	jsonResp.exitCode=result.code;
	if(result.code!=0){
		if(result.stderr===''){
			result.stderr='Time Limit Exceeded';
		}
		jsonResp.output=result.stderr;
		return jsonResp;
	}
	jsonResp.output=result.stdout;
	return jsonResp;

}

module.exports={compile,run};