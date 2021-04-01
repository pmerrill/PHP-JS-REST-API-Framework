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
        source[app.source].path[app.endpoint].param.default.setValue();

        //
        let isValid = app.checkSourceParam.isValid( source[app.source].path[app.endpoint].param.default );

        if(!isValid) {
            display.render.error('<b>Oops!</b> Looks like you forgot to enter something. <i class="far fa-smile-wink"></i>');
            return false;
        } else {
        
            //
            app.call();

        }

    });

});

//
const app = {

    //
    source: $('#app').data('source'),
    endpoint: $('#app').data('endpoint'),

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
            source[app.source].path[app.endpoint].endpoint,
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
        })
    },

    //
    sourceParameters: function(){
        let output = {};
        
        let sourceParams = source[app.source].path[app.endpoint].param;
        
        for(const property in sourceParams){
            let name = sourceParams[property].name;
            output[name] = sourceParams[property].value;
        }

        return output;
    }

}

//
const display = {
    submitButton: null,
    render: {
        error: function(message){
            $('.display').addClass('d-none');
            $('#messages').empty().append('<div class="error text-danger mt-2">' + message + '</div>').removeClass('d-none');
        },
        emptyResults: function(){
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

        //
        output: function(response){
            let appSourcePath = source[app.source].path[app.endpoint];

            for(const property in appSourcePath.response){
                appSourcePath.response[property].value = response[property];

                if (appSourcePath.response[property].isInvalid()) {
                    display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Uh oh!</b> There was a problem.');
                } else {

                    let interface = appSourcePath.response[property].build();

                    $('#' + property).append(interface).removeClass('d-none');
                }

            }
        }
    },
    state: {
        loading: function(){
            display.render.loading(display.submitButton);
            display.render.emptyResults();
            display.render.disabledForm();
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