import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/ui/PasswordInput";
import { df, getLang, toggleLang } from "../../utils/lang";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../stores/useAuth";
import Spinner from "../../components/ui/Spinner";
import { useEffect } from "react";
import { useLogin } from "../../hooks/useAuthQuery";

export default function Login() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { mutate: login, isPending: isLoggingIn } = useLogin();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const email = sessionStorage.getItem('email');
        if (email) {
            setValue('email', email);
        }
    }, []);

    const onSubmit = (data) => {
        login(data, {
            onSuccess: async (response) => {
                if (response.status !== 'success') {
                    toast.error(response.message);
                    return;
                }

                toast.success(response.message);
                await auth.set(response.user, response.access_token);
                navigate("/");
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
                        <h1 className="fw-bold mb-2 display-6 text-theme2">{df('login')}</h1>
                        <p className="text-secondary m-0">{df('login_subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            {/* Email */}
                            <div className="col-12 my-2">
                                <div className="form-group">
                                    <label className="form-label">{df('email')}</label>
                                    <input
                                        name="email"
                                        type="text"
                                        className="form-control py-2"
                                        placeholder="example@email.com"
                                        {...register('email', { required: df('required') })}
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
                                    validation={{ required: df('required') }}
                                />
                            </div>

                            {/* Sign In Button */}
                            <div className="col-12 my-2 mt-4">
                                {isLoggingIn ? (
                                    <div className="d-flex justify-content-center">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <button className="btn-theme btn py-2 rounded-theme shadow-sm w-100" type="submit">
                                        {df('login')}
                                    </button>
                                )}
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center mt-4">
                                <span className="text-secondary me-1">{df('dont_have_account')}</span>
                                <Link to="/register" className="text-theme fw-bold text-decoration-none">
                                    {df('register')}
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
