(function () {
    'use strict';

    angular
        .module('elogbooks.job')
        .controller('JobUpdateController', ['$http', '$state', 'apiClient', 'jobResponse', JobUpdateController]);

    function JobUpdateController($http, $state, apiClient, jobResponse) {
        var vm = this,
            jobApiClient = new apiClient.job($http);

        vm.job = jobResponse.items[0];
        vm.update = update;
        vm.statuses = apiClient.jobEntity.status;

        function update() {
            jobApiClient.update(vm.job, response => {
                $state.go('jobs.view', {id:response.id});
            });
        }
    }
})();
