"use strict";
var checkAndCreate;
checkAndCreate = function (v) {
	if (window[v] == null) {
		return window[v] = {};
	}
};
checkAndCreate("$c");
$c.checkAndCreate = checkAndCreate;
$c.tabActive = function (name) {
	var state = $w.app.state;
	var names = name.split("#")
	switch (names.length) {
		case 2:
			if (state[names[0]] == names[1]) {
				return " active "
			}
			else {
				return ""
			}
			break;
		case 3:
			if (state[names[0]][names[1]] == names[2]) {
				return " active "
			}
			else {
				return ""
			}

			break;
		case 4:
			if (state[names[0]][names[1]][names[2]] == names[3]) {
				return " active "
			}
			else {
				return ""
			}
			break;
		default:
			console.error("name length over")
	}
}
$c.tabClick = function (e) {
	var state = $w.app.state;
	var names = e.target.name.split("#")
	switch (names.length) {
		case 2:
			state[names[0]] = names[1]

			break;
		case 3:
			state[names[0]][names[1]] = names[2]

			break;
		case 4:
			state[names[0]][names[1]][names[2]] = names[3]
			break;
		default:
			console.error("name length over")
	}
	this.update()
}
$c.onChange = function (e) {
	var state = $w.app.state;
	var names = e.target.name.split("#")
	switch (names.length) {
		case 1:
			state[names[0]] = e.target.value
			break;
		case 2:
			state[names[0]][names[1]] = e.target.value
			break;
		case 3:
			state[names[0]][names[1]][names[2]] = e.target.value
			break;
		case 4:
			state[names[0]][names[1]][names[2]][names[3]] = e.target.value
			break;
		default:
			console.error("name length over")
	}
	this.update()
	return true

};
$c.onChecked = function (e) {
	var state = $w.app.state;
	var names = e.target.name.split("#")
	switch (names.length) {
		case 1:
			state[names[0]] = e.target.checked ? true : false
			break;
		case 2:
			state[names[0]][names[1]] = e.target.checked ? true : false
			break;
		case 3:
			state[names[0]][names[1]][names[2]] = e.target.checked ? true : false
			break;
		case 4:
			state[names[0]][names[1]][names[2]][names[3]] = e.target.checked ? true
				: false
			break;
		default:
			console.error("name length over")
	}
	this.update()
	return true
};
$c.infoFromUrl = function () {
	$w.app.state.url = window.location.href
	$w.app.state.params = {}
	var urls = $w.app.state.url.split("?")
	if (urls[1] != undefined) {
		var cols = urls[1].split("&")
		for (var i = 0; i < cols.length; i++) {
			var ps = cols[i].split("=")
			$w.app.state.params[ps[0]] = ps[1]
		}
	}
	var cols2 = urls[0].split("/")
	$w.app.state.screencat = cols2[3]
	if ($w.app.state.screencat.indexOf("used")>-1){
		$w.app.state.systemVersion="U"
	} else {
		$w.app.state.systemVersion="N"
	}
}
$c.onRadioChecked = function (e) {
	var state = $w.app.state;
	var names = e.target.name.split("#")
	switch (names.length) {
		case 2:
			state[names[0]] = names[1]
			break;
		case 3:
			state[names[0]][names[1]] = names[2]
			break;
		case 4:
			state[names[0]][names[1]][names[2]] = names[3]
			break;
		default:
			console.error("name length over")
	}
	this.update()
	return true
};
//Checkedでクリックは無視
$c.radioClick = function (e) {
	if (e.target.checked == false) {
		e.preventDefault()
	}
}

$c.ajaxPost = function (url, data, contenttype, callback) {
	$.ajax({
		type: "POST",
		url: url,
		headers: {

		},
		data: data,
		contentType: contenttype
	}).fail(function (jqXHR, textStatus) {
		console.log("Internet or Server Error")
		callback(jqXHR, textStatus)
	}).done(callback);
}
$c.ajaxPostJson = function (url, param, callback) {
	var data = JSON.stringify(param);
	$c.ajaxPost(url, data, "text/json", callback);
}
$c.deepCopy = function (obj) {
	return $.extend(true, {}, obj)
}
$c.swalshow = function () {
	var status = $w.app.state.swal;
	if (status.func === "close") {
		swal({
			title: status.title,
			type: status.type
		}, function () {
			var tempswal = {
				show: false,
				title: "",
				type: "",
				func: ""
			}
			var state = $w.app.state
			state.swal = tempswal
			$w.app.update()
		});
	}
	if (status.func === "reload") {
		swal({
			title: status.title,
			type: status.type
		}, function () {
			location.reload();
		});
	}
	if (status.func.substring(0, 7) === "reload:") {
		swal({
			title: status.title,
			type: status.type
		}, function () {
			location.reload(status.func.substr(7));
		});
	}
}
$c.showSweet = function (title, stype, func) {
	var tempswal = {
		show: true,
		title: title,
		type: stype,
		func: func
	}
	var state = $w.app.state
	state.swal = tempswal;
	$w.app.update()
}
$c.ajaxPostSwal = function (url, data, contenttype, callback) {
	$.ajax({
		type: "POST",
		url: url,
		headers: {
	
		},
		data: data,
		contentType: contenttype
	}).fail(function (jqXHR, textStatus) {
		$c.showSweet("サーバーかインターネットエラーです", "warning", "close");
	}).done(callback);
}

$c.ajaxPostJsonSwal = function (url, param, callback) {
	var data = JSON.stringify(param);
	$c.ajaxPostSwal(url, data, "text/json", callback);
}
$c.ErrorCheck = function (res) {
	if (res.status < 0) {
		$c.showSweet(res.data, "warning", "close");
		return false;
	}
	return true;
}
$c.convTime = function (rcd, fld) {
	// if (rcd[fld]!=undefined){
	// 	var s=""+rcd[fld]
	// 	if (s.length>19){
	// 		return s.substring(0,10)+" "+s.substring(11,19)
	// 	}
	// }
	//return ""
	return $c.convTime1(rcd[fld])
}
$c.convTime1 = function (s) {
	if (s != undefined) {
		s = "" + s
		if (s.length > 19) {
			return s.substring(0, 10) + " " + s.substring(11, 19)
		}
	}
	return ""
}

$c.handleAdded = function (file) {
	$w.app.state.file = file
	$w.app.update()
}
$c.handleCompleted = function (file) {

}
$c.createCORSRequest = function (method, url) {
	var xhr;
	xhr = new XMLHttpRequest();
	if (xhr.withCredentials != null) {
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest !== "undefined") {
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		xhr = null;
	}
	return xhr;
}
$c.uploadToS3 = function (uploadUrl, uploadData, key, progressCallback, callback) {
	var xhr = $c.createCORSRequest('PUT', uploadUrl);
	if (!xhr) {
		console.error("CORS is not support.");
		callback(key, new Error("File uploads are not supported by this browser."));
		return;
	}

	xhr.onload = function () {
		if (xhr.status === 200) {
			callback(key, false, true);
		} else {
			callback(key, new Error("A file upload error occurred: " + xhr.status), false);
		}
	};

	xhr.onerror = function () {
		callback(key, new Error("A file upload error occurred: " + xhr.status), false);
	};

	xhr.upload.onprogress = function (e) {
		var percentLoaded = Math.round((e.loaded / e.total) * 100);
		if (progressCallback)
			progressCallback(percentLoaded);
	};

	xhr.setRequestHeader('Content-Type', "application/vnd.ms-excel");
	//xhr.setRequestHeader( 'x-amz-acl', 'bucket-owner-full-control' );
	return xhr.send(uploadData);
} 