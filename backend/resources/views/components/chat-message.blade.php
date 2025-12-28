@php
    $chatDate = $chat->created_at->isToday() ? 'Today' : formatDate($chat->created_at);
    $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $audioExtensions = ['webm', 'mp3', 'wav', 'ogg', 'm4a'];
    $ext = '';
    $fileUrl = '';
@endphp


<div data-chat-date='{{ $chatDate }}' class="d-none justify-content-center my-2">
    <div class="bg-white rounded p-2 w-auto">
        {{ $chatDate }}
    </div>
</div>

<div data-chat-is-read="{{ $chat->is_read ?? 0 }}" data-chat-id="{{ $chat->id }}"
    class="mb-2 {{ $chat->from_user_id == user()->id ? 'justify-content-end' : '' }}" style="display: flex">

    @if ($chat->from_user_id != user()->id)
        <x-user-profile :user="$chat->user" />
    @endif
    <div class="w-75">

        @if ($chat->reply)
            <bdi class="p-2 rounded-top bg-light mx-1 text-theme fw-bold pointer d-block"
                onclick="scrollToMessage({{ $chat->reply->id }})">
                @ {{ $chat->reply->message }}
            </bdi>
        @endif
        <div class="{{ $chat->from_user_id == user()->id ? 'alert-secondary' : 'alert-light' }} {{ $chat->reply ? 'rounded-bottom' : 'rounded' }} border p-2 d-flex flex-column position-relative mx-1"
            style="line-break: anywhere">


            <bdi data-chat-message>
                {!! formatMessage($chat->message) !!}
            </bdi>

            @if ($chat->file)
                @php
                    $fileUrl = asset('uploads/' . $chat->file);
                    $ext = strtolower(pathinfo($chat->file, PATHINFO_EXTENSION));
                @endphp

                <div class="mt-2">
                    @if (in_array($ext, $imageExtensions))
                        <img data-fancybox="img" src="{{ $fileUrl }}" alt="Image"
                            style="max-width: 150px; max-height: 150px;cursor: zoom-in" class="img-thumbnail">
                    @elseif(in_array($ext, $audioExtensions))
                        <audio controls preload="none" style="max-width: 150px;">
                            <source src="{{ $fileUrl }}" type="audio/{{ $ext }}">
                            Your browser does not support the audio element.
                        </audio>
                    @endif
                    <div>
                        <a href="{{ $fileUrl }}" target="_blank" download="{{ $chat->message }}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-linecap="round"
                                    stroke-linejoin="round" stroke-width="2"
                                    d="M13.324 8.436L9.495 12.19c-.364.36-.564.852-.556 1.369a2 2 0 0 0 .6 1.387c.375.371.88.584 1.403.593a1.92 1.92 0 0 0 1.386-.55l3.828-3.754a3.75 3.75 0 0 0 1.112-2.738a4 4 0 0 0-1.198-2.775a4.1 4.1 0 0 0-2.808-1.185a3.85 3.85 0 0 0-2.77 1.098L6.661 9.39a5.63 5.63 0 0 0-1.667 4.107a6 6 0 0 0 1.798 4.161a6.15 6.15 0 0 0 4.21 1.778a5.77 5.77 0 0 0 4.157-1.646l3.829-3.756" />
                            </svg>
                            Download file ({{ $ext }})
                        </a>
                    </div>

                </div>

            @endif
            <div class="d-flex justify-content-between">
                <span style="font-size: 0.8rem" class="mt-3 text-muted d-flex align-items-center">
                    {{ formatTime($chat->created_at) }}

                    @if (user()->id == $chat->from_user_id)
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path data-chat-read-icon fill="none"
                                    stroke="{{ $chat->is_read ? 'var(--theme-color)' : '#7f878d' }}"
                                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m8 12.485l4.243 4.243l8.484-8.485M3 12.485l4.243 4.243m8.485-8.485L12.5 11.5" />
                            </svg>
                        </span>
                    @endif

                </span>
                <div class="d-flex gap-1 align-items-center">

                    <div class="dropdown">
                        <button class="btn btn-sm shadow-none text-dark" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#000"
                                    d="M8 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m4 2a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
                            </svg>
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenu">
                            <div class="hover-splash" onclick="replyToMessage(this)">
                                <button class="btn btn-sm shadow-none text-muted d-flex align-items-center w-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="M10 9V5l-7 7l7 7v-4.1c5 0 8.5 1.6 11 5.1c-1-5-4-10-11-11" />
                                    </svg>
                                    Reply
                                </button>
                            </div>


                            <div class="hover-splash" onclick="copyMessageToClipboard(this)">
                                <button class="btn btn-sm shadow-none text-muted d-flex align-items-center w-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        viewBox="0 0 20 20">
                                        <path fill="currentColor"
                                            d="M8 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1zM4 6a2 2 0 0 1 1-1.732V14.5A2.5 2.5 0 0 0 7.5 17h6.232A2 2 0 0 1 12 18H7.5A3.5 3.5 0 0 1 4 14.5z" />
                                    </svg>
                                    Copy
                                </button>
                            </div>


                            <div class="hover-splash" data-hide-message>
                                <button type="button"
                                    class="btn btn-sm text-muted shadow-none d-flex align-items-center w-100"
                                    hx-post='{{ url("chat/hide-message/{$chat->id}") }}' hx-swap='none' hx-vals="unset"
                                    hx-trigger='confirmed' hx-include="#chat_csrf [name='_token']"
                                    onClick="Swal.fire({
                        icon: 'warning',
                        title: 'Confirm',
                        text:'Do you want to delete this message?',
                        confirmButtonText:'Yes',
                        showCancelButton: true,})
                        .then((result)=>{
                            if(result.isConfirmed){
                            htmx.trigger(this, 'confirmed');  
                            $(this).parents('[data-chat-id]').slideUp()
                            } 
                        })">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="m19.833 21.26l-2.237-2.237q-1.167.935-2.583 1.456T12 21q-1.868 0-3.51-.709t-2.857-1.923t-1.924-2.858T3 12q0-1.596.521-3.012q.521-1.417 1.456-2.584L2.741 4.167l.713-.713l17.092 17.092zM12 20q1.383 0 2.616-.448t2.261-1.248L5.697 7.123q-.8 1.027-1.249 2.26Q4 10.618 4 12q0 3.325 2.338 5.663T12 20m7.62-3.192l-.74-.739q.55-.911.836-1.933Q20 13.114 20 12q0-3.325-2.337-5.663T12 4q-1.113 0-2.135.285q-1.023.284-1.934.834l-.739-.738q1.066-.67 2.274-1.025Q10.673 3 12 3q1.868 0 3.51.709t2.858 1.924T20.29 8.49T21 12q0 1.327-.356 2.534q-.355 1.208-1.025 2.274m-8.332-4.094" />
                                    </svg>
                                    Delete For Me
                                </button>
                            </div>

                            @if (user()->id == $chat->from_user_id && !$chat->is_read)
                                <div class="hover-splash" data-delete-message>
                                    <button type="button" style="white-space: nowrap"
                                        class="btn btn-sm shadow-none text-danger d-flex align-items-center w-100"
                                        hx-post='{{ url("chat/delete-message/{$chat->id}") }}' hx-swap='none'
                                        hx-include="#chat_csrf [name='_token']" hx-vals="unset" hx-trigger='confirmed'
                                        onClick="Swal.fire({
                        icon: 'warning',
                        title: 'Confirm',
                        text:'Do you want to delete this message?',
                        confirmButtonText:'Yes',
                        showCancelButton: true,})
                        .then((result)=>{
                            if(result.isConfirmed){
                            htmx.trigger(this, 'confirmed');  
                            $(this).parents('[data-chat-id]').slideUp()
                            } 
                        })">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M8 9h8v10H8z" opacity="0.3" />
                                            <path fill="currentColor"
                                                d="m15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8z" />
                                        </svg>
                                        Delete For Everyone
                                    </button>
                                </div>
                            @endif
                        </div>
                    </div>



                </div>

            </div>
        </div>

    </div>

    @if ($chat->from_user_id == user()->id)
        <x-user-profile :user="$chat->user" />
    @endif

</div>


@once
    <script>
        $(function() {

            // show first date for messages that are in the same date
            var chatDate;
            $.each($('[data-chat-date]'), function(index, el) {
                var $el = $(el);
                if ($el.data('chatDate') != chatDate) {
                    chatDate = $el.data('chatDate');
                    $el.removeClass('d-none').addClass('d-flex');
                }
            });

        });
    </script>
@endonce
