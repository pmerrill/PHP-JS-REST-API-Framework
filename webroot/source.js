//
const source = {
        
    // The name of this object should match whatever is set in the
    // in the data source attribute of <div id="app" data-source"...">.
    RESTCountries: {
        path: {
            
            // This object's name should match whatever is set in the
            // path data attribute of <div id="app" data-path="...">.
            default: {
                endpoint: '/api/rest-countries.php',

                // The contents of this object are compiled by sourceParameters() in app.js
                // and are passed to the endpoint as a query string.
                param: {

                    // A default parameter is required if triggering
                    // a call to this endpoint via a click.
                    default: {
                        name: 'search',
                        value: '',

                        // Required if users need to dynamically set the value of this parameter.
                        setValue: function(){
                            this.value = $('#search').val();
                        }
                    },

                    fields: {
                        name: 'fields',
                        value: 'alpha2Code;alpha3Code;flag;languages;name;population;region;subregion'
                    }
                },

                // Response objects are mapped to keys in the endpoint's response.
                // app.js will call build() on whatever you define in this object.
                // It is important to only put what you want rendered in here and to 
                // make sure that you include a build function that outputs the HTML you want in the UI.
                response: {

                    // This should exactly match a key provided by the api/[endpoint].php response.
                    // There should also be an element in the UI such as <div id="app-result" class="display">.
                    result: {

                        // This is set by app.js after a call is done.
                        // app.js iterates over the endpoint's response and updates all matching source.js response object values.
                        value: null,

                        // app.js uses this to build the UI for this response object.
                        // It appends the output to a specific UI element, which is <div id="app-result"></div> in this case.
                        build: function(){
                            let output = '';
                            
                            for(const object of this.value){
                                if(display.helper.hasKeys(object)){
                                    output += '<div class="list-group mb-3">';
                                    output += '     <div class="list-group-item list-group-item-action">';
                                    output += '         <div class="d-md-flex w-100 justify-content-between">';
                                    output += '             <div class="col-12 col-md-2 mb-3 mb-md-0">';
                                    output += '                 <img src="' + object['flag'] + '" class="w-75 rounded">';
                                    output += '             </div>';
                                    output += '             <div class="col-12 col-md-10">';
                                    output += '                 <h5 class="fw-bold mb-1">' + object['name'] + '</h5>';
                                    output += '                 <div class="table-responsive">';
                                    output += '                     <table class="table">';
                                    output += '                         <thead>';
                                    output += '                             <tr>';
                                    output += '                                 <th>Region</th>';
                                    output += '                                 <th>Subregion</th>';
                                    output += '                                 <th>Population</th>';
                                    output += '                                 <th>Language(s)</th>';
                                    output += '                                 <th>Alpha Codes</th>';
                                    output += '                             </tr>';
                                    output += '                         </thead>';
                                    output += '                         <tbody>';
                                    output += '                             <tr>';
                                    output += '                                 <td>' + object['region'] + '</td>';
                                    output += '                                 <td>' + object['subregion'] + '</td>';
                                    output += '                                 <td>' + display.helper.numberWithCommas(object['population']) + '</td>';
                                    output += '                                 <td>';
                                    for(const language of object['languages']){
                                        output += '                                 <small>' + language['name'] + '</small><br/>';
                                    }
                                    output += '                                 </td>';
                                    output += '                                 <td>';
                                    output += '                                     <small><strong>Alpha 2</strong>: ' + object['alpha2Code'] + '</small><br/>';
                                    output += '                                     <small><strong>Alpha 3</strong>: ' + object['alpha3Code'] + '</small>';
                                    output += '                                 </td>';
                                    output += '                             </tr>';
                                    output += '                         </tbody>';
                                    output += '                     </table>';
                                    output += '                 </div>';
                                    output += '             </div>';
                                    output += '         </div>';
                                    output += '     </div>';
                                    output += '</div>';
                                }
                            }

                            return output;
                        },

                        // app.js checks this before rendering the data via build().
                        isValid: function() {
                            let isValid = !display.helper.isUndefined(this.value);
                            isValid = isValid ? !display.helper.isNull(this.value) : isValid;
                            isValid = isValid ? display.helper.hasIndex(this.value, 0) : isValid;
                            return isValid;
                        }
                    },

                    // Defines what info gets rendered in <div id="app-info" class="display">.
                    info: {
                        value: null,
                        
                        build: function(){
                            let output = '';
                            output += '     <div class="table-responsive">';
                            output += '         <table class="table">';
                            output += '             <tbody>';
                            output +=                   this.content();
                            output += '             </tbody>';
                            output += '         </table>';
                            output += '     </div>';
                            return output;
                        },

                        content: function(){
                            let output = '';

                            // Add the key to the UI then generate the UI for the key's value.
                            for(const property in this.value){
                                output += '<tr>';
                                output += '     <td class="fw-bold capitalize">' + property + '</td>';
                                output += '     <td>' + this.subitem(property) + '</td>';
                                output += '</tr>';
                            }
                            return output;
                        },
                        
                        subitem: function(object){
                            let output = '';

                            // This handles an object that has keys with a plain value
                            // and keys with an array as the value.
                            if(display.helper.hasIndex(this.value, object)){
                                for(const property in this.value[object]){
                                    output += property + ': ' + this.value[object][property] + '<br/>';
                                }
                            } else {
                                output += this.value[object];
                            }

                            return output;
                        },

                        isValid: function() {
                            let isValid = !display.helper.isNull(this.value);
                            return isValid;
                        }
                    }
                }

            }
        },
    },

    // MetaWeather API integration
    MetaWeather: {
        path: {

            // Get the forecast for a specific location.
            default: {
                endpoint: '/api/bonus-work/weather.php',
                param: {
                    default: {
                        name: 'locationID',
                        value: 0,
                        setValue: function(){
                            this.value = $('#app').data('locationid');
                        }
                    }
                },
                response: {
                    result: {
                        value: null,
                        
                        build: function(){
                            let output = '';
                            
                            for(const object of this.value){
                                if(display.helper.hasKeys(object)){
                                    output += '<div class="list-group">';
                                    output += '     <div class="list-group-item list-group-item-action">';
                                    output += '         <div class="d-flex w-100 justify-content-between py-3">';
                                    output += '             <h5 class="mb-1">' + object['title'] + ' Weather Forecast</h5>';
                                    output += '             <small>Latitute/Longitude: ' + object['latt_long'] + '</small>';
                                    output += '         </div>';
                                    output += '         <div class="table-responsive">';
                                    output += '             <table class="table">';
                                    output += '                 <thead>';
                                    output += '                     <tr>';
                                    output += '                         <th>Date</th>';
                                    output += '                         <th>Min Temp</th>';
                                    output += '                         <th>Max Temp</th>';
                                    output += '                         <th>Weather</th>';
                                    output += '                     </tr>';
                                    output += '                 </thead>';
                                    output += '                 <tbody>';
                                    
                                    for(const day of object['consolidated_weather']){
                                        output += '                 <tr>';
                                        output += '                     <th scope="col">' + day['applicable_date'] + '</th>';
                                        output += '                     <td>' + Math.round(day['min_temp']) + '</td>';
                                        output += '                     <td>' + Math.round(day['max_temp']) + '</td>';
                                        output += '                     <td>' + day['weather_state_name'] + '</td>';
                                        output += '                 </tr>';
                                    }

                                    output += '                 </tbody>';
                                    output += '             </table>';
                                    output += '         </div>';
                                    output += '     </div>';
                                    output += '</div>';
                                }
                            }
                            
                            return output;
                        },

                        isValid: function() {
                            let isValid = !display.helper.isNull(this.value);
                            return isValid;
                        }
                    }
                }

            },

            // Search for a city by name.
            search: {
                endpoint: '/api/bonus-work/weather-search.php',
                param: {
                    default: {
                        name: 'query',
                        value: '',
                        setValue: function(){
                            this.value = $('#search').val();
                        }
                    }
                },
                response: {
                    result: {
                        value: null,
                        
                        build: function(){
                            let output = '';
                            for(const object of this.value){
                                if(display.helper.hasKeys(object)){
                                    output += '<div class="list-group">';
                                    output += '     <div class="list-group-item list-group-item-action mb-3">';
                                    output += '         <div class="d-flex w-100 justify-content-between pt-3 pb-1">';
                                    output += '             <h5 class="fw-bold mb-1">' + object['title'] + '</h5>';
                                    output += '             <small>Latitute/Longitude: ' + object['latt_long'] + '</small>';
                                    output += '         </div>';
                                    output += '         <p>Where On Earth ID (WOEID): <code>' + object['woeid'] + '</code></p>';
                                    output += '     </div>';
                                    output += '</div>';
                                }
                            }
                            return output;
                        },

                        isValid: function() {
                            let isValid = !display.helper.isNull(this.value);
                            return isValid;
                        }
                    }
                }
            }
        },
    },

    // Open Trivia Database Integration
    OpenTrivia: {
        path: {
            
            // Get a number of random trivia questions.
            default: {
                endpoint: '/api/bonus-work/trivia.php',
                param: {
                    default: {
                        name: 'amount',
                        value: 3
                    }
                },
                response: {
                    result: {
                        value: null,
                        
                        build: function(){
                            let output = '';
                            for(const object of this.value){
                                if(display.helper.hasKeys(object)){
                                    output += '<div class="list-group">';
                                    output += '     <div class="list-group-item list-group-item-action mb-3">';
                                    output += '         <div class="d-flex w-100 justify-content-between pt-3 pb-1">';
                                    output += '             <h5 class="mb-1"><strong>Q</strong>: ' + object['question'] + '</h5>';
                                    output += '         </div>';
                                    output += '         <p><strong>A</strong>: ' + object['correct_answer'] + '</p>';
                                    output += '     </div>';
                                    output += '</div>';
                                }
                            }
                            return output;
                        },

                        isValid: function() {
                            let isValid = !display.helper.isNull(this.value);
                            return isValid;
                        }
                    }
                }
            }
        },
    },

}