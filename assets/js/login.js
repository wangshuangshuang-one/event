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
    const layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须为6-12位，且不能包含字符'],

        repwd: function (value) {
            const pwd = $('.layui-form name=password').val();
            if (value !== pwd) {
                return alert('两次输入的密码不一致');
            }
        }
    });

    $('.reg-box').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val()
            },
            success(res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！')
                // 模拟人的点击行为
                $('#link_login').click();
            }
        });
    });
    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: 'http://api-breakingnews-web.itheima.net/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html';
            }
        })
    })
});