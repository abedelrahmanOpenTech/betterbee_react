@extends('layouts.web')

@section('content')
    <div class="container card my-5 col-11 col-lg-4">

        <form id='form' hx-post="{{ url('register') }}" hx-swap='outerHTML' hx-select='#form'>
            @csrf
            <h1 class="my-2">Register</h1>
            <div class="my-4">
                <x-response-message />
            </div>

            <div class="form-group my-2">
                <label for="name" class="form-label">Name</label>
                <input type="text" name='name' @class(['form-control', 'is-invalid' => $errors->has('name')]) value="{{ old('name') }}">
                <span class="text-danger">
                    @error('name')
                        {{ $message }}
                    @enderror
                </span>
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

            <div class="form-group my-2">
                <label for="email" class="form-label">Password</label>
                <input type="password" name='password' @class(['form-control', 'is-invalid' => $errors->has('email')])>
                <span class="text-danger"> @error('password')
                        {{ $message }}
                    @enderror
                </span>
            </div>

            <div class="form-group my-2">
                <button class="btn btn-dark shadow rounded-3">
                    Register
                </button>
            </div>

            <div>
                <a href="{{ url('login') }}" class="text-secondary d-flex my-3">Login</a>
            </div>
        </form>
    </div>
@endsection
