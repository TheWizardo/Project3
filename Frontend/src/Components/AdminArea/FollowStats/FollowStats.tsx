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

function getWindowDimensions() {
    const main = document.querySelector("main");
    const height = main.offsetHeight;
    const { innerWidth: width} = window;
    return { width, height};
}

function FollowStats(): JSX.Element {
    const [props, setProps] = useState<ChartProps>();
    const [width, setWidth] = useState<number>(600);
    
    
    function handleResize() {
        const aspect = 1.5625;
        const { width, height } = getWindowDimensions();
        
        let newWidth = width * 0.9;
        // constraining the chart so it will not overflow from the page
        if (newWidth / aspect > height){
            newWidth = height * aspect;
        } 
        setWidth(newWidth);
    }

    useEffect(() => {
        handleResize();

        vacationsService.getAllVacations().then(vacations => {
            // TO DO
            // HANDLE SIMILARLY NAMED VACATIONS
            let following = vacations.filter(v => v.followersCount > 0);
            let now = new Date();
            // setting the props that will be passed to the chart elem
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
                <div className={`mixed-chart`}>
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
