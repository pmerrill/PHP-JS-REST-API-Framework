//Write your javascript here, or roll your own. It's up to you.
//Make your ajax call to http://localhost:8765/api/index.php here
$('document').ready(function(){

    // Listen for the enter key then "click" the form button
    $('#input-search').keyup(function(event) {
        if (event.keyCode === 13) {
            $('.btn-search').click();
        }
    });

    // Handle button click
    $('.btn-search').on('click', function () {
        let input = $('#input-search').val();

        // 
        resetView();
        validate(input);

        //
        console.log('clicked => ' + input);
        $('.results-area').removeClass('d-none');
    });

    //
    function resetView(){
        $('.results-area').addClass('d-none');
        $('.message-area').addClass('d-none');
    }

    //
    function validate(input){
        if(input.length === 0) {
            $('.results-area').addClass('d-none');
            $('.message-area').removeClass('d-none');
            $('.message-area .error').html('<b>Error</b> The input was too short!');
            return false;
        }
    }
    
});