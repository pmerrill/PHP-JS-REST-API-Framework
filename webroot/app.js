$('document').ready(function(){

    // "Click" the submit button on specific keyup event.
    $('#search').keyup(function(event){
        if (event.key === 'Enter') {
            $('#submit').click();
        }
    });

    $('#submit').on('click', function (){
        display.submitButton = $(this);

        //
        source[api.source].path[api.endpoint].param.default.setValue();

        //
        let isValid = api.checkSourceParam.isValid( source[api.source].path[api.endpoint].param.default );

        if(!isValid) {
            display.render.error('<b>Oops!</b> Looks like you forgot to enter something. <i class="far fa-smile-wink"></i>');
            return false;
        } else {
        
            //
            api.call();

        }

    });

});

//
const api = {

    //
    source: $('#api').data('source'),
    endpoint: $('#api').data('endpoint'),

    // 
    checkSourceParam: {
        isValid: function(param){
            let isValid = this.isValidLength(param);
            isValid = !isValid ? this.isValidNumber(param) : isValid;
            return isValid;
        },
        isValidLength: function(param){
            return param.value.length > 0;
        },
        isValidNumber: function(param){
            return param.value > 0;
        }
    },

    //
    call: function(){
        
        // 
        display.state.loading();
        
        //
        $.get( 
            source[api.source].path[api.endpoint].endpoint,
            this.parameters()
        )
        .fail(function() {
            display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Bummer!</b> There was a problem completing your request.');
        })
        .done(function(response) {

            //
            api.response.status = response['status'];
            api.response.results = response['result'];
            api.response.info = response['info'];
        
            //
            if (api.response.hasError()) {
                display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Uh oh!</b> ' + api.response.status['message'])
            } else {
                display.render.results();
                display.render.info();
            }

        })
        .always(function() {
            display.state.doneLoading();
            return false;
        })
    },

    //
    parameters: function(){
        let output = {};
        
        let sourceParams = source[api.source].path[api.endpoint].param;
        
        for(const property in sourceParams){
            let name = sourceParams[property].name;
            output[name] = sourceParams[property].value;
        }

        return output;
    },

    //
    response: {
        status: {},
        results: {},
        info: {},
        hasError: function() {
            let hasError = this.isNull();
            hasError = !hasError ? this.hasInvalidRoot() : hasError;
            hasError = !hasError ? this.hasErrorCode() : hasError;
            return hasError;
        },
        isNull: function(){
            return this.results === null;
        },
        hasInvalidRoot: function(){
            return Object.keys(this.results[0]).length === 0;
        },
        hasErrorCode: function(){
            return this.status['code'] !== this.successStatusCode;
        },
        successStatusCode: 200
    },

}

//
const display = {
    submitButton: null,
    hasMessages: function(){
        return !$('#messages').is(':empty');
    },
    render: {
        error: function(message){
            $('#results').addClass('d-none');
            $('#info').addClass('d-none');
            $('#messages').empty().append('<div class="error text-danger mt-2">' + message + '</div>').removeClass('d-none');
        },
        loading: function(element){
            return element !== null ? element.html('<div class="spinner-border spinner-border-sm"" role="status"><span class="visually-hidden">Loading...</span></div>') : true;
        },
        emptyMessages: function(){
            return $('#messages').empty();
        },
        emptyInfo: function(){
            return $('#info').empty();
        },
        disabledForm: function(){
            return $('#search').attr('disabled', true);
        },
        emptyResults: function(){
            return $('#results').addClass('d-none').empty();
        },
        searchIcon: function(element){
            return element !== null ? element.html('<i class="fas fa-search fs-6"></i>') : true;
        },
        enabledForm: function(){
            return $('#search').attr('disabled', false);
        },

        //
        results: function(){
            let apiSource = source[api.source].path[api.endpoint];
            
            for(const element of api.response.results){
                if(Object.keys(element).length > 0){
                    $('#results').append( apiSource.resultsFactory(element) );
                }
            }

            $('#results').removeClass('d-none');
        },

        //
        info: function(){
            let apiSource = source[api.source].path[api.endpoint];
            
            for(const element in api.response.info){
                $('#info').append( apiSource.infoFactory(element) );
            }

            $('#info').removeClass('d-none');
        }
    },
    state: {
        loading: function(){
            display.render.loading(display.submitButton);
            display.render.emptyMessages();
            display.render.emptyInfo();
            display.render.disabledForm();
            display.render.emptyResults();
        },
        doneLoading: function(){
            display.render.searchIcon(display.submitButton);
            display.render.enabledForm();
        }
    },
    helper: {
        numberWithCommas: function(number){
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
}