$('document').ready(function(){

    // "Click" the submit button on specific keyup event.
    $('#search').keyup(function(event){
        if (event.key === 'Enter') {
            $('#submit').click();
        }
    });

    $('#submit').on('click', function (){
        ui.submitButton = $(this);

        // Access the default parameter for this data source.
        let sourceDefaultParameter = source[api.source].path[api.path].parameters.default;

        sourceDefaultParameter.setValue();
        
        // Validate the default parameter value.
        if(sourceDefaultParameter.value.toString().length > 0) {
            api.call();
        } else {
            ui.state.error('<b>Oops!</b> Looks like you forgot to enter something. <i class="far fa-smile-wink"></i>');
            return false;
        }

    });

});

const api = {

    // Get the API source and endpoint set in the UI.
    source: $('body').data('source'),
    path: $('body').data('path'),

    // Makes a call to the API endpoint and handles the response.
    call: function(){
        
        ui.state.loading();
        
        $.get(
            source[api.source].path[api.path].endpoint,
            api.getSourceParameters()
        )
        .fail(function() {
            ui.state.error('<i class="fas fa-exclamation-circle"></i> <b>Bummer!</b> There was a problem completing your request.');
        })
        .done(function(response) {
            ui.build(response);
        })
        .always(function() {
            ui.state.doneLoading();
            return false;
        });
    },

    // Access source path parameters
    // and generate a parameters object that we can pass with the API call.
    getSourceParameters: function(){
        let parameters = {};
    
        let sourcePathParameters = source[api.source].path[api.path].parameters;
        
        for(const property in sourcePathParameters){
            
            let name = sourcePathParameters[property].name;

            // Add the parameter to the parameters object.
            parameters[name] = sourcePathParameters[property].value;

        }

        return parameters;
    }

}

const ui = {
    
    // This gets set to whatever element triggered the API call.
    // Storing it here lets us change it to a loading spinner, etc.
    submitButton: null,
    
    state: {
        loading: function(){
            ui.loadingSpinner(ui.submitButton);
            ui.emptyDisplay();
            ui.emptyMessages();
            ui.disabledForm();
        },
        error: function(message){
            ui.emptyDisplay();
            $('#messages').empty().append('<div class="error text-danger mt-2">' + message + '</div>').removeClass('d-none');
        },
        doneLoading: function(){
            ui.searchIcon(ui.submitButton);
            ui.enabledForm();
        }
    },
    loadingSpinner: function(element){
        return element !== null ? element.html('<div class="spinner-border spinner-border-sm"" role="status"><span class="visually-hidden">Loading...</span></div>') : true;
    },
    emptyDisplay: function(){
        return $('.display').addClass('d-none').empty();
    },
    emptyMessages: function(){
        $('#messages').empty();
    },
    disabledForm: function(){
        return $('#search').attr('disabled', true);
    },
    searchIcon: function(element){
        return element !== null ? element.html('<i class="fas fa-search fs-6"></i>') : true;
    },
    enabledForm: function(){
        return $('#search').attr('disabled', false);
    },

    // Access the source path response objects
    // and build the UI based on what the API response contains.
    build: function(apiResponse){

        let sourcePathResponse = source[api.source].path[api.path].response;

        for(const property in sourcePathResponse){
            
            // Map data from the API to the source response object property value.
            sourcePathResponse[property].value = apiResponse[property];

            if (sourcePathResponse[property].isValid()) {
                
                // Build the UI as defined by this source's response property.
                $('#api-' + property).append( sourcePathResponse[property].generateHTML() );
                $('#api-' + property).removeClass('d-none');

            } else {
                ui.state.error('<i class="fas fa-exclamation-circle"></i> <b>Uh oh!</b> There was a problem.');
            }

        } 
    }
    
}
