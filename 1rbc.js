import * as readline from "node:readline";
import * as fs from "node:fs";

const filename = process.argv[2];
const stream = fs.createReadStream(filename);
const linestream = readline.createInterface(stream);
const NEW_LINE_CHARACTER = '\n'.charCodeAt(0);
const SEMICOLON_CHARACTER = ';'.charCodeAt(0);
const LOOKING_FOR_SEMICOLON = 0;
const LOOKING_FOR_NEWLINE = 1;

let state = LOOKING_FOR_SEMICOLON;
let stationBuffer = Buffer.alloc(100); // Allocate 100 bytes buffer to store station name
let tempBuffer = Buffer.alloc(5); // Allocate 5 bytes buffer to store temperature
let stationBufferIndex = 0;
let tempBufferIndex = 0;


const aggregations = new Map();

stream.on('end', () => {
    stream.close();
    printCompiledResults(aggregations);
})

stream.on('data', (chunk) => {

    for (let i = 0; i < chunk.length; i++) {
        const byte = chunk[i];

        if (state === LOOKING_FOR_SEMICOLON) {
            if (byte === SEMICOLON_CHARACTER) {
                state = LOOKING_FOR_NEWLINE
            } else {
                stationBuffer[stationBufferIndex] = byte;
                stationBufferIndex += 1;
            }
        } else if (state === LOOKING_FOR_NEWLINE) {
            if (byte === NEW_LINE_CHARACTER) {
                const temp = Number(tempBuffer.toString('utf-8', 0, tempBufferIndex)) * 10;
                const stationName = stationBuffer.toString('utf-8', 0, stationBufferIndex);

                const existing = aggregations.get(stationName);

                if (!existing) {
                    aggregations.set(stationName, {
                        min: temp,
                        max: temp,
                        sum: temp,
                        count: 1
                    });
                } else {
                    existing.min = Math.min(existing.min, temp);
                    existing.max = Math.max(existing.max, temp);
                    existing.sum += temp;
                    existing.count += 1;
                }

                state = LOOKING_FOR_SEMICOLON;

                stationBufferIndex = 0;
                tempBufferIndex = 0;
            } else {
                tempBuffer[tempBufferIndex] = byte;
                tempBufferIndex += 1;
            }


        }
    }

})

// for await (const line of linestream) {
//     const [stationName, temperatureStr] = line.split(";");

//     const temperature = Math.floor(parseFloat(temperatureStr) * 10);

//     const existing = aggregations.get(stationName);

//     if (existing) {
//         existing.min = Math.min(existing.min, temperature);
//         existing.max = Math.max(existing.max, temperature);
//         existing.sum += temperature;
//         existing.count++;
//     } else {
//         aggregations.set(stationName, {
//             min: temperature,
//             max: temperature,
//             sum: temperature,
//             count: 1,
//             avg: temperature,
//         });
//     }
// }

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
