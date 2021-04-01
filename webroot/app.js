$('document').ready(function(){

    // "Click" the submit button on specific keyup event.
    $('#search').keyup(function(event){
        if (event.key === 'Enter') {
            $('#submit').click();
        }
    });

    $('#submit').on('click', function (){

        //
        const apiSource = source[api.source].path[api.endpoint];
        apiSource.param.default.setValue();

        let isValid = api.checkParam.isValid( apiSource.param.default );
        if(!isValid) {
            display.render.error('<b>Oops!</b> Looks like you forgot to enter something. <i class="far fa-smile-wink"></i>');
            return false;
        } else {
            
            display.submitButton = $(this);
            display.state.loading();

            $.get(
                apiSource.endpoint,
                api.parameters()
            )
            .fail(function() {
                display.render.error('<i class="fas fa-exclamation-circle"></i> <b>Bummer!</b> There was a problem completing your request.');
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

    const api = {

        //
        source: $('#api').data('source'),
        endpoint: $('#api').data('endpoint'),

        //
        checkParam: {
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
        parameters: function(){
            let output = {};
            let params = source[api.source].path[api.endpoint].param;
            for(const property in params){
                let name = params[property].name;
                output[name] = params[property].value;
            }
            return output;
        },

        //
        response: {
            results: {},
            status: {},
            hasError: function() {
                let hasError = !this.hasValidRoot();
                hasError = !hasError ? this.hasErrorCode() : hasError;
                return hasError;
            },
            hasValidRoot: function(){
                return Object.keys(this.results[0]).length > 0;
            },
            hasErrorCode: function(){
                return this.status['code'] !== this.successStatusCode;
            },
            successStatusCode: 200
        },

    }

    //
    const source = {
        
        //
        RESTCountries: {
            path: {
                
                //
                default: {
                    endpoint: '/api/rest-countries.php',

                    //
                    param: {
                        default: {
                            name: 'search',
                            value: '',

                            // Add a way to change the value of this parameter.
                            setValue: function(){
                                this.value = $('#search').val();
                            }
                        },
                        fields: {
                            name: 'fields',
                            value: 'alpha2Code;alpha3Code;flag;languages;name;population;region;subregion'
                        }
                    },
                    
                    //
                    resultsFactory: function(element) {
                        return this.generate(element);
                    },
                    generate: function(element){
                        let output = '';
                        output += '<div class="list-group">';
                        output += '     <div class="list-group-item list-group-item-action">';
                        output += '         <div class="d-flex w-100 justify-content-between">';
                        output += '             <div class="col-12 col-md-2">';
                        output += '                 <img src="' + element['flag'] + '" class="w-75">';
                        output += '             </div>';
                        output += '             <div class="col-12 col-md-10">';
                        output += '                 <h5 class="mb-1">' + element['name'] + '</h5>';
                        output += '                 <strong>alpha2Code</strong>: ';
                        output += '                 <small>' + element['alpha2Code'] + '</small><br/>';
                        output += '                 <strong>alpha2Code</strong>: ';
                        output += '                 <small>' + element['alpha3Code'] + '</small><br/>';
                        output += '                 <strong>Region</strong>: ';
                        output += '                 <small>' + element['region'] + '</small><br/>';
                        output += '                 <strong>Subregion</strong>: ';
                        output += '                 <small>' + element['subregion'] + '</small><br/>';
                        output += '                 <strong>Population</strong>: ';
                        output += '                 <small>' + element['population'] + '</small><br/>';
                        output += '                 <strong>Language(s)</strong>: ';
                        for(const language of element['languages']){
                            output += '             <small>' + language['name'] + '</small><br/>';
                        }
                        output += '             </div>';
                        output += '         </div>';
                        output += '     </div>';
                        output += '</div>';
                        return output;
                    }
                }
            },
        },

        //
        MetaWeather: {
            path: {
                
                //
                default: {
                    endpoint: '/api/bonus-work/weather.php',

                    //
                    param: {
                        default: {
                            name: 'locationID',
                            value: 0,

                            // Add a way to change the value of this parameter.
                            setValue: function(){
                                this.value = $('#api').data('locationid');
                            }
                        }
                    },
                    
                    //
                    resultsFactory: function(element) {
                        return this.generate(element);
                    },
                    generate: function(element){
                        let output = '';
                        output += '<div class="list-group">';
                        output += '     <div class="list-group-item list-group-item-action">';
                        output += '         <div class="d-flex w-100 justify-content-between py-3">';
                        output += '             <h5 class="mb-1">' + element['title'] + ' Weather Forecast</h5>';
                        output += '             <small>Latitute/Longitude: ' + element['latt_long'] + '</small>';
                        output += '         </div>';
                        output += '         <div class="table-responsive">';
                        output += '             <table class="table">';
                        output += '                 <thead>';
                        output += '                     <tr>';
                        output += '                         <th>Date</th>';
                        output += '                         <th>Min Temp</th>';
                        output += '                         <th>Max Temp</th>';
                        output += '                         <th>Weather</th>';
                        output += '                     <tr>';
                        output += '                 </thead>';
                        output += '                 <tbody>';
                        
                        for(const day of element['consolidated_weather']){
                            output += '                 <tr>';
                            output += '                     <th scope="col">' + day['applicable_date'] + '</th>';
                            output += '                     <td>' + Math.round(day['min_temp']) + '</td>';
                            output += '                     <td>' + Math.round(day['max_temp']) + '</td>';
                            output += '                     <td>' + day['weather_state_name'] + '</td>';
                            output += '                 <tr>';
                        }

                        output += '                 </tbody>';
                        output += '             </table>';
                        output += '         </div>';
                        output += '     </div>';
                        output += '</div>';
                        return output;
                    },

                },

                // 
                search: {
                    endpoint: '/api/bonus-work/weather-search.php',

                    //
                    param: {
                        default: {
                            name: 'query',
                            value: '',

                            // Add a way to change the value of this parameter.
                            setValue: function(){
                                this.value = $('#search').val();
                            }
                        }
                    },
                    
                    //
                    resultsFactory: function(element) {
                        return this.generate(element);
                    },
                    generate: function(element){
                        let output = '';
                        output += '<div class="list-group">';
                        output += '     <div class="list-group-item list-group-item-action mb-3">';
                        output += '         <div class="d-flex w-100 justify-content-between pt-3 pb-1">';
                        output += '             <h5 class="fw-bold mb-1">' + element['title'] + '</h5>';
                        output += '             <small>Latitute/Longitude: ' + element['latt_long'] + '</small>';
                        output += '         </div>';
                        output += '         <p>Where On Earth ID (WOEID): <code>' + element['woeid'] + '</code></p>';
                        output += '     </div>';
                        output += '</div>';
                        return output;
                    },

                }
            },
        },

        //
        OpenTrivia: {
            path: {
                
                //
                default: {
                    endpoint: '/api/bonus-work/trivia.php',

                    //
                    param: {
                        default: {
                            name: 'amount',
                            value: 0,

                            // Add a way to change the value of this parameter.
                            setValue: function(){
                                this.value = $('#api').data('amount');
                            }
                        }
                    },
                    
                    //
                    resultsFactory: function(element) {
                        return this.generate(element);
                    },
                    generate: function(element){
                        let output = '';
                        output += '<div class="list-group">';
                        output += '     <div class="list-group-item list-group-item-action mb-3">';
                        output += '         <div class="d-flex w-100 justify-content-between pt-3 pb-1">';
                        output += '             <h5 class="mb-1"><strong>Q</strong>: ' + element['question'] + '</h5>';
                        output += '         </div>';
                        output += '         <p><strong>A</strong>: ' + element['correct_answer'] + '</p>';
                        output += '     </div>';
                        output += '</div>';
                        return output;
                    },

                }
            },
        },

    }

    const display = {
        submitButton: null,
        hasMessages: function(){
            return !$('#messages').is(':empty');
        },
        render: {
            error: function(message){
                $('#results').addClass('d-none');
                $('#messages').empty().append('<div class="error text-danger mt-2">' + message + '</div>').removeClass('d-none');
            },
            loading: function(element){
                return element.html('<div class="spinner-border spinner-border-sm"" role="status"><span class="visually-hidden">Loading...</span></div>');
            },
            emptyMessages: function(){
                return $('#messages').empty();
            },
            disabledForm: function(){
                return $('#search').attr('disabled', true);
            },
            emptyResults: function(){
                return $('#results').addClass('d-none').empty();
            },
            searchIcon: function(element){
                return element.html('<i class="fas fa-search fs-6"></i>');
            },
            enabledForm: function(){
                return $('#search').attr('disabled', false);
            },
            results: function(){
                for(const element of api.response.results){
                    if(Object.keys(element).length > 0){
                        $('#results').append( source[api.source].path[api.endpoint].resultsFactory(element) );
                    }
                }
                $('#results').removeClass('d-none');
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
    

});