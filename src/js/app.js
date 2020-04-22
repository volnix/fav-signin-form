import $ from "jquery";
import Swal from "sweetalert2";

let timerInterval

let validateForm = () => {
    return $('#zip').val() && $('input[name="first_time"]:checked').val() && $('#reason').val() && $('#people').val();
};

$(() => {
    $('.required-label').append('<span class="required-indicator">*</span>');

    //$('#why_surrender-wrapper').hide();

    $('#reason').change(() => {
        if ($('#reason').val().match(/Need to surrender/)) {
            $('#why_surrender-wrapper').show();
            $('#why_surrender').addClass('required-input');
        } else {
            $('#why_surrender-wrapper').hide();
            $('#why_surrender').removeClass('required-input');
        }
    });

    $('form').submit((e) => {

        e.preventDefault();
    
        if (validateForm()) {
    
            let data = {
                zip: $('#zip').val(),
                first_time: $('input[name="first_time"]:checked').val(),
                reason: $('#reason').val(),
                people: $('#people').val(),
                why_surrender: $('#why_surrender').val(),
                hear: $('#hear').val()
            };
    
            $.ajax({
                type: "POST",
                url: "https://akii9ff1cj.execute-api.us-east-1.amazonaws.com/signin",
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json"
                },
                error: (response) => {
                    let res = response.getAllResponseHeaders();
                    debugger;
                },
                success: (response) => {
                    debugger;
                    Swal.fire({
                        icon: 'success',
                        title: 'Thank you!',
                        text: 'Thank you for signing in.  Please enjoy your visit!',
                        timer: 10000,
                        onBeforeOpen: () => {
                                timerInterval = setInterval(() => {
                            }, 100);
                        },
                        onClose: () => {
                            clearInterval(timerInterval);
                            location.reload();
                        }
                    });
                }
            });
            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'All fields required',
                text: 'All fields are required.  Please fill out all fields and try again!',
                timer: 3000,
                onBeforeOpen: () => {
                        timerInterval = setInterval(() => {
                    }, 100);
                },
                onClose: () => {
                    clearInterval(timerInterval);
                }
            });
        }
    });
});