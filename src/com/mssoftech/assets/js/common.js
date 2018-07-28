"use strict";
var checkAndCreate;
checkAndCreate = function(v) {
	if (window[v] == null) {
		return window[v] = {};
	}
};
checkAndCreate("$c");
$c.checkAndCreate = checkAndCreate;
$c.contextpath = "/";
$c.onChange = function(e) {
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
	$w.app.setState(state)

};
$c.onChecked = function(e) {
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
	$w.app.setState(state)
};
$c.onRadioChecked = function(e) {
	var state = $w.app.state;
	var names = e.target.name.split("#")
	switch (names.length) {
	case 2:
		state[names[0]] = names[1]
		break;
	case 3:
		state[names[0]][names[1]] =names[2]
		break;
	case 4:
		state[names[0]][names[1]][names[2]]= names[3]
		break;
	default:
		console.error("name length over")
	}
	$w.app.setState(state)
};
$c.ajaxPost = function(url, data, contenttype, callback) {
	$.ajax({
		type : "POST",
		url : $c.contextpath + url,
        headers: {
        'X-XSRF-TOKEN': token,
       },
		data : data,
		contentType : contenttype
	}).fail(function(jqXHR, textStatus) {
		console.log("Internet or Server Error")
		callback(jqXHR, textStatus)
	}).done(callback);
}
$c.ajaxPostJson = function(url, param, callback) {
	var data = JSON.stringify(param);
	$c.ajaxPost(url, data, "text/json", callback);
}
$c.deepCopy = function(obj) {
	return $.extend(true, {}, obj)
}
$c.swalshow = function() {
	var status = $w.app.state.swal;
	if (status.func === "close") {
		swal({
			title : status.title,
			type : status.type
		}, function() {
			var tempswal = {
				show : false,
				title : "",
				type : "",
				func : ""
			}
			var state = $w.app.state
			state.swal = tempswal
			$w.app.setState(state)
		});
	}
	if (status.func === "reload") {
		swal({
			title : status.title,
			type : status.type
		}, function() {
			location.reload();
		});
	}
	if (status.func.substring(0, 7) === "reload:") {
		swal({
			title : status.title,
			type : status.type
		}, function() {
			location.reload(status.func.substr(7));
		});
	}
}
$c.showSweet = function(title, stype, func) {
	var tempswal = {
		show : true,
		title : title,
		type : stype,
		func : func
	}
	var state = $w.app.state
	state.swal = tempswal;
	$w.app.setState(state)
}
$c.ajaxPostSwal = function(url, data, contenttype, callback) {
	$.ajax({
		type : "POST",
		url : $c.contextpath + url,
        headers: {
        'X-XSRF-TOKEN': token,
       },
		data : data,
		contentType : contenttype
	}).fail(function(jqXHR, textStatus) {
		$c.showSweet("サーバーかインターネットエラーです", "warning", "close");
	}).done(callback);
}

$c.ajaxPostJsonSwal = function(url, param, callback) {
	var data = JSON.stringify(param);
	$c.ajaxPostSwal(url, data, "text/json", callback);
}
$c.ErrorCheck = function(res){
    if (res.status<0){
        $c.showSweet(res.data, "warning", "close");
        return false;
    }
    return true;
}