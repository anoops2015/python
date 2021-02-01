'use strict';
const FULL = 'full';

$(function() {


  /*
  |--------------------------------------------------------------------------
  | Configure your website
  |--------------------------------------------------------------------------
  |
  | We provided several configuration variables for your ease of development.
  | Read their complete description and modify them based on your need.
  |
  */

  page.config({

    /*
    |--------------------------------------------------------------------------
    | Google API Key
    |--------------------------------------------------------------------------
    |
    | Here you may specify your Google API key if you need to use Google Maps
    | in your application
    |
    | https://developers.google.com/maps/documentation/javascript/get-api-key
    |
    */

    googleApiKey: '',

    /*
    |--------------------------------------------------------------------------
    | Google Analytics Tracking
    |--------------------------------------------------------------------------
    |
    | If you want to use Google Analytics, you can specify your Tracking ID in
    | this option. Your key would be a value like: UA-12345678-9
    |
    */

    googleAnalyticsId: '',

    /*
    |--------------------------------------------------------------------------
    | Google reCAPTCHA
    |--------------------------------------------------------------------------
    |
    | reCAPTCHA protects you against spam and other types of automated abuse.
    | Please signup for an API key pair and insert your `Site key` value to the
    | following variable.
    |
    | http://www.google.com/recaptcha/admin
    |
    */

    reCaptchaSiteKey:  '',

    // See available languages: https://developers.google.com/recaptcha/docs/language
    reCaptchaLanguage: '',

    /*
    |--------------------------------------------------------------------------
    | Disable AOS on mobile
    |--------------------------------------------------------------------------
    |
    | If true, the Animate On Scroll animations don't run on mobile devices.
    |
    */

    disableAOSonMobile: true,

    /*
    |--------------------------------------------------------------------------
    | Smooth Scroll
    |--------------------------------------------------------------------------
    |
    | If true, the browser's scrollbar moves smoothly on scroll and gives your
    | visitor a better experience for scrolling.
    |
    */

    smoothScroll: true,

  });





  /*
  |--------------------------------------------------------------------------
  | Custom Javascript code
  |--------------------------------------------------------------------------
  |
  | Now that you configured your website, you can write additional Javascript
  | code below this comment. You might want to add more plugins and initialize
  | them in this file.
  |
  */

});


+function($){

        var validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //pattern2  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        //previous pattern /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/

        $('[data-form="captcha-mailer"]').each(function() {

            var form      = $(this),
                email     = form.find('[name="email"]'),
                message   = form.find('[name="message"]'),
                captcha   = form.find('[name="captcha"]'),
                onSuccess = form.dataAttr('on-success', null),
                onError   = form.dataAttr('on-error', null);

            form.on('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                form.find('.alert-success').hide();
                form.children('.alert-danger').remove();

                form.find('[required]').each(function() {
                    if ( $(this).val().length < 1 ) {
                        $(this).addClass('is-invalid');
                    }
                    else {
                        $(this).removeClass('is-invalid');
                    }
                });

                form.find('[type="email"]').each(function() {
                    if ( ! validEmail.test( $(this).val() ) ) {
                        $(this).addClass('is-invalid');
                    }
                    else {
                        $(this).removeClass('is-invalid');
                    }
                });

                if ( email.length ) {
                    if ( email.val().length < 1 || ! validEmail.test( email.val() ) ) {
                        email.addClass('is-invalid');
                        //return false;
                    }
                }

                if ( message.length ) {
                    if ( message.val().length < 1 ) {
                        message.addClass('is-invalid');
                        //return false;
                    }
                }

                if ( captcha.length ) {
                    if ( captcha.val().length < 1 ) {
                        captcha.addClass('is-invalid');
                        //return false;
                    }
                }

                if (form.find('.is-invalid').length) {
                    return false;
                }

                $.ajax({
                    type: "POST",
                    url: form.attr('action'),
                    data: form.serializeArray()
                })
                    .done( function( data ) {
                        var response = $.parseJSON( data );
                        if ( 'success' == response.status ) {
                            form.find('.alert-success').fadeIn(1000);
                            form.find(':input').val('');
                            if ( onSuccess !== null ) {
                                window[onSuccess]();
                            }
                        }
                        else {
                            captcha.val('');
                            form.prepend('<div class="alert alert-danger">'+ response.message +'</div>');
                            console.log( response.reason );
                            if ( onError !== null ) {
                                window[onError](response.reason);
                            }
                        }
                        //refresh captcha image
                        $('.captcha_pic').attr('src', 'simple-php-captcha.php?_CAPTCHA&' + $.now());
                    });

                return false;
            });


            form.find('[required], [type="email"]').each(function() {
                $(this).on('focus', function() {
                    $(this).removeClass('is-invalid');
                });
            });

            email.on('focus', function() {
                $(this).removeClass('is-invalid');
            });

            message.on('focus', function() {
                $(this).removeClass('is-invalid');
            });

            captcha.on('focus', function() {
                $(this).removeClass('is-invalid');
            });

        });

    $('[data-form="login-form"]').each(function() {

        var form      = $(this),
            email     = form.find('[name="email"]'),
            password   = form.find('[name="password"]');

        form.on('submit', function(e) {

            form.find('[required]').each(function() {
                if ( $(this).val().length < 1 ) {
                    $(this).addClass('is-invalid');
                }
                else {
                    $(this).removeClass('is-invalid');
                }
            });

            if ( email.length ) {
                if ( email.val().length < 1 || ! validEmail.test( email.val() ) ) {
                    email.addClass('is-invalid');
                    email.parent().addClass('is-invalid');
                    //return false;
                }
            }

            if ( password.length ) {
                if ( password.val().length < 1 ) {
                    password.addClass('is-invalid');
                    password.parent().addClass('is-invalid');
                    //return false;
                }
            }

            if (form.find('.is-invalid').length) {
                return false;
            }

            return true;
        });


        email.on('focus', function() {
            $(this).removeClass('is-invalid');
            $(this).parent().removeClass('is-invalid');
        });

        password.on('focus', function() {
            $(this).removeClass('is-invalid');
            $(this).parent().removeClass('is-invalid');
        });
    });

    $('[data-form="register-form"]').each(function() {

        var form                = $(this),
            email               = form.find('[name="email"]'),
            password            = form.find('[name="password"]'),
            confirmPassword     = form.find('[name="confirmPassword"]'),
            agree               = form.find('[name="agree"]'),
            captcha             = form.find('[name="captcha"]');

        form.on('submit', function(e) {

            form.find('[required]').each(function() {
                if ( $(this).val().length < 1 ) {
                    $(this).addClass('is-invalid');
                }
                else {
                    $(this).removeClass('is-invalid');
                }
            });

            if ( email.length ) {
                if ( email.val().length < 1 || ! validEmail.test( email.val() ) ) {
                    email.addClass('is-invalid');
                    email.parent().addClass('is-invalid');
                    //return false;
                }
            }

            if ( password.length ) {
                if ( password.val().length < 1 ) {
                    password.addClass('is-invalid');
                    password.parent().addClass('is-invalid');
                    //return false;
                }
            }

            if ( confirmPassword.length ) {
                if ( confirmPassword.val().length < 1 ) {
                    confirmPassword.addClass('is-invalid');
                    confirmPassword.parent().addClass('is-invalid');
                    //return false;
                }
            }

            if ( agree.length ) {
                if (!agree.is(':checked')) {
                    agree.addClass('is-invalid');
                    //return false;
                }
            }

            if ( captcha.length ) {
                if ( captcha.val().length < 1 ) {
                    captcha.addClass('is-invalid');
                    //return false;
                }
            }

            if (form.find('.is-invalid').length) {
                return false;
            }

            return true;
        });


        email.on('focus', function() {
            $(this).removeClass('is-invalid');
            $(this).parent().removeClass('is-invalid');
        });

        password.on('focus', function() {
            $(this).removeClass('is-invalid');
            $(this).parent().removeClass('is-invalid');
        });

        confirmPassword.on('focus', function() {
            $(this).removeClass('is-invalid');
            $(this).parent().removeClass('is-invalid');
        });

        agree.on('change', function() {
            $(this).removeClass('is-invalid');
        });

        captcha.on('focus', function() {
            $(this).removeClass('is-invalid');
        });
    });

    $('[data-form="reset-password-email-form"]').each(function() {

        var form                = $(this),
            email               = form.find('[name="email"]');

        form.on('submit', function(e) {

            form.find('[required]').each(function() {
                if ( $(this).val().length < 1 ) {
                    $(this).addClass('is-invalid');
                }
                else {
                    $(this).removeClass('is-invalid');
                }
            });

            if ( email.length ) {
                if ( email.val().length < 1 || ! validEmail.test( email.val() ) ) {
                    email.addClass('is-invalid');
                    email.parent().addClass('is-invalid');
                    //return false;
                }
            }
            if (form.find('.is-invalid').length) {
                return false;
            }

            return true;
        });


        email.on('focus', function() {
            $(this).removeClass('is-invalid');
            $(this).parent().removeClass('is-invalid');
        });

    });

    $('[data-form="reset-password-passwd-form"]').each(function() {

        var form                = $(this),
            password            = form.find('[name="password"]'),
            confirmPassword     = form.find('[name="confirmPassword"]');

        form.on('submit', function(e) {

            form.find('[required]').each(function() {
                if ( $(this).val().length < 1 ) {
                    $(this).addClass('is-invalid');
                }
                else {
                    $(this).removeClass('is-invalid');
                }
            });

            if ( password.length ) {
                if ( password.val().length < 1 ) {
                    password.addClass('is-invalid');
                    password.parent().addClass('is-invalid');
                    //return false;
                }
            }

            if ( confirmPassword.length ) {
                if ( confirmPassword.val().length < 1 ) {
                    confirmPassword.addClass('is-invalid');
                    confirmPassword.parent().addClass('is-invalid');
                    //return false;
                }
            }

            if (form.find('.is-invalid').length) {
                return false;
            }

            return true;
        });

        password.on('focus', function() {
            $(this).removeClass('is-invalid');
            $(this).parent().removeClass('is-invalid');
        });

        confirmPassword.on('focus', function() {
            $(this).removeClass('is-invalid');
            $(this).parent().removeClass('is-invalid');
        });

    });

    $('[data-form="generator-form"]').each(function() {
        var num100to9999Regex = RegExp('^([1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$');
        var form                = $(this),
            url                 = form.find('[name="url"]'),
            width               = form.find('[name="width"]'),
            height              = form.find('[name="height"]');

        form.on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $("#exampleModalLabel").html("Capturing screenshot ...");
            $("#preloader").removeClass("d-none");
            $("#downloadLink").addClass("d-none").attr("href", "");
            $("#screenshotLink").addClass("d-none").attr("href", "");
            $("#screenshotImage").addClass("d-none").attr("src", "");
            $("#resultMessage").addClass("d-none").html("");

            if ( url.length ) {
                if ( url.val().length < 1 ) {
                    url.addClass('is-invalid');
                }
            }

            if ( width.length ) {
                if ( width.val().length < 1 || !num100to9999Regex.test(width.val()) || parseInt(width.val()) > 1920) {
                    width.addClass('is-invalid');
                }
            }

            if ( height.length ) {
                if ( height.val().length < 1 ||  (height.val().toLowerCase() !== "full" && !num100to9999Regex.test(height.val()))) {
                    height.addClass('is-invalid');
                }
            }

            if (form.find('.is-invalid').length) {
                return false;
            }
            $("#modal-long").modal('show');
            console.log(form.serializeArray());
            if(window == window.top) {
                var start = new Date().getTime();
                $.ajax({
                    type: "POST",
                    url: "capture.php",
                    data: form.serializeArray()
                })
                    .done( function( data ) {
                        console.log(data);
                        var response = $.parseJSON( data );
                        $("#preloader").addClass("d-none");
                        if ( 'success' == response.status ) {
                            $("#exampleModalLabel").html("Your screenshot is ready.");
                            $("#downloadLink").removeClass("d-none").attr("href", response.link + '&attachment');
                            $("#screenshotLink").removeClass("d-none").attr("href", response.link);
                            $("#screenshotImage").removeClass("d-none").attr("src", response.link + '&' + Date.now());
                            if (typeof _paq != "undefined") {
                                _paq.push(['trackEvent', 'generator', 'screenshot', getDuration(start)]);
                            }
                        }
                        else {
                            $("#exampleModalLabel").html("Unable to capture screenshot.");
                            $("#resultMessage").removeClass("d-none").html(response.message);
                            if (typeof _paq != "undefined") {
                                _paq.push(['trackEvent', 'generator', 'screenshot-error', getDuration(start)]);
                            }
                        }
                        //refresh captcha image
                        if ($('.captcha-input').length) {
                            $('.captcha_pic').attr('src', 'simple-php-captcha.php?_CAPTCHA&' + $.now());
                            $('.captcha-input').val('');
                        }
                    });
            }


            return false;
        });

        url.on('focus', function() {
            $(this).removeClass('is-invalid');
        });

        width.on('focus', function() {
            $(this).removeClass('is-invalid');
        });

        height.on('focus', function() {
            $(this).removeClass('is-invalid');
        });

    });


    $('[data-form="homepage-form"]').each(function() {
        var form                = $(this),
            url                 = form.find('[name="url"]');

        form.on('submit', function(e) {
            document.cookie = "homepage-tab=screenshot; max-age=86400";
            e.preventDefault();
            e.stopPropagation();
            $("#exampleModalLabel").html("Capturing screenshot ...");
            $("#preloader").removeClass("d-none");
            $("#downloadLink").addClass("d-none").attr("href", "");
            $("#screenshotLink").addClass("d-none").attr("href", "");
            $("#screenshotImage").addClass("d-none").attr("src", "");
            $("#resultMessage").addClass("d-none").html("");

            if ( url.length ) {
                if ( url.val().length < 1 ) {
                    url.addClass('is-invalid');
                }
            }

            if (form.find('.is-invalid').length) {
                return false;
            }
            $("#modal-screenshot").modal('show');
            console.log(form.serializeArray());
            if(window == window.top) {
                var start = new Date().getTime();
                $.ajax({
                    type: "POST",
                    url: "capture.php",
                    data: form.serializeArray()
                })
                    .done( function( data ) {
                        console.log(data);
                        var response = $.parseJSON( data );
                        $("#preloader").addClass("d-none");
                        if ( 'success' == response.status ) {
                            $("#exampleModalLabel").html("Your screenshot is ready.");
                            $("#downloadLink").removeClass("d-none").attr("href", response.link + '&attachment');
                            $("#screenshotLink").removeClass("d-none").attr("href", response.link);
                            $("#screenshotImage").removeClass("d-none").attr("src", response.link + '&' + Date.now());
                            if (typeof _paq != "undefined") {
                                _paq.push(['trackEvent', 'home', 'screenshot', getDuration(start)]);
                            }
                        }
                        else {
                            $("#exampleModalLabel").html("Unable to capture screenshot.");
                            $("#resultMessage").removeClass("d-none").html(response.message);
                            if (typeof _paq != "undefined") {
                                _paq.push(['trackEvent', 'home', 'screenshot-error', getDuration(start)]);
                            }
                        }
                        //refresh captcha image
                        if ($('.captcha-input').length) {
                            $('.captcha_pic').attr('src', 'simple-php-captcha.php?_CAPTCHA&' + $.now());
                            $('.captcha-input').val('');
                        }
                    });
            }


            return false;
        });

        url.on('focus', function() {
            $(this).removeClass('is-invalid');
        });
    });

    $('[data-form="homepage-pdf-form"]').each(function() {
        var form                = $(this),
            url                 = form.find('[name="url"]');

        form.on('submit', function(e) {
            document.cookie = "homepage-tab=pdf; max-age=86400";
            e.preventDefault();
            e.stopPropagation();
            $("#exampleModalLabelPdf").html("Converting website to PDF ...");
            $("#preloaderPdf").removeClass("d-none");
            $("#downloadLinkPdf").addClass("d-none").attr("href", "");
            $("#resultMessagePdf").addClass("d-none").html("");
            $("#resultWrapperPdf").addClass("d-none").html("");

            if ( url.length ) {
                if ( url.val().length < 1 ) {
                    url.addClass('is-invalid');
                }
            }

            if (form.find('.is-invalid').length) {
                return false;
            }
            $("#modal-pdf").modal('show');
            console.log(form.serializeArray());
            if(window == window.top) {
                var start = new Date().getTime();
                $.ajax({
                    type: "POST",
                    url: "capture-pdf.php",
                    data: form.serializeArray()
                })
                    .done( function( data ) {
                        console.log(data);
                        var response = $.parseJSON( data );
                        $("#preloaderPdf").addClass("d-none");
                        if ( 'success' == response.status ) {
                            $("#exampleModalLabelPdf").html("Your PDF is ready.");
                            $("#downloadLinkPdf").removeClass("d-none").attr("href", response.link + '&attachment');
                            $("#resultWrapperPdf").removeClass("d-none").html("<object data='" + response.link + "' type='application/pdf' width='100%' height='600'>alt : <a target='_blank' href='" + response.link + "'>output.pdf</a></object>");
                            if (typeof _paq != "undefined") {
                                _paq.push(['trackEvent', 'home', 'pdf', getDuration(start)]);
                            }
                        }
                        else {
                            $("#exampleModalLabelPdf").html("Unable to create PDF.");
                            $("#resultMessagePdf").removeClass("d-none").html(response.message);
                            if (typeof _paq != "undefined") {
                                _paq.push(['trackEvent', 'home', 'pdf-error', getDuration(start)]);
                            }
                        }
                        //refresh captcha image
                        if ($('.captcha-input').length) {
                            $('.captcha_pic').attr('src', 'simple-php-captcha.php?_CAPTCHA&' + $.now());
                            $('.captcha-input').val('');
                        }
                    });
            }


            return false;
        });

        url.on('focus', function() {
            $(this).removeClass('is-invalid');
        });
    });

    $('[data-form="generator-pdf-form"]').each(function() {
        var form                = $(this),
            url                 = form.find('[name="url"]');

        form.on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $("#exampleModalLabelPdf").html("Converting website to PDF ...");
            $("#preloaderPdf").removeClass("d-none");
            $("#downloadLinkPdf").addClass("d-none").attr("href", "");
            $("#resultMessagePdf").addClass("d-none").html("");
            $("#resultWrapperPdf").addClass("d-none").html("");

            if ( url.length ) {
                if ( url.val().length < 1 ) {
                    url.addClass('is-invalid');
                }
            }

            if (form.find('.is-invalid').length) {
                return false;
            }
            $("#modal-pdf").modal('show');
            console.log(form.serializeArray());
            if(window == window.top) {
                var start = new Date().getTime();
                $.ajax({
                    type: "POST",
                    url: "capture-pdf.php",
                    data: form.serializeArray()
                })
                    .done( function( data ) {
                        console.log(data);
                        var response = $.parseJSON( data );
                        $("#preloaderPdf").addClass("d-none");
                        if ( 'success' == response.status ) {
                            $("#exampleModalLabelPdf").html("Your PDF is ready.");
                            $("#downloadLinkPdf").removeClass("d-none").attr("href", response.link + '&attachment');
                            $("#resultWrapperPdf").removeClass("d-none").html("<object data='" + response.link + "' type='application/pdf' width='100%' height='600'>alt : <a target='_blank' href='" + response.link + "'>output.pdf</a></object>");
                            if (typeof _paq != "undefined") {
                                _paq.push(['trackEvent', 'generator', 'pdf', getDuration(start)]);
                            }
                        }
                        else {
                            $("#exampleModalLabelPdf").html("Unable to create PDF.");
                            $("#resultMessagePdf").removeClass("d-none").html(response.message);
                            if (typeof _paq != "undefined") {
                                _paq.push(['trackEvent', 'generator', 'pdf-error', getDuration(start)]);
                            }
                        }
                        //refresh captcha image
                        if ($('.captcha-input').length) {
                            $('.captcha_pic').attr('src', 'simple-php-captcha.php?_CAPTCHA&' + $.now());
                            $('.captcha-input').val('');
                        }
                    });
            }


            return false;
        });

        url.on('focus', function() {
            $(this).removeClass('is-invalid');
        });
    });

    $('#home-url-pdf').change(function() {
        $('#home-url-screenshot').val($(this).val());
    });

    $('#home-url-screenshot').change(function() {
        $('#home-url-pdf').val($(this).val());
    });

    $('.ctcButton').click(function() {
        if (isValidBuilder()) {
            if (typeof _paq != "undefined") {
                _paq.push(['trackEvent', $('#urlInput').length ? 'builder' : 'how-to', 'clipboard']);
            }
            var text = getUrlFromApiCallElement();
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert('Copied!');
        }
    });

    $('.captureButton').click(function() {
        if (isValidBuilder()) {
            var url = getUrlFromApiCallElement();
            var win = window.open(url, '_blank');
            if (win) {
                if (typeof _paq != "undefined") {
                    _paq.push(['trackEvent', $('#urlInput').length ? 'builder' : 'how-to', 'capture']);
                }
                win.focus();
            } else {
                alert('Please allow popups for this website');
            }
        }
    });

    $('#urlInput').keyup(function(e) {
        copyValueToBuilder($(this), 'builderUrl');
        $(this).removeClass('is-invalid');
        $('#alertRow').addClass('d-none');
        if(e.which == 13) {
            $('.captureButton').click();
        }
    });

    //required for mouse midle button copy text
    $('#urlInput').blur(function(e) {
        copyValueToBuilder($(this), 'builderUrl');
        $(this).removeClass('is-invalid');
        $('#alertRow').addClass('d-none');
    });

    $('#dimensionInput').keyup(function() {
        copyValueToBuilder($(this), 'builderDimension');
        rememberLastDimension();
    });

    $('#cacheLimitInput').keyup(function() {
        copyValueToBuilder($(this), 'builderCacheLimit');
    });

    $('#zoomInput').keyup(function() {
        copyValueToBuilder($(this), 'builderZoom');
    });

    $('#clickInput').keyup(function() {
        copyValueToBuilder($(this), 'builderClick');
    });

    $('#hideInput').keyup(function() {
        copyValueToBuilder($(this), 'builderHide');
    });

    $('#cookiesInput').keyup(function() {
        copyValueToBuilder($(this), 'builderCookies');
    });

    $('#langInput').keyup(function() {
        copyValueToBuilder($(this), 'builderLang');
    });

    $('#agentInput').keyup(function() {
        copyValueToBuilder($(this), 'builderAgent');
    });

    $('#delaySelect').change(function() {
        copyValueToBuilder($(this), 'builderDelay');
    });

    $('#deviceSelect').change(function() {
        var value = $(this).val();
        var dimensionInput = $('#dimensionInput');
        if (value == 'desktop') {
            dimensionInput.val('1024x768');
        } else if (value == 'phone'){
            dimensionInput.val('480x800');
        } else if (value == 'tablet'){
            dimensionInput.val('800x1280');
        }
        copyValueToBuilder($(this), 'builderDevice');
        copyValueToBuilder(dimensionInput, 'builderDimension');
        rememberLastDimension();
    });

    $('#formatSelect').change(function() {
        copyValueToBuilder($(this), 'builderFormat');
    });

    $('#freshCheckbox').change(function() {
        var checked = $(this).is(':checked');
        $('#cacheLimitInput').val(checked ? '0' : '');
        $('#cacheLimitInput').attr('readonly', checked);
        copyValueToBuilder($('#cacheLimitInput'), 'builderCacheLimit');
    });

    $('#fullCheckbox').change(function() {
        var checked = $(this).is(':checked');
        var value = $('#dimensionInput').val();
        var lastWidth = $('#dimensionInput').attr('data-last-width');
        var lastHeight = $('#dimensionInput').attr('data-last-height');
        $('#dimensionInput').val(checked ? lastWidth + 'x' + FULL : lastWidth + 'x' + lastHeight);
        copyValueToBuilder($('#dimensionInput'), 'builderDimension');
    });

}(jQuery);

function    getUrlFromApiCallElement() {
    return $('#apiCall').children(':visible').text()
}

function isValidBuilder() {
    var el = $('#urlInput');
    if (el.length && el.val().length < 1) {
        el.addClass('is-invalid');
        $('#alertRow').removeClass('d-none');
        return false;
    }
    return true;
}
function rememberLastDimension() {
    var value = $('#dimensionInput').val();
    var array = value.split('x');
    if (array.length == 2) {
        $('#dimensionInput').attr('data-last-width', array[0]);
        if (array[1].toLowerCase() != FULL) {
            $('#dimensionInput').attr('data-last-height', array[1]);
        }
    }
}

function copyValueToBuilder(el, builderParam) {
    var value = el.val();
    //console.log(value);
    $('#' + builderParam + 'Value').text(encodeURIComponent(el.val()));
    if (value.length > 0) {
        $('#' + builderParam).removeClass('d-none');
    } else {
        $('#' + builderParam).addClass('d-none');
    }
}

function getDuration(start) {
    return Math.round((new Date().getTime() - start) / 1000 * 10) / 10;
}

function openChangePassword() {
    open("changepasswd.php",'','width=500,height=520');
    return false;
}

function openDeleteAccount() {
    open("deleteaccount.php",'','width=500,height=400');
    return false;
}

function togglePayment(){
    $('.toHide').hide();
    $("#payment-"+$("input[type=radio][name=paymentOption]:checked" ).val()).show();
}

function setUpImages(prefix, size, type) {
    if (size != '') {
        $("#" + prefix + "Upload").attr("src", "../assets/img/upload-disabled.png");
        $("#" + prefix + "Upload").css( 'cursor', 'default' );
        $("#" + prefix + "Upload").unbind( "click" );
        $("#" + prefix + "Upload").click(function() {
            return false;
        });
        $("#" + prefix + "Delete").attr("src", "../assets/img/delete.png");
        $("#" + prefix + "Delete").css( 'cursor', 'pointer' );
        $("#" + prefix + "Delete").unbind( "click" );
        $("#" + prefix + "Delete").click(function() {
            deleteFile(prefix, type);
        });
    } else {
        $("#" + prefix + "Upload").attr("src", "../assets/img/upload.png");
        $("#" + prefix + "Upload").css( 'cursor', 'pointer' );
        $("#" + prefix + "Upload").unbind( "click" );
        $("#" + prefix + "Upload").click(function() {
            //alert(prefix + " " + size + " " +  type);
            document.getElementById("uploadForm").reset();
            $('input[name=errorType]').val(type);
            $('input[name=prefix]').val(prefix);
            $('input[id=' + type + ']').click();

            //$('input[type=file]').change(function() {
            //    $('input[type=file]').unbind( "change" );
            //    submitImage(this.value, type);
            //
            // });
            // $('input[type=file]').click();
        });
        $("#" + prefix + "Delete").attr("src", "../assets/img/delete-disabled.png");
        $("#" + prefix + "Delete").css( 'cursor', 'default' );
        $("#" + prefix + "Delete").unbind( "click" );
        $("#" + prefix + "Delete").click(function() {
            return false;
        });
    }
}

function deleteFile(prefix, type) {
    if (confirm('Are you sure you want to delete this custom error image?')) {
        jQuery.get('getimage.php?type=' + type + "&action=delete", function() {
            refreshImage(prefix ,type);
            setUpImages(prefix, '', type);
        });
    }
}

function refreshImage(prefix, type) {
    //alert('refreshing ' + type);
    $("#" + prefix + "Img").attr("src", 'getimage.php?type=' + type + "&" + new Date().getTime());
}

function finishUpload(response) {
    if (response != 'OK') {
        alert(response.message);
    } else {
        var type = $('input[name=errorType]').val();
        var prefix = $('input[name=prefix]').val()
        //alert('setup: ' + prefix +  " " +  type);
        setUpImages(prefix, '1', type);
        refreshImage(prefix ,type);
    }
}

function changeScreenshotDimension(el){
    var device = $('input[name=device]');
    var selectedDevice = el.value;
    var width = $('input[name=width]');
    var height = $('input[name=height]');
    if ('phone' == selectedDevice) {
        width.val('480');
        if (!$("#inputHeightFull").is(':checked')) {
            height.val('800');
        }
    } else if ('tablet' == selectedDevice) {
        width.val('800');
        if (!$("#inputHeightFull").is(':checked')) {
            height.val('1280');
        }
    } else {
        width.val('1024');
        if (!$("#inputHeightFull").is(':checked')) {
            height.val('768');
        }
    }
}

function changeScreenshotHeight(){
    if ($("#inputHeightFull").is(':checked')) {
        $("#inputHeight").val("full");
        $("#inputHeight").prop('readonly', true);
    } else {
        $("#inputHeight").val("");
        $("#inputHeight").prop('readonly', false);
    }
}