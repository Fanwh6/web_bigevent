$(function(){
    var form = layui.form
    var layer = layui.layer

    // 文本校验
    form.verify({
        nickname: function(value){
            if (value.length > 6){
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        },
    })

    // 调用 initUserInfo 获取用户信息
    initUserInfo()

    // 初始化用户基本信息
    function initUserInfo(){
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res){
                if (res.status !== 0){
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);

                // 调用 form.val() 为表单赋值  为赋值的表单添加 lay-filter="" 属性
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click',function(e){
        // 阻止 表单的默认重置行为
        e.preventDefault()
        // 初始化用户基本信息
        initUserInfo()
    })

    // 监听表单的提交时间
    $('.layui-form').on('submit',function(e){
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // serialize() 生成 AJAX 请求时用于 URL 查询字符串
            data: $(this).serialize(),
            success: function(res){
                if (res.status !== 0){
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')

                // 调用父元素中的方法，重新渲染用户名和头像
                window.parent.getUserInfo()
            }
        })
    })
    
})