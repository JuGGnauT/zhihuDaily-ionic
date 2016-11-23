angular.module('starter.controllers', ['ionic'])
  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http, DailyServices, $ionicSideMenuDelegate) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
    DailyServices.getThemes(function (response) {
      console.log(response);
      $scope.themes = [];
      for (var i = 0, j = response.data.others; i < j.length; i++) {
        $scope.themes.push({
          thumbnail: DailyServices.replaceSrc(j[i].thumbnail),
          name: j[i].name,
          id: j[i].id
        });
      }
    })
  })
  .controller('aboutCtrl', function ($scope, $ionicSideMenuDelegate) {
    $scope.title = '李上冰';
    $ionicSideMenuDelegate.toggleLeft(false);

  })
  .controller('themesCtrl', function ($scope, $timeout, $ionicLoading, $http, $stateParams, DailyServices) {

    DailyServices.getTheme($stateParams.id, function (response) {
      console.log(response);
      $scope.theme = [];
      $scope.themeStories = [];
      var editors = [];
        for (var i = 0, j = response.data.editors; i < j.length; i++) {
          editors.push({
            url: j[i].url,
            id: j[i].id,
            avatar: DailyServices.replaceSrc(j[i].avatar),
            name: j[i].name
          });
        }
        $scope.theme.push({
          name: response.data.name,
          background: DailyServices.replaceSrc(response.data.background),
          desc: response.data.description,
          editors: editors
        });
        for (var i = 0, j = response.data.stories; i < j.length; i++) {
          if(j[i].images){
            var img=DailyServices.replaceSrc(j[i].images[0]);
            var className='item-thumbnail-right';
          }else{
            var img="";
            var className="";
          }
          $scope.themeStories.push({
            id: j[i].id,
            title: j[i].title,
            type: j[i].type,
            images:img,
            className:className
          });
        }
    })
  })
  .controller('detailCtrl', function ($scope,$window,$timeout,$ionicScrollDelegate, $stateParams, $http, $ionicLoading, DailyServices, $ionicHistory, $ionicNavBarDelegate) {
    var screenHeight=$window.screen.availHeight-44;
    $scope.$on('$ionicView.beforeEnter', function () {
      console.log('beforeEnter');
    });
    $scope.$on('$ionicView.afterEnter', function () {
      console.log('afterEnter');
      $ionicLoading.show({
        duration: 8000,
        noBackdrop: true,
      });
    }, false);
    $scope.prev=function(){
      $ionicHistory.goBack(-1);
    }
    $scope.backTop=function(){
      $ionicScrollDelegate.scrollTop(false);
    }
    $scope.nextScreen=function(){
      var prevTop=$ionicScrollDelegate.$getByHandle('detailContent').getScrollPosition().top;
      $ionicScrollDelegate.$getByHandle('detailContent').scrollTo(0,prevTop+screenHeight,true);
    }

    var id = $stateParams.id;
    $scope.title = $stateParams.title;
    DailyServices.getDetail(id, function (response) {
      console.log(response);
      var topImg = "";
      /*DailyServices.getCSS(response.data.css[0]);
      console.log(response.data.css[0]);*/
      $timeout(function () {
        if (response.data.image) {
          topImg = DailyServices.replaceSrc(response.data.image);
        }else if(response.data.images){
          topImg = DailyServices.replaceSrc(response.data.images[0]);
        }
        if (response.data.body) {
          $scope.Body = response.data.body.replace(/src="http[s]*:\/\//g, 'src="//images.weserv.nl/?url=')
            .replace(/<div class="img-place-holder"><\/div>/, '<div class="img-wrap"><img src="' + topImg + '"><h1>' + response.data.title + '</h1><\/div>');
          /*$scope.Body=response.data.body.replace().replace(/<div class="img-place-holder"><\/div>/, '<div class="img-wrap"><img src="' + topImg + '"><h1>' + response.data.title + '</h1><\/div>');*/
        }
        $ionicLoading.hide();
      }, 500)
    })
  })

  .controller('hotCtrl', function ($scope, $stateParams, $http, DailyServices) {
    $scope.sildeDatas = [];
    $scope.allDatas = [];
    var isLock = false;
    var page = 0;
    var isRerf=false;
    $scope.loadMore = function () {
      if (isLock) {
        return;
      }
      isLock = true;
      if (page) {
        var today = $scope.allDatas[$scope.allDatas.length - 1].date;
        var url = 'http://news.at.zhihu.com/api/4/news/before/' + today;
      } else {
        var url = 'http://news-at.zhihu.com/api/4/news/latest';
      }
      $http.get(url).success(function (response) {
        var acceptDatas = [];
        var stories = response.stories;
        console.log(response);
        if (!page) {
          var DatasCopy=[];
          for (var i = 0, j = response.top_stories; i < j.length; i++) {
            DatasCopy.push({
              image: DailyServices.replaceSrc(j[i].image),
              type: j[i].type,
              id: j[i].id,
              title: j[i].title,
              ga_prefix: j[i].ga_prefix
            });
          }
          page = 1;
          $scope.sildeDatas=DatasCopy;
        }
        for (var i = 0, j = response.stories; i < j.length; i++) {
          acceptDatas.push({
            images: DailyServices.replaceSrc(j[i].images[0]),
            type: j[i].type,
            id: j[i].id,
            title: j[i].title,
            ga_prefix: j[i].ga_prefix
          });
        }
        if(isRerf){
          $scope.allDatas=[{
            date: response.date,
            formatDate: DailyServices.formatDate(response.date),
            stories: acceptDatas
          }];
          isRerf=false;
        }else{
          $scope.allDatas.push({
            date: response.date,
            formatDate: DailyServices.formatDate(response.date),
            stories: acceptDatas
          });
        }
        $scope.allDatas[0].formatDate = '今日热文';
        $scope.$broadcast('scroll.infiniteScrollComplete');
        isLock = false;
      })
    };
    $scope.loadMore();
    $scope.doRefresh = function () {
      isRerf=true;
      page = 0;
      $scope.loadMore();
      // 停止广播ion-refresher
      $scope.$broadcast('scroll.refreshComplete');
    }
  });

