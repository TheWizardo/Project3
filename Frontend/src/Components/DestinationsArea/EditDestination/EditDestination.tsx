import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import DestinationModel from "../../../Models/DestinationModel";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import useVerifyAdmin from "../../../Utils/useVarifyAdmin";
import "./EditDestination.css";

function EditDestination(): JSX.Element {
    useVerifyAdmin();
    const { register, handleSubmit, formState } = useForm<DestinationModel>();
    const [destination, setDestination] = useState<DestinationModel>();
    const params = useParams();

    async function send(destination: DestinationModel): Promise<void> {
        try {
            await vacationsService.editDestination(destination);
            notifyService.success("Destination updated successfully!");
            window.history.go(-2);
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    useEffect(() => {
        vacationsService.getDestinations()
            .then(destinations => {
                const selectedDestination = destinations.find(d => d.id === +params.id);
                setDestination(selectedDestination);
            })
            .catch();
    }, []);

    return (
        <div className="EditDestination form-style">
            <form onSubmit={handleSubmit(send)}>
                {destination && <>
                    <label>Destination Name</label>
                    <input type="text" defaultValue={destination.name}{...register("name", {
                        required: { value: true, message: "Please fill" },
                        minLength: { value: 2, message: "Must be more than 2 characters" },
                        maxLength: { value: 50, message: "Must be less than 50 characters" }
                    })} />
                    <span className="error-massage">{formState.errors.name?.message}</span>

                    <label>Destination Description</label>
                    <textarea defaultValue={destination.description} {...register("description", {
                        required: { value: true, message: "Please fill" },
                        minLength: { value: 2, message: "Must be more than 2 characters" },
                        maxLength: { value: 150, message: "Must be less than 150 characters" }
                    })} />
                    <span className="error-massage">{formState.errors.description?.message}</span>

                    <input type="hidden" value={destination.id} {...register("id")}/>
                </>}

                <button>Add</button>
            </form>
        </div>
    );
}

export default EditDestination;
