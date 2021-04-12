$(function () {
    getUserInfo()
});

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.token
        },
        success(res){
            console.log(res);
        }
    });
};