/**
 * @description 二分类数据集生成函数源码
 * @param {*} numSamples 随机生成点的数量
 */
export function getData(numSamples) {
  let points = [];

  function genGauss(cx, cy, label) {
    for (let i = 0; i < numSamples / 2; i++) {
      let x = normalRandom(cx);
      let y = normalRandom(cy);
      points.push({
        x,
        y,
        label
      });
    }
  }

  genGauss(2, 2, 1); //生成以(2,2)为中心，label为1的点
  genGauss(-2, -2, 0); //生成以(-2,-2)为中心，label为0的点
  return points;
}

/**
 * @description 生成正态分布随机点
 * @param mean 均值
 * @param variance 方差，值越大点分布越分散，值越小点分布越密集
 */
function normalRandom(mean = 0, variance = 1) {
  let v1, v2, s;
  do {
    v1 = 2 * Math.random() - 1;
    v2 = 2 * Math.random() - 1;
    s = v1 * v1 + v2 * v2;
  } while (s > 1);

  let result = Math.sqrt(-2 * Math.log(s) / s) * v1;
  return mean + Math.sqrt(variance) * result;
}