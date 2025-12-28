 @php
     $imagePath = $user->profile
         ? asset("uploads/{$user->profile}")
         : 'https://ui-avatars.com/api/?name=' . urlencode($user->name);
 @endphp
 <img src="{{ $imagePath }}" data-og-src="{{ $imagePath }}" alt="{{ $user->name }}"
     class="rounded-circle bg-white border" style="object-fit: contain" width="48" height="48">
