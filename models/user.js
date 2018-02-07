var mongoose=require('mongoose');
var UserSchema=require('../schemas/user');
/*编译生成模型*/
var User=mongoose.model('User',UserSchema)


module.exports=User