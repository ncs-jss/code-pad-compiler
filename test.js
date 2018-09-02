const {c, cpp, node, python, java} = require('compile-run');
var fs = require("fs");
var stream;
stream = fs.createWriteStream("abc.java");
var sourcecode = `public class abc{
	public static void main(String argss[]){
		System.out.println("Hello\nWorld");
	}
}`;

// stream = fs.createReadStream("abc.java");
// stream.on("data", function(data) {
//     var chunk = data.toString();
//     console.log(chunk);
// }); 
sourcecode=sourcecode.replace(/\\/g,'\\n')
console.log(sourcecode);
stream.write(sourcecode);
let resultPromise = java.runFile("abc.java");
resultPromise
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });