@extends('layouts.web')

@section('content')
    <div class="container card my-5 col-11 col-lg-4">

        <form id='form' hx-post="{{ url('dashboard/login') }}" hx-swap='outerHTML' hx-select='#form' novalidate>
            @csrf
            <h1 class="my-2">Login</h1>
            <div class="my-4">
                <x-response-message />
            </div>
            <div class="form-group my-2">
                <label for="email" class="form-label">Email</label>
                <input type="email" name='email' @class(['form-control', 'is-invalid' => $errors->has('email')]) value="{{ old('email') }}">
                <span class="text-danger">
                    @error('email')
                        {{ $message }}
                    @enderror
                </span>
            </div>

            <div class="form-group my-2 position-relative" x-data="{ show: false }">
                <label for="email" class="form-label">Password</label>
                <input type="password" id="password" name='password' @class(['form-control', 'is-invalid' => $errors->has('email')])>
                <span class="text-danger"> @error('password')
                        {{ $message }}
                    @enderror
                </span>
                <div onclick='togglePassword("#password")' class="position-absolute top-0 end-0 btn p-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M12 9.005a4 4 0 1 1 0 8a4 4 0 0 1 0-8M12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365a8.504 8.504 0 0 0-16.493.004a.75.75 0 0 1-1.456-.363A10 10 0 0 1 12 5.5" />
                    </svg>
                </div>
            </div>

            <div class="form-group my-2">
                <button class="btn btn-dark shadow rounded-3">
                    Login
                </button>
            </div>


        </form>
    </div>
@endsection
