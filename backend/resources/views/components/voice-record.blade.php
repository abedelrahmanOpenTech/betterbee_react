<!-- Start Record Button -->
<button id="start-record" type="button"
    class="btn btn-light ms-1 bg-theme text-white rounded-circle d-flex justify-content-center align-items-center"
    style="width: 40px;height: 40px;">
    <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
        <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
            <rect width="14" height="27" x="17" y="4" fill="#ddd" rx="7" />
            <path stroke-linecap="round" d="M9 23c0 8.284 6.716 15 15 15s15-6.716 15-15M24 38v6" />
        </g>
    </svg>
</button>

<!-- Bootstrap Modal -->
<div class="modal fade" id="recordModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static"
    data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center p-3">
            <h5 class="mb-3">Recording...</h5>

            <!-- Animated Bars -->
            <div class="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                    <rect width="3" height="12" x="1" y="6" fill="currentColor">
                        <animate attributeName="y" begin="0s" dur="0.6s" values="6;1;6"
                            repeatCount="indefinite" />
                        <animate attributeName="height" begin="0s" dur="0.6s" values="12;22;12"
                            repeatCount="indefinite" />
                    </rect>
                    <rect width="3" height="12" x="6" y="6" fill="currentColor">
                        <animate attributeName="y" begin="0.1s" dur="0.6s" values="6;1;6"
                            repeatCount="indefinite" />
                        <animate attributeName="height" begin="0.1s" dur="0.6s" values="12;22;12"
                            repeatCount="indefinite" />
                    </rect>
                    <rect width="3" height="12" x="11" y="6" fill="currentColor">
                        <animate attributeName="y" begin="0.2s" dur="0.6s" values="6;1;6"
                            repeatCount="indefinite" />
                        <animate attributeName="height" begin="0.2s" dur="0.6s" values="12;22;12"
                            repeatCount="indefinite" />
                    </rect>
                    <rect width="3" height="12" x="16" y="6" fill="currentColor">
                        <animate attributeName="y" begin="0.3s" dur="0.6s" values="6;1;6"
                            repeatCount="indefinite" />
                        <animate attributeName="height" begin="0.3s" dur="0.6s" values="12;22;12"
                            repeatCount="indefinite" />
                    </rect>
                    <rect width="3" height="12" x="21" y="6" fill="currentColor">
                        <animate attributeName="y" begin="0.4s" dur="0.6s" values="6;1;6"
                            repeatCount="indefinite" />
                        <animate attributeName="height" begin="0.4s" dur="0.6s" values="12;22;12"
                            repeatCount="indefinite" />
                    </rect>
                </svg>
            </div>

            <!-- Buttons -->
            <div>
                <button id="cancel-record" type="button"
                    class="btn btn-light shadow-none px-3 text-danger mx-2">Cancel</button>
                <button id="send-record" type="button"
                    class="btn rounded shadow-none bg-theme text-white px-3 mx-2">Send</button>
            </div>
        </div>
    </div>
</div>

<script>
    var mediaRecorder;
    var audioChunks = [];
    var audioBlob;
    var stream;

    $('#start-record').on('click', async function() {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            audioBlob = new Blob(audioChunks, {
                type: 'audio/webm'
            });
        };

        mediaRecorder.start();

        // Show Bootstrap modal
        $('#recordModal').modal('show');
    });

    $('#cancel-record').on('click', function() {
        mediaRecorder.stop();
        audioChunks = []; // discard
        stream.getTracks().forEach(track => track.stop());
        $('#recordModal').modal('hide');
    });

    $('#send-record').on('click', function() {
        mediaRecorder.stop();
        setTimeout(() => {
            if (!audioBlob) return;
            const file = new File([audioBlob], 'voice.webm', {
                type: 'audio/webm'
            });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            $('#chat_file')[0].files = dataTransfer.files;

            $('#chat_input').val('Voice message');
            submitMessage();

            stream.getTracks().forEach(track => track.stop());

            $('#recordModal').modal('hide');
        }, 300); // wait for stop
    });
</script>
