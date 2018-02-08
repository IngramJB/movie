var express=require('express');
var port=process.env.PORT||3000;
var path=require('path');
var mongoose=require('mongoose');
var serveStatic=require('serve-static');
var app=express();
var dbUrl='mongodb://localhost/imooc';
mongoose.connect(dbUrl);
app.set('views','./views/pages');/*设置根目录*/
app.set('view engine','jade');/*设置模板引擎*/
//app.use(express.bodyParser());
var bodyParser=require('body-parser');
// cookie中间件
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoStore=require('connect-mongo')(session);
var logger=require('morgan');
app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    store:new mongoStore({
    	url:dbUrl,
    	collection:'sessions'
    })
}));
// 判断环境
if('development'===app.get('env')){
	// 打印错误
	app.set('showStackErrer',true);
	app.use(logger(':method :url :status'));
	// 排版美观
	app.locals.pretty=true;
	mongoose.set('debug',true);
}

app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(serveStatic('public'));
app.locals.moment=require('moment');
app.listen(port);
console.log('imooc started on port'+port);
//预处理
app.use(function(req,res,next){
		var _user=req.session.user;
		if(_user){
			app.locals.user=_user;
		}
		return next();
})
require('./config/router')(app);