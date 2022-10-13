import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import DestinationModel from "../../../Models/DestinationModel";
import VacationModel from "../../../Models/VacationModel";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import useVerifyAdmin from "../../../Utils/useVarifyAdmin";

import { DateRangePicker } from 'rsuite';
import { Explore } from '@rsuite/icons';
import "./AddVacation.css";
import config from "../../../Utils/config";

function AddVacation(): JSX.Element {
    useVerifyAdmin();
    const [destinations, setDestinations] = useState<DestinationModel[]>([]);
    const [dates, setDates] = useState<Date[]>([null, null]);
    const [dateError, setDateError] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<Blob>();
    const [preview, setPreview] = useState<string>("");
    const navigate = useNavigate();
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    const { before } = DateRangePicker;

    async function send(vacation: VacationModel): Promise<void> {
        try {
            // validation and applying changes 
            if (dates.length < 1) {
                setDateError("Please choose dates");
                return;
            }
            vacation.startDate = dates[0];
            vacation.endDate = dates[1];
            const selectedDst = destinations.find(d => d.id === +vacation.dstId);
            vacation.dstName = selectedDst.name;
            vacation.dstDescription = selectedDst.description;

            // adding vacation
            await vacationsService.addVacation(vacation);
            notifyService.success("Vacation added successfully!");
            navigate("/vacations");
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    useEffect(() => {
        vacationsService.getDestinations().then(d => setDestinations(d))
            .catch(err => notifyService.error(err));
    }, []);

    // handling the update of preview photo
    useEffect(() => {
        if (!selectedFile) {
            setPreview(`${config.imagesURL}/ImgNotFound.png`);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return;
        }

        setSelectedFile(e.target.files[0]);
    }

    return (
        <div className="AddVacation form-style">
            <NavLink to="/destinations"><Explore /> Manage Destination</NavLink>
            <form onSubmit={handleSubmit(send)}>
                <h1>Add Vacation</h1>

                <label>Destination:</label>
                {destinations.length > 0 && <select defaultValue={destinations[0].name} {...register("dstId", {
                    required: { value: true, message: "Please select a destination" },
                })}>
                    {destinations.map(d => <option value={d.id} key={d.id}>{d.name}</option>)}
                </select>}
                <span className="error-message">{formState.errors.dstId?.message}</span>

                <label>Price:</label>
                <input type="number" step="0.01" {...register("price", {
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
                    placement="bottomEnd"
                    disabledDate={before(new Date())}
                    character=" until "
                    cleanable={true}
                    onChange={(d) => {
                        setDates(d);
                        setDateError("");
                    }} />
                <span className="error-message">{dateError}</span>

                <label>Image:</label>
                <div className="container">
                    <input type="file" accept="image/*" onInput={onSelectFile}{...register("image")} />
                    <img src={preview} />
                </div>

                <button>Add</button>
            </form>
        </div>
    );
}

export default AddVacation;
