(function (){
    'use strict';

    angular
        .module('elogbooks.job', ['elogbooks.apiClient'])
        .config(registerRoutes)
        .factory('jobService', ['$http', 'apiClient', ($http, apiClient) => {
            return new apiClient.job($http);
        }]);

    function registerRoutes($stateProvider) {
        $stateProvider
            .state('jobs', {
                abstract: true,
                url: '/jobs',
                template: '<ui-view/>'
            })
            .state('jobs.list', {
                url: '/list',
                controller: 'JobListController',
                controllerAs: 'vm',
                templateUrl: 'modules/job/list/list.html',
                resolve: {
                    jobCollectionResponse : jobService => jobService.getAll()
                }
            })
            .state('jobs.create', {
                url: '/create',
                controller: 'JobCreateController',
                controllerAs: 'vm',
                templateUrl: 'modules/job/create/create.html',
            })
            .state('jobs.view', {
                url: '/view/{id}',
                controller: 'JobViewController',
                controllerAs: 'vm',
                templateUrl: 'modules/job/view/view.html',
                resolve: {
                    jobResponse : function ($stateParams, jobService) {
                        return jobService.get($stateParams.id);
                    }
                }
            })
    }
})();
