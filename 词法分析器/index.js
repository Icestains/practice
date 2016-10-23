var fs = require('fs');
var path = require('path');
var args = process.argv;

args = handleArgs(args);

// 确定输入输出文件位置
var inputFile = args['input'] ? args['input'] : './input.js';
var outputInfo = null;
if(args['output']){
	fs.open(path.join(args['output']),'w',function(err,fd){
		if(err) throw err;
		outputInfo = function(dec,word){
			if(!word) word = '';
			var data = dec + ' ' + word + '\r\n';
			// 为了防止写入顺序出错使用同步版本
			fs.writeSync(fd,data,function(err,wirte,string){
				if(err) throw err;
			});
		};
	})
}else{
	outputInfo = console.log;
}

// 读入文件
fs.readFile(inputFile,'utf-8',function(err,data){
	if(err) console.log(err);
	analysisRow(data);
});

// 词法分析主程序
function analysisRow(row){
	var state = 0;
	var word = '';
	var char = row[0]; // 初始字符
	var start = 0;	// 每一次分析开始位置
	var i = 0;
	while(true){
		switch(state){
			case 0:
				var charType = getCharType(char);
				switch(charType){
					// 字母
					case 'letter' : state = 1; break;
					// 数字
					case 'number' : state = 3; break;
					// 界限符 , ; ' " ( ) [ ] { }
					case 'bound' : state = 5; break;
					// 运算符, + - * / = > < & % ~ !
					case 'operator' : state = 6; break;
					// 空格
					case 'space' : state = 10; break;
					// 引号
					case 'quote' : state = 11; break;
					// 其他字符
					default:
						state = 9;
				}
				break;
			
			// 字母
			case 1:
				start = i;
				// 读入下一个字符，直到下一个字符不是字母或数字时
				while( isLetter(char) || isNumber(char) ){
					char = row[++i];
				}
				state = 2;
				break;

			// 关键字或保留字，终态
			case 2:
				var word = row.substring(start,i);
				if(isKeyword(word)){
					outputInfo('关键字',word);
				}else{
					outputInfo('标识符',word);
				}
				if(i === row.length){
					outputInfo('分析结束');
					return;	// 到达最后一个字符，分析结束
				}
				state = 0; // 一次识别结束，开始下一次识别，状态回到初态
				break;

			case 3:
				start = i;
				// 读入下一个字符，直到下一个字符不是数字时
				while(isNumber(char)){
					char = row[++i];
				}
				state = 4;
				break;

			// 数字，终态
			case 4:
				outputInfo('常数',row.substring(start,i));
				if(i === row.length){
					outputInfo('分析结束');
					return;	// 到达最后一个字符，分析结束
				}
				state = 0;
				break;

			// 界限符，终态
			case 5:
				outputInfo('界限符',char);
				char = row[++i];	// 读入一下个字符
				if(i === row.length){
					outputInfo('分析结束');
					return;
				}
				state = 0;
				break;

			// 运算符，注释 // /*(注释转入状态8)
			case 6:
				// 判断是否是注释
				if(char === '/'){
					char = row[++i];
					// '/'是最后一个字符
					if(i === row.length){
						outputInfo('运算符',row[--i]);
						return;
					}
					// 注释
					if(char === '/' || char === '*'){
						state = 8;
						break;
					}
					char = row[--i];
				}

				start = i;
				while(isOperator(char)){
					char = row[++i];
				}
				state = 7;
				break;

			// 运算符，终态
			case 7:
				word = row.substring(start,i);
				// 单长度运算符或者多长度运算符
				if(word.length === 1 || isLongOperator(word)){
					outputInfo('运算符',word);
					state = 0;
				}else{
					state = 9;	// 转为出错状态	
				}
				char = row[i];
				break;

			// 注释
			case 8:
				// 单行注释，到换行时结束，或到文件尾部结束
				if(char === '/'){
					// 没有达到单行注释结束标记时，一直读下一个字符
					while(!isSingleCommentEnd(row[i-1],char)){
						char = row[++i];
					}
				/* 多行注释 */
				}else if(char === '*'){
					// 当没有到达多行注释结束标记时一直继续读一下个字符
					while(!isMutilCommentEnd(row[i-1],char)){
						char = row[++i];
					}
				}
				char = row[++i]; // 读注释结束标记后面的字符
				if(i >= row.length) {
					outputInfo('分析结束');
					return;	// 注释结束标记后面没有字符，文件结束
				}
				state = 0; // 注释识别结束，转为初态进行下一次识别
				break;

			// 出错
			case 9:
				outputInfo('出错，请确认语法是否正确',row.substring(start,i));
				return;

			// 空格
			case 10:
				// console.log('空格');
				char = row[++i];	// 读入下一个字符
				if(i == row.length) {
					outputInfo('分析结束');
					return;
				}
				state = 0;
				break;

			// 单引号或双引号字符串,终态
			case 11:
				start = i;
        // 单引号
        if(char === '\''){
          char = row[++i];
          // 下一个字符不是引号，或者下一个字符为双引号，或下两个字符为单引号的转义字符(\')时读下一个
          while( !isQuote(char) || char === '\"' || (row[i-1] === '\\' && row[i-2] !== '\\') ){
            char = row[++i];
          }
        // 双引号
        }else if(char === '\"'){
          char = row[++i];
          while(!isQuote(char) || char === '\'' || (row[i-1] === '\\' && row[i-2] !== '\\') ){
            char = row[++i];
          }
        }
        char = row[++i];
        outputInfo('字符串',row.substring(start,i));
        state = 0;
        break;
		}
	}
}

// 获取字符类型
function getCharType(char){
	if(char === ' ' || char === '\r' || char === '\n' || char === '\t'){
		return 'space';
	}else if(isLetter(char)){
		return 'letter';
	}else if(isNumber(char)){
		return 'number';
	}else if(isBound(char)){
		return 'bound';
	}else if(isOperator(char)){
		return 'operator';
	}else if(isQuote(char)){
		return 'quote';
	}else{
		return;
	}
}

// 判断是否是引号
function isQuote(char){
	var quote = ['\'','\"'];
	for(var i = 0; i<quote.length; i++){
		if(char === quote[i]) return true;
	}
	return false;
}

// 判断单行注释是否结束，1.前一个为\r，当前为\n   2.文件尾
function isSingleCommentEnd(prev,curr){
	// 到达文件尾部,curr为undefind
	if(!curr) return true;
	if(prev === '\r' && curr === '\n') return true;
	return false;
}

// 判断多行注释是否结束  1.前一个为*，当前为/     2.文件尾
function isMutilCommentEnd(prev,curr){
	if(!curr) return true;
	if(prev === '*' && curr === '/') return true;
	return false;
}

// 判断是否是界限符    , ; : ( ) [ ] { }
function isBound(char){
	var bound = [',',';','(',')','[',']','{','}',':'];
	for(var i = 0;i<bound.length;i++){
		if(char === bound[i]) return true;
	}
	return false;
}

// 判断是否是运算符   + - * / = > < & % ~ ! | .   ?:
function isOperator(char){
	var operator = ['+','-','*','/','=','>','<','&','%','~','!','|','.','?'];
	for(var i = 0;i < operator.length;i++){
		if(char === operator[i]) return true;
	}
	return false;
}

// 判断是否是多长度运算符
function isLongOperator(word){
	var operator = ['++','--','+=','-=','&&','||','>=','<=','!=','!==','==','==='];
	for(var i = 0;i<operator.length;i++){
		if(word === operator[i]) return true;
	}
	return false;
}

// 判断是否是字母，包括大小写，以及两个可以在变量名中使用的符号
function isLetter(char){
	var letter = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','_','$'];
	for(var i=0;i<letter.length;i++){
		if(char === letter[i] || char === letter[i].toUpperCase()) return true;
	}
	return false;
}

// 判断是否是数字
function isNumber(char){
	var num = ['0','1','2','3','4','5','6','7','8','9'];
	for(var i=0;i<num.length;i++){
		if(char === num[i]) return true;
	}
	return false;
}

// 判断是关键字还是标识符
function isKeyword(word){
	var keyword = ['break','function','return','typeof','case','do','if','switch','var','catch','else','in','this','void','continue','false','instanceof','throw','while','debugger','finally','new','true','with','default','for','null','try','undefined'];
	for(var i = 0;i<keyword.length;i++){
		if(keyword[i] === word) return true;
	}
	return false;
}

// 处理终端输入的参数，将数组形式改为json形式
function handleArgs(args){
	args.splice(0,2);	// 删掉两个默认的参数
	var newArgs = {};

	for(var i=0;i<args.length;i++){
		var newArr = args[i].split('=');
		newArgs[newArr[0].substring(2)] = newArr[1];
	}

	return newArgs;
}