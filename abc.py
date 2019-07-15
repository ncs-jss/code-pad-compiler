import os
import time
import subprocess
import sys

print(sys.argv)
ts = time.time()
ts = int(ts)
os.system('mkdir python_code/'+str(ts))
f=open('python_code/'+str(ts)+'/'+str(ts)+'.py',"a")
f.write("g = raw_input() \nprint g \ng = raw_input() \nprint g ");
f.close();

f1=open('python_code/'+str(ts)+'/'+str(ts)+'_input',"a")
f1.write("5\n5");
f1.close();

# f1=open('python_code/'+str(ts)+'/'+str(ts)+'_output',"a")
# f1.write("5\n5\n");
# f1.close();
docker='docker run -i -v  /Users/apple/ncs/Code_Compiler/python_code/1562927594:/usr/src/myapp -w /usr/src/myapp python:2 python 1562927594.py < 1562927594_input'
# docker='docker run -i -v  /Users/apple/ncs/Code_Compiler/python_code/'+str(ts)+':/usr/src -w /usr/src python:2 python '+str(ts)+'.py < '+str(ts)+'_input'
# os.system(docker);	

# myCmd = os.popen(docker).read()
# print(myCmd)


with open('python_code/'+str(ts)+'/'+str(ts)+'_input', "rb") as data:
	MyOut= subprocess.Popen(
		    [
		        "docker",
		        "run",
		        "-i",
		        "-v",
		        "/Users/apple/ncs/Code_Compiler/python_code/"+str(ts)+":/usr/src/myapp",
		        "-w",
		        "/usr/src/myapp",
		        "python:2",
		        "python",
		        str(ts)+'.py',
		    ],
		    stdin=data,
		    stdout=subprocess.PIPE, 
            stderr=subprocess.STDOUT
    	)
stdout,stderr = MyOut.communicate()
print(stdout)
f2=open('python_code/'+str(ts)+'/'+str(ts)+'_output', "wb")
f2.write(stdout)
f2.close();
f2=open('python_code/'+str(ts)+'/'+str(ts)+'_output', "rb")
print(f2.read())