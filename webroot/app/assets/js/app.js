$('document').ready(function(){

    // We want to listen for specific "keyup" events
    // that trigger a "click" on the submit button.
    $('#searchInput').keyup(function(event){
        if (isButtonClickKey(event.key)) {
            $('#searchButton').click();
        }
        display.render.emptyMessages();
    });

    function isButtonClickKey(eventKey){
        return eventKey === 'Enter';
    }

    // Go and get data when the submit button is "clicked",
    // but only after validating the input.
    $('#searchButton').on('click', function (){
        api.search.term = $('#searchInput').val();

        if(!api.search.isValid()) {
            display.render.error('<b>Oops!</b> Looks like you forgot to enter a search term. <i class="far fa-smile-wink"></i>');
            return false;
        } else {
            
            // Modify the UI so the user knows
            // we're working on their search.
            display.submitButton = $(this);
            display.state.loading();

            $.get( '/api/index.php', { search: api.search.term } )
            .fail(function() {
                display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Bummer!</b> There was a problem processing your search.');
            })
            .done(function(results) {
                api.response.results = results;

                if (api.response.hasError()) {
                    display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Uh oh!</b> ' + results['status']['message'])
                } else {
                    renderResults();
                }

            })
            .always(function() {
                display.state.doneLoading();
                return false;
            });
        
        }

    });

    function renderResults(){
        if (api.response.hasCategory()){
            
            let category = api.response.category();
            let results = api.response.results['result'];
            
            for(const element of results){
                $('#resultsArea').append( api.factory[category](element) );  
            }
            
            $('#resultsArea').removeClass('d-none');
        
        } else {
            display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Uh oh!</b> There was an internal error. No category was set.');
        }
    }

    const api = {
        search: {
            term: '',
            isValid: function(){
                return this.isValidLength();
            },
            isValidLength: function(){
                return this.term.length > 0;
            }
        },
        response: {
            results: [],
            hasError: function() {
                return !this.hasResults || this.hasErrorCode();
            },
            hasResults: function(){
                return this.results.length > 0;
            },
            hasErrorCode: function(){
                return this.results['status']['code'] !== this.successStatusCode;
            },
            successStatusCode: 200,
            category: function(){
                return this.hasCategory() ? this.results['info']['category'] : '';
            },
            hasCategory: function(){
                return typeof(this.results['info']['category']) !== 'undefined';
            }
        },
        // Properties must match the category set in a endpoint.
        factory: {
            RESTCountries: function(element) {
                return generateCountry(element);
            },
            /*MetaWeather: function(element) {
                return generateWeather(element);
            }*/
        }
    }

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

    function generateCountry(element){
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

});