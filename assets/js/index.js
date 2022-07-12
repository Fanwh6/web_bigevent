$(function(){
    // 调用 getUserInfo 获取用户的基本信息
    getUserInfo()

    // 导入方法
    var layer = layui.layer
    // 点击退出，实现退出登录功能
    $('#btnLogout').on('click',function(){
        // console.log('ok');
        // 弹出提示框
        layer.confirm('确认退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 确认退出
            // 清空本地存储的 token
            localStorage.removeItem('token')
            // 跳转到登录页面
            location.href = '/code/login.html'

            // 关闭 confirm 询问框
            layer.close(index);
          });
    })
})

// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头的配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res){
            // console.log(res);
            // 判断信息是否获取成功
            if (res.status !== 0){
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data)
        }
        // 不论成功还是失败，都会调用 complete 回调函数
        // 优化到了 dataAPI.js 文件下
        // complete: function(res){
        //     // console.log('调用了 complete 回调函数');
        //     // console.log(res);
        //     // 在 complete 回调函数中，可以使用  res.responseJSON 拿到服务器响应回来的数据
        //     // 判断响应数据
        //     if (res.responseJSON.status === 1 &&  res.responseJSON.message === '身份认证失败！'){
        //         // 强制清空本地存储的token
        //         localStorage.removeItem('token')
        //         // 强制跳转到登录页面
        //         location.href = '/code/login.html'
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user){
    // 获取用户名（优先显示昵称）
    var name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    // 渲染用户头像
    // 判断用户是否设置了头像
    if (user.user_pic !== null){
        // 渲染用户设置的头像
        // attr 设置属性
        $('.layui-nav-img').attr('src',user.user_pic).show()
        // 隐藏文字头像
        $('.text-avatar').hide()
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide()
        // toUpperCase 转换成大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}