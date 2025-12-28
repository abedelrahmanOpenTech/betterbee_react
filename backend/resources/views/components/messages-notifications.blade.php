<script>
    var unreadMessages = @js($unreadMessages);
    var newMessageFound = @js($newMessageFound);
    var unreadMessagesCount = @js($unreadMessagesCount);
    var onlineUsers = @js($onlineUsers);
    var currentChatUserId = $('[data-chat-with-user]').attr('data-chat-with-user');

    $("[data-notification]").text('');
    $(`[data-user-id]`).removeClass('online-indicator');
    $(`[data-user-is-online]`).attr('data-user-is-online', 0);

    // displays notification number
    for (const userId in unreadMessages) {
        var userMessages = unreadMessages[userId];

        if (userId != currentChatUserId) {
            $(`[data-user-id='${userId}']`)
                .attr('data-user-last-message-date', userMessages[0].created_at)
                .find("[data-notification]").text(userMessages.length);
        }


    }

    // show user online indicator
    for (var onlineUser of onlineUsers) {
        $(`[data-user-id='${onlineUser.id}']`).addClass('online-indicator');
        $(`[data-user-id='${onlineUser.id}']`).attr('data-user-is-online', 1);
    }


    if (newMessageFound) {
        //play notification sound
        showNotification(`New Message From ${unreadMessages[Object.keys(unreadMessages).pop()][0].user_name}`, '');
        let audio = new Audio("{{ asset('audio/notification.mp3') }}");
        audio.play();
    }


    //alter head fav icon to indicate new notification
    if (unreadMessagesCount > 0) {
        $("title").text(`${unreadMessagesCount} New Messages`);
        playNotificationIndicator();

    } else {
        $("title").text($('title').data('title'));
        pauseNotificationIndicator();
    }


    if ('setAppBadge' in navigator) {
        navigator.setAppBadge(unreadMessagesCount);
    }

    sortUsers();
</script>
