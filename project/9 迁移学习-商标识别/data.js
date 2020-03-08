import {
    promises
} from "dns";

const IMAGE_SIZE = 224;

const loadImg = src => {
    return new Promise(resolve => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = src
        img.width = IMAGE_SIZE;
        img.height = IMAGE_SIZE;
        img.onload = () => resolve(img)
    })
}

// 输入数据格式
export const getInputs = async() => {
    const imgList = [],
        labelList = []
    for (let i = 0; i < 30; i++) {
        ['android', 'apple', 'windows'].forEach(label => {
            const src = `http://127.0.0.1:8081/brand/train/${label}-${i}.jpg`;
            const img = loadImg(src)
            imgList.push(img)
            labelList.push([
                label === 'android' ? 1 : 0,
                label === 'apple' ? 1 : 0,
                label === 'windows' ? 1 : 0,
            ])
        })
    }
    const inputs = await Promise.all(imgList)
    return {
        inputs,
        labelList
    }
}