angular.module('starter.services', [])
  .factory('DailyFact', function () {
    return {
      num: ['日', '一', '二', '三', '四', '五', '六']
    }
  })
  .service('DailyServices', function ($http, DailyFact) {
    this.replaceSrc = function (str) {
      return str.replace(/http[s]*:\/\//,'//images.weserv.nl/?url=');
      /*return str;//phone*/
    }
    this.formatDate = function (str) {
      var arr = str.split('');
      arr.splice(4, 0, '/');
      arr.splice(7, 0, '/');
      var date = new Date(arr.join(''));
      return date.getMonth() + '月 ' + date.getDate() + '日 ' + '星期' + DailyFact.num[date.getDay()];
    }
    this.getThemes = function (callback) {
      $http.get("http://news-at.zhihu.com/api/4/themes").then(function (response) {
        callback(response)
      }, function (err) {
        console.log('error');
      })
    }
    this.getTheme = function (id, callback) {
      $http.get('http://news-at.zhihu.com/api/4/theme/' + id).then(function (response) {
        callback(response)
      }, function (err) {
        console.log('error');
      })
    }
    this.getDetail = function (id, callback) {
      $http.get('http://news-at.zhihu.com/api/4/news/' + id).then(function (response) {
        callback(response)
      }, function (err) {
        console.log('error');
      })
    }
    this.getList = function (url, callback) {
      $http.get(url).then(function (response) {
        callback(response)
      }, function (err) {
        console.log('error');
      })
    }
    /*this.getCSS= function(url){
      $http.get(url).then(function(response){

        document.getElementsByTagName('style')[1].innerHTML=response.data;
      },function(err){
        console.log('error');
      })
    }
    this.rmCSS=function(){
      document.getElementsByTagName('style')[1].innerHTML='';
    }*/
  });
