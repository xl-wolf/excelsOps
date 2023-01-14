const fs = require('fs'); //文件模块
const path = require('path'); //系统路径模块

const join = (file) => path.join(__dirname, file);
const loadData = (filename) => JSON.parse(fs.readFileSync(filename, 'utf-8'))
const mkdir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}
mkdir('./resJsonPath')
// 读取数据
const tempJsonPath = './tempJson'
const dirs = fs.readdirSync(join(tempJsonPath))
dirs.forEach(dir => {
  const files = fs.readdirSync(join(`${tempJsonPath}/${dir}`))
  files.forEach(file => { console.log(loadData(join(`${tempJsonPath}/${dir}/${file}`))) })
})
// let file = join(`${tempJsonPath}/收款单.json`);
// const shoukuandata = loadData(file)
// file = join(`${tempJsonPath}/付款单.json`);
// const fukuandata = loadData(file)
// file = join(`${tempJsonPath}/售后单.json`);
// const shouhoudata = loadData(file)
// file = join(`${tempJsonPath}/源数据.json`);
// const shujuyuandata = loadData(file)

// const tmpHash = {}
// // 合并数据
// shujuyuandata.forEach(shujuyuan => {
//   tmpHash[shujuyuan['订单编号']] = shujuyuan
// });
// shoukuandata.forEach(shoukuan => {
//   const tmp = tmpHash[shoukuan['订单编号']]
//   tmpHash[shoukuan['订单编号']] = { ...tmp, ...shoukuan }
// });
// fukuandata.forEach(fukuan => {
//   const tmp = tmpHash[fukuan['订单编号']]
//   tmpHash[fukuan['订单编号']] = { ...tmp, ...fukuan }
// });
// shouhoudata.forEach(shouhou => {
//   const tmp = tmpHash[shouhou['订单编号']]
//   tmpHash[shouhou['订单编号']] = { ...tmp, ...shouhou }
// });
// // 输出结果
// const res = Object.values(tmpHash).map((resdata) => ({
//   '订单编号': resdata['订单编号'],
//   '收件人': resdata['收件人'],
//   '收件人电话': resdata['收件人电话'],
//   '收件人地址': resdata['收件人地址'],
//   '发货状态': resdata['发货状态'],
//   '订单状态': resdata['订单状态'],
//   '渠道名称': resdata['渠道名称'],
//   '商品名称': resdata['商品名称'],
//   '商品单价': resdata['商品单价'],
//   '商品数量': resdata['商品数量'],
//   '订单金额': resdata['订单金额'],
//   '应收金额': resdata['应收金额'],
//   '应付金额': resdata['应付金额'],
//   '售后渠道退款': resdata['售后渠道退款'],
//   '售后仓库退款': resdata['售后仓库退款'],
//   '利润': resdata['应收金额'] - resdata['应付金额'] - resdata['售后渠道退款'] + resdata['售后仓库退款'],
// }))
// // 字符串化JSON对象
// const jsonContent = JSON.stringify(res);
// const destfile = join(`${tempJsonPath}/output.json`)
// fs.writeFile(destfile, jsonContent, 'utf-8', (err) => {
//   if (err) {
//     console.log("output.json失败了");
//     return
//   }
//   console.log("output.json成功！！");
// });

