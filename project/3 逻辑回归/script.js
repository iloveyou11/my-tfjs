import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { getData } from './data.js';

window.onload = async () => {
  // 拿到400个数据
  const data = getData(400);

  // 绘制散点图
  tfvis.render.scatterplot({
    name: '逻辑回归训练数据'
  }, {
    values: [
      data.filter(p => p.label === 1),
      data.filter(p => p.label === 0),
    ]
  });

  // 构建模型，主要这里是逻辑回归，使用的损失函数为对数损失 logLoss，可参考http://wiki.fast.ai/index.php/Log_Loss
  const model = tf.sequential();
  model.add(tf.layers.dense({
    units: 1,
    inputShape: [2], //特征数量
    activation: 'sigmoid'
  }));
  model.compile({
    loss: tf.losses.logLoss, //对数损失，逻辑回归不适合使用MSE
    optimizer: tf.train.adam(0.1) //adam优化器，可以自动调节学习率
  });

  const inputs = tf.tensor(data.map(p => [p.x, p.y]));
  const labels = tf.tensor(data.map(p => p.label));

  // 训练模型
  await model.fit(inputs, labels, {
    batchSize: 40,
    epochs: 20,
    callbacks: tfvis.show.fitCallbacks({
      name: '训练效果'
    }, ['loss'])
  });

  // 编写界面输入预测值
  window.predict = (form) => {
    const pred = model.predict(tf.tensor([
      [form.x.value * 1, form.y.value * 1]
    ]));
    console.log(`预测结果：${pred.dataSync()[0]}`);
  };
};