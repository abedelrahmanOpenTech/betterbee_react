    <div id="loader" class="htmx-indicator position-fixed top-0 bottom-0 start-0 end-0"
        style="background-color: rgba(255, 255, 255, 0.432);z-index: 9999;">
        <div class="top-loading-bar"></div>
    </div>

    <div class="modal fade" id="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal_title" class="modal-title"></h5>
                    <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div id="modal_body" class="modal-body">
                    <form enctype="multipart/form-data" id='form' hx-post="{{ url($submit) }}"
                        hx-target='#form_fields' hx-indicator='#loader'>
                        @csrf
                        <div id="form_fields">

                        </div>

                        <button id="save_btn" class="d-none">

                        </button>


                    </form>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-light shadow-none"
                        data-bs-dismiss="modal">Close</button>
                    <button onclick="save_btn.click()" type="button"
                        class="btn text-white bg-theme shadow-none">Save</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        var modal = new bootstrap.Modal(document.getElementById('modal'));

        function addRow() {
            modal.show();
            $('#modal_title').text('Add')
            $('#form_fields').load(`{{ url($form) }}`, function() {
                htmx.process('#modal_body');
            });
        }

        function editRow(id) {
            modal.show();
            $('#modal_title').text('Edit')
            $('#form_fields').load(`{{ url($form) }}/${id}`, function() {
                htmx.process('#modal_body');
            });
        }
    </script>
