import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

window.onload = async () => {
  // x、y样本数据集
  const xs = [1, 2, 3, 4];
  const ys = [1, 3, 5, 7];

  // 使用 @tensorflow/tfjs-vis 库绘制散点图
  tfvis.render.scatterplot(
    { name: '线性回归训练集' },
    { values: xs.map((x, i) => ({ x, y: ys[i] })) },
    { xAxisDomain: [0, 5], yAxisDomain: [0, 8] }
  );

  // 定义模型。添加含有1个神经元的1层网络
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ loss: tf.losses.meanSquaredError, optimizer: tf.train.sgd(0.1) });

  const inputs = tf.tensor(xs);
  const labels = tf.tensor(ys);

  // 训练模型
  await model.fit(inputs, labels, {
    batchSize: 4,
    epochs: 200,
    callbacks: tfvis.show.fitCallbacks(
      { name: '训练过程' },
      ['loss']
    )
  });

  // 预测
  const output = model.predict(tf.tensor([5]));
  console.log(`如果 x 为 5，那么预测 y 为 ${output.dataSync()[0]}`);
};