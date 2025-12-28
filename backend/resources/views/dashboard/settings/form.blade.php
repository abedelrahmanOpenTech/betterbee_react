@extends('layouts.dashboard')

@section('title')
    Setings
@endsection

@section('content')
    <div class="container-fluid bg-white rounded p-2 shadow-sm">
        <form action="{{ url('dashboard/settings/save') }}" method="post">
            @csrf
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label class="form-check-label fw-bold" for="enable_register">Enable Register</label>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="enable_register"
                                name="enable_register" @if (old('enable_register', $settings->json->enable_register ?? 0)) checked @endif>
                        </div>
                    </div>
                </div>
                <div class="col-12 mt-3">
                    <div>
                        <button type="submit" class="btn bg-theme text-white px-4 shadow-sm rounded">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
@endsection
