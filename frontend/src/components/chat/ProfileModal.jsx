import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button } from "react-bootstrap";
import { df } from "../../utils/lang";
import { useAuthUpdate } from "../../hooks/useAuthQuery";
import useAuth from "../../stores/useAuth";
import toast from "react-hot-toast";
import Spinner from "../ui/Spinner";
import PasswordInput from "../ui/PasswordInput";
import { uploadsUrl } from "../../config";

export default function ProfileModal({ show, onClose }) {
    const auth = useAuth();
    const { mutate: updateProfile, isPending } = useAuthUpdate();
    const [profilePreview, setProfilePreview] = useState(auth.user?.profile ? uploadsUrl + '/' + auth.user.profile : null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: auth.user?.name,
            email: auth.user?.email,
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        if (data.password) formData.append('password', data.password);
        if (data.profile[0]) formData.append('profile', data.profile[0]);

        updateProfile(formData, {
            onSuccess: (response) => {
                if (response.status === 'success') {
                    auth.set(response.user);
                    toast.success(df('save_success'));
                    onClose();
                } else {
                    toast.error(response.message);
                }
            },
            onError: () => toast.error(df('error'))
        });
    };

    return (
        <Modal show={show} onHide={onClose} centered contentClassName="rounded-theme border-0 shadow">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">{df('profile')}</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <div className="text-center mb-4">
                        <label htmlFor="profile-upload" className="cursor-pointer position-relative">
                            <img
                                src={profilePreview || "https://placehold.co/150x150?text=Profile"}
                                alt="Profile"
                                className="rounded-circle border border-4 border-white shadow-sm object-fit-cover"
                                style={{ width: '120px', height: '120px' }}
                            />
                            <div className="position-absolute bottom-0 end-0 bg-theme text-white rounded-circle p-2 shadow-sm border border-2 border-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            </div>
                            <input
                                id="profile-upload"
                                type="file"
                                className="d-none"
                                accept="image/*"
                                {...(() => {
                                    const { onChange, ...rest } = register('profile');
                                    return {
                                        ...rest,
                                        onChange: (e) => {
                                            onChange(e);
                                            handleImageChange(e);
                                        }
                                    };
                                })()}
                            />
                        </label>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{df('name')}</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            {...register('name', { required: df('required') })}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{df('email')}</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            {...register('email', { required: df('required') })}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>

                    <div className="mb-3">
                        <PasswordInput
                            label={df('password') + " (" + df('optional') + ")"}
                            name="password"
                            register={register}
                            error={errors.password}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" className="rounded-theme px-4" onClick={onClose}>
                        {df('cancel')}
                    </Button>
                    <Button type="submit" variant="theme" className="rounded-theme px-4 btn-theme" disabled={isPending}>
                        {isPending ? <Spinner /> : df('save')}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
