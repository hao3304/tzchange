
	var prefix = "http://120.24.215.190:112/";

	$.getJSONP = function(url,callback){
		return $.ajax({
			url:url,
			dataType:"jsonp",
			jsonp:"callback",
			success:callback
		});
	}

	$.getJSONP2 = function(url,data,success,error){
		return $.ajax({
			url:url,
			data:data,
			dataType:"jsonp",
			jsonp:"callback",
			success:success,
			error:error
		});
	}
	
	function login(p,c){
		$.get(prefix + "changeservice/login/"+p.username+"/"+p.pwd,c)
	}

	function getUser(id,c){
		$.get(prefix + "changeservice/phoneuserinfo/"+id,c);
	}

	function getMessage(id,c){
		$.get(prefix + "changeservice/msgs/"+id,c);
	}
	
	function getChangeTypes(c){
		$.get(prefix + "changeservice/changetypes",c);
	}

	function getPicUrl(p,c){
		return prefix +"changeservice/uploadimage";
	}

	function postChange(p,c){
		$.get(prefix +"changeservice/changeupload",p,c);
	}

	function getChanges(p,c){
		$.getJSONP2(prefix + "changeservice/changequery", p,c)
	}

	function getOtherChanges(p,c){
		$.get(prefix + "changeservice/otherchanges?phone="+p,c)
	}

	function getChangeByStatus(s,c){
		$.get(prefix + "changeservice/changes/"+s,c)
	}

	function getChangeUnits(s,c){
		$.getJSONP(prefix + "changeservice/units?id="+s,c)
	}

	function changefeedback(p,c){
		$.getJSONP2(prefix + "changeservice/changefeedback", p,c);
	}

