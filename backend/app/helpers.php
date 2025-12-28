<?php

use Illuminate\Support\Carbon;
use League\CommonMark\GithubFlavoredMarkdownConverter;


function user()
{
    return auth()->user();
}


function isHtmxRequest()
{
    return request()->header('HX-Request') === 'true';
}


function redirectResponse($url = "")
{
    if (isHtmxRequest()) {
        return response('', 200)->header('HX-Redirect', url($url));
    }

    return redirect(url($url));
}

function formatDate($date, $format = "d-m-Y")
{
    return Carbon::parse($date)->format($format);
}


function formatTime($date)
{
    return Carbon::parse($date)->format("h:i A");
}


function formatMessage($message)
{
    $converter = new GithubFlavoredMarkdownConverter([
        'html_input' => 'strip',
        'allow_unsafe_links' => false,
    ]);

    $html = $converter->convert($message);

    // Add target="_blank" and rel="noopener noreferrer" to all <a> tags
    $html = preg_replace_callback(
        '/<a\s+href="([^"]+)">/i',
        function ($matches) {
            return '<a href="' . $matches[1] . '" target="_blank" rel="noopener noreferrer">';
        },
        $html
    );

    return nl2br(trim($html));
}


function tableButtons($row)
{
    $editIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>';

    return "<button class='btn shadow-none text-theme btn-sm' onclick='editRow({$row->id})'>
                $editIcon
            </button>";
}


function booleanIcon($value)
{
    if ($value) {
        return '<svg class="text-success" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" clip-rule="evenodd"/></svg>';
    }
    return '<svg class="text-danger" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M3 8h10"/></svg>';
}

function uploadPath($path = "")
{
    return public_path("/upload/$path");
}
