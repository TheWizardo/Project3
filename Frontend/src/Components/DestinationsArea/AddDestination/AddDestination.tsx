import { useForm } from "react-hook-form";
import DestinationModel from "../../../Models/DestinationModel";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import useVerifyAdmin from "../../../Utils/useVarifyAdmin";
import "./AddDestination.css";

function AddDestination(): JSX.Element {
    useVerifyAdmin();
    const { register, handleSubmit, formState } = useForm<DestinationModel>();

    async function send(destination: DestinationModel): Promise<void> {
        try {
            await vacationsService.addDestination(destination);
            notifyService.success("Destination added successfully!");
            window.history.go(-2);
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    return (
        <div className="AddDestination form-style">
            <form onSubmit={handleSubmit(send)}>
                <label>Destination Name</label>
                <input type="text" {...register("name", {
                    required: { value: true, message: "Please fill" },
                    minLength: { value: 2, message: "Must be more than 2 characters" },
                    maxLength: { value: 50, message: "Must be less than 50 characters" }
                })} />
                <span className="error-massage">{formState.errors.name?.message}</span>

                <label>Destination Description</label>
                <textarea {...register("description", {
                    required: { value: true, message: "Please fill" },
                    minLength: { value: 2, message: "Must be more than 2 characters" },
                    maxLength: { value: 150, message: "Must be less than 150 characters" }
                })} />
                <span className="error-massage">{formState.errors.description?.message}</span>

                <button>Add</button>
            </form>
        </div>
    );
}

export default AddDestination;
