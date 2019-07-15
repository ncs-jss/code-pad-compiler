import os
import time
import subprocess
import sys
import json

fileName = sys.argv[1]
folder_path='cpp_code';
file_path = folder_path+"/"+fileName+'.cpp'
output_path = folder_path+"/"+fileName+'_output'

MyOut= subprocess.Popen(
	    [
	        "docker",
	        "run",
	        "-i",
	        "-v",
	        "/Users/apple/ncs/Code_Compiler/"+folder_path+":/usr/src/myapp",
	        "-w",
	        "/usr/src/myapp",
	        "gcc",
	        "g++",
	        "-o",
	        fileName,
	        fileName+".cpp",
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