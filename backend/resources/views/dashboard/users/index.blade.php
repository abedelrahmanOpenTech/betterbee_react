@extends('layouts.dashboard')

@section('title')
    Users
@endsection

@section('content')
    <x-table-form form="dashboard/users/form" submit="dashboard/users/save" />

    <table id="example" class="custom-table table table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Disabled</th>
                <th>Created At</th>
                <th>
                    <button type="button" onclick="addRow()" class="btn btn-light">
                        Add
                    </button>
                </th>
            </tr>
        </thead>
        <tbody>

        </tbody>
    </table>

    <script>
        $(document).ready(function() {
            $('#example').DataTable({
                responsive: true,
                pageLength: 50,
                processing: true,
                serverSide: true,
                ajax: "{{ url('dashboard/get-users') }}",
                columnDefs: [{
                    targets: 3,
                    className: 'text-md-center'
                }],
                columns: [{
                        data: 'id',
                        name: 'id'
                    },

                    {
                        data: 'name',
                        name: 'name'
                    },
                    {
                        data: 'email',
                        name: 'email'
                    },

                    {
                        data: 'is_disabled',
                        name: 'is_disabled'
                    },
                    {
                        data: 'created_at',
                        name: 'created_at'
                    },
                    {
                        data: 'action',
                        name: 'action',
                        orderable: false,
                        searchable: false
                    },


                ]
            });
        });
    </script>
@endsection
