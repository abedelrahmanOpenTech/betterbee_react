<script>
    var deletedMessages = @js($deletedMessages);
    var messagesInfo = @js($messagesInfo);

    for (var deletedMessage of deletedMessages) {
        $(`[data-chat-id='${deletedMessage.id}']`).hide();
    }

    for (var messageInfo of messagesInfo) {
        if (messageInfo.is_read) {
            var $message = $(`[data-chat-id=${messageInfo.id}]`);

            $message.attr('data-chat-is-read', 1).find(`[data-delete-message]`).remove();
            $message.find('[data-chat-read-icon]').attr('stroke', "var(--theme-color)");
        }
    }
</script>
