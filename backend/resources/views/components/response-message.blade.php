 @if (session('response'))
     <div class="alert alert-{{ session('response.status') === 'error' ? 'danger' : 'success' }} alert-dismissible fade show"
         role="alert">
         {{ session('response.message') }}
     </div>
 @endif
