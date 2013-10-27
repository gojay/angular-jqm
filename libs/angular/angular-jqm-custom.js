(function(window, angular) {
    "use strict";

	var jqmModuleCustom = angular.module("jqmCustom", ["jqm"]);

	jqmModuleCustom.directive('jqmCollapsible', function() {
	    return {
	        restrict: 'A',
	        require: '^jqmCollapsibleSet',
	        templateUrl: 'templates/jqmCollapsible.html',
	        scope: 'isolate',
	        transclude: true,
	        replace: true,
	        compile: function(celement, cattr, transclude){
	            var defaultTheme = 'c';
	            var theme = {
	                header : angular.isDefined(cattr.theme) ? cattr.theme : defaultTheme,
	                content: angular.isDefined(cattr.contentTheme) ? cattr.theme : defaultTheme
	            };

	            var header = angular.element(celement).find('a');
	            header.attr('jqm-theme', theme.header);

	            return function(scope, element, attr, jqmCollapsibleSetCtrl){

	                jqmCollapsibleSetCtrl.addContent(scope)

	                if(jqmCollapsibleSetCtrl.isInset){
	                    angular.element(element).addClass('ui-corner-all');
	                }

	                scope.isCollapsed = false;
	                scope.iconType = jqmCollapsibleSetCtrl.iconType;
	                scope.header = attr.header;
	                scope.contentTheme = jqmCollapsibleSetCtrl.isBasic ? '' : 'ui-body-' + theme.content;

	                scope.collapse = function(){
	                    jqmCollapsibleSetCtrl.filterContent(scope);
	                };
	            } 
	        }
	    };
	});

	jqmModuleCustom.directive('jqmCollapsibleSet', function () {
	    var isDef = angular.isDefined;
	    var scopeSet = [];
	    return {
	        restrict: 'A',
	        transclude: true,
	        templateUrl: 'templates/jqmCollapsibleSet.html',
	        scope: {
	            basic:'@',
	            icon:'@',
	            inset:'@'
	        },
	        controller: ['$scope', '$element', jqmCollapsibleSetCtrl],
	        link: function(scope, element, attr, jqmCollapsibleSetCtrl){
	            // scope.$$scopeAs = 'jqmCollapsibleSet';   
	        }
	    };
	    function jqmCollapsibleSetCtrl($scope, $element){

	        this.iconType = isDef($scope.icon) ? $scope.icon : 'plus' ;
	        this.isInset  = isDef($scope.inset) ? $scope.inset : false ;
	        this.isBasic  = isDef($scope.basic) ? $scope.basic : false ;

	        this.addContent = function(scope){
	            scopeSet.push(scope);
	        };
	        
	        this.filterContent = function(scope){
	            var evt = !scope.isCollapsed;
	            var id  = scope.$parent.$id;
	            var filteredScope = scopeSet.filter(function(scope){
	                return scope.$parent.$id == id;
	            });
	            angular.forEach(filteredScope, function(scope){
	                scope.isCollapsed = false;
	            });
	            scope.isCollapsed = evt;
	        }

	    };
	});

	jqmModuleCustom.directive('jqmDialog', function() {
	    var isdef = angular.isDefined;
	    return {
	        restrict: 'A',
	        // replace: true,
	        transclude: true,
	        template: "<div class=\"ui-dialog-contain\" jqm-class=\"{'ui-overlay-shadow': shadow!='false', 'ui-corner-all': corners!='false'}\" ng-transclude></div>",
	        scope: {
	            corners: '@',
	            shadow: '@'
	        },
	        link: function(scope, element, attr) {
	            //We do this instead of '@' binding because "false" is actually truthy
	            //And these default to true
	            scope.shadow = isdef(attr.shadow) ? (attr.shadow==='true') : true;
	            scope.corners = isdef(attr.corners) ? (attr.corners==='true') : true;
	        }
	    };
	});

/*
	jqmModuleCustom.directive('jqmSlider', function(){
		var isDef = angular.isDefined;
		return {
			require: 'ngModel',
			scope: {
				value: '=ngModel'
			},
			restrict: 'A',
			replace: true,
			templateUrl: 'templates/jqmSlider.html',
			controller: ['$scope', '$element', '$attrs', '$timeout', '$document', '$swipe', jqmSliderCtrl],
			compile: function(celement, cattr, transclude){
				var theme = isDef(cattr.theme) ? cattr.theme : 'c' ;
				var handler = angular.element(celement).find('.ui-slider-handle');
				handler.attr('jqm-theme',theme);
				return function(scope, element, attr, jqmCollapsibleSetCtrl){}
			}
		};

		function jqmSliderCtrl($scope, $element, $attrs, $timeout, $document, $swipe){
			var docWidth = $document.width();

			var el = angular.element($element);

	        // var min  = $scope.min = isDef($attrs.min) ? $attrs.min : 0 ;
	        var min  = 0;
	        var max  = $scope.max = isDef($attrs.max) ? $attrs.max : 100 ;
	        var step = isDef($attrs.step) ? 1 / parseFloat($attrs.step) : 1 ; 

			$scope.mini = isDef($attrs.mini) ? $attrs.mini==="true" : false ;
	    	$scope.styles = {handler:{}, highlight:{}};
	    	$scope.highlight = isDef($attrs.highlight) ? $attrs.highlight==="true" : false ;

	        $scope.$watch('value', function(val){
	            if(val > max) $scope.value = max;

	            var calc = val * 100 / max + '%';
	            $scope.styles.handler.left = calc;
	            $scope.styles.highlight.width = calc;
	        });

		    function onLoad(){
		        var $slider = el.find('.ui-slider-track');
		        var $sliderHandler = el.find('.ui-slider-track > .ui-slider-handle');

		        var width = $slider[0].offsetWidth;
		        var left  = $slider[0].offsetLeft;

		        $swipe.bind($sliderHandler, {
		            start: function(coordscoords){
		                $sliderHandler.addClass('ui-focus');
		            },
		            move: function(coords){
		                var move = coords.x - left;
		                if(move <= 0) 
		                    move = 0;
		                else if(move >= width) 
		                    move = width;

		                var percent = move/width * 100;
		                var calc  = percent * max/100;
		                var value = Math.round( calc * step ) / step; 
		                $scope.value = value
		                $scope.$apply();
		            },
		            end: function(coords){
		                $sliderHandler.removeClass('ui-focus');
		            }
		        });
		    }

		    $timeout(onLoad);
		};
	});
*/
	jqmModuleCustom.directive('jqmSlider', function(){
		var isDef = angular.isDefined;
		return {
			require: ['ngModel', '^?jqmRangeslider'],
			scope: {
				value: '=ngModel'
			},
			restrict: 'A',
			replace: true,
			templateUrl: 'templates/jqmSlider.html',
			controller: ['$scope', '$element', '$attrs', '$timeout', '$document', '$swipe', jqmSliderCtrl],
			compile: function(celement, cattr, transclude){
				var theme = isDef(cattr.theme) ? cattr.theme : 'c' ;
				var handler = angular.element(celement).find('.ui-slider-handle');
				handler.attr('jqm-theme',theme);
				return function(scope, element, attrs, ctrls){
					var jqmRangesliderCtrl = ctrls[1];

					scope.isrange   = isRange();
					scope.mini      = isMini();
	    			scope.highlight = isHighlight();
	    			scope.styles    = getStyles();

	    			scope.min  = getMin();
	    			scope.max  = getMax();
	    			scope.step = getStep();

					function isRange(){
						return jqmRangesliderCtrl && angular.isObject(scope.value);
					}

					function isMini(){
						return !isRange() ? isDef(attrs.mini) ? attrs.mini==="true" : false 
										 : jqmRangesliderCtrl.scope.mini==="true" ;
					}

					function isHighlight(){
						return !isRange() ? isDef(attrs.highlight) ? attrs.highlight==="true" : false
										 : jqmRangesliderCtrl.scope.highlight==="true" ;
					}

					function getStyles(){
						var styles = { handler:{} };
						if( isRange() ){
							styles = {
								handler :{
									min : {},
									max : {}
								}
							};
						}
						return styles;
					}

					function getMin(){
						return !isRange() ? isDef(attrs.min) ? attrs.min : 0 
										  : isDef(jqmRangesliderCtrl.scope.min) ? jqmRangesliderCtrl.scope.min : 0 ;
					}

					function getMax(){
						return !isRange() ? isDef(attrs.max) ? attrs.max : 100 
										  : isDef(jqmRangesliderCtrl.scope.max) ? jqmRangesliderCtrl.scope.max : 100 ;
					}

					function getStep(){
						return !isRange() ? isDef(attrs.step) ? calcStep(attrs.step) : 1  
										  : isDef(jqmRangesliderCtrl.scope.step) ? calcStep(jqmRangesliderCtrl.scope.step) : 1 ;
					}
					function calcStep(step){
						return 1 / parseFloat(step);
					}
				}
			}
		};

		function jqmSliderCtrl(scope, element, attrs, $timeout, $document, $swipe){
			var docWidth = $document.width();

			var el = angular.element(element);

			scope.$watch('value', function(val){
				if( scope.isrange ){
					var min = val.min * 100 / scope.max;
					var max = val.max * 100 / scope.max;
		            angular.extend(scope.styles.handler, {
		            	min: { left:min + '%' },
		            	max: { left:max + '%' }
		            });
		            scope.styles['highlight'] = {
		            	width: (max - min) + '%',
		            	marginLeft: min + '%',
		            }
		        } else {
		        	if(val > scope.max) scope.value = scope.max;

		        	var calc = val * 100 / scope.max +'%';
		        	scope.styles.handler      = { left:calc };
		        	scope.styles['highlight'] = { width:calc };
		        }
	        }, true);

	        if( scope.isrange ){
	        	var activeSlider = 'min';
				scope.$watch('value.min', function(val){
					if(val >= scope.value.max){ 
						scope.value.min = scope.value.max; 
					}
		        });
				scope.$watch('value.max', function(val){
					if(val <= scope.value.min){ 
						scope.value.max = scope.value.min; 
					} 
		        });
	        }

		    function onLoad(){
		        var sliderClass = scope.isrange ? '.ui-rangeslider-sliders' : '.ui-slider-track' ;
		        var $slider = el.find(sliderClass);

		        var width = $slider[0].offsetWidth;
		        var left  = $slider[0].offsetLeft;

		        var min  = scope.min;
		        var max  = scope.max;
		        var step = scope.step;

		        var $sliderHandler = el.find('.ui-slider-track > .ui-slider-handle');
		        $sliderHandler.each(function(i,e){
		        	var handler = angular.element(e);

		        	$swipe.bind(handler, {
			            start: function(coords){
			            	if( scope.isrange ){
				            	activeSlider = i > 0 ? 'max' : 'min' ;
				            	console.log('start', activeSlider);
			            	}
			                handler.addClass('ui-focus');
			            },
			            move: function(coords){
			                var move = coords.x - left;
			                if(move <= 0) 
			                    move = 0;
			                else if(move >= width) 
			                    move = width;

			                var percent = move/width * 100;
			                var calc    = percent * max/100;
			                var value   = Math.round( calc * step ) / step;

			                if( scope.isrange )
			                	scope.value[activeSlider] = value;
			                else
			                	scope.value = value;

			                scope.$apply();
			            },
			            end: function(coords){
			                handler.removeClass('ui-focus');
			            }
			        });
		        })
		    };

		    $timeout(onLoad);
		};
	});

	jqmModuleCustom.directive('jqmRangeslider', ['$compile', function($compile){
		var isDef = angular.isDefined;
		return {
			scope: {
				min : '@',
				max : '@',
				step: '@',
				highlight: '@',
				mini: '@'
			},
			restrict: 'A',
			replace: true,
			transclude: true,
			template: '<div class="ui-rangeslider-sliders" ng-transclude></div>',
			controller: ['$scope', jqmRangesliderCtrl],
			compile: function(elm, attr){
				return function(scope, element, attr, jqmRangesliderCtrl){}
			}
		};

		function jqmRangesliderCtrl(scope){
			this.scope = scope;
		};
	}])

	jqmModuleCustom.directive('jqmSelect', ['$compile', function($compile){
		var isDef = angular.isDefined;
		var state = false;
		return {
			scope: {
				items:'=ngModel'
			},
			require: 'ngModel',
			restrict: 'A',
			templateUrl: 'templates/jqmSelect.html',
			replace: true,
			compile: function(celement, cattr, transclude){
				var isNative    = isDef(cattr.native) ? cattr.native==="true" : true ;
				var animation   = isDef(cattr.animation) ? cattr.animation : 'fade';
				var theme       = isDef(cattr.theme) ? cattr.theme : 'c';
				var buttonEl    = angular.element(celement).children().eq(0);

				var attributes = {'jqm-theme' : theme};
				if( !isNative ){
					angular.extend(attributes, {
						'jqm-popup-target':'PopupSelectMenu',
						'jqm-popup-model':'selectMenuPopup',
						'ng-click':'selectMenuPopup = true'
					});
				}
				buttonEl.attr(attributes);

				return function($scope, iElm, iAttrs, controller) {
					$scope.isNative = isNative ;
					$scope.title    = isDef(iAttrs.title) ? iAttrs.title : 'Choose one';
					$scope.selected = isDef(iAttrs.selected) ? iAttrs.selected : $scope.title;

					$scope.selectPopup = function(index){
				        $scope.selected = $scope.items[index];
				        $scope.selectMenuPopup = false;
				    };

					if( !isNative ){
						// create popup
						var popup = '<div jqm-popup="PopupSelectMenu" jqm-theme="a" animation="'+animation+'" style="min-width:250px;">'+
								       '<ul jqm-listview style="margin:0">'+
								            '<li jqm-li-entry jqm-theme="'+theme+'" style="text-align:center;">'+ $scope.title +'</li>'+
								            '<li ng-repeat="item in items" jqm-theme="'+theme+'" jqm-li-link icon="false"'+
								                'ng-class="{\'ui-btn-active\':item == selected}"'+
								                'ng-click="selectPopup($index)">{{item}}</li>'+
								        '</ul>'+
								    '</div>';
						// append compiled popup element
						angular.element(iElm).append($compile(popup)($scope));
					}
				}
			}
		};
	}]);

	jqmModuleCustom.directive('jqmSelectTransclude', ['$compile', function($compile){
		var isDef = angular.isDefined;
		var state = false;
		return {
			restrict: 'A',
			scope: {
				selected:'=ngModel'
			},
			template: '<div ng-class="{\'ui-select\':isNative}"><div jqm-button icon="ui-icon-arrow-d" iconpos="right" ng-class="{\'ui-first-child\':firstBtn, \'ui-last-child\':lastBtn}">{{selectedText}}</div><select ng-show="isNative" ng-model="selected" ng-transclude></select></div>',
			replace: true,
			transclude: true,
			compile: function(element, attr){
				var isNative    = isDef(attr.native) ? attr.native==="true" : true ;
				var animation   = isDef(attr.animation) ? attr.animation : 'fade';
				var theme       = isDef(attr.theme) ? attr.theme : 'c';
				var buttonEl    = angular.element(element).children().eq(0);
				var attributes = {'jqm-theme' : theme};
				if( !isNative ){
					angular.extend(attributes, {
						'jqm-popup-target':'PopupSelectMenu',
						'jqm-popup-model':'selectMenuPopup',
						'ng-click':'selectMenuPopup = true'
					});
				}
				buttonEl.attr(attributes);

				return function($scope, iElm, iAttrs, ctrl) {

					var title;

					$scope.isNative = isNative;
					$scope.options = [];
					$scope.$watch('selected', setSelectedText);

					$scope.selectPopup = function(selected){
						console.log('selected', selected)
				        $scope.selected = selected;
				        $scope.selectMenuPopup = false;
				    };

					setTimeout(onLoad);

					function setSelectedText(selected){
						$scope.selectedText = selected;
					};
					function onLoad(){
		                var groups = angular.element(iElm).parents('.ui-controlgroup-controls:first');
		                if(groups.length){
		                	var l = groups.children().length - 1;
		                	$scope.firstBtn = groups.find(iElm).index() == 0;
		                	$scope.lastBtn  = groups.find(iElm).index() == l;
		                }

						// get combobox 'select' element
						var selectEl = angular.element(iElm).find('select');
						// get option value is null/empty option combobox text
						var optionTitle = selectEl.find("option[value='']");
						// select menu title
						title = optionTitle.text();
						// if selected is null, set selected text same as title
						if(!$scope.selected){
							$scope.selectedText = title;
							$scope.$apply();
						}
						// remove this option
						optionTitle.remove();

						// create list items/options from select options (transclude element)
						var options = {};
						selectEl.children().each(function(i,e){
							var element = angular.element(e);
							if(element[0].nodeName == 'OPTGROUP'){
								options.type = 'group';

								if(!isDef(options.data)) options.data = {};
								var parent = options.data[element[0].label] = [];
								element.children().each(function(i,e){
									parent.push(angular.element(e).text())
								});
							} else {
								options.type = 'default';
								if(!isDef(options.data)) options.data = {};
								options.data[i] = angular.element(e).text();
							}
						});
		                selectEl.bind('focus', function () {
		                	if(!groups.length) return;
		                    groups.each(function(i,e){
		                    	angular.element(e).find('.ui-btn').removeClass('ui-focus');
		                    });
		                    angular.element(iElm).find('.ui-btn').addClass('ui-focus');
		                });
		                selectEl.bind('blur', function () {
		                	if(!groups.length) return;
		                    groups.each(function(i,e){
		                    	angular.element(e).find('.ui-btn').removeClass('ui-focus');
		                    });
		                });
						$scope.options = options;

						if( !isNative ){
							// create popup
							var popup = '<div jqm-popup="PopupSelectMenu" jqm-theme="a" class="ui-selectmenu" animation="'+animation+'" style="min-width:300px;">'+
									      	'<ul jqm-listview style="margin:0">'+
									            '<li jqm-li-entry jqm-theme="'+theme+'" style="text-align:center;">'+title+'</li>';
					      	if(options.type == 'group'){
					      		angular.forEach(options.data, function(groups, key){
				      				if(!angular.isObject(groups)) return;
						        	popup += '<li jqm-li-divider jqm-theme="b">'+ key +'</li>';
					      			angular.forEach(groups, function(option, key){
						        		popup += '<li jqm-li-link icon="false"'+
								                	'ng-class="{\'ui-btn-active\':\''+ option +'\' == selected}"'+
						        					'ng-click="selectPopup(\''+ option +'\')">'+ option +'</li>';
							        });
						        });
					      	} else {
					      		popup += '<li ng-repeat="option in options.data" jqm-theme="'+theme+'" class="ui-selectmenu" jqm-li-link icon="false"'+
								                'ng-class="{\'ui-btn-active\':option == selected}"'+
								                'ng-click="selectPopup(option)">{{option}}</li>';
					      	}
							popup += '</ul></div>';
							// append compiled popup element
							angular.element(iElm).append($compile(popup)($scope));
						}
					};
				}
			}
		};
	}]);

	jqmModuleCustom.directive('jqmRadio', [function () {
		var models = [], scopes = [];
	    return {
	        restrict: 'A',
	        transclude: true,
	        replace: true,
	        templateUrl: 'templates/jqmRadio.html',
	        scope: {
	            disabled: '@',
	            mini: '@',
	            iconpos: '@'
	        },
	        require: ['?ngModel','^?jqmControlgroup'],
	        link: function (scope, element, attr, ctrls) {
	            var ngModelCtrl = ctrls[0],
	                jqmControlGroupCtrl = ctrls[1];
	            scope.toggleChecked = toggleChecked;
	            scope.isMini = isMini;
	            scope.getIconPos = getIconPos;
	            scope.isActive = isActive;

	            scopes.push(scope);
	            models.push(ngModelCtrl);

	            if (ngModelCtrl) {
	                enableNgModelCollaboration();
	            }

	            function isMini() {
	                return scope.mini || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.mini);
	            }

	            function getIconPos() {
	                return scope.iconpos || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.iconpos);
	            }

	            function isActive() {
	                return (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.type === "horizontal") && scope.checked;
	            }

	            function toggleChecked() {
	                if (scope.disabled) {
	                    return;
	                }
                	angular.forEach(scopes, function(scope){
                    	scope.checked = false;
                	})
                	scope.checked = !scope.checked;
	                if (ngModelCtrl) {
	                	angular.forEach(models, function(model){
	                    	model.$setViewValue(false);
	                	})
	                    ngModelCtrl.$setViewValue(scope.checked);
	                }
	            }

	            function enableNgModelCollaboration() {
	                // For the following code, see checkboxInputType in angular's sources
	                var trueValue = attr.ngTrueValue,
	                    falseValue = attr.ngFalseValue;

	                if (!angular.isString(trueValue)) {
	                    trueValue = true;
	                }
	                if (!angular.isString(falseValue)) {
	                    falseValue = false;
	                }

	                ngModelCtrl.$render = function () {
	                    scope.checked = ngModelCtrl.$viewValue;
	                };

	                ngModelCtrl.$formatters.push(function (value) {
	                    return value === trueValue;
	                });

	                ngModelCtrl.$parsers.push(function (value) {
	                    return value ? trueValue : falseValue;
	                });
	            }
	        }
	    };
	}]);

	jqmModuleCustom.directive('jqmTable', ['$compile', function(compile){
		var isDef = angular.isDefined;
		return {
			scope: {},
			restrict: 'A',
			templateUrl: 'templates/jqmTable.html',
			replace: true,
			transclude: true,
			controller: ['$scope', jqmTableCtrl],
			compile: function(elm, attr, transclude){
				return function(scope, element, attrs){
					scope.columns = [];

					var  tblClass = isDef(attr.bodyTheme) ? 'ui-body-' + attr.bodyTheme : 'ui-body-c' ;
					if(isDef(attr.shadow)){
						tblClass += 'ui-shadow';
					}
					if(isDef(attr.type)){
						tblClass += ' table-' + attr.type;
					}

					var headClass = isDef(attr.headTheme) ? 'ui-bar-' + attr.headTheme : 'ui-bar-c' ;

				    var tableEl = angular.element(element).find('table');
				    tableEl.addClass("ui-responsive ui-table ui-table-columntoggle " + tblClass);

				    var indexes = [];
				    angular.element(element).find('thead > tr > th').each(function(i,e){
				    	var th = angular.element(e);
			    		if( th.data('priority') ){
			    			scope.columns.push({
			    				show    : true,
			    				priority: th.data('priority'),
			    				column  : th.text()
			    			});
			    			indexes.push(i);
			    		}
				    });

				    setTimeout(function() {
				    	angular.element(element).find('thead > tr').each(function(i,e){
				    		nestedNgShow(angular.element(e));
					    });
					    angular.element(element).find('tbody > tr').each(function(i,e){
					    	nestedNgShow(angular.element(e));
					    });
				    }, 200);

					function nestedNgShow(el){
						el.children().each(function(_i,_e){	
			    			var _e = angular.element(_e);
			    			var index = indexes.indexOf(_i);
			    			if(index !== -1) compileEl(_e, 'columns['+index+'].show');
			    		});
					}
				    function compileEl(_e, binding){
				    	var e_ = _e.attr('ng-show', binding);
		    			compile(e_.parent().contents())(scope);
		    			_e.replaceWith(e_);
				    }
				};
			}
		};

		function jqmTableCtrl(scope){

		}
	}]);

	jqmModuleCustom.directive('iscroll', ['$parse', '$timeout',  function ($parse, $timeout) {
	    var isDef = angular.isDefined;
	    return {
	        restrict: 'EA',
	        transclude: true,
	        replace: true,
	        templateUrl: 'templates/iscroll.html',
	        scope: {
	            pullUp: '&',
	            pullDown: '&',
	            onRefresh: '&',
	            onScrollStart: '&',
	            onBeforeScrollStart: '&',
	            onBeforeScrollMove: '&',
	            onBeforeScrollEnd: '&',
	            onScrollMove: '&',
	            onScrollEnd: '&',
	            onTouchEnd: '&',
	            onDestroy: '&',
	            onZoomStart: '&',
	            onZoom: '&',
	            onZoomEnd: '&'
	        },
	        link: function(scope, element, attr, iscrollableCtrl){
	            
	            var iscrollModel = $parse(attr.iscroll);

		        if (!iscrollModel.assign) {
		            throw new Error("iscroll expected assignable expression for iscroll attribute, got '" + attr.jqmSelectMenu + "'");
		        }
		        iscrollModel.assign(scope.$parent, scope);

	            attr.$set('id', attr.iscroll);

	            scope.scroller    = isDef(attr.scroller) ? attr.scroller : 'scroller' ;
	            scope.pullRefresh = isDef(attr.pullRefresh) ? attr.pullRefresh==="true" : false ;

	            var options = {
	                bounce        : isDef(attr.bounce) ? attr.bounce==='true' : false,
	                useTransition : isDef(attr.transition) ? attr.transition==='true' : false,
	                snap          : isDef(attr.snap)       ? attr.snap==='true' : false,
	                momentum      : isDef(attr.momentum)   ? attr.momentum==='true' : true,
	                vScrollbar    : isDef(attr.vertical)   ? attr.vertical==='true' : false,
	                hScrollbar    : isDef(attr.horizontal) ? attr.horizontal==='true' : false,
	                lockDirection : isDef(attr.lock)       ? attr.lock==='true' : true,
	                onBeforeScrollStart : function(e) {
				        var target = e.target;
						while (target.nodeType != 1) target = target.parentNode;

						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
							e.preventDefault();

				    }
	            };

	            if( isDef(attr.onRefresh) ) angular.extend(options, {onRefresh:scope.onRefresh});
	            if( isDef(attr.onScrollStart) ) angular.extend(options, {onScrollStart:scope.onScrollStart});
	            if( isDef(attr.onBeforeScrollMove) ) angular.extend(options, {onBeforeScrollMove:scope.onBeforeScrollMove});
	            if( isDef(attr.onBeforeScrollEnd) ) angular.extend(options, {onBeforeScrollEnd:scope.onBeforeScrollEnd});
	            if( isDef(attr.onScrollMove) ) angular.extend(options, {onScrollMove:scope.onScrollMove});
	            if( isDef(attr.onScrollEnd) ) angular.extend(options, {onScrollEnd:scope.onScrollEnd});
	            if( isDef(attr.onTouchEnd) ) angular.extend(options, {onTouchEnd:scope.onTouchEnd});
	            if( isDef(attr.onZoomStart) ) angular.extend(options, {onZoomStart:scope.onZoomStart});
	            if( isDef(attr.onZoom) ) angular.extend(options, {onZoom:scope.onZoom});
	            if( isDef(attr.onZoomEnd) ) angular.extend(options, {onZoomEnd:scope.onZoomEnd});

	            var iscroll = new iScroll(element[0]);

	            scope.iscroll = iscroll;

	            function iscrollOnLoad(){
	            
	            	if( scope.pullRefresh ){
	            		var scrollerEl = angular.element(element);
		                var pullDownEl = scrollerEl.find('.pullDown').get(0);
		                var pullUpEl   = scrollerEl.find('.pullUp').get(0);
		                var pullDownOffset = pullDownEl.offsetHeight;
		                var pullUpOffset   = pullUpEl.offsetHeight;
	            	}

	                // default setting "pull refresh"
	                var refreshOption = {
	                    topOffset: pullDownOffset,
	                    onRefresh: function () {
	                        if (pullDownEl.className.match('loading')) {
	                            pullDownEl.className = 'pullDown';
	                            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
	                        } else if (pullUpEl.className.match('loading')) {
	                            pullUpEl.className = 'pullUp';
	                            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
	                        }
	                    },
	                    onScrollMove: function () {
	                        if (this.y > 5 && !pullDownEl.className.match('flip')) {
	                            pullDownEl.className += ' flip';
	                            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
	                            this.minScrollY = 0;
	                        } else if (this.y < 5 && pullDownEl.className.match('flip')) {
	                            pullDownEl.className = 'pullDown';
	                            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
	                            this.minScrollY = -pullDownOffset;
	                        } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
	                            pullUpEl.className += ' flip';
	                            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
	                            this.maxScrollY = this.maxScrollY;
	                        } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
	                            pullUpEl.className = 'pullDown';
	                            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
	                            this.maxScrollY = pullUpOffset;
	                        }
	                    },
	                    onScrollEnd: function () {
	                        if (pullDownEl.className.match('flip')) {
	                            pullDownEl.className += ' loading';
	                            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';                
	                            scope.pullDown();
	                        } else if (pullUpEl.className.match('flip')) {
	                            pullUpEl.className += ' loading';
	                            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';                
	                            scope.pullUp();
	                        }
	                    }
	                }

	                if( scope.pullRefresh && isDef(attr.pullDown) && isDef(attr.pullUp) ) angular.extend(options, refreshOption);

	                angular.extend(iscroll.options, options);

	                iscroll.refresh();
	            };

	            $timeout(iscrollOnLoad, 400);
	        }
	    }
	}]);

})(window, window.angular);