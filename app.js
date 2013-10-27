var docWidth = document.width;
document.addEventListener('touchmove', function (e) { 
    e.preventDefault(); 
}, false);

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
    $routeProvider.when("/list", {
        templateUrl: 'partials/list.html',
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
                // $loadDialog.waitFor(delay.promise, 'Loading...');
                return delay.promise;
            }
        }
    });
    $routeProvider.when("/filter", {
        templateUrl: 'partials/listFilter.html',
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
                // $loadDialog.waitFor(delay.promise, 'Loading...');
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
        controller: ['$scope', '$document', '$swipe', '$timeout', PanelCtrl]
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
    $routeProvider.otherwise({
        redirectTo: "/"
    });
});


function NoopCtrl() {}

function MainCtrl($scope){
}

function ListCtrl($scope, $timeout, $compile){
    var x = 0;

    var swipeTabs,
        pullDownEl, pullDownOffset,
        pullUpEl, pullUpOffset,
        generatedCount = 0;

    $scope.tabs = [{
        title: 'Simple',
        selected: true,
    },{
        title: 'Description',
        selected: false
    },{
        title: 'Custom',
        selected: false
    }];

    $scope.barTranslate = {};

    $scope.f = 0;
    $scope.setF = function(val){
        $scope.f = val;
    };
    $scope.setTab = function(index){
        angular.forEach($scope.tabs, function(tabs){
            tabs.selected = false;
        });
        $scope.tabs[index].selected = true;
        swipeTabs.scrollToPage(index, 0);
    };

    $scope.onScrollMove = onScrollMove;
    $scope.onScrollEnd  = onScrollEnd;

    $scope.pullDownAction = pullDownAction;
    $scope.pullUpAction = pullUpAction;

    function onScrollMove(){
        var calc = (swipeTabs.absDistX/docWidth*100/3);
        var left = (swipeTabs.dirX > 0) ? calc + x : x - calc ;
        $scope.barTranslate = {
            '-webkit-transform': 'translate('+left+'%, 0px)',
            'transform': 'translate('+left+'%, 0px)'
        };
        $scope.$apply();
    };
    function onScrollEnd(){
        if(swipeTabs.absDistX) x = swipeTabs.currPageX * 100;

        angular.forEach($scope.tabs, function(tabs){
            tabs.selected = false;
        });
        $scope.tabs[swipeTabs.currPageX].selected = true;
        $scope.barTranslate = {
            '-webkit-transform': 'translate('+x+'%, 0px)',
            'transform': 'translate('+x+'%, 0px)'
        };
        $scope.$apply();
    };

    function pullDownAction(){
        var el = $('.tabActive'),
            index = el.index();

        // get wrapper id as iscroll id
        var scrollId = el.children().get(0).id;

        // get object iscroll from directive by scroll id
        var iscroll  = angular.element('#'+scrollId).scope().iscroll;

        setTimeout(function(){ 

            var li, i;

            for (i=0; i<3; i++) {
                li = compileEl(index, ++generatedCount);
                $('li:first-child',el).after(li);
            }

            iscroll.refresh();

        }, 1000);
    }
    function pullUpAction(){
        var el = $('.tabActive'),
            index = el.index();

        // get wrapper id as iscroll id
        var scrollId = el.children().get(0).id;

        // get object iscroll from directive by scroll id
        var iscroll  = angular.element('#'+scrollId).scope().iscroll;

        setTimeout(function(){ 
            var li, i;

            for (i=0; i<3; i++) {
                li = compileEl(index, ++generatedCount);
                $('ul',el).append(li);
            }

            iscroll.refresh();
            
        }, 1000);
    }

    function compileEl(scrollerId, i){
        var li;
        switch(scrollerId){
            default:
                li = '<li jqm-li-link icon="ui-icon-arrow-r">List new item '+ i +'</li>';
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

        var $liScope = $compile(angular.element(li))($scope);

        $scope.$apply();

        return $liScope.get(0);
    }

    function scrollOnLoad(){
        var wrapperWidth = 0;

        // console.log($scope)
        // console.log('pageWrapper', angular.element('#pageWrapper').scope())
        // console.log('wrapper1', angular.element('#wrapper1').scope())

        // get object iscroll from directive
        swipeTabs = angular.element('#pageWrapper').scope().iscroll;

        updateLayout();

        function updateLayout() {

            var currentTab = 0;

            if (wrapperWidth > 0) {
                currentTab = - Math.ceil( $('.pageScroller').position().left / wrapperWidth);
            }

            wrapperWidth = $('#pageWrapper').width();

            $('.pageScroller').css('width', wrapperWidth * 3)
                .find('.tab').css('width', wrapperWidth);

            swipeTabs.refresh();
            swipeTabs.scrollToPage(currentTab, 0, 0);
        }
    }

    $timeout(scrollOnLoad, 1000);
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
    $scope.materials = [
        {
            name: "ABC",
            groups: [
                {
                    id: 1
                }, 
                {
                    id: 2
                }
            ]
        }, 
        {
            name: "DEF",
            groups: [
                {
                    id: 1
                }
            ]
        }
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
// $swipe demo http://plnkr.co/edit/cjvwaBFFbRFUVeuis7lP?p=preview
function PanelCtrl($scope, $document, $swipe, $timeout){
    var startCoords;

    function cssPrefix(property, value){
        var vendors = ['', '-o-','-moz-','-ms-','-khtml-','-webkit-'];
        var styles = {};
        for (var i = vendors.length - 1; i >= 0; i--) {
            styles[vendors[i] + property] = value;
        }
        return styles;
    }

    function updateElementPosition(pos){
        var panelClass = $panel.get(0).className;
        if(panelClass.match(/right/)){ // overlay
            // pos = Math.abs(pos);
            // console.group();
            // console.log('width', width)
            // console.log('pos', pos)
            // console.log('pos', startCoords.x - pos)
            // console.log('right', $panel.css('right'))
            // console.groupEnd();

            // if(pos >= 270) pos = 270;
            // $panel.css(panelPosition, pos + 'px');
            var p = (width-pos)/width * 100;
            p = p > 50 ? 50 : p ;
            $panel.css('width', p + '%');
        } else {
            pos -= startCoords.x;
            var percent = parseInt(pos/width * 100);
            if(percent >= 90) percent = 90;
            $swiperContent.css(cssPrefix('transform', 'translate3d(' + percent + '%,0,0)'));
            $panel.css('width', Math.abs(percent) + '%');
        }
    }

    function fullSwipe(coords){
        return coords.x - startCoords.x > $swiperContent.width()*(1/3) ? true : false;
    }

    function swipeOnLoad(){
        var width = $document[0].width,
            boundL = parseInt(15/100*width), // 15%
            boundR = parseInt(85/100*width), // 85%
            minBoundLeft = parseInt(30/100*width); // 30%

        $scope.state = {};
        $scope.handle = {
            width:width,
            boundL:boundL,
            boundR:boundR,
        };

        var $swiperContent = angular.element('.ui-panel-content-wrap');
        var $swiperHandler = angular.element('.ui-panel-content-wrap .panel-content');
        var $panel, panelPosition;

        $scope.$watch('state.openPanel', function(val){
            $swiperContent.removeAttr('style');
            if($panel) $panel.removeAttr('style');
        })

        var enableSwipe = true; $panel = null;
        $swipe.bind($swiperHandler, {
            start: function(coords) {
                startCoords = coords;
                
                if(coords.x >= boundR){
                    $panel = angular.element('.ui-panel-position-right')
                                    .removeClass('ui-panel-closed')
                                    .addClass('ui-panel-opened ui-panel-open');
                   updateElementPosition(boundR);
                } else if(coords.x <= boundL) {
                    $panel = angular.element('.ui-panel-position-left')
                                    .removeClass('ui-panel-closed');
                   updateElementPosition(boundL);
                } else {
                    $panel = null;
                    $scope.state.openPanel = null;
                }

                panelPosition = ( $panel ) ? $panel.get(0).className : 'null';
                $scope.handle = {
                    width  : width,
                    boundL : boundL,
                    boundR : boundR,
                    enableSwipe: enableSwipe,
                    event  : 'swipe',
                    action : 'start',
                    panel  : panelPosition,
                    x : coords.x
                };
                $scope.$apply();
            },
            move: function(coords) {
                if(!$panel) return;

                updateElementPosition(coords.x);

                $scope.handle = {
                    event  : 'swipe',
                    action : 'move',
                    panel  : panelPosition,
                    x      : coords.x
                };
                $scope.$apply();
            },
            end: function(endCoords) {
                if(!$panel) return;

                var r = startCoords.x - endCoords.x;
                var f = fullSwipe(endCoords);
                if(r == 0){
                    updateElementPosition(0);
                    $scope.state.openPanel = null;
                } else {
                    var panelClass = $panel.get(0).className;
                    $scope.state.openPanel = (panelClass.match(/left/)) ? 'left' : 'right';
                }

                // $scope.state.openPanel = (panelClass.match(/left/)) ? 'left' : 'right' ;
                // if (!fullSwipe(endCoords)){
                //     if(!panelClass.match('overlay')) $scope.state.openPanel = null;
                //     updateElementPosition(0);
                // }
                $scope.handle = {
                    event  : 'swipe',
                    action : 'end',
                    panel  : $scope.state.openPanel,
                    x : endCoords.x,
                    fullSwipe: f
                };

                $scope.$apply();
            }
        });

        alert('onloaded');
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