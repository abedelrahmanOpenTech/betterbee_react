@php
    use App\Constants\App;
@endphp

<!DOCTYPE html>
<html lang="en">


<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title data-title='{{ App::TITLE }}'>{{ App::TITLE }}</title>
    <link data-head-image rel="icon" type="image/png" href="{{ asset('images/logo.png?1') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <style>
        :root {
            /* --theme-color: #0d6efd;
            --theme-color-light: #397cdfb4; */
            --theme-color: #18bf9f;
            --theme-color-light: #74eca8b3;
        }
    </style>

    <link rel="manifest" href="{{ asset('manifest.json?v=5') }}">
    <meta name="theme-color" content="#0d6efd">
    <link rel="apple-touch-icon" href="images/icon-192x192.png">
    <link rel="icon" type="image/png" href="images/icon-192x192.png">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@6.0/dist/fancybox/fancybox.css" />
    <link rel="stylesheet" href="{{ asset('css/jquery.toast.css') }}">
    <link rel="stylesheet" href="{{ asset('css/main.css?v=5') }}">

    <script>
        function asset(path = '') {
            return `{{ asset('') }}${path}`;
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.6/dist/htmx.min.js"
        integrity="sha384-Akqfrbj/HpNVo8k11SXBb6TlBWmXXlYQrCSqEWmyKJe+hDm3Z/B2WVG4smwBkRVm" crossorigin="anonymous">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@6.0/dist/fancybox/fancybox.umd.js"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha384-1H217gwSVyLSIfaLxHbE7dRb3v4mYCKbpQvzx0cegeju1MVsGrX5xXxAvs/HgeFs" crossorigin="anonymous">
    </script>
    <script src="{{ asset('js/jquery.toast.js') }}"></script>

    <script src="{{ asset('js/main.js?v=4') }}"></script>
    {{-- <script src="{{ asset('js/emojis.js') }}"></script> --}}
    <script src="{{ asset('js/lc_emoji_picker.min.js') }}"></script>
    {{-- <script src="https://static.lcweb.it/lc-emoji-picker-repo/lc_emoji_picker.min.js"></script> --}}


</head>

<body>


    @yield('content')

    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register("{{ asset('service-worker.js') }}")
                    .then(registration => {

                    })
                    .catch(error => {
                        console.error('Service Worker registration failed:', error);
                    });
            });

        }
    </script>

</body>

</html>
