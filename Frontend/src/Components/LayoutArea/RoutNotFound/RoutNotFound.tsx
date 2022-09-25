import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import notifyService from "../../../Services/NotifyService";
import "./RoutNotFound.css";

function random(a: number, b: number): number {
    if (b < a) {
        const temp = a;
        a = b;
        b = temp;
    }

    return b + (a - b) * Math.random();
}

function RoutNotFound(): JSX.Element {
    const [destruct, setDestruct] = useState<boolean>(false);
    const [abort, setAbort] = useState<boolean>(false);
    const [time, setTime] = useState<number>(999);
    const [x_pos, setX_pos] = useState<number>(100);
    const [y_pos, setY_pos] = useState<number>(100);
    const navigate = useNavigate();

    const messages = ["Terminating cooling system",
        "Overclocking nuclear cores",
        "Raising acidic composition",
        "Bribing guards to overlook the situation",
        "RUNNING FOR MY LIFE"];

    useEffect(() => {
        if (!destruct) return;

        const elem = document.getElementById("root");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }

        const timerIntervalId = window.setInterval(() => {
            setTime(currTime => {
                if (currTime === 0) {
                    setTimeout(() => {
                        document.exitFullscreen();
                        navigate("/");
                    }, 1800);
                }
                if (currTime % 3 === 0 && currTime !== 0) {
                    const index = (15 - currTime) / 3;
                    notifyService.error(messages[index], { autoClose: 1650 });
                }
                return currTime - 1;
            });
        }, 1000);

        const posIntervalId = window.setInterval(() => {
            setX_pos(currX => {
                const winWid = window.innerWidth;
                const newX = currX + random(-47, 50);
                if (newX <= 0) return 0;
                if (newX >= winWid - 50) return winWid - 50;
                return newX;
            });
            setY_pos(currY => {
                const winHigh = window.innerHeight;
                const newY = currY + random(-47, 50);
                if (newY <= 0) return 0;
                if (newY >= winHigh - 25) return winHigh - 25;
                return newY;
            });
        }, 75);

        return () => {
            window.clearInterval(timerIntervalId);
            window.clearInterval(posIntervalId);
        }
    }, [destruct]);

    function selfDestruct() {
        setTime(15);
        setDestruct(true);
    }

    function abortDestruct() {
        setDestruct(false);
        setAbort(true);
        notifyService.closeAll();
        notifyService.warn("Please don't do that again", { autoClose: 2000 });
        setTimeout(() => {
            document.exitFullscreen();
            navigate("/");
        }, 2500);
    }

    return (
        <div className="RoutNotFound">
            <h1>404</h1>
            <hr />
            <p>the page you are looking for could not be found.</p>
            <h3>Do you wish to self-destruct?</h3>
            <div className="vertical-center self-destruct">
                <button onClick={selfDestruct}>YES!</button>
            </div>
            <div className="vertical-center chicken-link">
                <NavLink to="/">Back to safety</NavLink>
            </div>

            {destruct && <div className="Red fullscreen">
                {time > 0 && <button onClick={abortDestruct} style={{ position: "fixed", top: y_pos, left: x_pos }}>abort</button>}
                <div className="vertical-center countdown">
                    {time > 0 && <>
                        <span>{time}</span>
                    </>}
                    {time <= 0 && <span>Just Kidding</span>}
                </div>
            </div>}

            {abort && <>
                <div className="Green fullscreen vertical-center">
                    <span>Safe!</span>
                </div>
            </>}
        </div>
    );
}

export default RoutNotFound;
