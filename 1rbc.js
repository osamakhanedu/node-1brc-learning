import * as readline from "node:readline";
import * as fs from "node:fs";

const filename = process.argv[2];
const stream = fs.createReadStream(filename);
const linestream = readline.createInterface(stream);

const aggregations = new Map();

for await (const line of linestream) {
    const [stationName, temperatureStr] = line.split(";");

    const temperature = Math.floor(parseFloat(temperatureStr) * 10);

    const existing = aggregations.get(stationName);

    if (existing) {
        existing.min = Math.min(existing.min, temperature);
        existing.max = Math.max(existing.max, temperature);
        existing.sum += temperature;
        existing.count++;
    } else {
        aggregations.set(stationName, {
            min: temperature,
            max: temperature,
            sum: temperature,
            count: 1,
            avg: temperature,
        });
    }
}

printCompiledResults(aggregations);

function printCompiledResults(aggregations) {
    const sortedStations = Array.from(aggregations.keys()).sort();

    let result =
        '{' +
        sortedStations
            .map((station) => {
                const data = aggregations.get(station);
                return `${station}=${round(data.min / 10)}/${round(
                    data.sum / 10 / data.count
                )}/${round(data.max / 10)}`;
            })
            .join(', ') +
        '}';

    console.log(result);
}

function round(num) {
    const fixed = Math.round(10 * num) / 10;

    return fixed.toFixed(1);
}
