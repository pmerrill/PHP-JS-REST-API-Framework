const source = {

    // Get random trivia
    OpenTrivia: {
        path: {
            default: {
                endpoint: '/backend/api/trivia.php',
                
                param: {
                    default: {
                        name: 'amount',
                        value: 3
                    }
                },
                
                response: {

                    // Controls how we handle the list of trivia questions
                    // we get from the endpoint.
                    result: {
                        value: null,
                        
                        build: function(){
                            let output = '';
                            for(const object of this.value){
                                if(display.helper.hasKeys(object)){
                                    output += '<strong>Question</strong>: ' + object['question'];
                                    output += '<p><strong>Answer</strong>: ' + object['correct_answer'] + '</p>';
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

    // Get random cat facts
    CatFacts: {
        path: {
            default: {
                endpoint: '/backend/api/cat-facts.php',
                
                response: {

                    // Controls how we handle the list of facts from the endpoint.
                    result: {
                        value: null,
                        
                        build: function(){
                          let output = '';
                          for(const object of this.value){
                            if(display.helper.hasKeys(object)){
                              output +=  '<p>' + object['text'] + '</p>';
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

    // Get detaild country information
    RESTCountries: {
        path: {
            
            default: {
                endpoint: '/backend/api/rest-countries.php',

                param: {
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

 
                response: {

                    // Controls how we handle the list of countries we receive from the endpoint.
                    result: {
                        value: null,

                        build: function(){
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
                                if(display.helper.hasKeys(object)){
                                    output += '     <tr>';
                                    output += '         <td><img src="' + object['flag'] + '" style="width:100px;"></td>';
                                    output += '         <td>' + object['name'] + '</td>';
                                    output += '         <td>' + object['region'] + '</td>';
                                    output += '         <td>' + object['subregion'] + '</td>';
                                    output += '         <td>' + display.helper.numberWithCommas(object['population']) + '</td>';
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
                        },

                        isValid: function() {
                            let isValid = !display.helper.isUndefined(this.value);
                            isValid = isValid ? !display.helper.isNull(this.value) : isValid;
                            isValid = isValid ? display.helper.hasIndex(this.value, 0) : isValid;
                            return isValid;
                        }
                    },

                    // Controls how we handle the stats on the page.
                    // Number of countries, regions, etc.
                    info: {
                        value: null,
                        
                        build: function(){
                            let output = '';
                            output += '<table>';
                            output += '     <tbody>';
                            output +=           this.content();
                            output += '     </tbody>';
                            output += '</table>';
                            return output;
                        },

                        content: function(){
                            let output = '';
                            for(const property in this.value){
                                output += '<tr>';
                                output += '     <td>' + property + '</td>';
                                output += '     <td>' + this.subitem(property) + '</td>';
                                output += '</tr>';
                            }
                            return output;
                        },
                        
                        subitem: function(object){
                            let output = '';

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
    }

}
