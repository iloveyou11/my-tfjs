import * as speechCommands from '@tensorflow-models/speech-commands';

const MODEL_PATH = 'http://127.0.0.1:8081';
let transferRecognizer;

window.onload = async() => {
    const recognizer = speechCommands.create(
        'BROWSER_FFT',
        null,
        MODEL_PATH + '/speech/model.json',
        MODEL_PATH + '/speech/metadata.json',
    );
    await recognizer.ensureModelLoaded();
    transferRecognizer = recognizer.createTransfer('轮播图');

    // 在这里加载已保存的声音数据
    const res = await fetch(MODEL_PATH + '/slider/data.bin');
    const arrayBuffer = await res.arrayBuffer();
    transferRecognizer.loadExamples(arrayBuffer);
    await transferRecognizer.train({
        epochs: 30
    });
    console.log('done');
};

window.toggle = async(checked) => {
    if (checked) {
        await transferRecognizer.listen(result => {
            const {
                scores
            } = result;
            const labels = transferRecognizer.wordLabels();
            const index = scores.indexOf(Math.max(...scores));
            console.log(labels[index]); //“上一张”/“下一张”
            window.play(labels[index]); //变换轮播图
        }, {
            overlapFactor: 0,
            probabilityThreshold: 0.5
        });
    } else {
        transferRecognizer.stopListening();
    }
};

let curIndex = 0;
const sliderCount = document.querySelectorAll('img').length
window.play = label => {
    const div = document.querySelector('.slider>div');
    if (label === '上一张') {
        if (curIndex === 0) {
            return;
        }
        curIndex -= 1;
    } else {
        if (curIndex === sliderCount - 1) {
            return;
        }
        curIndex += 1;
    }
    div.style.transition = "transform 1s"
    div.style.transform = `translateX(-${100 * curIndex}%)`;
}