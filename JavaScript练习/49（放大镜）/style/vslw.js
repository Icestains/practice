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

//改变透明度的函数
function opacity(obj, target, endFn) {
	var change = 0.05; //每次的变化量
	if (Number(getStyle(obj, 'opacity')) - target < 0) change = -change;
	clearInterval(obj.opacitytimer);
	obj.opacitytimer = setInterval(function() {
		var fact = Number(getStyle(obj, 'opacity')) - change;
		if ((fact <= target && change > 0) || (fact >= target && change < 0)) {
			clearInterval(obj.opacitytimer);
			obj.style.opacity = target;
			if (target == 0) obj.style.display = 'none';
			endFn && endFn(obj);
		} else {
			obj.style.opacity = fact;
		}
	}, 30);
}

//获取字符串中的数字
function getNum(text) {
	var value = text.replace(/[^0-9]/ig, "");
	return value;
}

//根据类名获取元素
function getElementsByClassName(parent, tagName, className) {
	var aEls = parent.getElementsByTagName(tagName);
	var arr = [];

	for (var i = 0; i < aEls.length; i++) {
		var aClassName = aEls[i].className.split(' ');
		for (var j = 0; j < aClassName.length; j++) {
			if (aClassName[j] == className) {
				arr.push(aEls[i]);
				break;
			}
		}
	}

	return arr;
}

//增加类名
function addClass(obj, className) {
	//原来没有类名
	if (obj.className == '') {
		obj.className = className;
	} else { //原来有类名
		var arrClassName = obj.className.split(' ');
		var _index = arrIndexOf(arrClassName, className);
		if (_index == -1) { //要添加的类名在原来的class中不存在
			obj.className += ' ' + className;
		} //要添加的类名在原来的class中存在的话什么都不要做了
	}
}

//移除类名
function removeClass(obj, className) {
	//原来有类名
	if (obj.className != '') {
		var arrClassName = obj.className.split(' ');
		var _index = arrIndexOf(arrClassName, className);
		if (_index != -1) { //要删除的类名存在
			arrClassName.splice(_index, 1);
			obj.className = arrClassName.join(' ');
		}
	}
}

//按值搜索，返回序号
function arrIndexOf(arr, v) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == v) {
			return i;
		}
	}
	return -1;
}

//绑定事件
function bind(obj, evname, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(evname, fn, false);
	} else {
		obj.attachEvent('on' + evname, function() {
			fn.call(obj);
		});
	}
}

//设置cookie
function setCookie(key, value, t) {
	var oDate = new Date();
	oDate.setDate(oDate.getDate() + t);
	console.log(oDate.toGMTString());
	document.cookie = key + '=' + encodeURI(value) + ';expires=' + oDate.toGMTString();
}

//获取cookie
function getCookie(key) {
	var arr1 = document.cookie.split('; ');
	for (var i = 0; i < arr1.length; i++) {
		var arr2 = arr1[i].split('=');
		if (arr2[0] == key) {
			return decodeURI(arr2[1]);
		}
	}
}

//删除cookie
function removeCookie(key) {
	setCookie(key, '', -1);
}