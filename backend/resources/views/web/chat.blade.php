@extends('layouts.web')
@section('content')
    <style>
        .profile-container {
            filter: grayscale(100%);
        }

        .user-profile img {
            width: 150px !important;
            height: 150px !important;
        }

        .online-indicator .profile-container {
            filter: grayscale(0);
            border-color: rgba(11, 199, 11, 0.904) !important
        }
    </style>
    <div id="unread_messages_script"></div>
    <div hx-get="{{ url('chat/get-notification') }}" hx-trigger="every 3s" hx-target="#unread_messages_script"
        class="container-fluid p-0 d-flex flex-column flex-grow-1">
        <div class="row mx-0">
            <div class="col-12 col-md-3 px-0 d-flex flex-column overflow-auto">
                <div class="col-12 col-md-3 shadow-sm position-fixed top-0 bottom-0 d-flex flex-column">
                    <div class="bg-theme text-white d-flex justify-content-between px-2 align-items-center"
                        style="height: 60px">
                        <div>
                            <x-user-profile :user=user() />
                            {{ user()->name }}
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-sm text-white p-1 shadow-none" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <!-- Three dots icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M3 9.5A1.5 1.5 0 1 1 3 6.5a1.5 1.5 0 0 1 0 3zm5 0A1.5 1.5 0 1 1 8 6.5a1.5 1.5 0 0 1 0 3zm5 0A1.5 1.5 0 1 1 13 6.5a1.5 1.5 0 0 1 0 3z" />
                                </svg>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#profileModal">
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#settingsModal">
                                        Settings
                                    </button>
                                </li>

                                <li>
                                    <button class="dropdown-item" onclick="location.href=location.href">
                                        Reload
                                    </button>
                                </li>

                                <li>
                                    <button hx-get="{{ url('logout') }}" hx-swap="none" class="dropdown-item text-danger">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>

                    </div>
                    <div class="p-1">
                        <input onkeyup="searchUser(this.value)" type="text"
                            class="form-control bg-light shadow-none border" placeholder="Search...">
                    </div>
                    <div id="users_list" class="overflow-auto flex-grow-1 pb-5" style="z-index: 10;height: 0;">

                        @foreach ($users as $user)
                            <div data-user-id="{{ $user->id }}" data-user="{{ $user->name }}"
                                data-user-is-online="{{ $user->isOnline() ? 1 : 0 }}"
                                data-user-last-message-date="{{ $user->last_message_date->toDateTimeString() }}"
                                class="d-flex align-items-center justify-content-between list-group-item list-group-item-action pe-1">
                                <div role="button" hx-target='#chat_with_user'
                                    hx-get='{{ url("chat/chat-with-user/{$user->id}") }}'
                                    onclick="setSelectedChat({{ $user->id }})"
                                    class="d-flex align-items-center w-100 gap-3 py-3">
                                    <div
                                        class="profile-container flex-shrink-0 border border-5 rounded-circle position-relative">
                                        <x-user-profile :user=$user />

                                    </div>

                                    <div class="flex-grow-1">
                                        <div class="fw-bold">
                                            {{ $user->name }}
                                        </div>
                                    </div>

                                    <div data-notification
                                        class="bg-danger text-white rounded-3 px-2 position-absolute top-0 end-0 m-1">

                                    </div>
                                </div>

                                <div class="dropdown">
                                    <span class="pointer hover-splash p-2 rounded" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24">
                                            <path fill="currentColor"
                                                d="M14 18a2 2 0 1 1-4 0a2 2 0 0 1 4 0m0-6a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-2-4a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
                                        </svg>
                                    </span>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <div data-mark-as-unread="{{ $user->id }}"
                                                class="hover-splash p-1 px-3 pointer">
                                                Mark As Unread
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <div id="chat_with_user" class="col-12 col-md-9 px-0 position-relative">

            </div>
        </div>
    </div>

    <div class="modal fade" id="settingsModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Settings</h5>
                    <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="themeColor" class="form-label">Theme Color</label>
                        <input type="color" id="themeColor" class="form-control"
                            value="{{ Cookie::get('theme_color') }}">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-light shadow-none"
                        data-bs-dismiss="modal">Close</button>
                    <button onclick="saveSettings()" type="button"
                        class="btn text-white bg-theme shadow-none">Save</button>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="profileModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Profile</h5>
                    <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form enctype="multipart/form-data" id='profileForm' hx-post="{{ url('update-profile') }}"
                        hx-swap='outerHTML' hx-select='#profileForm'>
                        @csrf

                        <input type="file" id="profile_input" name="profile" class="d-none"
                            onchange="handleProfileChange(event)">
                        <div id="user_profile" onclick="profile_input.click()"
                            class="user-profile d-flex justify-content-center">
                            <x-user-profile :user=user() />
                        </div>
                        <span class="text-danger">
                            @error('email')
                                {{ $message }}
                            @enderror
                        </span>

                        <div class="form-group my-2">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" name='name' @class(['form-control', 'is-invalid' => $errors->has('name')])
                                value="{{ old('name', user()->name) }}">
                            <span class="text-danger">
                                @error('name')
                                    {{ $message }}
                                @enderror
                            </span>
                        </div>


                        <div class="form-group my-2">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" name='email' @class(['form-control', 'is-invalid' => $errors->has('email')])
                                value="{{ old('email', user()->email) }}">
                            <span class="text-danger">
                                @error('email')
                                    {{ $message }}
                                @enderror
                            </span>
                        </div>

                        <div class="form-group my-2 position-relative" x-data="{ show: false }">
                            <label for="email" class="form-label">Password</label>
                            <input type="password" id="password" name='password' autocomplete="new-password"
                                @class(['form-control', 'is-invalid' => $errors->has('email')])>
                            <span class="text-danger"> @error('password')
                                    {{ $message }}
                                @enderror
                            </span>
                            <div onclick="togglePassword('#password')" class="position-absolute top-0 end-0 btn p-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M12 9.005a4 4 0 1 1 0 8a4 4 0 0 1 0-8M12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365a8.504 8.504 0 0 0-16.493.004a.75.75 0 0 1-1.456-.363A10 10 0 0 1 12 5.5" />
                                </svg>
                            </div>
                        </div>


                        <button id="updateProfileBtn" class="d-none">
                            Update
                        </button>


                        @if (session('toast'))
                            <script>
                                $.toast({
                                    icon: @js(session('toast.status')),
                                    text: @js(session('toast.message')),
                                    position: 'top-center',
                                })
                            </script>
                        @endif

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-light shadow-none"
                        data-bs-dismiss="modal">Close</button>
                    <button onclick="updateProfileBtn.click()" type="button"
                        class="btn text-white bg-theme shadow-none">Save</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        $(function() {
            var userId = localStorage.getItem('last_opened_chat');
            $(`[data-user-id='${userId}']`).click();

            initSettings();

            sortUsers();

            $(document).on("click", '[data-mark-as-unread]', function(e) {
                e.preventDefault();
                var otherUserId = $(this).attr('data-mark-as-unread');
                $.ajax({
                    type: "post",
                    url: `{{ url('chat/mark-as-unread') }}/${otherUserId}`,
                    dataType: "json",
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function(response) {
                        if (response.status == "success") {
                            closeChat();
                        }

                    }
                });
            });
        });


        function sortUsers() {
            var $usersList = $('#users_list');
            var $users = $usersList.children('[data-user]');

            $users.sort(function(a, b) {
                var onlineA = parseInt($(a).data("user-is-online"), 10);
                var onlineB = parseInt($(b).data("user-is-online"), 10);
                if (onlineA !== onlineB) {
                    return onlineB - onlineA;
                }

                var dateA = new Date($(a).data("user-last-message-date"));
                var dateB = new Date($(b).data("user-last-message-date"));
                return dateB - dateA;
            });

            $usersList.html($users);

        }

        function searchUser(searchValue) {
            searchValue = searchValue.toLowerCase();

            $.each($('[data-user]'), function(index, el) {
                let $el = $(el);
                let username = $el.data('user').toLowerCase();
                if (username.includes(searchValue)) {
                    $el.removeClass('d-none');
                } else {
                    $el.addClass('d-none');
                }

            });

        }

        function initSettings() {
            const themeColor = localStorage.getItem('theme_color');
            if (themeColor) {
                $('#themeColor').val(themeColor);
                $("meta[name='theme-color']").attr('content', themeColor);
                document.documentElement.style.setProperty('--theme-color', themeColor);
                document.documentElement.style.setProperty('--theme-color-light', hexToRgba(themeColor));
            } else {
                const themeColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--theme-color')
                    .trim();
                $('#themeColor').val(themeColor);
            }
        }

        function saveSettings() {
            localStorage.setItem('theme_color', $('#themeColor').val());
            location.href = location.href;
        }

        function setSelectedChat(userId) {
            localStorage.setItem('last_opened_chat', userId);
            $(`[data-user-id]`).removeClass('bg-light');
            $(`[data-user-id=${userId}]`).addClass('bg-light');
        }

        function closeChat() {
            chat_with_user.innerHTML = "";
            localStorage.removeItem('last_opened_chat');
            $(`[data-user-id]`).removeClass('bg-light');
        }


        function handleProfileChange(event) {
            const img = document.querySelector('#user_profile img');
            const file = event.target.files[0];

            if (!file) {
                img.src = img.dataset.ogSrc;
                return;
            }

            if (!file.type.startsWith('image/')) {
                $.toast({
                    heading: 'Error',
                    text: 'Please select a valid image file.',
                    icon: 'error',
                    position: 'top-center'
                });
                event.target.value = '';
                img.src = img.dataset.ogSrc;
                return;
            }

            if (typeof URL.createObjectURL === 'function') {
                img.src = URL.createObjectURL(file);
            } else {
                img.src = img.dataset.ogSrc;
            }
        }
    </script>
@endsection
