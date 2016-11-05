//制造数组的函数，参数为1个或2个数字，默认制造的数组从1开始
function makeArr() {
	var arr = []; //用来存储制造出来的数组
	var arglength = arguments.length; //记录实参个数的变量
	var max = '';
	var min = '';
	if (arglength === 1) { //实参个数为1的情况
		for (var i = 1; i <= arguments[0]; i++) {
			arr.push(i);
		}
		return arr;
	} else if (arglength === 2) { //实参个数为2的情况
		max = Math.max(arguments[0], arguments[1]);
		min = Math.min(arguments[0], arguments[1]);
		for (var i = min; i <= max; i++) {
			arr.push(i);
		}
		return arr;
	}
}

//获取元素的样式
//不要用来获取复合样式，获取的单一样式不要用来做判断，不要用来获取css没有设置的样式
function getStyle(obj, attr) {
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}

//用ID获取元素
function $(v) {
	if (typeof v === 'string') {
		return document.getElementById(v);
	}
}