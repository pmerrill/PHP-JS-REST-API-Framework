$('document').ready(function(){

    // We want to listen for specific "keyup" events
    // that trigger a "click" on the submit button.
    $('#input-search').keyup(function(event){
        if (isTriggerKeyup(event.key)) {
            $('.btn-search').click();
        }
        removeMessagesIfValidInput($(this).val());
    });

    function isTriggerKeyup(eventKey){
        let isEnterKey = eventKey === 'Enter';
        return isEnterKey;
    }

    function removeMessagesIfValidInput(input){
        let isMessageAreaEmpty = $('.message-area').is(':empty');
        if (!isMessageAreaEmpty && isValidInput(input)) {
            $('.message-area').empty();
        }
    }

    // Go and get data when the submit button is "clicked",
    // but only after validating the input.
    $('.btn-search').on('click', function (){
        const input = $('#input-search').val();

        if(!isValidInput(input)) {
            renderError();
            return false;
        } else {
            console.log('clicked => ' + input);
            
            let submitButton = $(this);
            renderLoadingSpinnerIn(submitButton);
            //renderSearchIconIn(submitButton);
        
        }

    });

    function isValidInput(input){
        let isValid = isValidInputLength(input);
        return isValid;
    }

    function isValidInputLength(input){
        return input.length > 0;
    }

    function renderError(){
        $('.results-area').addClass('d-none');
        $('.message-area').append('<div class="error text-danger mt-2"><b>Oops!</b> Looks like you forgot to enter a search term. <i class="far fa-smile-wink"></i></div>').removeClass('d-none');
    }

    function renderLoadingSpinnerIn(element){
        element.html('<div class="spinner-border spinner-border-sm"" role="status"><span class="visually-hidden">Loading...</span></div>')
    }

    function renderSearchIconIn(element){
        element.html('<i class="fas fa-search fs-6"></i>');
    }

});