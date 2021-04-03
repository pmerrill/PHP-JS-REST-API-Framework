const source = {

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
