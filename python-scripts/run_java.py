import os
import time
import subprocess
import sys
import json

cwd = os.getcwd()
folderName = sys.argv[1]
fileName = sys.argv[2]
folder_path='java_code/'+folderName;
file_path = folder_path+"/"+fileName+'.java'
input_data = sys.argv[3]
input_path = folder_path+"/"+fileName+'_input'
output_path = folder_path+"/"+fileName+'_output'
if input_data!='':
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
			        "openjdk:8",
			        "java",        
		        	"-Xmx1024M",
		        	"-Xms128M",
			        fileName,
			    ],
			    stdin=data,
			    stdout=subprocess.PIPE, 
		        stderr=subprocess.STDOUT
			)
else:
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
		        "openjdk:8",
		        "java",        
	        	"-Xmx1024M",
	        	"-Xms128M",
		        fileName,
		    ],
		    stdout=subprocess.PIPE, 
	        stderr=subprocess.STDOUT
		)
stdout,stderr = MyOut.communicate()
print(stdout)
if stderr==None:
	f2=open(output_path, "wb")
	f2.write(stdout)
	f2.close();
	os.remove(input_path);
	print(json.dumps({"exitCode":MyOut.returncode,"path":output_path}));
else:
	raise Exception(stderr);