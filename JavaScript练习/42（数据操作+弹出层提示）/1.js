//产生链接列表
function dataList(obj, index) {
	var oUl = document.createElement('ul');
	oUl.className = 'list';
	for (var i = 0; i < data[index].list.length; i++) {
		var oLi = document.createElement('li');
		var oALi = document.createElement('a');
		oALi.href = 'javascript:;';
		oALi.innerHTML = data[index].list[i].title;
		oLi.appendChild(oALi);
		oUl.appendChild(oLi);
	}
	obj.appendChild(oUl);
}

//弹出层
function popLayer(obj, obj1, obj2, obj3, index) {
	var arr = ['职位', '招聘人数', '工作地点', '工作经历', '学历', '薪资'];
	var arrInformation = ['position', 'recruitingNumbers', 'workingLocation', 'workExperience', 'education', 'wage'];
	var aAListContent = obj.getElementsByTagName('a');
	//循环为每个链接添加弹出层
	for (var i = 0; i < aAListContent.length; i++) {
		aAListContent[i].index = i;
		//鼠标移入，弹出层里面内容更新，弹出层出现
		aAListContent[i].onmouseover = function(ev) {
			var ev = ev || event;//事件对象

			obj1.innerHTML = ''; //先清空里面的内容

			var oH2 = document.createElement('h2');
			oH2.innerHTML = data[index].list[this.index].company;
			obj1.appendChild(oH2);

			var oUl = document.createElement('ul');
			for (var j = 0; j < arr.length; j++) {
				var oLi = document.createElement('li');
				oLi.className = 'col';
				oLi.innerHTML = '<strong>' + arr[j] + '</strong>：' + data[index].list[this.index][arrInformation[j]];
				oUl.appendChild(oLi);
			}
			obj1.appendChild(oUl);

			obj2.style.display = 'block';
			obj2.style.left = ev.clientX + this.offsetWidth + 'px';

			//当弹出层出现时高度大于可视区高度时，保持弹出层高度不超出可视区
			var height = ev.clientY + obj2.offsetHeight/2;
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if ( height > document.documentElement.clientHeight ) {
				obj2.style.top = document.documentElement.clientHeight - obj2.offsetHeight + scrollTop + 'px';
			} else {
				obj2.style.top = ev.clientY - obj2.offsetHeight/2 + scrollTop + 'px';
			}
			obj3.style.top = ev.clientY - (obj2.offsetTop - scrollTop) + 'px';

		}
		//鼠标移出，弹出层隐藏
		aAListContent[i].onmouseout = function(){
			obj2.style.display = 'none';
		}
	}
}

window.onload = function() {
	var oHeader = document.getElementById('header');
	var oListContent = document.getElementById('listContent');
	var oTipsContent = document.getElementById('tipsContent');
	var oTips = document.getElementById('tips');
	var oArrow = document.getElementById('arrow');

	//oHeader区添加选项卡
	for (var i = 0; i < data.length; i++) {
		var oLi = document.createElement('li');
		oLi.innerHTML = data[i].name;
		oLi.index = i; //加索引
		if (i == 0) {
			oLi.className = 'focus';
			dataList(oListContent, i);
			popLayer(oListContent, oTipsContent, oTips, oArrow, i);
		}
		oHeader.appendChild(oLi);
	}

	//为每个oHeader区选项卡添加点击事件
	var aLiHeader = oHeader.getElementsByTagName('li');
	for (var i = 0; i < aLiHeader.length; i++) {
		aLiHeader[i].onclick = function() {

			//当前选中高亮效果
			for (var i = 0; i < aLiHeader.length; i++) {
				aLiHeader[i].className = '';
			}
			this.className = 'focus';

			//oListContent区重新加载
			oListContent.innerHTML = '';
			dataList(oListContent, this.index);
			popLayer(oListContent, oTipsContent, oTips, oArrow, this.index);
		}
	}
}