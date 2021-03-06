const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

function compile(fileName,timeout=60000){

	let folder_path='cpp_code';
	let file_path = folder_path+"/"+fileName+'.cpp'
	const cmd = `sudo docker run -i --memory=256m --memory-swap=256m -v  "$PWD"/${folder_path}/:/usr/src/myapp -w /usr/src/myapp gcc g++ -std=c++0x -w -O2 -fomit-frame-pointer -lm -o ${fileName} ${fileName}.cpp`;

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

function run(fileName,input,timeout=10000){
	let folder_path='cpp_code';
	let file_path = folder_path+"/"+fileName+'.cpp'
	let input_path = folder_path+"/"+fileName+'_input.txt'
	fs.writeFileSync(path.resolve(__dirname, `../../${input_path}`),input);
	const cmd = `sudo docker run -i --memory=256m --memory-swap=256m -v  "$PWD"/${folder_path}/:/usr/src/myapp -w /usr/src/myapp gcc ./${fileName} < "$PWD"/${input_path}`;
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