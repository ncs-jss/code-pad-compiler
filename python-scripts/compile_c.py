import os
import time
import subprocess
import sys
import json

cwd = os.getcwd()
fileName = sys.argv[1]
folder_path='c_code';
file_path = folder_path+"/"+fileName+'.c'
output_path = folder_path+"/"+fileName+'_output'

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
	        "gcc",
	        "-std=gnu99",
	        "-w",
	        "-O2",
	        "-fomit-frame-pointer",
	        "-lm",
	        "-o",
	        fileName,
	        fileName+".c",
	    ],
	    stdout=subprocess.PIPE, 
        stderr=subprocess.STDOUT
	)
stdout,stderr = MyOut.communicate()
if stderr==None:
	f2=open(output_path, "wb")
	f2.write(stdout)
	f2.close();
	print(json.dumps({"exitCode":MyOut.returncode,"path":output_path}));
else:
	raise Exception(stderr);