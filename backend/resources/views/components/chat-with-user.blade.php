<style>
    .chat-animation-out {
        opacity: 0.2;
        transform: translateX(-3%);
    }

    .chat-messages {
        background-color: var(--theme-color-light);
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='385' height='192.5' viewBox='0 0 1600 800'%3E%3Cpath fill='%23FFFFFF' d='M1102.5 734.8c2.5-1.2 24.8-8.6 25.6-7.5.5.7-3.9 23.8-4.6 24.5C1123.3 752.1 1107.5 739.5 1102.5 734.8zM1226.3 229.1c0-.1-4.9-9.4-7-14.2-.1-.3-.3-1.1-.4-1.6-.1-.4-.3-.7-.6-.9-.3-.2-.6-.1-.8.1l-13.1 12.3c0 0 0 0 0 0-.2.2-.3.5-.4.8 0 .3 0 .7.2 1 .1.1 1.4 2.5 2.1 3.6 2.4 3.7 6.5 12.1 6.5 12.2.2.3.4.5.7.6.3 0 .5-.1.7-.3 0 0 1.8-2.5 2.7-3.6 1.5-1.6 3-3.2 4.6-4.7 1.2-1.2 1.6-1.4 2.1-1.6.5-.3 1.1-.5 2.5-1.9C1226.5 230.4 1226.6 229.6 1226.3 229.1zM33 770.3C33 770.3 33 770.3 33 770.3c0-.7-.5-1.2-1.2-1.2-.1 0-.3 0-.4.1-1.6.2-14.3.1-22.2 0-.3 0-.6.1-.9.4-.2.2-.4.5-.4.9 0 .2 0 4.9.1 5.9l.4 13.6c0 .3.2.6.4.9.2.2.5.3.8.3 0 0 .1 0 .1 0 7.3-.7 14.7-.9 22-.6.3 0 .7-.1.9-.3.2-.2.4-.6.4-.9C32.9 783.3 32.9 776.2 33 770.3z'/%3E%3Cpath fill='%23FFFFFF' d='M171.1 383.4c1.3-2.5 14.3-22 15.6-21.6.8.3 11.5 21.2 11.5 22.1C198.1 384.2 177.9 384 171.1 383.4zM596.4 711.8c-.1-.1-6.7-8.2-9.7-12.5-.2-.3-.5-1-.7-1.5-.2-.4-.4-.7-.7-.8-.3-.1-.6 0-.8.3L574 712c0 0 0 0 0 0-.2.2-.2.5-.2.9 0 .3.2.7.4.9.1.1 1.8 2.2 2.8 3.1 3.1 3.1 8.8 10.5 8.9 10.6.2.3.5.4.8.4.3 0 .5-.2.6-.5 0 0 1.2-2.8 2-4.1 1.1-1.9 2.3-3.7 3.5-5.5.9-1.4 1.3-1.7 1.7-2 .5-.4 1-.7 2.1-2.4C596.9 713.1 596.8 712.3 596.4 711.8zM727.5 179.9C727.5 179.9 727.5 179.9 727.5 179.9c.6.2 1.3-.2 1.4-.8 0-.1 0-.2 0-.4.2-1.4 2.8-12.6 4.5-19.5.1-.3 0-.6-.2-.8-.2-.3-.5-.4-.8-.5-.2 0-4.7-1.1-5.7-1.3l-13.4-2.7c-.3-.1-.7 0-.9.2-.2.2-.4.4-.5.6 0 0 0 .1 0 .1-.8 6.5-2.2 13.1-3.9 19.4-.1.3 0 .6.2.9.2.3.5.4.8.5C714.8 176.9 721.7 178.5 727.5 179.9zM728.5 178.1c-.1-.1-.2-.2-.4-.2C728.3 177.9 728.4 178 728.5 178.1z'/%3E%3Cg fill='%23FFF'%3E%3Cpath d='M699.6 472.7c-1.5 0-2.8-.8-3.5-2.3-.8-1.9 0-4.2 1.9-5 3.7-1.6 6.8-4.7 8.4-8.5 1.6-3.8 1.7-8.1.2-11.9-.3-.9-.8-1.8-1.2-2.8-.8-1.7-1.8-3.7-2.3-5.9-.9-4.1-.2-8.6 2-12.8 1.7-3.1 4.1-6.1 7.6-9.1 1.6-1.4 4-1.2 5.3.4 1.4 1.6 1.2 4-.4 5.3-2.8 2.5-4.7 4.7-5.9 7-1.4 2.6-1.9 5.3-1.3 7.6.3 1.4 1 2.8 1.7 4.3.5 1.1 1 2.2 1.5 3.3 2.1 5.6 2 12-.3 17.6-2.3 5.5-6.8 10.1-12.3 12.5C700.6 472.6 700.1 472.7 699.6 472.7zM740.4 421.4c1.5-.2 3 .5 3.8 1.9 1.1 1.8.4 4.2-1.4 5.3-3.7 2.1-6.4 5.6-7.6 9.5-1.2 4-.8 8.4 1.1 12.1.4.9 1 1.7 1.6 2.7 1 1.7 2.2 3.5 3 5.7 1.4 4 1.2 8.7-.6 13.2-1.4 3.4-3.5 6.6-6.8 10.1-1.5 1.6-3.9 1.7-5.5.2-1.6-1.4-1.7-3.9-.2-5.4 2.6-2.8 4.3-5.3 5.3-7.7 1.1-2.8 1.3-5.6.5-7.9-.5-1.3-1.3-2.7-2.2-4.1-.6-1-1.3-2.1-1.9-3.2-2.8-5.4-3.4-11.9-1.7-17.8 1.8-5.9 5.8-11 11.2-14C739.4 421.6 739.9 421.4 740.4 421.4zM261.3 590.9c5.7 6.8 9 15.7 9.4 22.4.5 7.3-2.4 16.4-10.2 20.4-3 1.5-6.7 2.2-11.2 2.2-7.9-.1-12.9-2.9-15.4-8.4-2.1-4.7-2.3-11.4 1.8-15.9 3.2-3.5 7.8-4.1 11.2-1.6 1.2.9 1.5 2.7.6 3.9-.9 1.2-2.7 1.5-3.9.6-1.8-1.3-3.6.6-3.8.8-2.4 2.6-2.1 7-.8 9.9 1.5 3.4 4.7 5 10.4 5.1 3.6 0 6.4-.5 8.6-1.6 4.7-2.4 7.7-8.6 7.2-15-.5-7.3-5.3-18.2-13-23.9-4.2-3.1-8.5-4.1-12.9-3.1-3.1.7-6.2 2.4-9.7 5-6.6 5.1-11.7 11.8-14.2 19-2.7 7.7-2.1 15.8 1.9 23.9.7 1.4.1 3.1-1.3 3.7-1.4.7-3.1.1-3.7-1.3-4.6-9.4-5.4-19.2-2.2-28.2 2.9-8.2 8.6-15.9 16.1-21.6 4.1-3.1 8-5.1 11.8-6 6-1.4 12 0 17.5 4C257.6 586.9 259.6 588.8 261.3 590.9z'/%3E%3Ccircle cx='1013.7' cy='153.9' r='7.1'/%3E%3Ccircle cx='1024.3' cy='132.1' r='7.1'/%3E%3Ccircle cx='1037.3' cy='148.9' r='7.1'/%3E%3Cpath d='M1508.7 297.2c-4.8-5.4-9.7-10.8-14.8-16.2 5.6-5.6 11.1-11.5 15.6-18.2 1.2-1.7.7-4.1-1-5.2-1.7-1.2-4.1-.7-5.2 1-4.2 6.2-9.1 11.6-14.5 16.9-4.8-5-9.7-10-14.7-14.9-1.5-1.5-3.9-1.5-5.3 0-1.5 1.5-1.5 3.9 0 5.3 4.9 4.8 9.7 9.8 14.5 14.8-1.1 1.1-2.3 2.2-3.5 3.2-4.1 3.8-8.4 7.8-12.4 12-1.4 1.5-1.4 3.8 0 5.3 0 0 0 0 0 0 1.5 1.4 3.9 1.4 5.3-.1 3.9-4 8.1-7.9 12.1-11.7 1.2-1.1 2.3-2.2 3.5-3.3 4.9 5.3 9.8 10.6 14.6 15.9.1.1.1.1.2.2 1.4 1.4 3.7 1.5 5.2.2C1510 301.2 1510.1 298.8 1508.7 297.2zM327.6 248.6l-.4-2.6c-1.5-11.1-2.2-23.2-2.3-37 0-5.5 0-11.5.2-18.5 0-.7 0-1.5 0-2.3 0-5 0-11.2 3.9-13.5 2.2-1.3 5.1-1 8.5.9 5.7 3.1 13.2 8.7 17.5 14.9 5.5 7.8 7.3 16.9 5 25.7-3.2 12.3-15 31-30 32.1L327.6 248.6zM332.1 179.2c-.2 0-.3 0-.4.1-.1.1-.7.5-1.1 2.7-.3 1.9-.3 4.2-.3 6.3 0 .8 0 1.7 0 2.4-.2 6.9-.2 12.8-.2 18.3.1 12.5.7 23.5 2 33.7 11-2.7 20.4-18.1 23-27.8 1.9-7.2.4-14.8-4.2-21.3l0 0C347 188.1 340 183 335 180.3 333.6 179.5 332.6 179.2 332.1 179.2zM516.3 60.8c-.1 0-.2 0-.4-.1-2.4-.7-4-.9-6.7-.7-.7 0-1.3-.5-1.4-1.2 0-.7.5-1.3 1.2-1.4 3.1-.2 4.9 0 7.6.8.7.2 1.1.9.9 1.6C517.3 60.4 516.8 60.8 516.3 60.8zM506.1 70.5c-.5 0-1-.3-1.2-.8-.8-2.1-1.2-4.3-1.3-6.6 0-.7.5-1.3 1.2-1.3.7 0 1.3.5 1.3 1.2.1 2 .5 3.9 1.1 5.8.2.7-.1 1.4-.8 1.6C506.4 70.5 506.2 70.5 506.1 70.5zM494.1 64.4c-.4 0-.8-.2-1-.5-.4-.6-.3-1.4.2-1.8 1.8-1.4 3.7-2.6 5.8-3.6.6-.3 1.4 0 1.7.6.3.6 0 1.4-.6 1.7-1.9.9-3.7 2-5.3 3.3C494.7 64.3 494.4 64.4 494.1 64.4zM500.5 55.3c-.5 0-.9-.3-1.2-.7-.5-1-1.2-1.9-2.4-3.4-.3-.4-.7-.9-1.1-1.4-.4-.6-.3-1.4.2-1.8.6-.4 1.4-.3 1.8.2.4.5.8 1 1.1 1.4 1.3 1.6 2.1 2.6 2.7 3.9.3.6 0 1.4-.6 1.7C500.9 55.3 500.7 55.3 500.5 55.3zM506.7 55c-.3 0-.5-.1-.8-.2-.6-.4-.7-1.2-.3-1.8 1.2-1.7 2.3-3.4 3.3-5.2.3-.6 1.1-.9 1.7-.5.6.3.9 1.1.5 1.7-1 1.9-2.2 3.8-3.5 5.6C507.4 54.8 507.1 55 506.7 55zM1029.3 382.8c-.1 0-.2 0-.4-.1-2.4-.7-4-.9-6.7-.7-.7 0-1.3-.5-1.4-1.2 0-.7.5-1.3 1.2-1.4 3.1-.2 4.9 0 7.6.8.7.2 1.1.9.9 1.6C1030.3 382.4 1029.8 382.8 1029.3 382.8zM1019.1 392.5c-.5 0-1-.3-1.2-.8-.8-2.1-1.2-4.3-1.3-6.6 0-.7.5-1.3 1.2-1.3.7 0 1.3.5 1.3 1.2.1 2 .5 3.9 1.1 5.8.2.7-.1 1.4-.8 1.6C1019.4 392.5 1019.2 392.5 1019.1 392.5zM1007.1 386.4c-.4 0-.8-.2-1-.5-.4-.6-.3-1.4.2-1.8 1.8-1.4 3.7-2.6 5.8-3.6.6-.3 1.4 0 1.7.6.3.6 0 1.4-.6 1.7-1.9.9-3.7 2-5.3 3.3C1007.7 386.3 1007.4 386.4 1007.1 386.4zM1013.5 377.3c-.5 0-.9-.3-1.2-.7-.5-1-1.2-1.9-2.4-3.4-.3-.4-.7-.9-1.1-1.4-.4-.6-.3-1.4.2-1.8.6-.4 1.4-.3 1.8.2.4.5.8 1 1.1 1.4 1.3 1.6 2.1 2.6 2.7 3.9.3.6 0 1.4-.6 1.7C1013.9 377.3 1013.7 377.3 1013.5 377.3zM1019.7 377c-.3 0-.5-.1-.8-.2-.6-.4-.7-1.2-.3-1.8 1.2-1.7 2.3-3.4 3.3-5.2.3-.6 1.1-.9 1.7-.5.6.3.9 1.1.5 1.7-1 1.9-2.2 3.8-3.5 5.6C1020.4 376.8 1020.1 377 1019.7 377zM1329.7 573.4c-1.4 0-2.9-.2-4.5-.7-8.4-2.7-16.6-12.7-18.7-20-.4-1.4-.7-2.9-.9-4.4-8.1 3.3-15.5 10.6-15.4 21 0 1.5-1.2 2.7-2.7 2.8 0 0 0 0 0 0-1.5 0-2.7-1.2-2.7-2.7-.1-6.7 2.4-12.9 7-18 3.6-4 8.4-7.1 13.7-8.8.5-6.5 3.1-12.9 7.4-17.4 7-7.4 18.2-8.9 27.3-10.1l.7-.1c1.5-.2 2.9.9 3.1 2.3.2 1.5-.9 2.9-2.3 3.1l-.7.1c-8.6 1.2-18.4 2.5-24 8.4-3 3.2-5 7.7-5.7 12.4 7.9-1 17.7 1.3 24.3 5.7 4.3 2.9 7.1 7.8 7.2 12.7.2 4.3-1.7 8.3-5.2 11.1C1335.2 572.4 1332.6 573.4 1329.7 573.4zM1311 546.7c.1 1.5.4 3 .8 4.4 1.7 5.8 8.7 14.2 15.1 16.3 2.8.9 5.1.5 7.2-1.1 2.7-2.1 3.2-4.8 3.1-6.6-.1-3.2-2-6.4-4.8-8.3C1326.7 547.5 1317.7 545.6 1311 546.7z'/%3E%3C/g%3E%3C/svg%3E");
        background-attachment: fixed;
    }


    @media screen and (max-width:700px) {
        /* .user-info {
            position: fixed !important;
            top: 0 !important;
            left: 0;
            right: 0;
            z-index: 999;

        }

        .chat-messages {
            padding-top: 60px !important;
        }

        form {
            position: fixed !important;
            bottom: 0 !important;
            left: 0;
            right: 0;
            z-index: 999;

        } */

    }
</style>


{{-- <div hx-trigger='every 3s' hx-post='{{ url("chat/get-chat-updates/{$otherUser->id}") }}'
    hx-vals="js:{unreadMessagesIds:JSON.stringify(getUnreadMessagesIds())}" hx-include="#chat_csrf [name='_token']">

</div> --}}


<div class="chat-animation-out d-flex flex-column bg-light" style="transition: all 0.3s;height: 100vh;height: 100svh;"
    hx-trigger="every 3s" hx-post='{{ url('chat/get-chat-updates/' . $otherUser->id) }}' hx-target="#chat_messages"
    hx-disinherit="*" hx-swap="beforeend" hx-include="#chat_csrf [name='_token']"
    hx-vals="js:{lastMessageId:lastMessageId(),unreadMessagesIds:JSON.stringify(getUnreadMessagesIds())}">

    <div id="chat_csrf">
        @csrf
    </div>

    <!-- Top Bar: User Info -->
    <div class="user-info d-flex justify-content-between px-2 align-items-center bg-theme text-white shadow-sm flex-shrink-0"
        style="height:60px">
        <div class="d-flex align-items-center " data-chat-with-user="{{ $otherUser->id }}">

            <div role="button" onclick='closeChat()' class="d-block d-md-none me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 12 24">
                    <path fill="#ddd" fill-rule="evenodd"
                        d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z" />
                </svg>
            </div>

            <x-user-profile :user=$otherUser />

            <div class="mx-3">
                <div class="fw-bold">{{ $otherUser->name }}</div>
                <div class="small">{{ $otherUser->email }}</div>
            </div>
        </div>

        <div class="d-flex gap-3 align-items-center">
            <div class="d-flex">
                <div id="search_messages_controls" class="hide me-2 no-select">
                    <div class="d-flex gap-2 align-items-center">
                        <svg class="pointer" onclick="searchMessagesUp()" xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24" viewBox="0 0 16 16">
                            <path fill="#ddd" fill-rule="evenodd"
                                d="m8 5.293l3.854 3.853l-.707.708L8 6.707L4.854 9.854l-.708-.708z"
                                clip-rule="evenodd" />
                        </svg>
                        <span id="search_messages_current_index">0</span>
                        /
                        <span id="search_messages_count">0</span>
                        <svg class="pointer" onclick="searchMessagesDown()" xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24" viewBox="0 0 16 16">
                            <path fill="none" stroke="#ddd" d="M4.5 6L8 9.5L11.5 6" stroke-width="1" />
                        </svg>
                    </div>
                </div>
                <input id="search_messages_input" onkeyup="searchMessages()" type="text"
                    class="hide border-0 border-bottom border-2 text-white" autocomplete="off"
                    style="background-color: transparent;outline: none;::placeholder:white" placeholder="Search...">

                <div>
                    <div id="hide_search_messages_input_btn" class="pointer hide" onclick="hideSearchMessagesInput()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="#ddd"
                                d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
                        </svg>
                    </div>

                    <div id="show_search_messages_input_btn" class="pointer" onclick="showSearchMessagesInput()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g fill="none">
                                <path fill="#ddd" d="M19 11a8 8 0 1 1-16 0a8 8 0 0 1 16 0" opacity="0.16" />
                                <path stroke="#ddd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
            <div role="button" onclick='closeChat()' class="d-none d-md-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22"
                        opacity="0.5" />
                    <path fill="currentColor"
                        d="M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 1 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 1 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06" />
                </svg>
            </div>
        </div>

    </div>

    <!-- Messages Area (placeholder) -->
    <div id="chat_messages" class="chat-messages flex-grow-1 overflow-auto p-3">
        @foreach ($chat as $message)
            <x-chat-message :chat=$message />
        @endforeach
    </div>

    <!-- Input Bar -->
    <form enctype="multipart/form-data" hx-post="{{ url('chat/create') }}" hx-target="#chat_messages"
        hx-on::after-request="scrollToBottomOfChat()" hx-swap="beforeend"
        class="border-top d-flex align-items-end p-2 bg-white">
        @csrf

        <input type="file" name='chat_file' id="chat_file" class="d-none" onchange="uploadFile(this)">
        <button type="button" class="btn btn-light me-1" onclick="chat_file.click();">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.324 8.436L9.495 12.19c-.364.36-.564.852-.556 1.369a2 2 0 0 0 .6 1.387c.375.371.88.584 1.403.593a1.92 1.92 0 0 0 1.386-.55l3.828-3.754a3.75 3.75 0 0 0 1.112-2.738a4 4 0 0 0-1.198-2.775a4.1 4.1 0 0 0-2.808-1.185a3.85 3.85 0 0 0-2.77 1.098L6.661 9.39a5.63 5.63 0 0 0-1.667 4.107a6 6 0 0 0 1.798 4.161a6.15 6.15 0 0 0 4.21 1.778a5.77 5.77 0 0 0 4.157-1.646l3.829-3.756" />
            </svg>
        </button>

        <div style="width: 65px">
            <x-emoji-picker />

        </div>

        <input type="hidden" name='to_user_id' value="{{ $otherUser->id }}">
        <div class="d-flex w-100 flex-column">
            <div data-reply-to-message class="text-muted">

            </div>
            <div data-files-preview>

            </div>
            <textarea data-autoresize id='chat_input' name='message' rows="1" class="form-control border shadow-sm ms-1"
                style="max-height: 100px; resize: none;" placeholder="Type a message..." autofocus="on"></textarea>

        </div>

        <div class="ms-1" style="width: 50px">
            <div id="voiceRecordBtnContainer">
                <x-voice-record />
            </div>

            <div id="submitBtnContainer" style="display: none">
                <button type="button" onclick="submitMessage()"
                    class="btn text-white shadow-sm ms-1 bg-theme rounded-circle d-flex justify-content-center align-items-center"
                    style="width: 40px;height: 40px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                        <path fill="#ddd"
                            d="M256 277.333v-42.666H122.027L64 42.667L469.333 256L64 469.333l57.6-192z" />
                    </svg>
                </button>
            </div>
        </div>
    </form>

</div>

<script>
    // Cached selectors
    var $textarea = $("textarea");
    var $voiceRecordBtnContainer = $('#voiceRecordBtnContainer');
    var $submitBtnContainer = $('#submitBtnContainer');
    var $chatFile = $('#chat_file');
    var $chatMessages = $('#chat_messages');
    var $filesPreview = $("[data-files-preview]");
    var $replyToMessageBox = $("[data-reply-to-message]");
    var $showSearchMessagesInputBtn = $('#show_search_messages_input_btn');
    var $hideSearchMessagesInputBtn = $('#hide_search_messages_input_btn');
    var $searchMessagesInput = $('#search_messages_input');
    var $searchMessagesCount = $('#search_messages_count');
    var $searchMessagesCurrentIndex = $('#search_messages_current_index');
    var $searchMessagesControls = $('#search_messages_controls');
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    $(function() {
        initAutoResize();
        scrollToBottomOfChat();

        $(".chat-animation-out").removeClass('chat-animation-out').addClass('chat-animation-in');


        $('#chat_input').on('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                if (isMobile) {
                    // On mobile: Enter should insert newline
                    e.preventDefault();
                    const start = this.selectionStart;
                    const end = this.selectionEnd;
                    $(this).val(
                        $(this).val().substring(0, start) +
                        "\n" +
                        $(this).val().substring(end)
                    );
                    this.selectionStart = this.selectionEnd = start + 1;
                } else {
                    // On desktop: Enter submits
                    e.preventDefault();
                    submitMessage();
                }
            }
        });

        $(document).on('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                $textarea.focus();
            }
        });

        $textarea.on('paste', function(e) {
            var items = (e.originalEvent.clipboardData || e.clipboardData).items;
            $.each(items, function(i, item) {
                if (item.type.indexOf("image") === 0) {
                    var file = item.getAsFile();

                    var dt = new DataTransfer();
                    dt.items.add(file);

                    $chatFile[0].files = dt.files;
                    $chatFile.trigger('change');
                }
            });
        }).keyup(function() {
            if ($textarea.val()) {
                $submitBtnContainer.slideDown(200);
                $voiceRecordBtnContainer.hide();
            } else {
                $submitBtnContainer.hide();
                $voiceRecordBtnContainer.slideDown(200);
            }
        });
    });

    function submitMessage() {
        if ($chatFile[0].files.length) {
            $textarea.val($textarea.val() + "\n \n " + $chatFile[0].files[0].name);
        }

        htmx.trigger('form', 'submit');
        setTimeout(() => {
            $replyToMessageBox.empty();
            $filesPreview.empty();
            $textarea.val("").css("height", "40px");
            focusTextArea();
            $chatFile.val(null);

            setTimeout(() => {
                scrollToBottomOfChat();
            }, 100);
        }, 0);
    }

    function copyMessageToClipboard(el) {
        var chatMessage = $(el).parents('[data-chat-id]').find('[data-chat-message]').text().trim();
        copyToClipboard(chatMessage);
    }

    function replyToMessage(el) {
        var $parent = $(el).parents('[data-chat-id]');
        var replyToMessage = $parent.find('[data-chat-message]').text();

        $replyToMessageBox
            .html(`<div class='text-dark bg-light fw-bold p-2 rounded my-1 w-100 d-flex'>
                          <span>Reply To: ${replyToMessage}</span>
                          <button type='button' onclick='$(this).parents("[data-reply-to-message]").empty()' class='btn btn-sm border text-danger shadow-none ms-auto' >Cancel</button>
                    </div>
                    <input type='hidden' name='reply_to' value='${$parent.attr('data-chat-id')}'/>
            `)
            .hide().slideDown();

        $textarea.focus();
    }

    function scrollToMessage(id) {
        var $target = $(`[data-chat-id='${id}']`);

        $chatMessages.animate({
            scrollTop: $target.position().top + $chatMessages.scrollTop() - 100
        }, 500, function() {
            $target.fadeOut(100).fadeIn();
        });
    }

    function scrollToBottomOfChat() {
        if ($chatMessages.length) {
            $chatMessages[0].scrollTop = $chatMessages[0].scrollHeight;
        }
    }

    function initAutoResize() {
        $("textarea[data-autoresize]").each(function() {
            var $this = $(this);

            $this.css({
                height: this.scrollHeight + "px",
                overflowY: "hidden"
            });

            $this.on("input", function() {
                $this.css("height", "auto");
                $this.css("height", this.scrollHeight + "px");
                $this.css("overflowY", "hidden");
            });
        });
    }

    function focusTextArea() {
        $textarea.focus();
    }

    function lastMessageId() {
        var $allMessages = $("[data-chat-id]");
        if ($allMessages.length == 0) {
            return 0;
        }
        return $allMessages.last().attr("data-chat-id");
    }

    function getUnreadMessagesIds() {
        var unReadMessagesIds = [];
        $(`[data-chat-is-read=0]`).each(function() {
            unReadMessagesIds.push($(this).attr('data-chat-id'));
        });
        return unReadMessagesIds;
    }


    function showSearchMessagesInput() {
        $searchMessagesInput.show(200).focus();
        $showSearchMessagesInputBtn.hide();
        $hideSearchMessagesInputBtn.show();
    }

    function hideSearchMessagesInput() {
        $searchMessagesInput.hide(200).val('');
        $showSearchMessagesInputBtn.show();
        $hideSearchMessagesInputBtn.hide();
        $searchMessagesControls.hide();
    }

    function searchMessages() {
        var search = $searchMessagesInput.val().toLowerCase().trim();
        var searchIndex = 0;
        $searchMessagesControls.hide();
        $(`[data-search-index]`).removeAttr(`data-search-index`);

        $.each($(`[data-chat-message]`), function(index, el) {
            var $el = $(el);
            var messageText = $el.text().toLowerCase().trim();
            if (messageText.includes(search) && search) {
                searchIndex++;
                $el.attr('data-search-index', searchIndex);
            }
        });

        var $searchedMessages = $(`[data-search-index]`);
        $searchMessagesCount.text(searchIndex);
        $searchMessagesCurrentIndex.text($searchedMessages.length ? 1 : 0);

        if ($searchedMessages.length) {
            var firstChatIdInSearch = $searchedMessages.first().parents(`[data-chat-id]`).data('chatId');
            scrollToMessage(firstChatIdInSearch);
            $searchMessagesControls.show();
        }
    }

    function searchMessagesDown() {
        var currentIndex = parseInt($searchMessagesCurrentIndex.text());
        var nextIndex = currentIndex + 1;

        if (nextIndex > $searchMessagesCount.text()) {
            nextIndex = 1;
        }

        $searchMessagesCurrentIndex.text(nextIndex);
        var chatMessageId = $(`[data-search-index=${nextIndex}]`).parents(`[data-chat-id]`).data('chatId');
        scrollToMessage(chatMessageId);
    }

    function searchMessagesUp() {
        var currentIndex = parseInt($searchMessagesCurrentIndex.text());
        var nextIndex = currentIndex - 1;

        if (nextIndex <= 0) {
            nextIndex = $searchMessagesCount.text();
        }

        $searchMessagesCurrentIndex.text(nextIndex);
        var chatMessageId = $(`[data-search-index=${nextIndex}]`).parents(`[data-chat-id]`).data('chatId');
        scrollToMessage(chatMessageId);
    }

    function uploadFile(el) {
        if (el.files.length === 0) {
            return;
        }

        var file = el.files[0];
        var url = URL.createObjectURL(file);

        let previewHtml = `
        <div class='text-dark bg-light fw-bold p-2 rounded my-1 w-100 d-flex align-items-center'>
    `;

        if (file.type.startsWith("image/")) {
            previewHtml += `<img style='width:50px;height:50px;object-fit:cover' class='my-1 me-1' src='${url}'/>`;
        } else if (file.type === "application/pdf") {
            previewHtml += `<span class="me-2">📄</span>`;
        } else if (file.type.startsWith("video/")) {
            previewHtml += `<span class="me-2">🎥</span>`;
        } else if (file.type.startsWith("audio/")) {
            previewHtml += `<span class="me-2">🎵</span>`;
        } else {
            previewHtml += `<span class="me-2">📁</span>`;
        }

        previewHtml += `
        ${file.name}
        <button type='button' onclick='deleteFileUpload(this)' class='btn btn-sm border text-danger shadow-none ms-auto' style='height:30px'>Cancel</button>
        </div>`;

        $filesPreview.html(previewHtml);

        if ($textarea.val().trim() == "") {
            $textarea.val(" ");
        }

        $textarea.focus().trigger("keyup");
    }

    function deleteFileUpload(el) {
        $filesPreview.text('');
        $chatFile.val(null);
        $textarea.val("").trigger('keyup');
    }
</script>
