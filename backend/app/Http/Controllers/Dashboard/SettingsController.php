<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    public function form(Request $request)
    {

        $settings = Settings::getSettings();

        return view('dashboard.settings.form', [
            'settings' => $settings
        ]);
    }


    public function save(Request $request)
    {

        $data = Validator::validate($request->all(), [
            'enable_register' => 'nullable',
        ]);

        $data['enable_register'] = empty($data['enable_register']) ? 0 : 1;
        $settings = Settings::get()->first();
        if (empty($settings)) {
            Settings::create(['json' => json_encode($data)]);
        } else {
            Settings::where("id", $settings->id)->update(['json' => json_encode($data)]);
        }

        session()->flash("toast", ["status" => "success", "message" => "Saved"]);

        return redirect(url('dashboard/settings'));
    }
}
