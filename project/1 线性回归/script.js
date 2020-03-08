import * as tf from "@tensorflow/tfjs"
import * as tfvis from "@tensorflow/tfjs-tfvis"

window.onload = async() => {
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

    // 定义一个神经元
    const model = tf.sequential()
    model.add(tf.layers.dense({
        units: 1,
        inputShape: [1]
    }))
    model.compile({
        loss: tf.losses.meanSquaredError,
        optimizer: tf.train.sgd(0.1)
    })

    const inputs = tf.tensor(xs)
    const labels = tf.tensor(ys)

    await model.fit(inputs, labels, {
        batchSize: 10,
        epochs: 200,
        callbacks: tfvis.show.fitCallbacks({
            name: '训练过程'
        }, ['loss'])
    })

    window.onIput = e => {
        const inputX = e.target.value
        const outputY = model.predict(tf.tensor([inputX]))
        document.getElementById('output').innerHTML = output.dataSync()[0]
    }
}