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
    <link data-head-image rel="icon" type="image/ong" href="{{ asset('images/logo.png') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <style>
        :root {
            --theme-color: #182030;
            --theme-color-light: #c2417c;
        }
    </style>



    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ asset('css/jquery.toast.css') }}">
    <link rel="stylesheet" href="{{ asset('css/main.css?v=5') }}">
    <link rel="stylesheet" href="{{ asset('css/table.css') }}">

    {{-- <link
        href="https://cdn.datatables.net/v/bs5/dt-2.3.3/fh-4.0.3/r-3.0.6/sb-1.8.3/sp-2.3.5/sl-3.1.0/datatables.min.css"
        rel="stylesheet" integrity="sha384-2uwkvotU5FO+z6CLKrwZK8Sm02wLTt+RVLNSzjZNQMlNHHV0LLbF35ok1b8RHlbw"
        crossorigin="anonymous"> --}}
    <link href="https://cdn.jsdelivr.net/npm/datatables.net-bs5@1.11.5/css/dataTables.bootstrap5.min.css"
        rel="stylesheet">

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


    {{-- <script src="https://cdn.datatables.net/v/bs5/dt-2.3.3/fh-4.0.3/r-3.0.6/sb-1.8.3/sp-2.3.5/sl-3.1.0/datatables.min.js"
        integrity="sha384-1gaydUF2n5jJ4fQmD+R0lDnMTEoDM1S7IeRSLkFGBVaT8XoSBWUc2QJ/Z8QZL3Ks" crossorigin="anonymous">
    </script> --}}
    <script src="https://cdn.jsdelivr.net/npm/datatables.net@1.11.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/datatables.net-bs5@1.11.5/js/dataTables.bootstrap5.min.js"></script>

    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.dataTables.min.css">
    <script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>



    <script src="{{ asset('js/jquery.toast.js') }}"></script>

    <script src="{{ asset('js/main.js?v=3') }}"></script>

</head>

<body style="background-color: #f5f5f5">

    <div class="container-fluid p-0 d-flex flex-column flex-grow-1">
        <div class="row mx-0">
            <!-- Sidebar -->
            <div class="col-2 col-md-2 px-0">
                <div class="col-2 col-md-2 px-0 d-flex flex-column overflow-auto position-fixed top-0 bottom-0">
                    <div class="bg-theme text-white shadow-sm position-sticky top-0 p-2 d-flex align-items-center justify-content-between flex-shrink-0"
                        style="height: 70px">
                        <div>
                            <x-user-profile :user=user() />
                            {{ user()->name }}
                        </div>

                    </div>

                    <!-- Sidebar Menu -->
                    <div class="flex-grow-1 overflow-auto bg-theme d-flex flex-column" style="height: 100%;">
                        <div class="d-flex flex-column p-1">
                            @php
                                $menuItems = [
                                    [
                                        'route' => '/dashboard/users',
                                        'icon' =>
                                            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M64.12 147.8a4 4 0 0 1-4 4.2H16a8 8 0 0 1-7.8-6.17a8.35 8.35 0 0 1 1.62-6.93A67.8 67.8 0 0 1 37 117.51a40 40 0 1 1 66.46-35.8a3.94 3.94 0 0 1-2.27 4.18A64.08 64.08 0 0 0 64 144c0 1.28 0 2.54.12 3.8m182-8.91A67.76 67.76 0 0 0 219 117.51a40 40 0 1 0-66.46-35.8a3.94 3.94 0 0 0 2.27 4.18A64.08 64.08 0 0 1 192 144c0 1.28 0 2.54-.12 3.8a4 4 0 0 0 4 4.2H240a8 8 0 0 0 7.8-6.17a8.33 8.33 0 0 0-1.63-6.94Zm-89 43.18a48 48 0 1 0-58.37 0A72.13 72.13 0 0 0 65.07 212A8 8 0 0 0 72 224h112a8 8 0 0 0 6.93-12a72.15 72.15 0 0 0-33.74-29.93Z"/></svg>',
                                        'label' => 'Users',
                                    ],
                                    [
                                        'route' => '/dashboard/settings',
                                        'icon' =>
                                            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/></svg>',
                                        'label' => 'Settings',
                                    ],
                                ];
                            @endphp

                            @foreach ($menuItems as $item)
                                <a href="{{ url($item['route']) }}"
                                    class="text-white text-decoration-none p-2 rounded my-1 gap-2 d-flex flex-column flex-md-row align-items-center {{ request()->is(ltrim($item['route'], '/')) ? 'bg-light text-theme' : '' }}">
                                    {!! $item['icon'] !!} {{ $item['label'] }}
                                </a>
                            @endforeach
                        </div>


                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="col-10 col-md-10 px-0">
                <div class="shadow-sm bg-white p-3 fw-bold w-100 fs-3 d-flex justify-content-between"
                    style="height: 70px">
                    @yield('title')

                    <button hx-get="{{ url('dashboard/logout') }}" hx-swap="none"
                        class="mt-auto btn btn-light shadow-none  text-danger border-danger m-2">Logout</button>
                </div>
                <div class="p-3">
                    @yield('content')
                </div>
            </div>
        </div>
    </div>

    @if (session('toast'))
        <script>
            $.toast({
                icon: @js(session('toast.status')),
                text: @js(session('toast.message')),
                position: 'top-center',
            })
        </script>
    @endif

</body>

</html>
