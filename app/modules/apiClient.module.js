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

    JobEntity.prototype.getTextStatus = function () {
        switch (this.status) {
            case 0: return 'Open';
            case 1: return 'Closed';
            case 2: return 'In Progress';
            default: return '?';
        }
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
            }, function () {
                console.log('Request Failed');
            });
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
            this.quote = QuoteApiClient;
        });
})();
