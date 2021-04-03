$('document').ready(function(){

    $('#search').keyup(function(event){
        if (event.key === 'Enter') {
            $('#submit').click();
        }
    });

    $('#submit').on('click', function (){
        display.submitButton = $(this);

        let isValid = true;
        
        // Check if parameters exist for this source
        if(!display.helper.isUndefined( source[app.source].path[app.path].param )) {
            
            source[app.source].path[app.path].param.default.setValue();
            
            isValid = app.helper.isValidParam( source[app.source].path[app.path].param.default );
        
        }
        
        if(!isValid) {
            display.render.error('<b>Oops!</b>');
            return false;
        } else {
            app.call();
        }

    });
});

const app = {
    source: $('#app').data('source'),
    path: $('#app').data('path'),

    // Performs the API call
    call: function(){
        display.state.loading();
        
        $.get( 
            source[app.source].path[app.path].endpoint,
            this.sourceParameters()
        )
        .fail(function() {
            display.render.error('<b>Bummer!</b>');
        })
        .done(function(response) {
            display.render.output(response);
        })
        .always(function() {
            display.state.doneLoading();
            return false;
        });
    },

    // Compiles the API call parameters
    sourceParameters: function(){
        let output = {};
        
        let sourceParams = source[app.source].path[app.path].param;
        
        for(const property in sourceParams){
            let name = sourceParams[property].name;
            output[name] = sourceParams[property].value;
        }

        return output;
    },

    helper: {
        
        // Source param validation
        isValidParam: function(param){
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
    }
}

const display = {
    submitButton: null,

    render: {
        error: function(message){
            this.emptyDisplay();
            $('#messages').empty().append(message).removeClass('d-none');
        },
        emptyMessages: function(){
            $('#messages').empty();
        },
        emptyDisplay: function(){
            return $('.display').addClass('d-none').empty();
        },
        loading: function(element){
            return element !== null ? element.html('Loading...') : true;
        },
        submitButton: function(element){
            return element !== null ? element.html('Submit') : true;
        },
        disabledForm: function(){
            return $('#search').attr('disabled', true);
        },
        enabledForm: function(){
            return $('#search').attr('disabled', false);
        },

        // Passes through the definitions in source.js.
        // Output is appended to the UI element with the same ID as the property.
        output: function(apiResponse){
            let sourcePath = source[app.source].path[app.path];

            for(const property in sourcePath.response){
                
                // Update the source path property value
                // with what we got from the API.
                sourcePath.response[property].value = apiResponse[property];

                if (!sourcePath.response[property].isValid()) {
                    display.render.error('<b>Uh oh!</b>');
                } else {
                    
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
            display.render.submitButton(display.submitButton);
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
