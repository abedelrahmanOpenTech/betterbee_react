@foreach ($chat as $message)
    <x-chat-message :chat=$message />
@endforeach

@if (count($chat) > 0)
    <script>
        scrollToBottomOfChat();
    </script>
@endif
