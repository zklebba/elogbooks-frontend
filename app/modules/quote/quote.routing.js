(function (){
    'use strict';

    angular
        .module('elogbooks.quote', ['elogbooks.apiClient'])
        .config(registerRoutes)
        .factory('quoteService', ['$http', 'apiClient', ($http, apiClient) => {
            return new apiClient.quote($http);
        }]);

    function registerRoutes($stateProvider) {
        $stateProvider
            .state('quotes', {
                abstract: true,
                url: '/quotes',
                template: '<ui-view/>'
            })
            .state('quotes.list', {
                url: '/list',
                controller: 'QuoteListController',
                controllerAs: 'vm',
                templateUrl: '/modules/quote/list/list.html',
                resolve: {
                    quoteCollectionResponse : quoteService => quoteService.getAll()
                }
            })
            .state('quotes.view', {
                url: '/view/{id}',
                controller: 'QuoteViewController',
                controllerAs: 'vm',
                templateUrl: 'modules/quote/view/view.html',
                resolve: {
                    quoteResponse : ($stateParams, quoteService) => quoteService.get($stateParams.id)
                }
            })
    }
})();
