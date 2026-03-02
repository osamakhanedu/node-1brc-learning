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
        existing.avg = existing.sum / existing.count;
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
        "{" +
        sortedStations
            .map((stationName) => {
                const { min, max, sum, count, avg } =
                    aggregations.get(stationName);
                return `${stationName}: min=${min}, max=${max}, avg=${avg.toFixed(1)}`;
            })
            .join(", ") +
        "}";

    console.log(result);
}
