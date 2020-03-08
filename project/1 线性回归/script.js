import * as tf from "@tensorflow/tfjs"
import * as tfvis from "@tensorflow/tfjs-tfvis"

window.onload = () => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const ys = [1, 3, 5, 6, 8, 10, 12, 13, 15, 17]

    tfvis.render.scatterplot({
        name: '线性回归训练集'
    }, {
        values: xs.map((x, i) => ({
            x,
            y: ys[i]
        }))
    }, {
        xAxisDomain: [0, 10],
        yAxisDomain: [0, 20]
    });
    // const series1 = Array(100).fill(0)
    //     .map(y => Math.random() * 100 - (Math.random() * 50))
    //     .map((y, x) => ({
    //         x,
    //         y,
    //     }));

    // const series2 = Array(100).fill(0)
    //     .map(y => Math.random() * 100 - (Math.random() * 150))
    //     .map((y, x) => ({
    //         x,
    //         y,
    //     }));

    // const series = ['First', 'Second'];
    // const data = {
    //     values: [series1, series2],
    //     series
    // }

    // const surface = {
    //     name: 'Scatterplot',
    //     tab: 'Charts'
    // };
    // tfvis.render.scatterplot(surface, data);
}