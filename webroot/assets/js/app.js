$('document').ready(function(){

    // We want to listen for specific "keyup" events
    // that trigger a "click" on the submit button.
    $('#searchInput').keyup(function(event){
        if (isButtonClickKey(event.key)) {
            $('#searchButton').click();
        }
        removeMessagesIfValidInput($(this).val());
    });

    function isButtonClickKey(eventKey){
        let isEnterKey = eventKey === 'Enter';
        return isEnterKey;
    }

    function removeMessagesIfValidInput(searchInput){
        let isMessageAreaEmpty = $('#messageArea').is(':empty');
        if (!isMessageAreaEmpty && isValidInput(searchInput)) {
            $('#messageArea').empty();
        }
    }

    // Go and get data when the submit button is "clicked",
    // but only after validating the input.
    $('#searchButton').on('click', function (){
        const searchInput = $('#searchInput').val();

        if(!isValidInput(searchInput)) {
            renderError('<b>Oops!</b> Looks like you forgot to enter a search term. <i class="far fa-smile-wink"></i>');
            return false;
        } else {
            
            // Modify the UI so the user knows
            // we're working on their search.
            const submitButton = $(this);
            renderLoadingSpinnerIn(submitButton);
            removeMessagesIfValidInput(searchInput);
            disableForm();

            $.get( '/api/index.php', { search: searchInput } )
            .fail(function() {
                renderError('<i class="fas fa-exclamation-circle"></i> <b>Bummer!</b> There was a problem processing your search.');
                return false;
            })
            .done(function(result) {
                $('#resultsArea').html(JSON.stringify(result)).removeClass('d-none');
            })
            .always(function() {
                renderSearchIconIn(submitButton);
                enableForm();
                return false;
            });
        
        }

    });

    function isValidInput(searchInput){
        let isValid = isValidInputLength(searchInput);
        return isValid;
    }

    function isValidInputLength(searchInput){
        return searchInput.length > 0;
    }

    function renderError(errorMessage){
        $('#resultsArea').addClass('d-none');
        $('#messageArea').append('<div class="error text-danger mt-2">' + errorMessage + '</div>').removeClass('d-none');
    }

    function renderLoadingSpinnerIn(element){
        element.html('<div class="spinner-border spinner-border-sm"" role="status"><span class="visually-hidden">Loading...</span></div>');
    }

    function disableForm(){
        $('#searchInput').attr('disabled', true);
    }

    function renderSearchIconIn(element){
        element.html('<i class="fas fa-search fs-6"></i>');
    }

    function enableForm(){
        $('#searchInput').attr('disabled', false);
    }

});