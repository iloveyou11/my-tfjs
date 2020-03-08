import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import {
    getInputs
} from './data';
import {
    img2x,
    file2img
} from './utils';

const MOBILENET_MODEL_PATH = 'http://127.0.0.1:8081/mobilenet/web_model/model.json';
const NUM_CLASSES = 3;
const BRAND_CLASSES = ['android', 'apple', 'windows'];

window.onload = async() => {
    const {
        inputs,
        labels
    } = await getInputs();

    // 可视化商标
    const surface = tfvis.visor().surface({
        name: '输入示例',
        styles: {
            height: 250
        }
    });
    inputs.forEach(img => {
        surface.drawArea.appendChild(img);
    });

    // 加载mobilenet模型
    const mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH)
    mobilenet.summary(); //查看模型概况
    // 开始截断模型
    const layer = mobilenet.getLayer('conv_pw_13_relu');
    const truncatedMobilenet = tf.model({
        inputs: mobilenet.inputs,
        outputs: layer.output
    })

    // 添加网络
    const model = tf.sequential()
    model.add(tf.layers.flatten({
        inputShape: layer.outputShape.slice(1) //[null,7,7,256]
    }));
    model.add(tf.layers.dense({
        units: 10,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: NUM_CLASSES,
        activation: 'softmax'
    }));
    model.compile({
        loss: 'categoricalCrossentropy',
        optimizer: tf.train.adam()
    })

    // 将训练数据输入到截断模型中
    const {
        xs,
        ys
    } = tf.tidy(() => {
        const xs = tf.concat(inputs.map(imgEl => truncatedMobilenet.predict(img2x(imgEl)))) //xs为truncatedMobilenet网络吐出的数据
        const ys = tf.tensor(labels)
        return {
            xs,
            ys
        }
    })
    await model.fit(xs, ys, {
        epochs: 20,
        callbacks: tfvis.show.fitCallbacks({
            name: '训练效果'
        }, ['loss'], {
            callbacks: ['onEpochEnd']
        })
    });

    // 预测
    window.predict = async(file) => {
        const img = await file2img(file);
        document.body.appendChild(img);
        const pred = tf.tidy(() => {
            const x = img2x(img);
            const input = truncatedMobilenet.predict(x);
            return model.predict(input);
        })
        const index = pred.argMax(1).dataSync()[0];
        document.getElementById('output').innerHTML = `预测结果：${BRAND_CLASSES[index]}`
    }
    window.download = async() => {
        await model.save('downloads://model'); //建议看官方文档model.save
    };
}