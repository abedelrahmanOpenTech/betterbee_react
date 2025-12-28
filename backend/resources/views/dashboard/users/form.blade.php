<input type="hidden" name='id' value="{{ old('id', $user->id) }}">

<div class="form-group my-2">
    <label for="is_disabled" class="form-label">Disabled</label>
    <input type="checkbox" name="is_disabled" value="1" @if (old('is_disabled', $user->is_disabled ?? 0)) checked @endif
        class="form-check-input">
</div>


<div class="form-group my-2">
    <label for="name" class="form-label required">Name</label>
    <input type="text" name='name' @class(['form-control', 'is-invalid' => $errors->has('name')]) value="{{ old('name', $user->name) }}">
    <span class="text-danger">
        @error('name')
            {{ $message }}
        @enderror
    </span>
</div>



<div class="form-group my-2">
    <label for="email" class="form-label required">Email</label>
    <input type="email" name='email' @class(['form-control', 'is-invalid' => $errors->has('email')]) value="{{ old('email', $user->email) }}">
    <span class="text-danger">
        @error('email')
            {{ $message }}
        @enderror
    </span>
</div>

<div class="form-group my-2 position-relative" x-data="{ show: false }">
    <label for="email" class="form-label">Password</label>
    <input type="password" id="password" name='password' autocomplete="new-password" @class(['form-control', 'is-invalid' => $errors->has('password')])>
    <span class="text-danger"> @error('password')
            {{ $message }}
        @enderror
    </span>
    <div onclick="togglePassword('#password')" class="position-absolute top-0 end-0 btn p-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor"
                d="M12 9.005a4 4 0 1 1 0 8a4 4 0 0 1 0-8M12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365a8.504 8.504 0 0 0-16.493.004a.75.75 0 0 1-1.456-.363A10 10 0 0 1 12 5.5" />
        </svg>
    </div>
</div>
