/**
 * Created by ws on 2017/11/24.
 */
angular.module('starter.controllers')
  .service('linkageSelectService', [function () {
    var _this = this;
    //页面中选择器数量 default : 0
    _this.globalId = 0;
    return _this;
  }])

  .directive('linkageSelect', ['$timeout', '$ionicScrollDelegate', 'linkageSelectService', '$ionicModal', function ($timeout, $ionicScrollDelegate, linkageSelectService, $ionicModal) {

    return {
      restrict: 'E',
      templateUrl: 'directives/linkageSelect/page.html',
      scope: {
        options: "=",
        callback: "&"
      },
      link: function (scope) {

        scope.globalId = ++linkageSelectService.globalId;
        scope.showData = '全部 全部 全部';

        scope.$watch('options.list', function (newV) {
          if (newV && scope.options.list.length > 0) {
            scope.levelOneList = scope.options.list;
            init();
          }
        });


        scope.levelTwoList = [];
        scope.levelThreeList = [];


        scope.levelOneTimer = null; //一级滑动定时器
        scope.levelTwoTimer = null; //二级滑动定时器
        scope.levelThreeTimer = null; //三级滑动定时器


        /*-------------------------------------------------------*/
        //打开模型
        scope.openModal = function () {
          if (scope.modal) {
            scope.modal.show();
          } else {
            $ionicModal.fromTemplateUrl(
              'directives/linkageSelect/modal.html',
              {
                scope: scope,
                animation: 'fade-in'
              }).then(function (modal) {
              scope.modal = modal;
              scope.modal.show();
            });
          }
        };

        scope.cancelModal = function () {
          scope.modal.hide();
        };

        //确定
        scope.submitValue = function () {
          scope.showData = scope.levelOneValue.NodeText + ' ' + scope.levelTwoValue.NodeText + ' ' + scope.levelThreeValue.NodeText;
          scope.options.selectedValues = [];
          scope.options.selectedValues.push(scope.levelOneValue);
          scope.options.selectedValues.push(scope.levelTwoValue);
          scope.options.selectedValues.push(scope.levelThreeValue);
          scope.modal.hide();
        };
        /*-------------------------------------------------------*/


        function init() {
          initLevelOne();
          initLevelTwo();
          initLevelThree();
        }


        //初始化一级
        function initLevelOne() {

          insertBlankData(scope.levelOneList);
          scope.levelOneValue = scope.levelOneList[2];
          scope.levelOneValue.selected = true;
          scope.levelOneIndex = 2;

          // console.log(scope.levelOneList);
        }

        //初始化二级
        function initLevelTwo() {
          insertBlankData(scope.levelTwoList);
          // console.log(scope.levelTwoList);
          if (scope.levelOneValue.Children) {
            scope.levelTwoValue = scope.levelOneValue.Children[2];
          } else {
            scope.levelTwoValue = scope.levelTwoList[2];
          }
          scope.levelTwoValue.selected = true;
          scope.levelTwoIndex = 2;
        }

        //初始化三级
        function initLevelThree() {
          insertBlankData(scope.levelThreeList);
          if (scope.levelTwoValue.Children) {
            scope.levelThreeValue = scope.levelTwoValue.Children[2];
          } else {
            scope.levelThreeValue = scope.levelThreeList[2];
          }
          scope.levelThreeValue.selected = true;
          scope.levelThreeIndex = 2;
        }

        var posi;          //实时滚动位置
        var lastTimePosi;  //上一次位置

        //滚动触发事件
        scope.scrollingEvent = function (type) {
          var opEntity = getOperateEntity(type);

          if (scope[opEntity.scrollTimer]) {
            $timeout.cancel(scope[opEntity.scrollTimer]);
          }

          if (posi) {
            lastTimePosi = posi;
          }

          posi = $ionicScrollDelegate.$getByHandle(opEntity.scrollHandler).getScrollPosition();

          var index;
          if(lastTimePosi) {
            if (posi.top > lastTimePosi.top) {
              index = Math.abs(Math.ceil(posi.top / 30));
            } else if (posi.top <= lastTimePosi.top) {
              index = parseInt(posi.top / 30);
            }
          }

          // var index = Math.abs(Math.round(posi.top / 30));
          // console.log(posi, index);
          if (posi.top == index * 30) {
            updateSelect(index + 2, type);
          } else {
            scope[opEntity.scrollTimer] = $timeout(function () {
              posi.top = index * 30;
              updateSelect(index + 2, type);
              scrollToPosi($ionicScrollDelegate.$getByHandle(opEntity.scrollHandler), posi);
            }, 200);
          }
        };


        //点击Event
        scope.selectEvent = function (type, index) {
          var opEntity = getOperateEntity(type);

          if(index < 2 || index >= scope[opEntity.data].length -2){
            return;
          }


            var nowPosi = {};
          nowPosi.top = (index -2) * 30;
          nowPosi.left = 0;
          updateSelect(index, type);
          scrollToPosi($ionicScrollDelegate.$getByHandle(opEntity.scrollHandler), nowPosi);
        };

        //获取滚动条详细数据
        function getOperateEntity(type) {
          var entity = new Object();

          switch (type) {
            case 'levelOne':
              entity.scrollTimer = 'levelOneTimer';
              entity.type = type;
              entity.scrollHandler = 'levelOneScroll_' + scope.globalId;
              entity.data = 'levelOneList';

              break;
            case 'levelTwo':
              entity.scrollTimer = 'levelTwoTimer';
              entity.type = type;
              entity.scrollHandler = 'levelTwoScroll_' + scope.globalId;
              entity.data = 'levelTwoList';
              break;
            case 'levelThree':
              entity.scrollTimer = 'levelThreeTimer';
              entity.type = type;
              entity.scrollHandler = 'levelThreeScroll_' + scope.globalId;
              entity.data = 'levelThreeList';
              break;
          }

          return entity;
        }


        //更新选中的内容
        function updateSelect(index, type) {
          switch (type) {
            case "levelOne":
              //强制
              $timeout(function () {
                scope.levelOneValue.selected = false;
                scope.levelOneList[index].selected = true;
                scope.levelOneIndex = index;
                scope.levelOneValue = scope.levelOneList[index];
              });
              break;
            case "levelTwo":
              //强制
              $timeout(function () {
                scope.levelTwoValue.selected = false;
                scope.levelTwoList[index].selected = true;
                scope.levelTwoIndex = index;
                scope.levelTwoValue = scope.levelTwoList[index];
                // console.log(scope.levelTwoIndex,scope.levelTwoValue);

              });
              break;
            case "levelThree":
              //强制
              $timeout(function () {
                scope.levelThreeValue.selected = false;
                scope.levelThreeList[index].selected = true;
                scope.levelThreeIndex = index;
                scope.levelThreeValue = scope.levelThreeList[index];
                // console.log(scope.levelThreeValue);
              });
              break;

          }
        }


        scope.$watch('levelOneIndex', function (newV, oldV) {
          if (newV != oldV) {
            if (newV != 2) {  //不是选择全部的时候
              scope.levelTwoList = scope.levelOneList[newV].Children;
            } else {
              scope.levelTwoList = [];
            }
            initLevelTwo();
            scope.levelTwoValue.selected = false;
            scope.levelTwoIndex = 2;
            scope.levelTwoValue = scope.levelTwoList[2];
            scope.levelTwoValue.selected = true;
            scrollToPosi($ionicScrollDelegate.$getByHandle('levelTwoScroll_' + scope.globalId), {top:0,left:0});
          }
        });

        scope.$watch('levelTwoIndex', function (newV, oldV) {
          if (newV != oldV) {
            if (newV != 2) { //不是选择全部的时候
              scope.levelThreeList = scope.levelTwoList[newV].Children;
            } else {
              scope.levelThreeList = [];
            }
            initLevelThree();
            scope.levelThreeValue.selected = false;
            scope.levelThreeIndex = 2;
            scope.levelThreeValue = scope.levelThreeList[2];
            scope.levelThreeValue.selected = true;
            scrollToPosi($ionicScrollDelegate.$getByHandle('levelThreeScroll_' + scope.globalId), {top:0,left:0});
          }
        });

        //在数据列表前后插入俩个空数据
        function insertBlankData(arr) {
          if (arr[0] == '' && arr[1] == '' && arr[2].NodeText == '全部') {
            return;
          } else {
            arr.unshift({NodeText: '全部'});
            arr.unshift('');
            arr.unshift('');
            arr.push('');
            arr.push('');
          }
        }

        //滑动到指定位置
        function scrollToPosi(scorllHandler, posi) {
          scorllHandler && scorllHandler.scrollTo(posi.left, posi.top, true);
        }


      }
    }

  }]);
