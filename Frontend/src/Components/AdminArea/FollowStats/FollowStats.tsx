import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import "./FollowStats.css";

// SHOW EXPIRED VACATIONS AS A DIFFERENT SERIES

interface ChartProps {
    options: ApexCharts.ApexOptions;
    series: ApexAxisChartSeries;
}

function getWindowWidth() {
    const main = document.querySelector("main");
    const height = main.offsetHeight;
    const { innerWidth: width, innerHeight: windowHeight } = window;
    return { width, height, windowHeight};
}

function FollowStats(): JSX.Element {
    const [props, setProps] = useState<ChartProps>();
    const [width, setWidth] = useState<number>(600);

    useEffect(() => {
        function handleResize() { // NEEDS TO BE WORKED OUT on the right track
            let { width, height, windowHeight } = getWindowWidth();
            if (height > windowHeight * 0.82) {
                width = height * 1.54;
            }
            setWidth(width * 0.9);
        }
        handleResize();

        vacationsService.getAllVacations().then(vacations => {
            // HANDLE SIMILARLY NAMED VACATIONS
            let following = vacations.filter(v => v.followersCount > 0);
            let now = new Date();
            setProps({
                options: {
                    chart: {
                        type: "bar",
                        toolbar: {
                            show: false
                        }
                    }
                },
                series: [{
                    name: "followed",
                    data: following.map(v => {
                        return { x: `${v.dstName}${v.startDate < now ? " [EXP]" : ""}`, y: v.followersCount };
                    }),
                    color: "#a073ff"
                }]
            });
        })
            .catch(err => notifyService.error(err));


        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="FollowStats">
            <div className="row">
                <div className="mixed-chart">
                    {props && <Chart
                        options={props.options}
                        series={props.series}
                        width={width}
                        type="bar"
                    />}
                </div>
            </div>
        </div>
    );
}

export default FollowStats;
