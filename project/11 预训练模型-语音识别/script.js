import * as speechCommands from '@tensorflow-models/speech-commands';
const MODEL_PATH = 'http://127.0.0.1:8081/speech';

window.onload = async() => {
    const recognizer = speechCommands.create(
        'BROWSER_FFT', //傅里叶变换
        null,
        MODEL_PATH + '/model.json',
        MODEL_PATH + '/metadata.json'
    )
    await recognizer.ensureModelLoaded()


    const labels = recognizer.wordLabels().slice(2)
    const resultEl = document.querySelector('#result')
    resultEl.innerHTML = labels.map(l => `
    <div>${l}</div>
`).join('');

    // 语音识别
    recognizer.listen(resilt => {
        const {
            scores
        } = result;
        const maxValue = Math.max(...scores);
        const index = scores.indexOf(maxValue) - 2;
        resultEl.innerHTML = labels.map((l, i) => `
        <div style="background: ${i === index && 'green'}">${l}</div>
        `).join('');
    }, {
        overlapFactor: 0.3, //控制频率，值越大，识别的次数越多
        probabilityThreshold: 0.9 //准确度
    })
}