import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import {
    getData
} from './data.js';

// 不能使用线性逻辑回归
window.onload = async() => {
    const data = getData(400);

    tfvis.render.scatterplot({
        name: 'XOR 训练数据'
    }, {
        values: [
            data.filter(p => p.label === 1),
            data.filter(p => p.label === 0),
        ]
    });

    // 构建多层神经网络
    const model = tf.sequential();
    model.add(tf.layers.dense({
        units: 4,
        inputShape: [2],
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
    }));
    model.compile({
        loss: tf.losses.logLoss,
        optimizer: tf.train.adam(0.1)
    });

    const inputs = tf.tensor(data.map(p => [p.x, p.y]));
    const labels = tf.tensor(data.map(p => p.label));

    await model.fit(inputs, labels, {
        epochs: 10,
        callbacks: tfvis.show.fitCallbacks({
            name: '训练效果'
        }, ['loss'])
    });

    window.predict = (form) => {
        const pred = model.predict(tf.tensor([
            [form.x.value * 1, form.y.value * 1]
        ]));
        alert(`预测结果：${pred.dataSync()[0]}`);
    };
};