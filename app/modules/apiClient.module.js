(function () {
    'use strict';

    function BaseEntity(data) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }

    function JobEntity(data) {
        BaseEntity.call(this, data);
    }

    JobEntity.prototype = Object.create(BaseEntity.prototype);

    JobEntity.status = {
        open: { id: 0, label: 'Open' },
        closed: { id: 1, label: 'Closed' },
        inProgress: { id: 2, label: 'In Progress' },
    };

    JobEntity.prototype.getTextStatus = function () {
        for (let key in JobEntity.status) {
            let status = JobEntity.status[key];
            if (status.id === this.status) {
                return status.label;
            }
        }

        return '?';
    };

    function QuoteEntity(data) {
        BaseEntity.call(this, data);
    }

    QuoteEntity.prototype = Object.create(BaseEntity.prototype);

    let BaseApiClient = (function () {
        let BASE_URL = 'http://localhost:8001',
            $httpClient,
            Entity;

        let makeEntities = function (data) {
            let entities = [];

            if (data.hasOwnProperty('id')) {
                data = [data];
            }

            for (let i in data) {
                if (data.hasOwnProperty(i)) {
                    entities.push(new Entity(data[i]));
                }
            }

            return entities;
        }

        let requestFailed = function () {
            console.log('Request Failed');
        }

        function BaseApiClient($http, BaseEntity) {
            $httpClient = $http;
            Entity = BaseEntity;
        }

        BaseApiClient.prototype.get = function (endpoint) {
            return $httpClient({
                url: BASE_URL + endpoint,
                method: "GET"
            }).then(function (response) {
                let data = [];

                // single
                if (response.hasOwnProperty('data')) {
                    data = response.data;
                }

                // multiple items
                if (data.hasOwnProperty('data') && Array.isArray(data.data)) {
                    data = data.data;
                }

                response.data.items = makeEntities(data);
                return response.data;
            }, requestFailed);
        }

        BaseApiClient.prototype.post = function (endpoint, entity, callbackFn) {
            return $httpClient({
                url: BASE_URL + endpoint,
                method: "POST",
                data: entity,
            }).then(function (response) {
                if (callbackFn && response.hasOwnProperty('data')) {
                    callbackFn(response.data);
                }
            }, requestFailed);
        }

        BaseApiClient.prototype.put = function (endpoint, entity, callbackFn) {
            return $httpClient({
                url: BASE_URL + endpoint,
                method: "PUT",
                data: entity,
            }).then(function (response) {
                if (callbackFn && response.hasOwnProperty('data')) {
                    callbackFn(response.data);
                }
            }, requestFailed);
        }

        return BaseApiClient;
    })();

    function JobApiClient($http) {
        BaseApiClient.call(this, $http, JobEntity);
    }

    JobApiClient.prototype = Object.create(BaseApiClient.prototype);

    JobApiClient.prototype.get = function (id) {
        return BaseApiClient.prototype.get.call(this, '/job/' + id);
    }

    JobApiClient.prototype.getAll = function () {
        return BaseApiClient.prototype.get.call(this, '/job');
    }

    JobApiClient.prototype.create = function (job, callbackFn) {
        return BaseApiClient.prototype.post.call(this, '/job', job, callbackFn);
    }

    JobApiClient.prototype.update = function (job, callbackFn) {
        let data = {
            status: Number.parseInt(job.status),
            description: job.description,
        },
            statusIsValid = false;

        for (let key in JobEntity.status) {
            let status = JobEntity.status[key];
            if (status.id === data.status) {
                statusIsValid = true;
                break;
            }
        }

        if (!statusIsValid) {
            console.log('Validation error!');
        } else {
            return BaseApiClient.prototype.put.call(this, '/job/' + job.id, data, callbackFn);
        }
    }

    function QuoteApiClient($http) {
        BaseApiClient.call(this, $http, QuoteEntity);
    }

    QuoteApiClient.prototype = Object.create(BaseApiClient.prototype);

    QuoteApiClient.prototype.get = function (id) {
        return BaseApiClient.prototype.get.call(this, '/quote/' + id);
    }

    QuoteApiClient.prototype.getAll = function () {
        return BaseApiClient.prototype.get.call(this, '/quote');
    }

    angular.module('elogbooks.apiClient', [])
        .service('apiClient', function() {
            this.job = JobApiClient;
            this.jobEntity = JobEntity;
            this.quote = QuoteApiClient;
        });
})();
