var Movie=require('../models/movie.js');
var User=require('../models/user.js');
console.log(User+'111');
var _=require('underscore');
module.exports=function(app){
// index
app.get('/',function(req,res){
  console.log('user in session:');
  console.log(req.session.user)
  Movie.fetch(function(err,movies){
    if(err){
      console.log(err)
    }
    res.render('index',{
      title:'首页',
      movies:movies
  })
  })
})
// signup
app.post('/user/signup',function(req,res){ 
  var _user=req.body.user;
  User.findOne({name:_user.name},function(err,user){
    if(err){
      console.log(err)
    }
    if(user){
      return res.redirect('/')
    }
    else{
            var user=new User(_user);
            user.save(function(err,user){
              if(err){
                console.log(err)
              }
              res.redirect('/admin/userlist');
              })        
          }
  })
})
//signin
app.post('/user/signin',function(req,res){
  var _user=req.body.user;
  var name=_user.name;
  var password=_user.password;
    console.log(password+'_user');
  User.findOne({name:name},function(err,user){
if(err){
  console.log(err)
}
if(!user){
  redirect('/');
}
user.comparePassword(password,function(err,isMatch){
  if(err){
    console.log(err)
  }

  if(isMatch){
    req.session.user=user;
    console.log('password is matched')
    return res.redirect('/');
  }
  else{
    console.log('password is not matched')
  }
})
  })
})
//logout
app.get('/logout',function(req,res){
  delete req.session.user;
  delete app.locals.user;
  res.redirect('/')
})
// userList
app.get('/admin/userlist',function(req,res){
    User.fetch(function(err,users){
    if(err){
      console.log(err)
    }

    res.render('userlist',{
      title:'用户列表页',
      users:users
    })
  })
})
// detail
app.get('/movie/:id',function(req,res){
  var id=req.params.id;
  Movie.findById(id,function(err,movie){
    res.render('detail',{
    title:movie.title,
    movie:movie
  })
  })
})



// admin 录入页的id随机生成
app.get('/admin/movie',function(req,res){
  res.render('admin',{
    title:'后台录入页',
    movie:{
      title:'',
      doctor:'',
      country:'',
      year:'',
      poster:'',
      flash:'',
      summary:'',
      language:''
    }
  })
})
//admin update movie
app.get('/admin/update/:id',function(req,res){
  var id=req.params.id;

  if(id){
    Movie.findById(id,function(err,movie){
      res.render('admin',{
        title:'更新页',
        movie:movie
      })
    })
  }
})
// admin post movie 拿到从后台录入页post的数据
app.post('/admin/movie/new',function(req,res){
  var id=req.body.movie._id;
  var movieObj=req.body.movie;
  var _movie;
  if(id!=='undefined'){
    Movie.findById(id,function(err,movie){
      if(err){
        console.log(err)
      }


      _movie=_.extend(movie,movieObj);/*拷贝*/
      _movie.save(function(err,movie){
        if(err){
          console.log(err)
        }
        res.redirect('/movie/'+ movie._id)
      })
    })
  }
  else{
    _movie=new Movie({
      doctor:movieObj.doctor,
      title:movieObj.title,
      country:movieObj.country,
      language:movieObj.language,
      year:movieObj.year,
      poster:movieObj.poster,
      summary:movieObj.summary,
      flash:movieObj.flash
    })
    _movie.save(function(err,movie){
        if(err){
          console.log(err)
        }
        res.redirect('/movie/'+movie._id)
    })
  }
})


// list
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
    if(err){
      console.log(err)
    }

    res.render('list',{
      title:'列表页',
      movies:movies
    })
  })
})
//list delete movie
app.delete('/admin/list',function(req,res){
  var id=req.query.id;
  if(id){
    Movie.remove({_id:id},function(err){
      if(err){
        consoel.log(err)
      }
      else{
        res.json({success:1})
      }
    })
  }
})
}