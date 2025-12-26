import { useState } from "react";

/**
 * PasswordInput Component
 * A reusable password input field with toggle visibility functionality
 * 
 * @param {Object} props
 * @param {string} props.label - Label text for the input
 * @param {string} props.name - Name attribute for the input
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.register - React Hook Form register function
 * @param {Object} props.error - Error object from React Hook Form
 * @param {Object} props.validation - Validation rules for React Hook Form
 */
export default function PasswordInput({
    label,
    name = "password",
    placeholder = "",
    register,
    error,
    validation = {}
}) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="form-group position-relative">
            <label className="form-label">{label}</label>
            <input
                name={name}
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder={placeholder}
                {...register(name, validation)}
            />
            {error && <p className="text-danger small mt-1">{error.message}</p>}

            <div
                className="pointer position-absolute end-0 m-0 me-2 cursor-pointer"
                style={{ top: '40px' }}
                onClick={togglePasswordVisibility}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? (
                    // Eye slash icon (password hidden)
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673A8.7 8.7 0 0 1 12 18q-5.4 0-9-6q1.908-3.18 4.32-4.674m2.86-1.146A9 9 0 0 1 12 6q5.4 0 9 6q-1 1.665-2.138 2.87M3 3l18 18" /></g></svg>

                ) : (
                    // Eye icon (password visible)
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024"><path fill="currentColor" d="M515.472 321.408c-106.032 0-192 85.968-192 192c0 106.016 85.968 192 192 192s192-85.968 192-192s-85.968-192-192-192m0 320c-70.576 0-129.473-58.816-129.473-129.393s57.424-128 128-128c70.592 0 128 57.424 128 128s-55.935 129.393-126.527 129.393m508.208-136.832c-.368-1.616-.207-3.325-.688-4.91c-.208-.671-.624-1.055-.864-1.647c-.336-.912-.256-1.984-.72-2.864c-93.072-213.104-293.663-335.76-507.423-335.76S95.617 281.827 2.497 494.947c-.4.897-.336 1.824-.657 2.849c-.223.624-.687.975-.895 1.567c-.496 1.616-.304 3.296-.608 4.928c-.591 2.88-1.135 5.68-1.135 8.592c0 2.944.544 5.664 1.135 8.591c.32 1.6.113 3.344.609 4.88c.208.72.672 1.024.895 1.68c.336.88.256 1.968.656 2.848c93.136 213.056 295.744 333.712 509.504 333.712c213.776 0 416.336-120.4 509.44-333.505c.464-.912.369-1.872.72-2.88c.224-.56.655-.976.848-1.6c.496-1.568.336-3.28.687-4.912c.56-2.864 1.088-5.664 1.088-8.624c0-2.816-.528-5.6-1.104-8.497M512 800.595c-181.296 0-359.743-95.568-447.423-287.681c86.848-191.472 267.68-289.504 449.424-289.504c181.68 0 358.496 98.144 445.376 289.712C872.561 704.53 693.744 800.595 512 800.595" /></svg>
                )}
            </div>
        </div>
    );
}
