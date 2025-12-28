 <x-chat-message :chat=$chat />


 <script>
     $(`[data-user-id="{{ $chat->to_user_id }}"]`).attr(`data-user-last-message-date`,
         " {{ $chat->created_at->toDateTimeString() }}");

     sortUsers();
 </script>
