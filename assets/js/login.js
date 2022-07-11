$(function (){
    // 为‘去注册账号’绑定点击事件
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 为‘去登录’绑定点击事件
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 from 对象
    var form = layui.form
    // 从 layui 中获取 layer 对象
    var layer = layui.layer
    // 通过 from.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个 pwd 校验规则
        pwd: [
            // \S 代表空格
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        // 定义一个 repwd(确认密码) 校验规则
        repwd: function(value){
            // 利用形参获取确认密码输入框的值
            // 还需要拿到密码框内的值
            // .reg-box [name=password] 代表获取.reg-box下属性为name=password
            var pwd = $('.reg-box [name=password]').val()
            // 判断两次密码输入是否一样
            if (pwd !== value) {
                // 如果不一致，则return一个错误提示消息
                return '两次密码不一致'
            }
            
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 发起 ajax 的 post 请求
        // 参数1：url地址，参数2：请求数据，参数3：回调函数
        var data = {username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()}
        $.post('/api/reguser',data,function(res){
            // 通过状态值，判断提交是否成功
            if (res.status !== 0){
                // 提交失败，返回错误信息
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            // 提交成功=注册成功
            // console.log('注册成功！');
            layer.msg('注册成功，请登录！');
            // 模拟人的点击行为，跳转到登录页面
            $('#link_login').click()
        })
    })

    // 监听登录表单提交事件
    $('#form_login').submit(function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        // 发起 ajax 请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 此处 this 指向 form_login表单
            // serialize() 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res){
                if (res.status !== 0){
                    // 登录失败
                    return layer.msg('登录失败！')
                }
                // 登录成功
                layer.msg('登录成功！')
                // console.log(res.token);
                // 将登录成功得到的 token 值保存到 localStorage 中
                localStorage.setItem('token',res.token)
                // 登录成功，跳转到后台首页
                location.href = '/code/index.html'
            }
        })
    })
})