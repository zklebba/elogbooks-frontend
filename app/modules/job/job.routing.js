(function (){
    'use strict';

    angular
        .module('elogbooks.job', [])
        .config(registerRoutes)
        .factory('jobService', ['$http', JobServiceFactory])

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

    function JobEntity(data) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }

    JobEntity.prototype.getTextStatus = function () {
        switch (this.status) {
            case 0: return 'Open';
            case 1: return 'Closed';
            case 2: return 'In Progress';
            default: return '?';
        }
    };

    function JobServiceFactory($http) {
        let BASE_URL = 'http://localhost:8001';

        let makeEntities = function (data) {
            let entities = [];

            if (data.hasOwnProperty('id')) {
                data = [data];
            }

            for (let i in data) {
                if (data.hasOwnProperty(i)) {
                    entities.push(new JobEntity(data[i]));
                }
            }

            return entities;
        }

        function JobService() {

        }

        JobService.prototype.get = function (id) {
            return $http({
                url: BASE_URL + '/job/' + id,
                method: "GET"
            }).then(function (response) {
                let items = makeEntities(response.data);
                response.data.item = items[0];
                return response.data;
            }, function () {
                console.log('Request Failed');
            });
        }

        JobService.prototype.getAll = function () {
            return $http({
                url: BASE_URL + '/job',
                method: "GET",
                params: {}
            }).then(function (response) {
                response.data.items = makeEntities(response.data.data);
                return response.data;
            }, function () {
                console.log('Request Failed');
            });
        }

        return new JobService();
    }
})();
