const fs = require('fs'); //文件模块
const path = require('path'); //系统路径模块

const join = (file) => path.join(__dirname, file);
const loadData = (filename) => JSON.parse(fs.readFileSync(filename, 'utf-8'))
const mkdir = (dir) => !fs.existsSync(dir) && fs.mkdirSync(dir)

// 创建mergedJson文件夹
const mergedJsonPath = './mergedJson'
mkdir(mergedJsonPath)
// 合并tempJson目录下的所有文件的数据的方法
const mergeTempJsonDirData = (files, dir) => {
  const fileDatas = []
  files.forEach(file => fileDatas.push(...loadData(join(`${tempJsonPath}/${dir}/${file}`))))
  return fileDatas
}
// 保存文件到本地的方法
const writeFileTolocal = (jsondata, filename) => {
  const jsonContent = JSON.stringify(jsondata);
  const destfile = join(`${mergedJsonPath}/${filename}.json`)
  fs.writeFile(destfile, jsonContent, 'utf-8', (err) => {
    if (err) {
      console.log("output.json失败了");
      return
    }
    console.log(`保存${filename}.json成功！！`);
  });
}
let yuanshujudata, fukuandata, shoukuandata, shouhoucangkudata, shouhouqudaodata
// 读取数据tempJson文件夹下的所有文件
const tempJsonPath = './tempJson'
const dirs = fs.readdirSync(join(tempJsonPath))
dirs.forEach(dir => {
  const files = fs.readdirSync(join(`${tempJsonPath}/${dir}`))
  // tempJson目录下的所有的json文件合并后的文件
  const mergedJson = mergeTempJsonDirData(files, dir)
  if (dir === '源数据') {
    yuanshujudata = mergedJson
  }
  else if (dir === '付款单') {
    fukuandata = mergedJson
  }
  else if (dir === '收款单') {
    shoukuandata = mergedJson
  }
  else if (dir === '售后仓库退款单') {
    shouhoucangkudata = mergedJson
  }
  else if (dir === '售后渠道退款单') {
    shouhouqudaodata = mergedJson
  }
  // 保存下数据方便排查问题影响性能的时候可以注释掉
  writeFileTolocal(mergedJson, `合并后的${dir}`)
})

const mergeDataFunc = () => {
  // 合并数据
  const tmpHash = {}
  // 与源数据是否全部匹配上
  let allmatched = true
  yuanshujudata.forEach(yuanshuju => {
    tmpHash[yuanshuju['订单编号']] = yuanshuju
  });
  const handleMegrFunc = (data, sheetType) => {
    data.forEach(dataItem => {
      const tmp = tmpHash[dataItem['订单编号']]
      if (!tmp) {
        console.log(`${sheetType}文件夹下的文件存在没匹配上的数据,订单编号是${dataItem['订单编号']}`)
        allmatched = false
      }
      tmpHash[dataItem['订单编号']] = { ...tmp, ...dataItem }
    });
  }
  handleMegrFunc(fukuandata, '付款单')
  handleMegrFunc(shoukuandata, '收款单')
  handleMegrFunc(shouhoucangkudata, '售后仓库退款单')
  handleMegrFunc(shouhouqudaodata, '售后渠道退款单')
  return { tmpHash, allmatched }
}
const { tmpHash, allmatched } = mergeDataFunc()

if (allmatched) {
  // 输出结果
  const resJson = Object.values(tmpHash).map((resdata) => ({
    '订单编号': resdata['订单编号'],
    '收件人': resdata['收件人'],
    '收件人电话': resdata['收件人电话'],
    '收件人地址': resdata['收件人地址'],
    '发货状态': resdata['发货状态'],
    '订单状态': resdata['订单状态'],
    '渠道名称': resdata['渠道名称'],
    '商品名称': resdata['商品名称'],
    '商品单价': resdata['商品单价'],
    '商品数量': resdata['商品数量'],
    '订单金额': resdata['订单金额'],
    '应收金额': resdata['应收金额'],
    '应付金额': resdata['应付金额'],
    '售后渠道退款': resdata['售后渠道退款'],
    '售后仓库退款': resdata['售后仓库退款'],
    '利润': resdata['应收金额'] - resdata['应付金额'] - resdata['售后渠道退款'] + resdata['售后仓库退款'],
  }))

  writeFileTolocal(resJson, `最终要获得的数据`)
}
