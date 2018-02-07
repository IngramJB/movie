module.exports=function (grunt) {
  grunt.initConfig({
    watch:{
      jade:{
      files:['views/**'],
      options:{
        livereload:true/*重新启动*/
      }
    },
      js:{
        files:['public/js/**','models/**/*.js','schemas/**/*.js'],
        // tasks:['jsinit'],
        options:{
          livereload:true
        }
      }
  },
    
    nodemon:{
      dev:{
        options:{
          file:'app.js',
          args:[],
          ignoredFiles:['README.md','node_modules/**','.DS_Store'],
          watchedExtensions:['js'],
          watchedFloders:['./'],
          debug:true,
          delayTime:1,
          env:{
            PORT:3000
          },
          cwd:__dirname
        }
      }
    },
    concurrent:{
      tasks:['nodemon','watch'],
      options:{
        logConcurrentOutput:true
      }
    }
  })
  grunt.loadNpmTasks('grunt-contrib-watch')/*监听文件变化，重新执行任务*/
  grunt.loadNpmTasks('grunt-contrib-nodemon')/*实时监听app.js,重启app.js*/
  grunt.loadNpmTasks('grunt-concurrent')/*优化慢任务的构建时间，同时跑多个任务*/
  grunt.option('force',true)/*防止中断服务*/
  grunt.registerTask('default',['concurrent'])/*注册默认任务*/
}