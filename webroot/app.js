$('document').ready(function(){

    // "Click" the submit button on specific keyup event.
    $('#search').keyup(function(event){
        if (event.key === 'Enter') {
            $('#submit').click();
        }
    });

    $('#submit').on('click', function (){

        // Make the element accessible via the display object.
        display.submitButton = $(this);

        // Set the default source path param value as defined in source.js.
        source[app.source].path[app.path].param.default.setValue();

        // Verify that the default value is valid.
        let isValid = app.checkSourceParam.isValid( source[app.source].path[app.path].param.default );

        if(!isValid) {
            display.render.error('<b>Oops!</b> Looks like you forgot to enter something. <i class="far fa-smile-wink"></i>');
            return false;
        } else {
        
            // Make a request to the source path 
            // endpoint and process the response.
            app.call();

        }

    });

});

//
const app = {

    // Get the source and endpoint set in the UI.
    // source = A top-level object in source.js.
    // path = A path object in source.js that defines this API call.
    source: $('#app').data('source'),
    path: $('#app').data('path'),

    // Contains functions for verifying the value of a source path parameter.
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

    // Makes a call to the API endpoint and handles the response.
    call: function(){
        
        display.state.loading();
        
        $.get( 

            // Get the endpoint as defined in source.js.
            source[app.source].path[app.path].endpoint,

            // Iterates over the source param object in source.js and creates a key-value object.
            this.sourceParameters()
        )
        .fail(function() {
            display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Bummer!</b> There was a problem completing your request.');
        })
        .done(function(response) {
            display.render.output(response);
        })
        .always(function() {
            display.state.doneLoading();
            return false;
        });
    },

    // Creates a key-value object from the source path params as defined in source.js.
    sourceParameters: function(){
        let output = {};
        
        let sourceParams = source[app.source].path[app.path].param;
        
        for(const property in sourceParams){
            let name = sourceParams[property].name;
            output[name] = sourceParams[property].value;
        }

        return output;
    }

}

// UI manipulation
const display = {

    // Set when a user clicks the submit button.
    submitButton: null,


    render: {
        error: function(message){
            this.emptyDisplay();
            $('#messages').empty().append('<div class="error text-danger mt-2">' + message + '</div>').removeClass('d-none');
        },
        emptyMessages: function(){
            $('#messages').empty();
        },
        emptyDisplay: function(){
            return $('.display').addClass('d-none').empty();
        },
        loading: function(element){
            return element !== null ? element.html('<div class="spinner-border spinner-border-sm"" role="status"><span class="visually-hidden">Loading...</span></div>') : true;
        },
        searchIcon: function(element){
            return element !== null ? element.html('<i class="fas fa-search fs-6"></i>') : true;
        },
        disabledForm: function(){
            return $('#search').attr('disabled', true);
        },
        enabledForm: function(){
            return $('#search').attr('disabled', false);
        },

        // Generate and render data as defined in source.js.
        output: function(apiResponse){

            // Simplify the logic by assigning to a variable.
            let sourcePath = source[app.source].path[app.path];

            // Iterate over the response object(s) defined in source.js.
            for(const property in sourcePath.response){
                
                sourcePath.response[property].value = apiResponse[property];

                if (!sourcePath.response[property].isValid()) {
                    display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Uh oh!</b> There was a problem.');
                } else {

                    // Builds the UI as defined by this source's response property.
                    let output = sourcePath.response[property].build();
                    $('#app-' + property).append(output).removeClass('d-none');
                
                }

            } 
        }
    },
    state: {
        loading: function(){
            display.render.loading(display.submitButton);
            display.render.emptyDisplay();
            display.render.emptyMessages();
            display.render.disabledForm();
        },
        doneLoading: function(){
            display.render.searchIcon(display.submitButton);
            display.render.enabledForm();
        }
    },
    helper: {
        isUndefined: function(value){
            return typeof(value) === 'undefined';
        },
        isNull: function(value){
            return value === null;
        },
        hasIndex: function(object, index){
            return Object.keys(object[index]).length > 0;
        },
        hasKeys: function(object){
            return Object.keys(object).length > 0;
        },
        numberWithCommas: function(number){
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
}