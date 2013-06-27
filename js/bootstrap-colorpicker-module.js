'use strict';

angular.module('colorpicker.module', [])
  .factory('colorpicker.helpers', function () {
    return {
      prepareValues: function(format) {
        var thisFormat = 'hex';
        if (format) {
          thisFormat = format;
        }
        return {
          name: thisFormat,
          transform: 'to' + (thisFormat === 'hex' ? thisFormat.charAt(0).toUpperCase() + thisFormat.slice(1) : thisFormat.length > 3 ? thisFormat.toUpperCase().slice(0, -1) : thisFormat.toUpperCase())
        };
      },
      updateView: function(element, value) {
        if (!value) {
          value = '';
        }
        element.val(value);
        element.data('colorpicker').color.setColor(value);
      }
    }
  })
  .directive('colorpicker', ['colorpicker.helpers', function(helper) {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, ngModel) {

        var thisFormat = {name: 'hex'},
            show, hide;
        
        scope.$watch(attrs.colorpicker, function(newVal, oldVal){
            if (typeof newVal === 'object') {
                //Object: {format: 'hex', show: 'show callback', hide: 'hide callback'}
                thisFormat = typeof newVal.format !== 'undefined' ? helper.prepareValues(newVal.format) : helper.prepareValues();
                show = typeof newVal.show !== 'undefined' ? $parse(newVal.show) : false;
                hide = typeof newVal.hide !== 'undefined' ? $parse(newVal.hide) : false;           
            } else {
                //String: 'hex'
                thisFormat = helper.prepareValues(newVal);
                show = false;
                hide = false;
            }
        }, true);

        element.colorpicker({format: thisFormat.name});
        if(!ngModel) return;

        element.colorpicker()
        .on('changeColor', function(event) {
          element.val(element.data('colorpicker').format(event.color[thisFormat.transform]()));
          scope.$apply(ngModel.$setViewValue(element.data('colorpicker').format(event.color[thisFormat.transform]())));
        })
        .on('show', function(event){
            if (show) {
                scope.$apply(function() {
                    show(scope);
                });
            }
        })
        .on('hide', function(event){
            if (hide) {
                scope.$apply(function() {
                    hide(scope);
                });
            }
        });

        ngModel.$render = function() {
          helper.updateView(element, ngModel.$viewValue) ;
        }
      }
    };
  }])
  .directive('colorpicker', ['colorpicker.helpers', function(helper) {
    return {
      require: '?ngModel',
      restrict: 'E',
      replace: true,
      transclude: false,
      scope: {
        componentPicker: '=ngModel',
        inputName: '@inputName',
        inputClass: '@inputClass',
        colorFormat: '@colorFormat'
      },
      template: '<div class="input-append color" data-color="rgb(0, 0, 0)" data-color-format="">' +
        '<input type="text" class="{{ inputClass }}" name="{{ inputName }}" ng-model="componentPicker" value="" />' +
        '<span class="add-on"><i style="background-color: {{componentPicker}}"></i></span>' +
        '</div>',

      link: function(scope, element, attrs, ngModel) {

        var thisFormat = {name: 'hex'},
            show, hide;
        
        scope.$watch(attrs.colorpicker, function(newVal, oldVal){
            if (typeof newVal === 'object') {
                //Object: {format: 'hex', show: 'show callback', hide: 'hide callback'}
                thisFormat = typeof newVal.format !== 'undefined' ? helper.prepareValues(newVal.format) : helper.prepareValues();
                show = typeof newVal.show !== 'undefined' ? $parse(newVal.show) : false;
                hide = typeof newVal.hide !== 'undefined' ? $parse(newVal.hide) : false;           
            } else {
                //String: 'hex'
                thisFormat = helper.prepareValues(newVal);
                show = false;
                hide = false;
            }
        }, true);

        element.colorpicker();
        if(!ngModel) return;

        var elementInput = angular.element(element.children()[0]);

        element.colorpicker()
        .on('changeColor', function(event) {
          elementInput.val(element.data('colorpicker').format(event.color[thisFormat.transform]()));
          scope.$parent.$apply(ngModel.$setViewValue(element.data('colorpicker').format(event.color[thisFormat.transform]())));
        })
        .on('show', function(event){
            if (show) {
                scope.$apply(function() {
                    show(scope);
                });
            }
        })
        .on('hide', function(event){
            if (hide) {
                scope.$apply(function() {
                    hide(scope);
                });
            }
        });

        ngModel.$render = function() {
          helper.updateView(element, ngModel.$viewValue) ;
        }
      }
    };
  }]);
