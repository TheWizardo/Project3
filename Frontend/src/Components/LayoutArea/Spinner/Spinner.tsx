import "./Spinner.css";
import loadingGIF from "../../../Assets/Images/spinner.gif"

function Spinner(): JSX.Element {
    return (
        <div className="Spinner">
            <img src={loadingGIF} />
        </div>
    );
}

export default Spinner;
