const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var QuestionSchema = new Schema({
	question :{
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	day:Number,
	input:[String],
	output:[String]
});
module.exports= mongoose.model('Question',QuestionSchema);

