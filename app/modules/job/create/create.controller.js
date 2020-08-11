(function () {
    'use strict';

    angular
        .module('elogbooks.job')
        .controller('JobCreateController', ['$http', '$state', 'apiClient', JobCreateController]);

    function JobCreateController($http, $state, apiClient) {
        var vm = this,
            jobApiClient = new apiClient.job($http);

        vm.job = {
            description: null,
            status: apiClient.jobEntity.status.open.id
        };
        vm.create = create;

        function create() {
            jobApiClient.create(vm.job, response => {
                $state.go('jobs.view', {id:response.id});
            });
        }
    }
})();
