import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import DestinationModel from "../../../Models/DestinationModel";
import VacationModel from "../../../Models/VacationModel";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import useVerifyAdmin from "../../../Utils/useVarifyAdmin";

import { DateRangePicker } from 'rsuite';
import { Explore } from '@rsuite/icons';
import "./EditVacation.css";
import config from "../../../Utils/config";

function EditVacation(): JSX.Element {
    useVerifyAdmin();
    const [destinations, setDestinations] = useState<DestinationModel[]>([]);
    const [vacation, setVacation] = useState<VacationModel>();
    const [vacationChanged, setVacationChanged] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<Blob>();
    const [preview, setPreview] = useState<string>("");
    const params = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    const { before } = DateRangePicker;

    async function send(sendVacation: VacationModel): Promise<void> {
        try {
            // applying changes
            sendVacation.startDate = vacation.startDate;
            sendVacation.endDate = vacation.endDate;
            sendVacation.dstId = +sendVacation.dstId;
            const selectedDst = destinations.find(d => d.id === sendVacation.dstId);
            sendVacation.dstName = selectedDst.name;
            sendVacation.dstDescription = selectedDst.description;
            await vacationsService.updateVacation(sendVacation);
            notifyService.success("Vacation updated!");
            navigate("/vacations");
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    // handling change of dates
    function changeDates(dates: Date[]) {
        const alteredVacation = { ...vacation };
        alteredVacation.startDate = dates[0];
        alteredVacation.endDate = dates[1];
        setVacation(alteredVacation);
        setVacationChanged(true);
    }

    // handling change of destination
    function changeDst(ev: any) {
        const alteredVacation = { ...vacation };
        const selectedDst = destinations.find(d => d.id === +ev.target.value);
        alteredVacation.dstName = selectedDst.name;
        alteredVacation.dstDescription = selectedDst.description;
        setVacation(alteredVacation);
        setVacationChanged(true);
    }

    // handling the update of preview photo
    function onSelectFile(e: any) {
        const alteredVacation = { ...vacation };
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            alteredVacation.image = undefined;
            alteredVacation.imageName = "notFound";
            setVacation(alteredVacation);
            return;
        }
        alteredVacation.image = e.target.files[0];
        alteredVacation.imageName = e.target.files[0].name;
        setVacation(alteredVacation);
        setVacationChanged(true);
        setSelectedFile(e.target.files[0]);
    }

    useEffect(() => {
        // fetching the selected vacation by the ID
        vacationsService.getVacationById(+params.id).then(v => {
            setPreview(`${config.imagesURL}/${v.imageName}`);
            setVacation(v);
        })
            .catch(err => notifyService.error(err));

        // fetching destinations 
        vacationsService.getDestinations().then(d => setDestinations(d))
            .catch(err => notifyService.error(err));
    }, []);

    useEffect(() => {
        if (!vacation) return;

        if (!selectedFile) {
            setPreview(`${config.imagesURL}/${vacation.imageName}`);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    return (
        <div className="EditVacation form-style">
            <NavLink to="/destinations"><Explore /> Manage Destination</NavLink>
            <form onSubmit={handleSubmit(send)}>
                <h1>Edit Vacation</h1>

                {vacation && <>
                    <label>Destination:</label>
                    {destinations.length > 0 && <select defaultValue={vacation.dstId} onChangeCapture={(ev) => changeDst(ev)} {...register("dstId", {
                        required: { value: true, message: "Please select a destination" },
                    })}>
                        {destinations.map(d => <option value={d.id} key={d.id}>{d.name}</option>)}
                    </select>}
                    <span className="error-message">{formState.errors.dstId?.message}</span>

                    <label>Price:</label>
                    <input type="number" step="0.01" defaultValue={vacation.price} onChangeCapture={() => setVacationChanged(true)} {...register("price", {
                        required: { value: true, message: "Missing price" },
                        min: { value: 0, message: "Price cannot be negative" },
                        max: { value: 10000, message: "Price cannot exceed 10000" }
                    })} />
                    <span className="error-message">{formState.errors.price?.message}</span>

                    <label>Dates:</label>
                    <DateRangePicker
                        format="dd-MM-yyyy"
                        defaultValue={[vacation.startDate, vacation.endDate]}
                        showOneCalendar
                        disabledDate={before(new Date())}
                        character=" until "
                        cleanable={false}
                        onChange={(dates) => changeDates(dates)} />

                    <label>Image:</label>
                    <div className="container">
                        <input type="file" accept="image/*" onInput={onSelectFile}{...register("image")} />
                        <img src={preview} />
                    </div>

                    <input type="text" hidden value={vacation.imageName} {...register("imageName")} />
                    <input type="number" hidden value={vacation.id} {...register("id")} />
                    <input type="number" hidden value={vacation.followersCount} {...register("followersCount")} />
                </>}
                <button disabled={!vacationChanged}>Update</button>
            </form>
        </div>
    );
}

export default EditVacation;
