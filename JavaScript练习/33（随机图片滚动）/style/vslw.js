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

//运动函数，上下左右长宽
function doMove(obj, attr, dir, target, endFn) {
	dir = parseInt(getStyle(obj, attr)) < target ? dir : -dir; //确定方向
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var speed = parseInt(getStyle(obj, attr)) + dir; // 步长
		if (speed > target && dir > 0 || speed < target && dir < 0) {
			speed = target;
		}
		obj.style[attr] = speed + 'px'; //改变位置
		if (speed == target) {
			clearInterval(obj.timer);
			endFn && endFn(); //存在回调函数的话，调用回调函数
		}
	}, 30);
}

//抖动函数，上下左右抖动
function shake(obj, attr, endFn) {
	if (obj.onOff) return;
	obj.onOff = true;

	var pos = parseInt(getStyle(obj, attr));
	var arr = []; // 20, -20, 18, -18 ..... 0
	var num = 0;
	var timer = null;

	for (var i = 20; i > 0; i -= 2) {
		arr.push(i, -i);
	}
	arr.push(0);

	clearInterval(obj.shake);
	obj.shake = setInterval(function() {
		obj.style[attr] = pos + arr[num] + 'px'; //改变位置
		num++;
		if (num === arr.length) {
			clearInterval(obj.shake);
			endFn && endFn();
			obj.onOff = false;
		}
	}, 50);
}

function fnShake() {
	var _this = this;
	shake(_this, 'left', function() {
		shake(_this, 'top');
	});
}