var mongoose=require('mongoose');
/*表结构的定义*/
var MovieSchema=new mongoose.Schema({
  doctor:String,
  title:String,
  language:String,
  country:String,
  summary:String,
  flash:String,
  poster:String,
  year:Number,
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
MovieSchema.pre('save',function (next) {
  console.log(this+"测试this1");
  if(this.isNew){
    this.meta.create=this.meta.updateAt=Date.now()
  }else{
    this.meta.updateAt=Date.now();
  }
  next();/*没有不执行*/
})
// 通过statics添加自定义扩展方法
MovieSchema.statics={
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
module.exports=MovieSchema