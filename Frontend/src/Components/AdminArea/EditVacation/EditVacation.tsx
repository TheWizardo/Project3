import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import DestinationModel from "../../../Models/DestinationModel";
import VacationModel from "../../../Models/VacationModel";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import { vacationsStore } from "../../../Redux/VacationsState";
import useVerifyAdmin from "../../../Utils/useVarifyAdmin";

import { DateRangePicker } from 'rsuite';
import { Explore } from '@rsuite/icons';
import "./EditVacation.css";
import config from "../../../Utils/config";

function EditVacation(): JSX.Element {
    useVerifyAdmin();
    const [destinations, setDestinations] = useState<DestinationModel[]>([]);
    const [vacation, setVacation] = useState<VacationModel>();
    const [dates, setDates] = useState<Date[]>([null, null]);
    const [dateError, setDateError] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<Blob>();
    const [preview, setPreview] = useState<string>("");
    const params = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    const { before } = DateRangePicker;

    async function send(vacation: VacationModel): Promise<void> {
        try {
            if (dates.length < 1) {
                setDateError("Please choose dates");
                return;
            }
            vacation.startDate = dates[0];
            vacation.endDate = dates[1];
            const selectedDst = destinations.find(d => d.id === +vacation.dstId);
            vacation.dstName = selectedDst.name;
            vacation.dstDescription = selectedDst.description;
            await vacationsService.updateVacation(vacation);
            notifyService.success("Vacation updated!");
            navigate("/vacations");
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    useEffect(() => {
        const selectedVacation = vacationsStore.getState().vacations.find(v => v.id === +params.id);
        setPreview(`${config.imagesURL}/${selectedVacation.imageName}`);
        setVacation(selectedVacation);
        setDates([selectedVacation.startDate, selectedVacation.endDate]);
        vacationsService.getDestinations().then(d => setDestinations(d))
            .catch(err => notifyService.error(err));
    }, []);

    useEffect(() => {
        if (vacation) {
            if (!selectedFile) {
                setPreview(`${config.imagesURL}/${vacation.imageName}`);
                return;
            }

            const objectUrl = URL.createObjectURL(selectedFile)
            setPreview(objectUrl)

            // free memory when ever this component is unmounted
            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [selectedFile]);

    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    return (
        <div className="EditVacation form-style">
            <NavLink to="/destinations"><Explore /> Manage Destination</NavLink>
            <form onSubmit={handleSubmit(send)}>
                <h1>Edit Vacation</h1>

                {vacation && <>
                    <label>Destination:</label>
                    {destinations.length > 0 && <select defaultValue={vacation.dstId} {...register("dstId", {
                        required: { value: true, message: "Please select a destination" },
                    })}>
                        {destinations.map(d => <option value={d.id} key={d.id}>{d.name}</option>)}
                    </select>}
                    <span className="error-message">{formState.errors.dstId?.message}</span>

                    <label>Price:</label>
                    <input type="number" step="0.01" defaultValue={vacation.price} {...register("price", {
                        required: { value: true, message: "Missing price" },
                        min: { value: 0, message: "Price cannot be negative" },
                        max: { value: 10000, message: "Price cannot exceed 10000" }
                    })} />
                    <span className="error-message">{formState.errors.price?.message}</span>

                    <label>Dates:</label>
                    <DateRangePicker
                        format="dd-MM-yyyy"
                        defaultValue={[dates[0], dates[1]]}
                        showOneCalendar
                        disabledDate={before(new Date())}
                        character=" until "
                        cleanable={true}
                        onChange={(d) => {
                            setDates(d);
                            setDateError("");
                        }} />
                    <span className="error-message">{dateError}</span>

                    <label>Image:</label>
                    <div>
                        <input type="file" accept="image/*" onInput={onSelectFile}{...register("image")} />
                        <img src={preview} />
                    </div>

                    <input type="text" hidden value={vacation.imageName} {...register("imageName")} />
                    <input type="number" hidden value={vacation.id} {...register("id")} />
                    <input type="number" hidden value={vacation.following} {...register("following")} />
                </>}
                <button>Update</button>
            </form>
        </div>
    );
}

export default EditVacation;
