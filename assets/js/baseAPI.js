// 注：每次调用 $.get() / $.post() / $.ajax() 的时候
// 会先调用 ajaxPrefilter() 这个函数
// 在这个函数中我们可以拿到 ajax 提供的配置对象
$.ajaxPrefilter(function(options){
    // console.log(options.url);
    // 发起真正的 ajax 请求前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
})