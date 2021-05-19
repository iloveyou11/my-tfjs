import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { MnistData } from './data';

window.onload = async () => {
  const data = new MnistData();
  await data.load();
  const examples = data.nextTestBatch(20)
  const surface = tfvis.visor().surface({
    name: '输入示例'
  });

  // 展示样本中的手写数据
  for (let i = 0; i < 20; i++) {
    // 清除tensor内存，防止内存泄漏
    const imageTensor = tf.tidy(() => {
      return examples.xs
        .slice([i, 0], [1, 784]) //这里详细查看文档,tf.slice()方法是使用
        .reshape([28, 28, 1]);
    })

    // 在浏览器中展示
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = 'margin: 4px';
    await tf.browser.toPixels(imageTensor, canvas);

    surface.drawArea.appendChild(canvas)
  }

  // 定义模型
  // 1. 卷积(5*5*8)
  // 2. 池化
  // 3. 卷积(5*5*16)
  // 4. 池化
  // 5. flatten
  // 6. softmax
  const model = tf.sequential()
  model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }))
  model.add(tf.layers.maxPool2d({
    poolSize: [2, 2],
    strides: [2, 2]
  }))
  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }))
  model.add(tf.layers.maxPool2d({
    poolSize: [2, 2],
    strides: [2, 2]
  }))
  model.add(tf.layers.flatten())
  model.add(tf.layers.dense({
    units: 10,
    activation: 'softmax',
    kernelInitializer: 'varianceScaling'
  }))
  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: tf.train.adam(),
    metrics: ['accuracy']
  })

  const [trainX, trainY] = tf.tidy(() => {
    const d = data.nextTrainBatch(1000)
    return [
      d.xs.reshape([1000, 28, 28, 1]),
      d.labels
    ]
  })
  const [testX, testY] = tf.tidy(() => {
    const d = data.nextTestBatch(200)
    return [
      d.xs.reshape([200, 28, 28, 1]),
      d.labels
    ]
  })

  // 训练模型
  await model.fit(trainX, trainY, {
    validationData: [testX, testY],
    batchSize: 500,
    epochs: 50,
    callbacks: tfvis.show.fitCallbacks({
      name: '训练效果'
    }, ['loss', 'val_loss', 'acc', 'val_acc'], {
      callbacks: ['onEpochEnd']
    })
  })

  // 画布支持绘制，监听mousemove方法
  const canvas = document.querySelector('canvas')
  canvas.addEventListener('mousemove', e => {
    if (e.buttons === 1) {
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.fillRect(e.offsetX, e.offsetY, 10, 10);
    }
  })
  // 清楚画布
  window.clear = () => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, 300, 300);
  }
  clear()

  // 预测
  window.predict = () => {
    const input = tf.tidy(() => {
      return tf.image.resizeBilinear( //tf.image.resizeBilinear改变图片尺寸 (300,300)->(28,28)
        tf.browser.fromPixels(canvas), [28, 28], //tf.browser.fromPixels是将canvas/image转化为tensor
        true
      ).slice([0, 0, 0], [28, 28, 1]) //将彩色通道转化为黑白通道，将rgb通道切掉
        .toFloat()
        .div(255) //归一化(0,1)
        .reshape([1, 28, 28, 1]);
    });
    const pred = model.predict(input).argMax(1);
    document.getElementById('output').innerHTML = `预测结果为 ${pred.dataSync()[0]}`
  };
}