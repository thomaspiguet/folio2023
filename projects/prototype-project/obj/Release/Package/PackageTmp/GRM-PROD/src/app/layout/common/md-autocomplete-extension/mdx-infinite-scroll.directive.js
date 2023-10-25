(
  function() {
    'use strict';
    angular
      .module('app.layout.common.md-autocomplete-extension')
      .directive('mdxInfiniteScroll', mdxInfiniteScroll);

    /* @ngInject */
    function mdxInfiniteScroll($log, $timeout) {      
      //Threshold. Scroller distance from the bottom of the list for fetch to be triggered.
      var THRESHOLD = 100;    
      
      var cdo = {
        require: 'mdAutocomplete',
        link: mdxInfiniteScrollLink
      };

      function mdxInfiniteScrollLink(scope, element, attrs, ctrl) {       
        validateAttributes(scope, attrs);
        var container = element.find('md-autocomplete-wrap').find('.md-virtual-repeat-scroller');
        angular.element(container).on('scroll', onScroll);   
        //onScroll event handler
        function onScroll(event) {
          var scrollingContainer = angular.element(event.target);
          var scrollingContainerHeight = Math.ceil(scrollingContainer.height());
          var scrollPosition = scrollingContainer[0].scrollHeight - scrollingContainer.scrollTop();
          var isScrollAtBottom = scrollPosition >= (scrollingContainerHeight - THRESHOLD) && 
          scrollPosition <= (scrollingContainerHeight + THRESHOLD);
          
          if (isScrollAtBottom && scrollingContainerHeight > 0) {
            var pipeFunction = scope.$eval(attrs.mdxInfiniteScroll);
            var totalRecordsCount = _.toNumber(scope.$eval(attrs.mdxTotalRecordsCount));
            if (ctrl.matches.length < totalRecordsCount) {
                //Unbind event handler at first, to prevent multiple call to the handler while scrolling in the "hot spot".
                scrollingContainer.off('scroll', onScroll);
                ctrl.loading = true; //Trigger linear-progress loading              
                //Function here will always return a promise, its an md-autocomplete requirement.
                pipeFunction().then(function (response) {
                  ctrl.loading = false;           
                  ctrl.focus(); //Needed to live refresh the list.
                }).finally(function () {
                  scrollingContainer.on('scroll', onScroll); //Rebind event handler after promise completion.
                });
            }
          }
        }
        //Here, we want to scroll at the top if search text of the autocomplete is changed/updated.
        scope.$watch(function() { 
          return ctrl.scope.searchText; 
        }, 
        function (newValue, oldValue) {
          if (newValue !== oldValue) {
            container.scrollTop(0);
          }
        });
      }

      function validateAttributes(scope, attrs) {
        if (attrs.mdxInfiniteScroll === '') {
          $log.error('mdxInfiniteScroll directive : mdxInfiniteScroll attribute is mandatory.');
        } else if (!_.isFunction(scope.$eval(attrs.mdxInfiniteScroll))) {
          $log.error('mdxInfiniteScroll directive : mdxInfiniteScroll attribute must be a function.');
        }
        if (attrs.mdxTotalRecordsCount === '') {
          $log.error('mdxInfiniteScroll directive : mdxTotalRecordsCount attribute is mandatory.');
        } else if (_.isNaN(_.toNumber(scope.$eval(attrs.mdxTotalRecordsCount)))) {
          $log.error('mdxInfiniteScroll directive : mdxTotalRecordsCount attribute must be a number.');
        }
      }

    return cdo;
  }
 }
)();
