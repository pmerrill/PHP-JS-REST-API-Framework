$('document').ready(function(){

    // "Click" the submit button on specific keyup event.
    $('#searchInput').keyup(function(event){
        if (event.key === 'Enter') {
            $('#searchButton').click();
        }
    });

    $('#searchButton').on('click', function (){
        api[api.host].param.search.value = $('#searchInput').val();

        if(!api[api.host].param.search.isValid()) {
            display.render.error('<b>Oops!</b> Looks like you forgot to enter a search term. <i class="far fa-smile-wink"></i>');
            return false;
        } else {
            
            display.submitButton = $(this);
            display.state.loading();

            $.get(
                api[api.host].endpoint,
                api.parameters()
            )
            .fail(function() {
                display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Bummer!</b> There was a problem processing your search.');
            })
            .done(function(response) {
                api.response.results = response['result'];
                api.response.status = response['status'];

                if (api.response.hasError()) {
                    display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Uh oh!</b> ' + api.response.status['message'])
                } else {
                    display.render.results();
                }

            })
            .always(function() {
                display.state.doneLoading();
                return false;
            });
        
        }

    });

    const display = {
        submitButton: null,
        hasMessages: function(){
            return !$('#messageArea').is(':empty');
        },
        render: {
            error: function(message){
                $('#resultsArea').addClass('d-none');
                $('#messageArea').empty().append('<div class="error text-danger mt-2">' + message + '</div>').removeClass('d-none');
            },
            loading: function(element){
                return element.html('<div class="spinner-border spinner-border-sm"" role="status"><span class="visually-hidden">Loading...</span></div>');
            },
            emptyMessages: function(){
                return $('#messageArea').empty();
            },
            disabledForm: function(){
                return $('#searchInput').attr('disabled', true);
            },
            emptyResults: function(){
                return $('#resultsArea').addClass('d-none').empty();
            },
            searchIcon: function(element){
                return element.html('<i class="fas fa-search fs-6"></i>');
            },
            enabledForm: function(){
                return $('#searchInput').attr('disabled', false);
            },
            results: function(){
                for(const element of api.response.results){
                    $('#resultsArea').append( api[api.host].factory(element) );  
                }
                $('#resultsArea').removeClass('d-none');
            }
        },
        state: {
            loading: function(){
                display.render.loading(display.submitButton);
                display.render.emptyMessages();
                display.render.disabledForm();
                display.render.emptyResults();
            },
            doneLoading: function(){
                display.render.searchIcon(display.submitButton);
                display.render.enabledForm();
            }
        }
    }
    
    const api = {
        host: $('#searchArea').data('host'),
        
        //
        RESTCountries: {
            endpoint: '/api/index.php',
            param: {
                search: {
                    value: '',
                    isValid: function(){
                        return this.isValidLength();
                    },
                    isValidLength: function(){
                        return this.value.length > 0;
                    }
                },
                fields: {
                    value: 'alpha2Code;alpha3Code;flag;languages;name;population;region;subregion'
                }
            },

            //
            factory: function(element) {
                return this.generate(element);
            },
            generate: function(element){
                let output = '';
                output += '<div class="list-group">';
                output += '     <div class="list-group-item list-group-item-action">';
                output += '         <div class="d-flex w-100 justify-content-between">';
                output += '             <img src="' + element['flag'] + '" class="w-100">';
                output += '             <h5 class="mb-1">' + element['name'] + '</h5>';
                output += '             <small>' + element['alpha2Code'] + ' ' + element['alpha3Code'] + '</small>';
                output += '         </div>';
                output += '         <p class="mb-1">' + element['region'] + '' + element['subregion'] + '</p>';
                output += '         <small>' + element['population'] + '</small>';
                output += '         <small>' + JSON.stringify(element['languages']) + '</small>';
                output += '     </div>';
                output += '</div>';
                return output;
            }
        },

        //
        parameters: function(){
            let output = {};
            let params = api[api.host].param;
            for(const property in params){
                output[property] = params[property].value;
            }
            return output;
        },

        //
        response: {
            results: {},
            status: {},
            hasError: function() {
                return !this.hasResults || this.hasErrorCode();
            },
            hasResults: function(){
                return this.results.length > 0;
            },
            hasErrorCode: function(){
                return this.status['code'] !== this.successStatusCode;
            },
            successStatusCode: 200
        },

    }

});