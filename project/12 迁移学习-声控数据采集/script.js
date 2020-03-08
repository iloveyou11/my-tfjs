import * as speechCommands from '@tensorflow-models/speech-commands';
import * as tfvis from '@tensorflow/tfjs-vis';

const MODEL_PATH = 'http://127.0.0.1:8081';
let transferRecognizer; //定义迁移学习器（迁移学习语音识别器）

window.onload = async() => {
    const recognizer = speechCommands.create(
        'BROWSER_FFT',
        null,
        MODEL_PATH + '/speech/model.json',
        MODEL_PATH + '/speech/metadata.json'
    );
    await recognizer.ensureModelLoaded();
    transferRecognizer = recognizer.createTransfer('轮播图');
}

// 收集声音
window.collect = async(btn) => {
    btn.disabled = true;
    const label = btn.innerText;
    await transferRecognizer.collectExample(label === '背景噪音' ? '_background_noise_' : label)
    btn.disabled = false;
    document.querySelector('$count').innerHTML = JSON.stringify(transferRecognizer.countExamples(), null, 2);
}

// 训练模型
window.train = async() => {
    await transferRecognizer.train({
        epochs: 30,
        callback: tfvis.show.fitCallbacks({
            name: '训练效果'
        }, ['loss', 'acc'], {
            callbacks: ['onEpochEnd']
        })
    });
}

window.toggle = async(checked) => {
    if (checked) {
        await transferRecognizer.listen(result => {
            const {
                scores
            } = result;
            const labels = transferRecognizer.wordLabels();
            const index = scores.indexOf(Math.max(...scores));
            console.log(labels[index]);
        }, {
            overlapFactor: 0, //值越大识别越频繁
            probabilityThreshold: 0.75 //准确度
        })
    } else {
        transferRecognizer.stopListening();
    }
}

// 存储采集到的语音数据，避免每次都要录入
window.save = () => {
    const arrayBuffer = transferRecognizer.serializeExamples()
    const blob = new Blob([arrayBuffer])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'data.bin' //定义下载名称
    link.click()
}