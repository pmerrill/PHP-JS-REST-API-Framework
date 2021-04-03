$('document').ready(function(){

    $('#search').keyup(function(event){
        if (event.key === 'Enter') {
            $('#submit').click();
        }
    });

    $('#submit').on('click', function (){
        display.submitButton = $(this);

        source[app.source].path[app.path].param.default.setValue();

        let isValid = app.checkSourceParam.isValid( source[app.source].path[app.path].param.default );
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

        output: function(apiResponse){
            let sourcePath = source[app.source].path[app.path];

            for(const property in sourcePath.response){
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
