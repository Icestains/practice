class VN {
  constructor(vn){
    this.vn = vn;
    this.firstvt = [];
    this.lastvt = [];
    this.right = [];
  }
  insertFirstVt(vt){
    this.firstvt.push(vt);
    this.firstvt = Array.from(new Set(this.firstvt));
  }
  insertFirstVts(arr){
    const newArr = [...this.firstvt,...arr];
    this.firstvt = Array.from(new Set(newArr));
  }
  insertLastVt(vt){
    this.lastvt.push(vt);
    this.lastvt = Array.from(new Set(this.lastvt));
  }
  insertLastVts(arr){
    const newArr = [...this.lastvt,...arr];
    this.lastvt = Array.from(new Set(newArr));
  }
  addRight(right){
    this.right.push(right);
  }
  getFirstVt(){
    return this.firstvt;
  }
  getLastVt(){
    return this.lastvt;
  }
  getRight(){
    return this.right;
  }
  getVnChar(){
    return this.vn;
  }
}

// 判断是否是大写，大写就是非终结符
const isCapital = (str)=>{
  if(/^[A-Z]$/.test(str)){
    return true;
  }else{
    return false;
  }
}

const addVtChar = (vtSet,char) => {
  vtSet.push(char);
  return Array.from(new Set(vtSet));
}

const calcFirstVt = (vn,set,vtSet) => {
  const rightArr = vn.getRight();

  for(let i=0;i<rightArr.length;i++){
    const right = rightArr[i];
    if (!isCapital(right[0])) { // 第一个字符为终结字符
      vn.insertFirstVt(right[0]);
      vtSet = addVtChar(vtSet,right[0]);
    } else if (!right[1]) { // 第一个字符为非终结符，并且没有第二个字符
      const newVnFristVt = set[right[0]].getFirstVt();
      if(!newVnFristVt.length && right[0] !== vn.getVnChar()){
        calcFirstVt(set[right[0]],set,vtSet);
      }
      vn.insertFirstVts(set[right[0]].getFirstVt());
    } else if (!isCapital(right[1])) { // 第二个字符为终结字符，第一个为非终结字符
      const newVnFristVt = set[right[0]].getFirstVt();
      if(!newVnFristVt.length && right[0] !== vn.getVnChar()){
        calcFirstVt(set[right[0]],set,vtSet);
      }
      vn.insertFirstVts(set[right[0]].getFirstVt());
      vn.insertFirstVt(right[1]);
      vtSet = addVtChar(vtSet,right[1]);
    }
  }

  return [set,vtSet];
}

const calcLastVt = (vn,set,vtSet) => {
  const rightArr = vn.getRight();

  for(let i=0;i<rightArr.length;i++){
    const right = rightArr[i];
    const length = right.length;
    if (!isCapital(right[length-1])) { // 倒数第一个字符为终结字符
      vn.insertLastVt( right[length-1] );
      vtSet = addVtChar(vtSet,right[length-1]);
    } else if (!right[length-2]) { // 倒数第一个字符为非终结符，并且没有倒数第二个字符
      const newVnLastVt = set[right[length-1]].getLastVt();
      if(!newVnLastVt.length && right[length-1] !== vn.getVnChar()){
        calcLastVt(set[right[length-1]],set,vtSet);
      }
      vn.insertLastVts(newVnLastVt);
    } else if (!isCapital(right[length-2])) { // 倒数第二个字符为终结字符，倒数第一个为非终结字符
      const newVnLastVt = set[right[length-1]].getLastVt();
      if(!newVnLastVt.length && right[length-1] !== vn.getVnChar()){
        calcLastVt(set[right[length-1]],set,vtSet);
      }
      vn.insertLastVts(newVnLastVt);
      vn.insertLastVt(right[length-2]);
      vtSet = addVtChar(vtSet,right[length-2]);
    }
  }

  return [set,vtSet];
}

const splitPro = (pro,set) => {
  const newArr = pro.split('->');
  const vnChar = newArr[0].trim(); // VN 字符
  const right = newArr[1].trim();
  let vn;

  // VN 集合中没有该 VN 则将该 VN 添加进去
  if (!set[vnChar]) {
    vn = new VN(vnChar);
    vn.addRight(right);
    set[vnChar] = vn;
  } else {
    vn = set[vnChar];
    vn.addRight(right);
  }

  return set;
}

const makeTable = (table,vnObjSet,vtSet) => {
  let firstKey;
  for(let key in vnObjSet){
    if(!firstKey) firstKey = key; // 保存第一个非终结字符
    const rightArr = vnObjSet[key].getRight();
    for(let i=0;i<rightArr.length;i++){
      const right = rightArr[i];
      for(let index=0;index<right.length-1;index++){
        // 第一个为非终结符，第二个为终结符
        if(isCapital(right[index]) && !isCapital(right[index+1])){
          // 非终结符的lastvt的优先关系大于终结符的优先关系
          const lastArr = vnObjSet[right[index]].getLastVt();
          const vtIndex = vtSet.indexOf(right[index+1]);
          for(let j=0;j<lastArr.length;j++){
            table[vtSet.indexOf(lastArr[j])][vtIndex] = '>';
          }
        // 第一个为终结符，第二个也为终结符
        }else if(!isCapital(right[index]) && !isCapital(right[index+1])){
          table[vtSet.indexOf(right[index])][vtSet.indexOf(right[index+1])] = '=';
        }else if(!isCapital(right[index]) && isCapital(right[index+1])){
          // 第一个为终结符，第二个为非终结符
          const firstArr = vnObjSet[right[index+1]].getFirstVt();
          const vtIndex = vtSet.indexOf(right[index]);
          for(let j=0;j<firstArr.length;j++){
            table[vtIndex][vtSet.indexOf(firstArr[j])] = '<';
          }

          // 第三个为终结符
          if(right[index+2] && !isCapital(right[index+2])){
            const vtIndex2 = vtSet.indexOf(right[index+2]);
            table[vtIndex][vtIndex2] = '=';
          }
        }
      }
    }
  }

  const endIndex = vtSet.length;  // #号的索引
  // 获取第一个出现的非终结符的firstvt和lastvt
  // console.log(vnObjSet[firstKey])

  const firstFirstVt = vnObjSet[firstKey].getFirstVt();
  const firstLastVt = vnObjSet[firstKey].getLastVt();
  for(let i=0;i<firstFirstVt.length;i++){
    const lIndex = vtSet.indexOf(firstFirstVt[i]);
    table[endIndex][lIndex] = '<';
  }
  for(let i=0;i<firstLastVt.length;i++){
    const lIndex = vtSet.indexOf(firstLastVt[i]);
    table[lIndex][endIndex] = '>';
  }

  return table;
}

// 判断规约时用哪条产生式规约
const judgePro = (stackStr,vnObjSet) => {
  const pro = {
    left:'',
    right:''
  }

  for(let i=stackStr.length;i>=1;i--){
    const subStr = stackStr.substring(stackStr.length-i);
    // 遍历每一个产生式右部看是否有相等的
    for(let key in vnObjSet){
      const vn = vnObjSet[key];
      const rightArr = vn.getRight();
      for(let j=0;j<rightArr.length;j++){
        if(rightArr[j] === subStr){
          pro.left = vn.getVnChar();
          pro.right = rightArr[j];
          break;
        };
      }
      if(pro.right) break;
    }
  }

  return pro;
}

const getStackVtIndex = (charStack,vtSet) => {
  let index = 0;
  for(let i=charStack.length-1;i>=0;i--){
    // 是终结符下一个
    if(isCapital(charStack[i])){
      continue;
    }else{
      // 不是终结符当前
      // console.log(charStack[i])
      index = vtSet.indexOf(charStack[i]) === -1 ? vtSet.length : vtSet.indexOf(charStack[i]);
      break;
    }
  }
  //console.log(index)
  return index;
}

// 分析输入的字符串
const analysisString = (str,table,vtSet,vnObjSet,charStack = ['#']) => {
  // 输入字符串最前面的符号与栈顶符号比较优先关系
  const strIndex = vtSet.indexOf(str[0]) === -1 ? vtSet.length : vtSet.indexOf(str[0]);
  const stackIndex = getStackVtIndex(charStack,vtSet);
  
  let charStackStr = charStack.join('');

  // 优先关系为小于，移进
  if(table[stackIndex][strIndex] === '<' || table[stackIndex][strIndex] === '='){
    console.log(`${charStackStr}\t${table[stackIndex][strIndex]}\t${str}\t移进`);
    charStack.push(str[0]);
    str = str.substring(1);
    analysisString(str,table,vtSet,vnObjSet,charStack);
  }else if(table[stackIndex][strIndex] === '>'){
    console.log(`${charStackStr}\t>\t${str}\t归约`);
    // 判断用哪条产生式归约
    const pro = judgePro(charStackStr,vnObjSet);
    if(!pro.right) {
      console.log('错误,没有找到可以匹配的产生式，分析结束');
      return;
    }
    charStackStr = charStackStr.split('').reverse().join('');
    charStackStr = charStackStr.replace(pro.right.split('').reverse().join(''),pro.left);
    charStackStr = charStackStr.split('').reverse().join('');
    charStack = charStackStr.split('');
    analysisString(str,table,vtSet,vnObjSet,charStack);
  // 分析结束
  }else if(str === '#' && stackIndex === table.length-1 && strIndex === table.length-1){
    console.log(`${charStackStr}\t \t${str}\t接受`);
  }else{
    console.log(`${charStackStr}\t${table[stackIndex][strIndex]}\t${str}\t不接受`);
    console.log('不接受该分析的字符串');
    return;
  }
}

const main = (production,inputString,outputFun)=>{

  if(outputFun){
    console.log = outputFun;
  }

  let vnObjSet = {};
  let vtSet = [];

  for(let i=0;i<production.length;i++){
    vnObjSet = splitPro(production[i],vnObjSet);
  }

  //console.log(vnObjSet);
  
  // 计算FirstVt
  for(let key in vnObjSet){
    let newArray = calcFirstVt(vnObjSet[key],vnObjSet,vtSet);
    vnObjSet = newArray[0];
    vtSet = newArray[1];
  }

  // 计算LastVt
  for(let key in vnObjSet){
    let newArray = calcLastVt(vnObjSet[key],vnObjSet,vtSet);
    vnObjSet = newArray[0];
    vtSet = newArray[1];
  }

  // console.log(vnObjSet);
  // console.log(vtSet);

  // 构造优先关系表
  let relationTable = new Array(vtSet.length+1);
  for(let i=0;i<relationTable.length;i++){
    relationTable[i] = new Array(vtSet.length+1);
  }
  relationTable = makeTable(relationTable,vnObjSet,vtSet);
  
  console.log('VT集为：');
  console.log(vtSet);
  console.log('--------------------------------');

  console.log('关系表为：');
  console.log(relationTable);
  console.log('--------------------------------');

  // 分析输入的字符串
  console.log('分析过程：');
  console.log('符号栈\t关系\t输入串\t动作');
  analysisString(inputString,relationTable,vtSet,vnObjSet);

}

const main2 = () => {
  if(!global) return; // 浏览器环境下不执行

  // 产生式
  const production = [
    'Z->aMb',
    'M->(L',
    'M->c',
    'L->c)'
  ];

  // 输入串
  const inputString = 'a(c)b#';

  main(production,inputString);

}

main2();