const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	name :{
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	admission_no :{
		type: String,
		required: true,
		minlength: 7,
		unique: true
	},
	question_solved:[Schema.ObjectId]
});


UserSchema.methods.toJSON=function(){
	var user=this;
	var  userObject= user.toObject();

	return _.pick(userObject,['_id','name','phone','email','likedPosts','sharedPosts','follow','followers']); 
}

UserSchema.statics.findByCredentials=function(phone,password){
var User=this;
return User.findOne({phone}).then(function(user){
	if(!user){
		return Promise.reject();
	}
	return new Promise(function(resolve,reject){
		bcrypt.compare(password,user.password,function(err,res){
			if(res){
				resolve(user);
			}
			else{
				reject();
			}
		});
	});
});
};

UserSchema.pre('save',function(next){
var user = this;
if(user.isModified('password'))
{
	bcrypt.genSalt(10,function(err,salt){
		bcrypt.hash(user.password,salt,function(err,hash){
			user.password=hash;
			next();
		});
	});
}
else
{
	next();
}
});


UserSchema.statics.findByToken = function(token){
	var User =this;
	var decoded;

	try{

		decoded= jwt.verify(token,'abcd');

	}catch(e){

		return new Promise(function(resolve,reject){
			reject();
		});

	}
	return User.findOne({
		_id : decoded._id,
		'tokens.token' : token,
		'tokens.access' : 'auth'
	});
};

module.exports= mongoose.model('User',UserSchema);

