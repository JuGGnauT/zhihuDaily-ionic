angular.module('starter.services', [])
  .service('DailyServices', function($http) {
    this.replaceSrc=function(str){
      return str.replace(/http[s]*:\/\//,'//images.weserv.nl/?url=');
    }
    this.getThemes=function(callback){
      $http.get("http://news-at.zhihu.com/api/4/themes").then(function (response) {
        callback(response)
      },function(err){
        console.log('error');
      })
    }
    this.getTheme=function(id,callback){
      $http.get('http://news-at.zhihu.com/api/4/theme/'+id).then(function (response) {
        callback(response)
      },function(err){
        console.log('error');
      })
    }
    this.getDetail=function(id,callback){
      $http.get('http://news-at.zhihu.com/api/4/news/'+id).then(function (response) {
        callback(response)
      },function(err){
        console.log('error');
      })
    }
    this.getList=function(url,callback){
      $http.get(url).then(function (response) {
        callback(response)
      },function(err){
        console.log('error');
      })
    }
  });
