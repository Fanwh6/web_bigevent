$(function(){
    // 导入 form方法
    var form = layui.form

    // 定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value){
            if (value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同！'
            }
        },
        rePwd: function(value){
            if (value !== $('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }
    })

    // 修改密码
    $('.layui-form').on('submit',function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // serialize() 生成 AJAX 请求时用于 URL 查询字符串
            data: $(this).serialize(),
            success: function(res){
                if (res.status !== 0){
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')

                // 重置表单
                // $('.layui-form') 获取的是jQuery对象
                // $('.layui-form')[0] 转换为 原生DOM对象
                // reset() 原生DOM对象重置方法
                $('.layui-form')[0].reset()
            }
        })
    })
})