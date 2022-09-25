import "./Copyright.css";

function Copyright(): JSX.Element {
    return (
        <div className="Copyright">
			© All right reserved {(new Date()).getFullYear()}
        </div>
    );
}

export default Copyright;
