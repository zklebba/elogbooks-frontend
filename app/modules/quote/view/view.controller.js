(function () {
    'use strict';

    angular
        .module('elogbooks.quote')
        .controller('QuoteViewController', ['quoteResponse', QuoteViewController]);

    function QuoteViewController(quoteResponse) {
        var vm = this;
        vm.quote = quoteResponse.items[0];
    }
})();
