window.onload = function() {
	switchScreen('section', 'sectionList');
}

function switchScreen(className1, className2) {
	var aSection = getByClass(document, '*', className1);
	var iHeight = aSection[0].offsetHeight;
	var onOff = true;
	var iNow = 0;
	var oUl = getByClass(document, '*', className2)[0];
	var aLi = oUl.getElementsByTagName('li');

	//初始化
	for (var i = 1; i < aSection.length; i++) {
		aSection[i].style.top = iHeight + 'px';
	}

	window.onmousewheel = fn;
	if (window.addEventListener) {
		window.addEventListener('DOMMouseScroll', fn, false);
	}

	//鼠标滚轮事件
	function fn(ev) {
		var ev = ev || event;
		var b; //记录滚轮滚动方向的变量，b值为true代表上，b值为false代表下

		//判断滚动方向
		if (ev.wheelDelta) {
			b = ev.wheelDelta > 0 ? true : false;
		} else {
			b = ev.detail < 0 ? true : false;
		}

		if (onOff) {
			onOff = false;

			if (b) { //往上滚动
				if (iNow != 0) {
					doMove(aSection[iNow--], 'top', 50, iHeight); //当前的往下移动
					aSection[iNow].style.top = -iHeight + 'px';
				}
			} else { //往下滚动，当前的往上移
				if (iNow != aSection.length - 1) {
					doMove(aSection[iNow++], 'top', 50, -iHeight);
					aSection[iNow].style.top = iHeight + 'px';
				}
			}

			function limitINow() {
				if (iNow < 0) {
					iNow = 0;
				} else if (iNow >= aSection.length) {
					iNow = aSection.length - 1
				}
			}
			limitINow();


			for (var i = 0; i < aLi.length; i++) {
				aLi[i].className = '';
			}
			aLi[iNow].className = 'active';

			doMove(aSection[iNow], 'top', 50, 0, function() {
				onOff = true;
			});
		}
	}

	//窗口大小改变事件
	window.onresize = function() {
		iHeight = aSection[0].offsetHeight;
		for (var i = 0; i < aSection.length; i++) {
			if (aSection[i].offsetTop < 0) {
				aSection[i].style.top = -iHeight + 'px';
			} else if (aSection[i].offsetTop > 0) {
				aSection[i].style.top = iHeight + 'px';
			}
		}
	}

	//li的点击事件
	for (var i = 0; i < aLi.length; i++) {
		aLi[i].index = i;
		aLi[i].onclick = function() {
			if (onOff) {
				onOff = false;
				if (this.index > iNow) { //点击后一个
					aSection[this.index].style.top = iHeight + 'px';
					doMove(aSection[iNow], 'top', 50, -iHeight);
				} else if (this.index < iNow) { //点击前一个
					aSection[this.index].style.top = -iHeight + 'px';
					doMove(aSection[iNow], 'top', 50, iHeight);
				}

				for (var i = 0; i < aLi.length; i++) {
					aLi[i].className = '';
				}
				aLi[this.index].className = 'active';

				iNow = this.index;
				doMove(aSection[iNow], 'top', 50, 0, function() {
					onOff = true;
				});
			}
		}
	}
}

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

//获取元素的样式
function getStyle(obj, attr) {
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}

function getByClass(parent, tagName, className) {
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