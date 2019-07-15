import os
import time
import subprocess
import sys
import json


fileName = sys.argv[1]
input_data = sys.argv[2]
folder_path='python_code/';
file_path = folder_path+'/'+fileName+'.py'
input_path = folder_path+'/'+fileName+'_input'
output_path = folder_path+'/'+fileName+'_output'
# os.system("mkdir "+folder_path)
# f=open(file_path,"a")
# f.write(code);
# f.close();

f1=open(input_path,"a")
f1.write(input_data);
f1.close();
with open(input_path, "rb") as data:
	MyOut= subprocess.Popen(
		    [
		        "docker",
		        "run",
		        "-i",
		        "-v",
		        "/Users/apple/ncs/Code_Compiler/python_code:/usr/src/myapp",
		        "-w",
		        "/usr/src/myapp",
		        "python:2",
		        "python",
		        fileName+'.py',
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