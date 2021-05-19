import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { getIrisData, IRIS_CLASSES } from './data';

window.onload = async () => {
  // 加载数据集和验证集
  const [xTrain, yTrain, xTest, yTest] = getIrisData(0.15); //15%的数据用于验证集

  // 构建模型，这里用到的损失函数为交叉熵损失 categoricalCrossentropy，适用于多分类
  const model = tf.sequential();
  model.add(tf.layers.dense({
    units: 10,
    inputShape: [xTrain.shape[1]],
    activation: 'sigmoid' //也可以使用其他激活函数，如relu
  }));
  model.add(tf.layers.dense({
    units: 3,
    activation: 'softmax' //这里使用softmax激活函数，算出每个类别的概率
  }));
  model.compile({
    loss: 'categoricalCrossentropy', //交叉熵损失，对数损失函数的多分类版本
    optimizer: tf.train.adam(0.1),
    metrics: ['accuracy']
  });

  // 训练模型
  await model.fit(xTrain, yTrain, {
    epochs: 100,
    validationData: [xTest, yTest],
    callbacks: tfvis.show.fitCallbacks({
      name: '训练效果'
    }, ['loss', 'val_loss', 'acc', 'val_acc'], {
      callbacks: ['onEpochEnd']
    })
  });

  window.predict = (form) => {
    const input = tf.tensor([
      [
        form.a.value * 1,
        form.b.value * 1,
        form.c.value * 1,
        form.d.value * 1,
      ]
    ]);
    const pred = model.predict(input);
    console.log(`预测结果：${IRIS_CLASSES[pred.argMax(1).dataSync(0)]}`); //argmax？
  };
};