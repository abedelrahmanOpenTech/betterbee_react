import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/ui/PasswordInput";
import { df, getLang, toggleLang } from "../../utils/lang";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../stores/useAuth";
import Spinner from "../../components/ui/Spinner";
import { useRegister } from "../../hooks/useAuthQuery";

export default function Register() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { mutate: registerUser, isPending: isRegistering } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const onSubmit = (data) => {
        const formData = new FormData();

        // Append all form fields
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        registerUser(formData, {
            onSuccess: async (response) => {
                if (response.status !== 'success') {
                    toast.error(response.message);
                    return;
                }

                toast.success(response.message);
                await auth.set(response.user, response.access_token);
                navigate('/');
            },
            onError: (error) => {
                toast.error(error.message ? error.message : df('error'));
            }
        });
    };

    return (
        <div className="container d-flex flex-column justify-content-center py-5 slide-up-animation">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">

                    <div className="mb-4">
                        <button onClick={() => navigate(-1)} className="btn btn-link text-secondary text-decoration-none d-flex align-items-center p-0 border-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2 rtl-flip rtl-rotate">
                                <path d="M19 12H5"></path>
                                <path d="M12 19l-7-7 7-7"></path>
                            </svg>
                            <span>{df('back')}</span>
                        </button>
                    </div>

                    <div className="mb-4">
                        <h1 className="fw-bold mb-2 display-6 text-theme2">{df('register')}</h1>
                        <p className="text-secondary m-0">{df('register_subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            {/* Name */}
                            <div className="col-12 my-2">
                                <div className="form-group">
                                    <label className="form-label">{df('name')}</label>
                                    <input
                                        name="name"
                                        type="text"
                                        className="form-control py-2"
                                        placeholder={df('name')}
                                        {...register('name', { required: df('required') })}
                                    />
                                    {errors.name && <p className="text-danger small mt-1">{errors.name.message}</p>}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="col-12 my-2">
                                <div className="form-group">
                                    <label className="form-label">{df('email')}</label>
                                    <input
                                        name="email"
                                        type="email"
                                        className="form-control py-2"
                                        placeholder="example@email.com"
                                        {...register('email', {
                                            required: df('required'),
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: df('invalid_email')
                                            }
                                        })}
                                    />
                                    {errors.email && <p className="text-danger small mt-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            {/* Password */}
                            <div className="col-12 my-2">
                                <PasswordInput
                                    label={df('password')}
                                    name="password"
                                    register={register}
                                    error={errors.password}
                                    validation={{
                                        required: df('required'),
                                        minLength: {
                                            value: 8,
                                            message: df('password_min_length')
                                        }
                                    }}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="col-12 my-2">
                                <PasswordInput
                                    label={df('confirm_password')}
                                    name="password_confirmation"
                                    register={register}
                                    error={errors.password_confirmation}
                                    validation={{
                                        required: df('required'),
                                        validate: (val) => {
                                            if (watch('password') != val) {
                                                return df('passwords_not_match');
                                            }
                                        },
                                    }}
                                />
                            </div>

                            {/* Register Button */}
                            <div className="col-12 my-2 mt-4">
                                {isRegistering ? (
                                    <div className="d-flex justify-content-center">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <button className="btn-theme btn py-2 rounded-theme shadow-sm w-100" type="submit">
                                        {df('register')}
                                    </button>
                                )}
                            </div>

                            {/* Login Link */}
                            <div className="text-center mt-4">
                                <span className="text-secondary me-1">{df('already_have_account')}</span>
                                <Link to="/login" className="text-theme fw-bold text-decoration-none">
                                    {df('login')}
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="text-center mt-5">
                <button
                    onClick={toggleLang}
                    className="btn btn-link text-secondary text-decoration-none btn-sm">
                    {getLang() === 'ar' ? 'English' : 'العربية'}
                </button>
            </div>
        </div>
    );
}
