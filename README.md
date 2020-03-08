Tensorflow.js Converter 依赖**python3.6.8**版本

**搭建虚拟环境：**
1. 安装conda
可以使用[清华镜像源](https://mirror.tuna.tsinghua.edu.cn/help/anaconda/)，安装Miniconda 即可（注意配置环境变量）
2. 在终端检查conda命令是否可用，并创建指定python版本的虚拟环境
`conda create -n [name] python=3.6.8` 创建虚拟环境
`conda remove -n [name] --all` 删除虚拟环境
`conda info --envs` 查看虚拟环境
`conda activate [name]` 激活虚拟环境（可以发现python版本已经改变）
`conda deactivate [name]` 退出虚拟环境
3. 安装tfjs converter
`pip install tensorflowjs`安装
`tensorflowjs_converter -h`检查是否安装成功


**python与JavaScript模型的互转：**
1. 准备工作
`conda activate [name]`激活
`tensorflowjs_converter`检查
2. 开始转换——具体格式建议看文档（github tfjs-converter）
  1）python模型转js模型
  `tensorflowjs_converter --input_format=keras --output_format=tf_layers_model [input_path] [output_path]`
  2）js模型转python模型
  `tensorflowjs_converter --input_format=tf_layers_model --output_format=keras [input_path] [output_path]`
3. 验证模型正确性

**模型加速：**
1. 分片(--weight_shared_size_bytes=[size])
 `tensorflowjs_converter --input_format=tf_layers_model --output_format=tf_layers_model --weight_shared_size_bytes=100000 [input_path] [output_path]`
在输出文件夹中会发现很多块分片后的模型，这样在加载模型时可以使用并发实现加速
2. 量化(--quantization_bytes=[n])
 `tensorflowjs_converter --input_format=tf_layers_model --output_format=tf_layers_model --quantization_bytes=2 [input_path] [output_path]`
3. 通过转为tfjs_graph_model来加速模型——内部实现了凸优化(--output_format=tf_graph_model)
  `tensorflowjs_converter --input_format=tf_layers_model --output_format=tf_graph_model [input_path] [output_path]`

**拓展学习：**
1. 举一反三，训练不同应用场景的AI模型
2. 多看官方文档
3. 使用更多的预训练模型，如目标检测、NLP、人体姿势识别
4. 做更多智能相关的开源项目或商业项目，增加技术影响力