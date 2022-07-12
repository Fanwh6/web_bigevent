// 注：每次调用 $.get() / $.post() / $.ajax() 的时候
// 会先调用 ajaxPrefilter() 这个函数
// 在这个函数中我们可以拿到 ajax 提供的配置对象
$.ajaxPrefilter(function(options){
    // console.log(options.url);
    // 发起真正的 ajax 请求前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 统一为有权限的接口，设置 headers 请求头
    // 判断请求url中是否包含’/my‘
    // indexOf 判断是否包含
    if (options.url.indexOf('/my') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function(res){
        // console.log('调用了 complete 回调函数');
            // console.log(res);
            // 在 complete 回调函数中，可以使用  res.responseJSON 拿到服务器响应回来的数据
            // 判断响应数据
            if (res.responseJSON.status === 1 &&  res.responseJSON.message === '身份认证失败！'){
                // 强制清空本地存储的token
                localStorage.removeItem('token')
                // 强制跳转到登录页面
                location.href = '/code/login.html'
            }
    }
})