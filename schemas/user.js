var mongoose=require('mongoose');
var bcrypt=require('bcrypt');/*加密工具*/
var SALT_WORK_FACTOR=10;
var UserSchema=new mongoose.Schema({
  name:{
    unique:true,
    type:String
  },
  password:{
    unique:true,
    type:String
  },
  meta:{
    createAt:{
      type:Date,
      default:Date.now()
    },
    updateAt:{
      type:Date,
      default:Date.now()
    }
  }
})
/*数据库每次存储之前的操作*/
UserSchema.pre('save',function (next) {
  var user=this;
  if(this.isNew){
    this.meta.create=this.meta.updateAt=Date.now()
  }else{
    this.meta.updateAt=Date.now();
  }
  // 生成随机盐
  bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
    if(err) return next(err)
      // 拿到盐进行加工
      bcrypt.hash(user.password,salt,function(err,hash){
        if(err) return next(err)
          // 加盐后的密码
          user.password=hash;
          console.log(user.password);
          next();
    })
  });
  //next();/*没有不执行*/
})
/*添加实例方法*/
UserSchema.methods={
  comparePassword:function(_password,cb){
   bcrypt.compare(_password,this.password,function(err,isMatch){
    if(err){
     return cb(err)
    }
    cb(null,isMatch)
   }) 
  }
}
// 通过statics添加自定义扩展方法
UserSchema.statics={
  // 批量查询
  fetch:function(cb){
    return this
         .find({})
         .sort('meta.updateAt')
         .exec(cb)
  },
  // 指定ID查询
  findById:function(id, cb){
    return this
           .findOne({_id: id})
           .exec(cb)
  }
}

/*导出*/
module.exports=UserSchema