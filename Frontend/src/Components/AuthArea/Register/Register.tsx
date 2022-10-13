import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./Register.css";

function Register(): JSX.Element {
    const { register, handleSubmit, formState } = useForm<UserModel>();
    const [usernameTaken, setUsernameTaken] = useState<boolean>();
    const navigate = useNavigate();

    async function send(user: UserModel) {
        try {
            const exists = await authService.usernameExists(user.username);
            if (exists) {
                setUsernameTaken(true);
                return;
            }
            await authService.register(user);
            notifyService.success(`Welcome ${user.username}`);
            navigate("/vacations");
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }
    return (
        <div className="Register">
            <form onSubmit={handleSubmit(send)} className="form-style">
                <label>First Name:</label>
                <input type="text" {...register("firstName", { required: { value: true, message: "required" }, minLength: { value: 2, message: "must be at least 2 chars" }, maxLength: { value: 100, message: "must be less than 100 chars" } })} />
                <span className="error-message">{formState.errors.firstName?.message}</span>
                <br/>

                <label>Last Name:</label>
                <input type="text" {...register("lastName", { required: { value: true, message: "required" }, minLength: { value: 2, message: "must be at least 2 chars" }, maxLength: { value: 100, message: "must be less than 100 chars" } })} />
                <span className="error-message">{formState.errors.lastName?.message}</span>
                <br/>

                <label>Username:</label>
                <input type="text" {...register("username", { required: { value: true, message: "required" }, minLength: { value: 4, message: "must be at least 4 chars" }, maxLength: { value: 100, message: "must be less than 100 chars" } })} />
                <span className="error-message">{formState.errors.username?.message}</span>
                {usernameTaken && <span className="error-message">Username is taken</span>}
                <br/>

                <label>Password:</label>
                <input type="password" {...register("password", { required: { value: true, message: "required" }, minLength: { value: 4, message: "must be at least 4 chars" }, maxLength: { value: 100, message: "must be less than 100 chars" } })} />
                <span className="error-message">{formState.errors.password?.message}</span>
                <br/>

                <button>Register</button>
            </form>
        </div>
    );
}

export default Register;
