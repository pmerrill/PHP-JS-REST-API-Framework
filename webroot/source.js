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
                    // Each param object must have a default property.
                    default: {
                        name: 'search',
                        value: '',
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
                    return this.generateCountry(element);
                },
                generateCountry: function(element){
                    let output = '';
                    output += '<div class="list-group mb-3">';
                    output += '     <div class="list-group-item list-group-item-action">';
                    output += '         <div class="d-md-flex w-100 justify-content-between">';
                    output += '             <div class="col-12 col-md-2 mb-3 mb-md-0">';
                    output += '                 <img src="' + element['flag'] + '" class="w-75 rounded">';
                    output += '             </div>';
                    output += '             <div class="col-12 col-md-10">';
                    output += '                 <h5 class="fw-bold mb-1">' + element['name'] + '</h5>';
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
                    output += '                                 <td>' + element['region'] + '</td>';
                    output += '                                 <td>' + element['subregion'] + '</td>';
                    output += '                                 <td>' + display.helper.numberWithCommas(element['population']) + '</td>';
                    output += '                                 <td>';
                    for(const language of element['languages']){
                        output += '                                 <small>' + language['name'] + '</small><br/>';
                    }
                    output += '                                 </td>';
                    output += '                                 <td>';
                    output += '                                     <small><strong>Alpha 2</strong>: ' + element['alpha2Code'] + '</small><br/>';
                    output += '                                     <small><strong>Alpha 3</strong>: ' + element['alpha3Code'] + '</small>';
                    output += '                                 </td>';
                    output += '                             </tr>';
                    output += '                         </tbody>';
                    output += '                     </table>';
                    output += '                 </div>';
                    output += '             </div>';
                    output += '         </div>';
                    output += '     </div>';
                    output += '</div>';
                    return output;
                },
                
                //
                infoFactory: function(element) {
                    return this.generateInfo(element);
                },
                generateInfo: function(element){
                    let output = '<h5 class="mt-3 fw-bold capitalize">' + element + '</h5> ';
                
                    if(Object.keys(api.response.info[element]).length > 0){
                        for(const property in api.response.info[element]){
                            output += property + ': ' + api.response.info[element][property] + '<br/>';
                        }
                    } else {
                        output += api.response.info[element];
                    }

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
                    output += '                     </tr>';
                    output += '                 </thead>';
                    output += '                 <tbody>';
                    
                    for(const day of element['consolidated_weather']){
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
                        value: 10
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