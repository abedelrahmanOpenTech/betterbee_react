let playNotificationIndicatorTimeout = [];

$(function () {
    Fancybox.bind("[data-fancybox]", {});
});

function playNotificationIndicator() {

    $('[data-head-image]').attr('href', `${asset('images/logo2.png')}`);

    let timeout = setTimeout(() => {
        $('[data-head-image]').attr('href', `${asset('images/logo.png')}`);

        let timeout = setTimeout(() => {
            playNotificationIndicator();
            playNotificationIndicatorTimeout.push(timeout);
        }, 200);

    }, 200);

    playNotificationIndicatorTimeout.push(timeout);
}

function pauseNotificationIndicator() {
    for (let timeout of playNotificationIndicatorTimeout) {
        clearTimeout(timeout);
    }

    $('[data-head-image]').attr('href', `${asset('images/logo.png')}`);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;

    textarea.style.position = 'fixed';
    textarea.style.top = 0;
    textarea.style.left = 0;

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        const successful = document.execCommand('copy');
    } catch (err) {
    }

    document.body.removeChild(textarea);
    $.toast({
        icon: 'success',
        text: 'Copied',
        position: 'bottom-right',
    })
}


function togglePassword(selector) {
    const $password = $(selector);
    const type = $password.attr('type') === 'password' ? 'text' : 'password';
    $password.attr('type', type);
}

function showNotification(title, body) {

    if (Notification.permission === 'granted') {
        var notification = new Notification(title, { body: body });

    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body });
            }
        });
    }
}

function lightenColor(hex, percent = 50) {
    // Remove #
    hex = hex.replace(/^#/, '');

    // Parse r,g,b
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Increase each channel
    r = Math.min(255, r + (r * percent / 100));
    g = Math.min(255, g + (g * percent / 100));
    b = Math.min(255, b + (b * percent / 100));

    // Convert back to hex
    return "#" +
        Math.round(r).toString(16).padStart(2, '0') +
        Math.round(g).toString(16).padStart(2, '0') +
        Math.round(b).toString(16).padStart(2, '0');
}

function hexToRgba(hex, alpha = 0.5) {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        // expand shorthand #abc → #aabbcc
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
