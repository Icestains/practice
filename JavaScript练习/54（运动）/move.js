function startMove(obj, json, endFn) {
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var bStop = true;

		for (var attr in json) {
			var iCur = 0;

			if (attr == 'opacity') {
				iCur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
			} else {
				iCur = parseInt(getStyle(obj, attr));
			}

			var iSpeed = (json[attr] - iCur) / 8;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

			if (iCur != json[attr]) bStop = false;

			if (attr == 'opacity') {
				obj.style.opacity = (iCur + iSpeed) / 100;
				obj.style.filter = 'filter:alpha(opacity:' + (iCur + iSpeed) + ')';
			} else {
				obj.style[attr] = iCur + iSpeed + 'px';
			}
		}

		if (bStop) {
			clearInterval(obj.timer);
			endFn && endFn();
		}

	}, 30);
}

function getStyle(obj, attr) {
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}