// Define API sources, their endpoints and parameters, 
// and generate HTML for the UI.
const source = {
    
    // REST Countries API integration.
    RESTCountries: {
        path: {
            
            // Define the endpoint we're going to use.
            default: {
                endpoint: '/backend/api/rest-countries.php',

                // Define this endpoint's parameters.
                parameters: {

                    // Required if triggering a call to this endpoint via click.
                    default: {
                        name: 'search',
                        value: '',

                        // Required if users need to dynamically set the value of this parameter.
                        setValue: function(){
                            this.value = $('#search').val();
                        }
                    },

                    // Optional parameter
                    fields: {
                        name: 'fields',
                        value: 'alpha2Code;alpha3Code;flag;languages;name;population;region;subregion'
                    }
                },

                // Define the items in the API's response that we want to use.
                // Add objects named after specific items in the API's response.
                response: {

                    // Template for the "result" item from the API's response.
                    result: {

                        // Updated to be whatever is in the "result" item in the API's response.
                        // This happens after the API call finishes, but before the UI is built.
                        value: null,

                        // Validate what we got from the API's response.
                        isValid: function() {
                            let isValid = !helper.isUndefined(this.value);
                            isValid = isValid ? !helper.isNull(this.value) : isValid;
                            isValid = isValid ? helper.hasIndex(this.value, 0) : isValid;
                            return isValid;
                        },

                        // Return HTML for use in the UI.
                        // Build the HTML using the contents of the "result" item in the API's response.
                        generateHTML: function(){
                            let output = '';
                            
                            for(const object of this.value){
                                output += '<table>';
                                output += '     <thead>';
                                output += '         <tr>';
                                output += '             <th>Flag</th>';
                                output += '             <th>Name</th>';
                                output += '             <th>Region</th>';
                                output += '             <th>Subregion</th>';
                                output += '             <th>Population</th>';
                                output += '             <th>Language(s)</th>';
                                output += '             <th colspan="2">Alpha Codes</th>';
                                output += '         </tr>';
                                output += '     </thead>';
                                output += '     <tbody>';
                                if(helper.hasKeys(object)){
                                    output += '     <tr>';
                                    output += '         <td><img src="' + object['flag'] + '" style="width:100px;"></td>';
                                    output += '         <td>' + object['name'] + '</td>';
                                    output += '         <td>' + object['region'] + '</td>';
                                    output += '         <td>' + object['subregion'] + '</td>';
                                    output += '         <td>' + helper.numberWithCommas(object['population']) + '</td>';
                                    output += '         <td>';
                                    for(const language of object['languages']){
                                        output += '         <small>' + language['name'] + '</small><br/>';
                                    }
                                    output += '         </td>';
                                    output += '         <td>' + object['alpha2Code'] + '</td>';
                                    output += '         <td>' + object['alpha3Code'] + '</td>';
                                    output += '     </tr>';
                                }
                                output += '     </tbody>';
                                output += '</table>';
                            }

                            return output;
                        }
                    },

                    // Template for the "info" item from the API's response.
                    info: {
                        value: null,

                        isValid: function() {
                            let isValid = !helper.isNull(this.value);
                            return isValid;
                        },
                        
                        generateHTML: function(){
                            let output = '';
                            output += '<table>';
                            output += '     <tbody>';
                            output +=           this.tableRows();
                            output += '     </tbody>';
                            output += '</table>';
                            return output;
                        },

                        tableRows: function(){
                            let output = '';
                            for(const property in this.value){
                                output += '<tr>';
                                output += '     <td>' + property + '</td>';
                                output += '     <td>' + this.tableRowContent(property) + '</td>';
                                output += '</tr>';
                            }
                            return output;
                        },
                        
                        tableRowContent: function(object){
                            let output = '';

                            if(helper.hasIndex(this.value, object)){
                                for(const property in this.value[object]){
                                    output += property + ': ' + this.value[object][property] + '<br/>';
                                }
                            } else {
                                output += this.value[object];
                            }

                            return output;
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
                endpoint: '/backend/api/weather.php',

                parameters: {
                    
                    default: {
                        name: 'locationID',
                        value: 0,
                        setValue: function(){
                            this.value = $('body').data('locationid');
                        }
                    }

                },

                response: {
                    
                    result: {
                        value: null,

                        isValid: function() {
                            let isValid = !helper.isNull(this.value);
                            return isValid;
                        },
                        
                        generateHTML: function(){
                            let output = '';
                            
                            for(const object of this.value){
                                if(helper.hasKeys(object)){
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
                        }
                    }

                }

            },

            // Search for a city by name.
            search: {
                endpoint: '/backend/api/weather-search.php',
                
                parameters: {
                    
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

                        isValid: function() {
                            let isValid = !helper.isNull(this.value);
                            return isValid;
                        },
                        
                        generateHTML: function(){
                            let output = '';
                            for(const object of this.value){
                                if(helper.hasKeys(object)){
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
                endpoint: '/backend/api/trivia.php',
                
                parameters: {
                    
                    default: {
                        name: 'amount',
                        value: 3
                    }

                },

                response: {
                    
                    result: {
                        value: null,

                        isValid: function() {
                            let isValid = !helper.isNull(this.value);
                            return isValid;
                        },
                        
                        generateHTML: function(){
                            let output = '';
                            for(const object of this.value){
                                if(helper.hasKeys(object)){
                                    output += '<strong>Question</strong>: ' + object['question'];
                                    output += '<p><strong>Answer</strong>: ' + object['correct_answer'] + '</p>';
                                }
                            }
                            return output;
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
                endpoint: '/backend/api/weather.php',

                parameters: {
                    
                    default: {
                        name: 'locationID',
                        value: 0,
                        setValue: function(){
                            this.value = $('body').data('locationid');
                        }
                    }

                },

                response: {
                    
                    result: {
                        value: null,

                        isValid: function() {
                            let isValid = !helper.isNull(this.value);
                            return isValid;
                        },
                        
                        generateHTML: function(){
                            let output = '';
                            
                            for(const object of this.value){
                                if(helper.hasKeys(object)){
                                    output += '<h5>' + object['title'] + ' Weather Forecast</h5>';
                                    output += '<small>Latitute/Longitude: ' + object['latt_long'] + '</small>';
                                    output += '<table>';
                                    output += '     <thead>';
                                    output += '         <tr>';
                                    output += '             <th>Date</th>';
                                    output += '             <th>Min Temp</th>';
                                    output += '             <th>Max Temp</th>';
                                    output += '             <th>Weather</th>';
                                    output += '         </tr>';
                                    output += '     </thead>';
                                    output += '     <tbody>';
                                    
                                    for(const day of object['consolidated_weather']){
                                        output += '     <tr>';
                                        output += '         <td>' + day['applicable_date'] + '</td>';
                                        output += '         <td>' + Math.round(day['min_temp']) + '</td>';
                                        output += '         <td>' + Math.round(day['max_temp']) + '</td>';
                                        output += '         <td>' + day['weather_state_name'] + '</td>';
                                        output += '     </tr>';
                                    }

                                    output += '     </tbody>';
                                    output += '</table>';
                                }
                            }
                            
                            return output;
                        }
                    }

                }

            },

            // Search for a city by name.
            search: {
                endpoint: '/backend/api/weather-search.php',
                
                parameters: {
                    
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

                        isValid: function() {
                            let isValid = !helper.isNull(this.value);
                            return isValid;
                        },
                        
                        generateHTML: function(){
                            let output = '';
                            for(const object of this.value){
                                if(helper.hasKeys(object)){
                                    output += '<h5>' + object['title'] + '</h5>';
                                    output += '<small>Latitute/Longitude: ' + object['latt_long'] + '</small>';
                                    output += '<p>Where On Earth ID (WOEID): <code>' + object['woeid'] + '</code></p>';
                                }
                            }
                            return output;
                        }
                    }

                }
            }
        },
    },

    // Get random cat facts
    CatFacts: {
        path: {
            default: {
                endpoint: '/backend/api/cat-facts.php',
                parameters: {},
                
                response: {

                    // Controls how we handle the list of facts from the endpoint.
                    result: {
                        value: null,
                        
                        isValid: function() {
                          let isValid = !helper.isNull(this.value);
                          return isValid;
                        },
                        
                        generateHTML: function(){
                          let output = '';
                          for(const object of this.value){
                            if(helper.hasKeys(object)){
                              output +=  '<p>' + object['text'] + '</p>';
                            }
                          }
                          return output;
                        }
                    }
                }
            }
        },
    }

}

const helper = {
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
