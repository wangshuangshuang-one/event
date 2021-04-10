$(function () {
    $("#link_reg").on('click', function () {
        $(".login-box").hide();
        $(".reg-box").show();
    });
    $("#link_login").on('click', function () {
        $(".reg-box").hide();
        $(".login-box").show();
    });

    // 定义校验规则
    const form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须为6-12位，且不能包含字符'],

        repwd: function (value) {
            const pwd = $('.layui-form name=password').val();
            if (value !== pwd) {
                alert('两次输入的密码不一致');
            }
        }
    });

    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '//api-breakingnews-web.itheima.net/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success(res) {
                if (res.status !== 0) {
                    return console.log(res.message);
                }
                console.log('注册成功');
            }
        });
    });

});