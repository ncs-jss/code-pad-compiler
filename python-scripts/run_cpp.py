import os
import time
import subprocess
import sys
import json

cwd = os.getcwd()
fileName = sys.argv[1]
folder_path='cpp_code';
file_path = folder_path+"/"+fileName+'.cpp'
input_data = sys.argv[2]
input_path = folder_path+"/"+fileName+'_input'
output_path = folder_path+"/"+fileName+'_output'

f1=open(input_path,"a")
f1.write(input_data);
f1.close();
with open(input_path, "rb") as data:
	MyOut= subprocess.Popen(
		    [
		        "docker",
		        "run",
		        "-i",
		        '--memory=256m',
	        	'--memory-swap=256m',
	        	"-v",
		        cwd+"/"+folder_path+":/usr/src/myapp",
		        "-w",
		        "/usr/src/myapp",
		        "gcc",
		        "./"+fileName,
		    ],
		    stdin=data,
		    stdout=subprocess.PIPE, 
	        stderr=subprocess.STDOUT
		)
stdout,stderr = MyOut.communicate()
if stderr==None:
	f2=open(output_path, "wb")
	f2.write(stdout)
	f2.close();
	os.remove(input_path);
	print(json.dumps({"exitCode":MyOut.returncode,"path":output_path}));
else:
	raise Exception(stderr);