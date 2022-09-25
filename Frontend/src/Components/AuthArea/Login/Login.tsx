import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import "./Login.css";

function Login(): JSX.Element {

    const { register, handleSubmit, formState } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    async function send(cred: CredentialsModel) {
        try {
            await authService.login(cred); // bugs out when incorrect data is provided
            notifyService.success("Welcome back m8!");
            await vacationsService.getMyVacations();
            navigate("/vacations");
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit(send)} className="form-style">
                <label>Username:</label>
                <input type="text" {...register("username", { required: { value: true, message: "required" }, minLength: { value: 4, message: "must be at least 4 chars" }, maxLength: { value: 100, message: "must be less than 100 chars" } })} />
                <span className="error-message">{formState.errors.username?.message}</span>
                <br/>

                <label>Password:</label>
                <input type="password" {...register("password", { required: { value: true, message: "required" }, minLength: { value: 4, message: "must be at least 4 chars" }, maxLength: { value: 100, message: "must be less than 100 chars" } })} />
                <span className="error-message">{formState.errors.password?.message}</span>
                <br/>

                <button>Login</button>
                <hr />
                <p>Not a member yet? <NavLink to="/register">register</NavLink></p>
            </form>
        </div>
    );
}

export default Login;