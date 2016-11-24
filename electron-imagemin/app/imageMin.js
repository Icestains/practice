const fs = require('fs');
const path = require('path');

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

// const basePath = 'G:\\新建文件夹';

// 匹配jpg,png图片的拓展名
const regImg = /^\.(jpg|png)$/i;

const imgUrlArr = [];
let dirNumber = 0;

// 寻找图片路径
const findImage = (base,callback) => {
  dirNumber++;
  console.log(dirNumber);
  fs.readdir(base, (err, files) => {
    if (err) throw new Error(err);
    files.forEach(file => {
      
      try{
        const stats = fs.statSync(path.join(base, file));
        if (stats.isDirectory()) {
          findImage(path.join(base, file),callback);
        } else if (stats.isFile() && path.extname(file).match(regImg)) {
          const filePath = path.join(base, file);
          imgUrlArr.push(filePath);
        }

      }catch(e){
        throw new Error(e);
      }
    });
    dirNumber--;
    console.log(dirNumber)
    if(dirNumber === 0){
      console.log('所有的图片路径都找到了');
      let pending = 0;
      for (let i = 0; i < imgUrlArr.length; i++) {
        pending++;
        console.log(pending)
        makeDir(imgUrlArr[i], (output) => {
          imageCompress(imgUrlArr[i], output, () => {
            // console.log(imgUrlArr[i], ' 压缩完成');
            pending--;
            console.log(pending)
            if(pending === 0){
              callback && callback();
            }
          });
        })
      }
    }
  });
}

// 确保保存压缩后图片的目录存在
const makeDir = (filePath, callback) => {  
  const optimizedDir = path.resolve(filePath,'..','./optimized');
  try{
    fs.readdirSync(optimizedDir);
    callback(optimizedDir);
  }catch(e){
    try{
      fs.mkdirSync(optimizedDir);
      callback(optimizedDir);
    }catch(e){
      throw new Error(e);
    }
  }
}

// 压缩图片，将压缩后的图片保存到相对图片路径的`optimized`文件夹里
const imageCompress = (filePath, output, callback) => {
  // console.log('开始压缩 ',filePath);
  imagemin([filePath], output, {
    plugins: [
      imageminMozjpeg(),
      imageminPngquant({quality: '65-80'})
    ]
  }).then(files => {
    callback();
  });
}

const imageMin = (base, callback) => {
  base = path.join(base);
  fs.stat(base ,(err, stats) => {
    if(stats.isDirectory()){
      findImage(base,callback);
    }else if(stats.isFile() && path.extname(base).match(regImg)){
      makeDir(base, (output) => {
        imageCompress(base, output, () => {
          console.log(base,' 压缩完成');
          callback && callback();
        });
      });
    }
  });
}

exports.imageMin = imageMin;
