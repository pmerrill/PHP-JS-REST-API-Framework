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