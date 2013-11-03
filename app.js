var docWidth;
document.addEventListener('touchmove', function (e) { 
    e.preventDefault(); 
}, false);
function doOnOrientationChange(){
    docWidth = document.width;
    console.log(window.orientation, docWidth)
}
window.addEventListener('orientationchange', doOnOrientationChange);
// Initial execution if needed
doOnOrientationChange();

var module = angular.module("app", ["jqm", "jqmCustom", "ngTouch"]);
module
.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=1; i<=total; i++)
            input.push(i);
        return input;
    };
})
.filter('fb', function() {
    return function (input, val) {
        return input.filter(function(element){
            return element >= val;
        });
    };
})
.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: 'partials/main.html',
        animation: 'page-slidedown'
        // controller: ['$scope', '$timeout', '$document', '$swipe', MainCtrl],
        // back: true
    });
    $routeProvider.when("/list/iscroll", {
        templateUrl: 'partials/list-iscroll.html',
        animation: 'page-slide',
        controller: ['$scope', '$timeout', '$compile', ListCtrl],
        resolve: {
            delay: function($q, $timeout, $loadDialog) {
                var delay = $q.defer();
                $loadDialog.setTheme('a').show('Loading...');
                $timeout(function(){
                    delay.resolve();
                    $loadDialog.hide();
                }, 1000);
                // return delay.promise;
                return delay.promise;
            }
        }
    });
    $routeProvider.when("/list/tab/:timeout", {
        templateUrl: 'partials/list-tab.html',
        animation: 'page-slide',
        controller: ['$scope', '$routeParams', '$timeout', '$compile', ListTabCtrl],
        resolve: {
            delay: function($q, $timeout, $loadDialog) {
                var delay = $q.defer();
                $loadDialog.setTheme('a').show('Loading...');
                $timeout(function(){
                    delay.resolve();
                    $loadDialog.hide();
                }, 1000);
                // return delay.promise;
                return delay.promise;
            }
        }
    });
    $routeProvider.when("/list/infinite", {
        templateUrl: 'partials/list-infinite.html',
        animation: 'page-slide',
        controller: ['$scope', '$timeout', '$compile', ListInfiniteCtrl],
        resolve: {
            delay: function($q, $timeout, $loadDialog) {
                var delay = $q.defer();
                $loadDialog.setTheme('a').show('Loading...');
                $timeout(function(){
                    delay.resolve();
                    $loadDialog.hide();
                }, 1000);
                // return delay.promise;
                return delay.promise;
            }
        }
    });
    $routeProvider.when("/list/refresh", {
        templateUrl: 'partials/list-refresh.html',
        animation: 'page-slide',
        controller: ['$scope', '$timeout', '$compile', ListRefreshCtrl],
        resolve: {
            delay: function($q, $timeout, $loadDialog) {
                var delay = $q.defer();
                $loadDialog.setTheme('a').show('Loading...');
                $timeout(function(){
                    delay.resolve();
                    $loadDialog.hide();
                }, 1000);
                // return delay.promise;
                return delay.promise;
            }
        }
    });
    $routeProvider.when("/list/filter", {
        templateUrl: 'partials/list-filter.html',
        animation: 'page-slide',
        controller: ['$scope', '$timeout', listFilterCtrl],
        resolve: {
            delay: function($q, $timeout, $loadDialog) {
                var delay = $q.defer();
                $loadDialog.setTheme('a').show('Loading...');
                $timeout(function(){
                    delay.resolve();
                    $loadDialog.hide();
                }, 1000);
                // return delay.promise;
                return delay.promise;
            }
        }
    });
    $routeProvider.when("/dialog", {
        templateUrl: 'partials/dialog.html',
        animation: 'page-slidedown'
    });

    $routeProvider.when("/panel", {
        templateUrl: 'partials/panel.html',
        animation: 'page-slide',
        controller: ['$scope', '$compile', '$document', '$swipe', '$timeout', PanelCtrl]
    });
    $routeProvider.when("/collapsible", {
        templateUrl: 'partials/collapsible.html',
        animation: 'page-slide',
        controller: ['$scope', '$timeout', CollapsibleCtrl]
    });
    $routeProvider.when("/autocomplete", {
        templateUrl: 'partials/autocomplete.html',
        animation: 'page-slide',
        controller: ['$scope', AutocompleteCtrl]
    });
    $routeProvider.when("/carousel", {
        templateUrl: 'partials/carousel.html',
        animation: 'page-slide',
        controller: ['$scope', '$timeout', CarouselCtrl]
    });
    $routeProvider.when("/popup", {
        templateUrl: 'partials/popup.html',
        animation: 'page-slide',
        controller: ['$scope', PopupCtrl]
    });
    $routeProvider.when("/slider", {
        templateUrl: 'partials/slider.html',
        animation: 'page-slide',
        controller: ['$scope', SliderCtrl]
    });
    $routeProvider.when("/select", {
        templateUrl: 'partials/select.html',
        animation: 'page-slide',
        controller: ['$scope', SelectCtrl]
    });
    $routeProvider.when("/form", {
        templateUrl: 'partials/form.html',
        animation: 'page-slide',
        controller: ['$scope', FormCtrl]
    });
    $routeProvider.when("/table", {
        templateUrl: 'partials/table.html',
        animation: 'page-slide',
        controller: ['$scope', TableCtrl]
    });
    $routeProvider.when("/infinite", {
        templateUrl: 'partials/infinite.html',
        animation: 'page-slide',
        controller: ['$scope', '$timeout', InfiniteCtrl]
    });
    $routeProvider.otherwise({
        redirectTo: "/"
    });
});


function NoopCtrl() {}

function MainCtrl($scope){
}

function ListCtrl(scope, $timeout, $compile){
    scope.state = {};
    scope.data = [];
    addData(50);
    function addData(until){
        for(var i = 1; i <= until; i++) {
            scope.data.push(i);
        }
    }
}
// coba tambah fitur baru : infinite scroll
// module : ngInfiniteScroll
// source :  https://github.com/BinaryMuse/ngInfiniteScroll 
// demo & documentation : http://binarymuse.github.io/ngInfiniteScroll
function ListTabCtrl(scope, $routeParams, $timeout, $compile){
    var x = 0;

    var loadTimeout = $routeParams.timeout ? $routeParams.timeout : 1000 ;
    var tabIscroll;
    var generatedCount = tabIndex = oldY = 0;

    var ListiScroll = {
        init: function(){
            var wrapperWidth = 0;

            // get object tab iscroll
            tabIscroll = angular.element('#tabWrapper').scope().iscroll;

            updateLayout();

            function updateLayout() {

                var currentTab = 0;

                if (wrapperWidth > 0) {
                    currentTab = - Math.ceil( $('.tabScroller').position().left / wrapperWidth);
                }

                wrapperWidth = $('#tabWrapper').width();

                $('.tabScroller').css('width', wrapperWidth * 3)
                    .find('.tab').css('width', wrapperWidth);

                tabIscroll.refresh();
                tabIscroll.scrollToPage(currentTab, 0, 0);
            }
        },
        addData: function(index, until, last){
            var last = scope.data[index].length ? scope.data[index][scope.data[index].length - 1] : 0 ;
            for(var i = 1; i <= until; i++) {
                if(last) 
                    scope.data[index].push(last + i) 
                else
                    scope.data[index].unshift(last + i);
            }
        },
        compileEl: function(scrollerId, i){
            var li;
            switch(scrollerId){
                default:
                    li = '<li jqm-li-link icon="ui-icon-arrow-r">Generated item '+ i +'</li>';
                    break;
                case 1:
                    li = '<li jqm-li-link icon="ui-icon-arrow-r">'+
                            '<h4 class="ui-li-heading">New Kitten '+ i +' </h4>'+
                            '<p class="ui-li-desc">Description here..</p>'+
                        '</li>';
                    break;
                case 2:
                    li = '<li jqm-li-link icon="ui-icon-arrow-r">'+
                            '<img src="http://placekitten.com/80/80" jqm-li-thumb />'+
                            '<h4 class="ui-li-heading">New Kitten '+ i +'</h4>'+
                            '<p class="ui-li-desc">Description here..</p>'+
                            '<span jqm-li-count>44</span>'+
                        '</li>';
                    break;
            }

            var $liScope = $compile(angular.element(li))(scope);

            scope.$apply();

            return $liScope.get(0);
        },
        get: function(){
            // ambil element class tabActive
            var tabActive = angular.element('.tabActive');
            // ambil index element tab
            tabIndex = tabActive.index();
            // ambil ID children tabActive
            var scrollId = tabActive.children().get(0).id;
            // ambil object iScroll dari element ID tersebut
            return angular.element('#'+scrollId).scope().iscroll;
        },
        handle: {
            tab: {
                onScrollMove: function(){
                    var calc = (tabIscroll.absDistX / docWidth * 100);
                    var left = (tabIscroll.distX < 0) ? calc + x : x - calc;

                    // log
                    // console.group('tab:onScrollMove');
                    // console.log('distX', tabIscroll.distX);
                    // console.log('absDistX', tabIscroll.absDistX);
                    // console.log('left', left);
                    // console.groupEnd();
                    // end log

                    scope.barTranslate = {
                        '-webkit-transform': 'translate3d('+left+'%, 0, 0)',
                        'transform': 'translate3d('+left+'%, 0, 0)'
                    };
                    scope.$apply();
                },
                onScrollEnd: function(){
                    x = tabIscroll.currPageX * 100;

                    angular.forEach(scope.tabs, function(tabs){
                        tabs.selected = false;
                    });
                    scope.tabs[tabIscroll.currPageX].selected = true;
                    scope.barTranslate = {
                        '-webkit-transform': 'translate3d('+x+'%, 0, 0)',
                        'transform': 'translate3d('+x+'%, 0, 0)'
                    };
                    scope.$apply();
                }
            },
            page: {
                onBeforeScrollMove: function(){
                    // ambil iscroll
                    var thisIscroll = ListiScroll.get();
                    // set old Y
                    oldY = Math.abs(thisIscroll.y);
                    // log
                    // console.log('onBeforeScrollMove', thisIscroll.y)
                },
                onScrollMove: function(){
                    // ambil iscroll
                    var thisIscroll = ListiScroll.get();
                    // disable tab iscroll, jika scrolling Y (position y bergerak melebihi old Y)
                    if(oldY < Math.abs(thisIscroll.y)) tabIscroll.disable();
                    // log
                    // console.log('onScrollMove', oldY, Math.abs(thisIscroll.y), (oldY < Math.abs(thisIscroll.y)))
                },
                onBeforeScrollEnd: function(){
                    // aktifkan tab iscroll stelah scrolling
                    tabIscroll.enable();
                    oldY = 0;
                },
                /* pull refresh */
                pullDownAction: function(){
                    var thisIscroll = ListiScroll.get();

                    $timeout(function(){ 

                        var li, i;

                        // for (i=0; i<3; i++) {
                        //     li = compileEl(index, ++generatedCount);
                        //     $('li:first-child',el).after(li);
                        // }
                        ListiScroll.addData(tabIndex, 3,false);

                        thisIscroll.refresh();

                    }, 1000);
                },
                pullUpAction: function(){
                    var thisIscroll = ListiScroll.get();

                    $timeout(function(){ 
                        var li, i;

                        // for (i=0; i<3; i++) {
                        //     li = ListiScroll.compileEl(index, ++generatedCount);
                        //     $('ul',el).append(li);
                        // }
                        ListiScroll.addData(tabIndex, 3,true);

                        thisIscroll.refresh();
                        
                    }, 1000);
                },
                /* infinite scroll */
                infiniteScroll: function(){
                    var thisIscroll = ListiScroll.get();

                    if( thisIscroll.y <= (thisIscroll.maxScrollY + 20) ){
                        scope.loading = true;
                        $timeout(function(){
                            ListiScroll.addData(tabIndex, 10,true);
                            $timeout(function(){ 
                                thisIscroll.refresh();
                                scope.loading = false; 
                            });
                        }, 3000);
                    }
                }
            }
        }
    };

    scope.tabs = [{
        title: 'Infinite',
        selected: true,
    },{
        title: 'Refresh',
        selected: false
    },{
        title: 'Custom',
        selected: false
    }];

    scope.data = [
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    ];

    console.log('data', scope.data)

    scope.barTranslate = {};

    scope.f = 0;
    scope.setF = function(val){
        scope.f = val;
    };
    scope.setTab = function(index){
        angular.forEach(scope.tabs, function(tabs){
            tabs.selected = false;
        });
        scope.tabs[index].selected = true;
        tabIscroll.scrollToPage(index, 0);
    };

    scope.tabIscroll  = ListiScroll.handle.tab;
    scope.pageIscroll = ListiScroll.handle.page;

    scope.loading = false;

    $timeout(ListiScroll.init, loadTimeout);
}
function ListInfiniteCtrl(scope, $timeout, $compile){

    scope.data = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

    scope.infiniteScroll = function(){
        var iscroll = angular.element('#wrapper').scope().iscroll;

        if( iscroll.y <= (iscroll.maxScrollY + 20) ){
            scope.loading = true;
            $timeout(function(){
                addData(10);
                $timeout(function(){ 
                    iscroll.refresh();
                });
            }, 3000);
        }
    };

    function addData(until){
        var last = scope.data.length ? scope.data[scope.data.length - 1] : 0 ;
        for(var i = 1; i <= until; i++) {
            scope.data.push(last + i);
        }
    }
    function compileEl(scrollerId, i){
        var li = '<li jqm-li-link icon="ui-icon-arrow-r">Generated item '+ i +'</li>';
        var $liScope = $compile(angular.element(li))(scope);
        scope.$apply();
        return $liScope.get(0);
    }
}
function ListRefreshCtrl(scope, $timeout, $compile){
    var index = 0;

    scope.data = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

    scope.pullDownAction = function(){
        var iscroll  = angular.element('#wrapper').scope().iscroll;

        $timeout(function(){ 

            var li, i;

            for (i=0; i<3; i++) {
                li = compileEl(++index);
                $('ul:first').prepend(li);
            }

            iscroll.refresh();

        }, 1000);
    },
    scope.pullUpAction = function(){
        var iscroll  = angular.element('#wrapper').scope().iscroll;

        $timeout(function(){ 
            var li, i;

            for (i=0; i<3; i++) {
                li = compileEl(++index);
                $('ul:first').append(li);
            }

            iscroll.refresh();
            
        }, 1000);
    }

    function addData(until){
        var last = scope.data.length ? scope.data[scope.data.length - 1] : 0 ;
        for(var i = 1; i <= until; i++) {
            scope.data.push(last + i);
        }
    }
    function compileEl(i){
        var li = '<li jqm-li-link icon="ui-icon-arrow-r">Generated item '+ i +'</li>';
        var $liScope = $compile(angular.element(li))(scope);
        scope.$apply();
        return $liScope.get(0);
    }
}

function listFilterCtrl($scope, $timeout){
    $scope.friends = {
        'A':[
            {
                name: 'Abraham',
                phone:'555-1276'
            },
            {
                name: 'AXl',
                phone:'555-1286'
            }
        ],
        'B':[
            {
                name: 'Bianca',
                phone:'555-1296'
            },
            {
                name: 'Bobby',
                phone:'555-1256'
            }
        ],
        'C':[
            {
                name: 'Chyntia',
                phone:'555-1246'
            },
            {
                name: 'Chocky',
                phone:'555-1236'
            }
        ]
    };
    $scope.friends2 = [
        {name:'John', phone:'555-1276'},
        {name:'Mary', phone:'800-BIG-MARY'},
        {name:'Mike', phone:'555-4321'},
        {name:'Adam', phone:'555-5678'},
        {name:'Julie', phone:'555-8765'},
        {name:'Juliette', phone:'555-5678'}
    ];

    $scope.groups = [
        {
            name: "First",
            id: 1
        }, 
        {
            name: "Second",
            id: 2
        }
    ];
    $scope.materials = [{
        name: "ABC",
        groups: [
            {
                id: 1
            }, 
            {
                id: 2
            }
        ]}, {
        name: "DEF",
        groups: [
            {
                id: 1
            }
        ]}
    ];
    $scope.filterByGroup = function (group) {
        return function (item) {
            for (var i = 0; i < item.groups.length; i++) {
                var ig = item.groups[i];
                if (ig.id == group.id) {
                    return true;
                }
            }
            return false;
        };
    };

    $timeout(function() {
        // var myScroll = new IScroll('.ui-content', {scrollX: false, scrollbars: 'default'});
        var myScroll = new IScroll('.ui-content', {scrollbars: true, mouseWheel: true, interactiveScrollbars: true});
    },1000);
}

// angular ngTouch
// docs http://docs.angularjs.org/api/ngTouch.directive:ngSwipeLeft
// ngSwipeLeft demo http://plnkr.co/edit/5zETIhmbeXDdVEYmP5XB?p=preview
// $swipe demo http://plnkr.co/edit/cjvwaBFFbRFUVeuis7lP?p=preview
function PanelCtrl($scope, $compile, $document, $swipe, $timeout){
    var startCoords = {};
    var panelValues = {
        'reveal'  : 90,
        'overlay' : 50
    };

    $scope.state = $scope.logs = {};

    function swipeOnLoad(){
        var width = $document[0].width || window.innerWidth,
            boundL = parseInt(15/100*width),        // 15%
            boundR = parseInt(85/100*width),        // 85%
            minBoundLeft = parseInt(30/100*width);  // 30%

        var logs = {
            width:width,
            boundL:boundL,
            boundR:boundR
        };
        $scope.logs = logs;

        var enableSwipe = true; 
        var $panel = null;
        var $swiperContent = angular.element('.ui-panel-content-wrap');
        var $swiperHandler = angular.element('.ui-panel-content-wrap .panel-content');

        $scope.$watch('state.openPanel', function(opened){
            $swiperContent.removeAttr('style');
            if( $panel ) {
                // remove the panel styles
                $panel.removeAttr('style');
                // set width the overlay panel
                if($panel.get(0).className.match(/overlay/)) $panel.css('width', panelValues.overlay + '%');
            }
            // set null panel element 
            $panel = null;
        });
        
        function cssPrefix(property, value){
            var vendors = ['', '-o-','-moz-','-ms-','-khtml-','-webkit-'];
            var styles = {};
            for (var i = vendors.length - 1; i >= 0; i--) {
                styles[vendors[i] + property] = value;
            }
            return styles;
        }

        function updateElementPosition(pos){
            // pos = Math.abs(pos - startCoords.x);
            var panelClass = $panel.get(0).className;
            // reveal
            if(panelClass.match(/reveal/)) { 
                // pos = Math.abs(pos - startCoords.x);
                var val = panelValues.reveal;
                var percent = parseInt(pos/width * 100);
                if(percent > val) percent = val;
                $swiperContent.css(cssPrefix('transform', 'translate3d(' + percent + '%,0,0)'));
                // $swiperContent.css('left', percent + '%');
            // overlay
            } else if(panelClass.match(/overlay/)) { 
                var val = panelValues.overlay;
                var p = (width-pos)/width * 100;
                p = p > val ? val : p ;
                $panel.css('width', p + '%');
            }
        }

        function fullSwipe(coords){
            return coords.x - startCoords.x > $swiperContent.width()*(1/3) ? true : false;
        }
        $swipe.bind($swiperHandler, {
            start: function(coords) {
                startCoords = coords;
                
                if($panel == null){
                    if(coords.x >= boundR){
                        $panel = angular.element('.ui-panel-position-right')
                                        .removeClass('ui-panel-closed')
                                        .addClass('ui-panel-opened ui-panel-open')
                                        .css('visibility','visible');
                       updateElementPosition(boundR);
                    } else if(coords.x <= boundL) {
                        $panel = angular.element('.ui-panel-position-left')
                                        .css('visibility','visible');
                       updateElementPosition(coords.x);
                    }
                } else {
                    // $panel = null;
                    $scope.state.openPanel = null;
                }

                panelClass = ( $panel ) ? $panel.get(0).className : 'null';
                var logs = {
                    width  : width,
                    boundL : boundL,
                    boundR : boundR,
                    event  : 'swipe',
                    action : 'start',
                    panel  : panelClass,
                    x      : coords.x
                };
                $scope.logs = logs;
                $scope.$apply();
            },
            move: function(coords) {
                if(!$panel) return;

                updateElementPosition(coords.x);

                var logs = {
                    event  : 'swipe',
                    action : 'move',
                    panel  : panelClass,
                    x      : coords.x
                };
                $scope.logs = logs;
                $scope.$apply();
            },
            end: function(endCoords) {
                if(!$panel) return;

                var r = startCoords.x - endCoords.x;
                var f = fullSwipe(endCoords);
                $scope.state.openPanel = (panelClass.match(/left/)) ? 'left' : 'right';

                // if(panelClass.match(/left/)){
                //     $swiperContent.css('left', 0);
                //     $scope.state.openPanel = 'left';
                // } else {
                //     $panel.css('width', panelValues.overlay + '%');
                //      $scope.state.openPanel = 'right';
                // }
                
                // if(r <= 0 || !f){
                //     $scope.state.openPanel = null;
                //     updateElementPosition(0);
                // } else {
                //     $scope.state.openPanel = (panelClass.match(/left/)) ? 'left' : 'right';
                // }
                
                var logs = {
                    event  : 'swipe',
                    action : 'end',
                    panel  : $scope.state.openPanel,
                    x      : endCoords.x,
                    fullSwipe: f,
                    r:r
                };
                $scope.logs = logs;
                $scope.$apply();
            }
        });
    }

    $timeout(swipeOnLoad, 1000);
}

function CollapsibleCtrl($scope, $timeout){
    
}

function AutocompleteCtrl($scope){
    $scope.cars = [
        'Audi',
        'Acura',
        'BMW',
        'Cadillac',
        'Chrysler',
        'Dodge',
        'Ferrari',
        'Ford',
        'GMC',
        'Honda',
        'Hyundai',
        'Infiniti',
        'Jeep',
        'Kia',
        'Lexus',
        'Mini',
        'Nissan',
        'Porsche',
        'Subaru',
        'Toyota',
        'Volkswagen',
        'Volvo',
    ];

}

function PopupCtrl($scope){
    $scope.close = function(popup, evt){
        var popupModel = $scope.$$childHead[popup];
        popupModel.dismissible = true;
        popupModel.hide();
    }
}

function CarouselCtrl($scope, $timeout){
    var x = 0;
    var swipeCarousel;

    $scope.images = [{
        url: 'assets/img/paris.jpg',
        selected: true,
    },{
        url: 'assets/img/sydney.jpg',
        selected: false
    },{
        url: 'assets/img/newyork.jpg',
        selected: false
    },{
        url: 'assets/img/galaxy_express.png',
        selected: true,
    },{
        url: 'assets/img/phone_lumia920.png',
        selected: false
    },{
        url: 'assets/img/phone_iphone5.png',
        selected: false
    }];

    $scope.onScrollMove = onScrollMove;
    $scope.onScrollEnd  = onScrollEnd;

    function onScrollMove(){
        // var calc = (swipeCarousel.absDistX/docWidth*100/3);
        // var left = (swipeCarousel.dirX > 0) ? calc + x : x - calc ;
        // $scope.$apply();
    };
    function onScrollEnd(){
        console.log(swipeCarousel.currPageX)
        // if(swipeCarousel.absDistX) x = swipeCarousel.currPageX/$scope.images.length * 100;
        angular.forEach($scope.images, function(image){
            image.selected = false;
        });
        $scope.images[swipeCarousel.currPageX].selected = true;
        $scope.$apply();
    };

    function scrollOnLoad(){
        var wrapperWidth = 0;

        // console.log($scope)
        // console.log('pageWrapper', angular.element('#pageWrapper').scope())
        // console.log('wrapper1', angular.element('#wrapper1').scope())

        // get object iscroll from directive
        swipeCarousel = angular.element('#carouselWrapper').scope().iscroll;

        updateLayout();

        function updateLayout() {

            var currentTab = 0;

            if (wrapperWidth > 0) {
                currentTab = - Math.ceil( $('.carouselScroller').position().left / wrapperWidth);
            }

            // wrapperWidth = $('#carouselWrapper').width();
            wrapperWidth = document.width / 3;

            $('.carouselScroller').css('width', wrapperWidth * $scope.images.length)
                .find('.tab').css('width', wrapperWidth);

            swipeCarousel.refresh();
            swipeCarousel.scrollToPage(currentTab, 0, 0);
        }
    }

    $timeout(scrollOnLoad, 1000);
}

function SliderCtrl(scope){
    scope.slider1 = 5;
    scope.slider2 = 5;
    scope.slider3 = 5;

    scope.sliders = {min:0, max:5};
}

function SelectCtrl($scope){
    $scope.items  = ['item1', 'item2', 'item3'];
    $scope.movies = ['Action', 'Comedy', 'Drama', 'Fantasy'];

    $scope.groups = {
        Europe : ['Italy', 'England', 'Germany'],
        Asia   : ['Japan', 'Korea', 'China'],
        America: ['Brazil', 'Argentina', 'USA']
    };

    // $scope.selectedCountry = 'Brazil';
}

function FormCtrl(scope){

    scope.data = {
        text   : null,
        color  : null,
        date   : null,
        number : null,
        tel    : null,
        range  : 5,
        flip   : true,
        textarea : 'textarea',
        items  : ['item1', 'item2', 'item3'],
        movies : ['Action', 'Comedy', 'Drama', 'Fantasy'],
        groups : {
            Europe : ['Italy', 'England', 'Germany'],
            Asia   : ['Japan', 'Korea', 'China'],
            America: ['Brazil', 'Argentina', 'USA']
        },
        checks : [
            {selected:false, value:'one'},
            {selected:false, value:'two'},
            {selected:false, value:'three'}
        ],
        radios : [
            {selected:false, value:'one'},
            {selected:false, value:'two'},
            {selected:false, value:'three'}
        ]
    };

    scope.values = {};

    scope.$watch('data', function(_scope){
        scope.values['text'] = _scope.text;
        scope.values['textarea'] = _scope.textarea;
        scope.values['color'] = _scope.color;
        scope.values['date'] = _scope.date;
        scope.values['number'] = _scope.number;
        scope.values['tel'] = _scope.tel;
        scope.values['range'] = _scope.range;
        scope.values['flip'] = _scope.flip;

        var v = [];
        angular.forEach(_scope.checks, function(obj){
            if(obj.selected) v.push(obj.value)
        });
        scope.values['check'] = v;
        angular.forEach(_scope.radios, function(obj){
            if(obj.selected) scope.values['radio'] = obj.value;
        });
    }, true);
}

function TableCtrl(scope){
    scope.columns = [
        {show:true, column:'Rank'},
        {show:true, column:'Year'},
        {show:true, column:'Rating'},
        {show:true, column:'Reviews'}
    ];

    scope.data = [
        {
            no: '1',
            name: 'Citizen Kane',
            link: 'http://en.wikipedia.org/wiki/Citizen_Kane',
            year: '1941',
            rating: '100%',
            reviews: 74
        },
        {
            no: '2',
            name: 'Casablanca',
            link: 'http://en.wikipedia.org/wiki/Casablanca_(film)',
            year: '1942',
            rating: '97%',
            reviews: 64
        },
        {
            no: '3',
            name: 'The Godfather',
            link: 'http://en.wikipedia.org/wiki/The_Godfather',
            year: '1972',
            rating: '97%',
            reviews: 87
        },
        {
            no: '4',
            name: 'Gone with the Wind',
            link: 'http://en.wikipedia.org/wiki/Gone_with_the_Wind_(film)',
            year: '1939',
            rating: '96%',
            reviews: 87
        },
        {
            no: '5',
            name: 'Lawrence of Arabia',
            link: 'http://en.wikipedia.org/wiki/Lawrence_of_Arabia_(film)',
            year: '1962',
            rating: '94%',
            reviews: 87
        }
    ]
}

function InfiniteCtrl(scope, $timeout){
    scope.images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    scope.loading = false;

    scope.loadMore = function() {
        scope.loading = true;
        $timeout(function(){
            var last = scope.images[scope.images.length - 1];
            for(var i = 1; i <= 8; i++) {
              scope.images.push(last + i);
            }
            scope.loading = false;
        }, 3000);
    };
}