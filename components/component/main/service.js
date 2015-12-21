
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
	$.getJSONP(prefix + "changeservice/login/"+p.username+"/"+p.pwd,c)
}

function getUser(id,c){
	$.getJSONP(prefix + "changeservice/phoneuserinfo/"+id,c);
}

function getMessage(id,c){
	$.getJSONP(prefix + "changeservice/msgs/"+id,c);
}

function getChangeTypes(p,c){
	$.getJSONP(prefix + "changeservice/changetypes?parent="+p,c);
}

function getPicUrl(p,c){
	return prefix +"changeservice/uploadimage";
}

function postChange(p,c){
	$.getJSONP2(prefix +"changeservice/changeupload",p,c);
}

function getChanges(p,c){
	$.getJSONP2(prefix + "changeservice/changequery", p,c)
}

function getOtherChanges(p,c){
	$.getJSONP(prefix + "changeservice/otherchanges?phone="+p,c)
}

function getChangeByStatus(s,c){
	$.getJSONP(prefix + "changeservice/changes/"+s,c)
}

function getChangeUnits(p,c){
	$.getJSONP2(prefix + "changeservice/units",p,c)
}

function getUsers(p,c){
	$.getJSONP2(prefix + "changeservice/susers",p,c)
}

function getMobileUsers(p,c){
	$.getJSONP2(prefix + "changeservice/users",p,c)
}

/*商户查询*/
function getBusiness(p,c){
	$.getJSONP2(prefix + "changeservice/businessquery",p,c)
}

/*商户上报*/
function postBusiness(p,c){
	$.getJSONP2(prefix + "changeservice/businessupload",p,c)
}

/*商户删除*/
function delBusiness(p,c){
	$.getJSONP2(prefix + "changeservice/businessdelete",p,c)
}

/*商户编辑*/
function editBusiness(p,c){
	$.getJSONP2(prefix + "changeservice/businessedit",p,c)
}

/*工单年度统计*/
function changesstat(c){
	$.getJSONP(prefix + "changeservice/changesstat",c)
}

/*商户年度统计*/
function businessstat(c){
	$.getJSONP(prefix + "changeservice/businessstat",c)
}

/*工单按单位统计*/
function unitstat(p,c){
	$.getJSONP(prefix + "changeservice/unitstat?yunit="+p,c)
}

/*添加单位*/
function addunit(p,c){
	$.getJSONP2(prefix + "changeservice/addunit",p,c)
}

/*删除单位*/
function deleteunit(p,c){
	$.getJSONP(prefix + "changeservice/deleteunit?id="+p,c)
}

/*编辑单位*/
function modifyunit(p,c){
	$.getJSONP2(prefix + "changeservice/modifyunit",p,c)
}

/*添加用户*/
function adduser(p,c){
	$.getJSONP2(prefix + "changeservice/adduser",p,c)
}

/*系统用户修改*/
function modifyuser(p,c){
	$.getJSONP2(prefix + "changeservice/modifyuser",p,c)
}

/*删除用户*/
function deleteuser(p,c){
	$.getJSONP(prefix + "changeservice/deleteuser?id="+p,c)
}


/*添加手机用户*/
function addphoneuser(p,c){
	$.getJSONP2(prefix + "changeservice/addphoneuser",p,c)
}

/*手机修改*/
function modifyphoneuser(p,c){
	$.getJSONP2(prefix + "changeservice/modifyphoneuser",p,c)
}

/*删除手机用户*/
function deletephoneuser(p,c){
	$.getJSONP(prefix + "changeservice/deletephoneuser?id="+p,c)
}

/*获取日志*/
function logs(p,c){
	$.getJSONP2(prefix + "changeservice/logs",p,c)
}


/*获取原始数据*/
function ochangequery(p,c){
	$.getJSONP2(prefix + "changeservice/ochangequery",p,c)
}

/*商户入驻审核*/
function businessfeedback(p,c){
	$.getJSONP2(prefix + "changeservice/businessfeedback",p,c)
}

/*工单审核*/
function changefeedback(p,c){
	$.getJSONP2(prefix + "changeservice/changefeedback",p,c)
}

function changemerge(p,c){
	$.getJSONP2(prefix + "changeservice/changemerge",p,c)
}

function changedelete(p,c){
	$.getJSONP2(prefix + "changeservice/changedelete",p,c)
}

/*商户删除*/
function businessdelete(p,c){
	$.getJSONP2(prefix + "changeservice/businessdelete",p,c)
}

function uploadprevimage(p,c){
	$.ajaxFileUpload
	(
		{
			url:prefix + 'UploadHandler.ashx?action=uploadprevimage&changeid='+p, //用于文件上传的服务器端请求地址
			secureuri: false,
			fileElementId: '_f'+p,
			dataType: 'json',
			success: c
		}
	)
}

function login(p,c){
	$.getJSONP(prefix + "changeservice/slogin/"+ p.userName+"/"+ p.pwd,c)
}

module.exports = {
	businessdelete:businessdelete,
	changedelete:changedelete,
	changemerge:changemerge,
	login:login,
	uploadprevimage:uploadprevimage,
	changefeedback:changefeedback,
	businessfeedback:businessfeedback,
	ochangequery:ochangequery,
	logs:logs,
	addphoneuser:addphoneuser,
	modifyphoneuser:modifyphoneuser,
	deletephoneuser:deletephoneuser,
	login:login,
	getUser:getUser,
	getMessage:getMessage,
	getChangeTypes:getChangeTypes,
	getPicUrl:getPicUrl,
	postChange:postChange,
	getChanges:getChanges,
	getOtherChanges:getOtherChanges,
	getChangeByStatus:getChangeByStatus,
	getChangeUnits:getChangeUnits,
	getUsers:getUsers,
	getMobileUsers:getMobileUsers,
	getBusiness:getBusiness,
	postBusiness:postBusiness,
	delBusiness:delBusiness,
	editBusiness:editBusiness,
	changesstat:changesstat,
	businessstat:businessstat,
	unitstat:unitstat,
	addunit:addunit,
	deleteunit:deleteunit,
	modifyunit:modifyunit,
	adduser:adduser,
	modifyuser:modifyuser,
	deleteuser:deleteuser,
	prefix:prefix

}
