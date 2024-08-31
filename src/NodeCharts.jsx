import {Component, useEffect, useState} from "react";
import React from "react";
import {
    VictoryLine,
    VictoryChart,
    VictoryZoomContainer,
    VictoryTheme
} from "victory";
import {getFormattedDate} from "./utils";

import "./NodeCharts.sass";
import Loader from "./Loader";
import {useTranslation} from "react-i18next";

const fetchDetails = nodeId => {
    const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const url = `${backendUrl}/measurements/${nodeId}/latest`;
    return fetch(url)
        .then(response => response.json())
        .then(json => json.measurements);
};

const myTheme = VictoryTheme.material;
myTheme.axis.style.grid.stroke = "lightgray";
myTheme.axis.style.grid.strokeDasharray = '10, 0';

function TimeChart({data, property}) {
    const chartData = data.map(measurement => {
        return {
            x: new Date(measurement.timestamp),
            y: measurement[property]
        };
    });

    return (
        <VictoryChart
            scale={{x: "time"}}
            theme={myTheme}
            domainPadding={{y: 10}}
            containerComponent={<VictoryZoomContainer/>}
        >
            <VictoryLine
                data={chartData}
                style={{
                    data: {stroke: "#ff8115"},
                }}
            />
        </VictoryChart>
    );
}

export default function NodeCharts({match}) {
    const {t} = useTranslation();
    const [measurements, setMeasurements] = useState([]);

    useEffect(() => {
        fetchDetails(match.params.nodeId).then(setMeasurements)
    }, []);

    function makeCharts(measurements) {
        const properties = [
            "batteryVoltage",
            "batteryChargeEstimate",
            "mppVoltage",
            "batteryTemperature",
            "openCircuitVoltage"
        ];
        return properties.map(property => {
            return (
                <div className="chartGroup" key={property}>
                    <h2>{t(`charts.${property}`)}</h2>
                    <TimeChart data={measurements} property={property}/>
                </div>
            );
        });
    }

    const charts = measurements ? makeCharts(measurements) : null;

    const latestMeasurement =
        measurements.length &&
        getFormattedDate(measurements[0].timestamp);


    return (
        <div className="node-charts">
            <h1> {t('nodeCharts.heading', {nodeId: match.params.nodeId})}</h1>

            {!charts ?
                <Loader>Loading...</Loader>
                :
                <React.Fragment>
                    <aside>{t('nodeCharts.latestMeasurement', {date: latestMeasurement})}</aside>

                    <div className="charts">{charts}</div>
                </React.Fragment>
            }

        </div>
    );
}
