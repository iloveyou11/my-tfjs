import * as tf from '@tensorflow/tfjs';
import {
    IMAGENET_CLASSES
} from './imagenet_classes';

const MOBILENET_MODEL_PATH = 'http://127.0.0.1:8081/mobilenet/web_model/model.json';

// file变为img标签
function file2img(file) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.width = 224;
            img.height = 224;
            img.onload = () => resolve(img);
        }
    })
}

window.onload = async() => {
    const model = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
    window.predict = async(file) => {
        const img = await file2img(file);
        document.body.appendChild(img);
        const pred = tf.tidy(() => {
            const input = tf.browser.fromPixels(img)
                .toFloat()
                .sub(255 / 2)
                .div(255 / 2) //转换到[-1,1]
                .reshape([1, 224, 224, 3]); //彩色图片
            return model.predict(input);
        })
        const index = pred.argMax(1).dataSync()[0] //index的值
        document.getElementById('output').innerHTML = `预测结果：${IMAGENET_CLASSES[index]}`
    }
}