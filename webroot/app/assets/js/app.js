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
            removeResults();
            disableForm();

            $.get( '/api/index.php', { search: searchInput } )
            .fail(function() {
                renderError('<i class="fas fa-exclamation-circle"></i> <b>Bummer!</b> There was a problem processing your search.');
            })
            .done(function(results) {
                processResults(results);
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

    function removeResults(){
        $('#resultsArea').addClass('d-none').empty();
    }

    function disableForm(){
        $('#searchInput').attr('disabled', true);
    }

    function processResults(results){
        resultsHaveError(results) ? renderError('<i class="fas fa-exclamation-circle"></i> <b>Uh oh!</b> ' + results['status']['message']) : renderResults(results);
    }

    function resultsHaveError(results){
        return results['status']['code'] !== successStatusCode();
    }

    function successStatusCode(){
        return 200;
    }

    function renderResults(results){
        $('#resultsArea').html(resultsTable(results)).removeClass('d-none');
    }

    function resultsTable(results){
        let table;
        table  = '<table class="table">';
        table += '  <thead>';
        table += '      <tr>';
        table += '          <th scope="col" colspan="2">Results</th>';
        table += '          <th scope="col">alpha2Code</th>';
        table += '          <th scope="col">alpha3Code</th>';
        table += '          <th scope="col">Region</th>';
        table += '          <th scope="col">Subregion</th>';
        table += '          <th scope="col">Languages</th>';
        table += '      </tr>';
        table += '  </thead>';
        table += '  <tbody>';
        table +=        generateCountryTableRows(results);
        table += '  </tbody>';
        table += '</table>';
        return table;
    }

    function generateCountryTableRows(results){
        let rows = '';
        let countries = results['result'];
        for(let index = 0; index < countries.length; index++){
            rows += '<tr>';
            rows += '   <td><img src="' + countries[index]['flag'] + '" class="w-100"></td>';
            rows += '   <td>' + countries[index]['name'] + '</td>';
            rows += '   <td>' + countries[index]['alpha2Code'] + '</td>';
            rows += '   <td>' + countries[index]['alpha3Code'] + '</td>';
            rows += '   <td>' + countries[index]['region'] + '</td>';
            rows += '   <td>' + countries[index]['subregion'] + '</td>';
            rows += '   <td>' + JSON.stringify(countries[index]['languages']) + '</td>';
            rows += '</tr>';
        }
        return rows;
    }

    function renderSearchIconIn(element){
        element.html('<i class="fas fa-search fs-6"></i>');
    }

    function enableForm(){
        $('#searchInput').attr('disabled', false);
    }

});