$(function(){

    var layer = layui.layer
    var form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 初始化文章分类
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if (res.status !== 0){
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎渲染分类列表的下拉菜单
                var htmlStr = template('tpl-cate',res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 通知 layui 重新渲染表单ui结构
                form.render() 
            }
        })
    }

    // 封面
    // 1. 初始化图片裁剪器 
    var $image = $('#image') 
    // 2. 裁剪选项 
    var options = { 
        aspectRatio: 400 / 280, 
        preview: '.img-preview' 
    }
    // 3. 初始化裁剪区域 
    $image.cropper(options)


    // 为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click',function(){
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change',function(e){
        // 获取文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0){
            return layer.msg('用户未选择文件！')
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 先 销毁 旧的裁剪区域，再 重新设置图片路径 ，之后再 创建新的裁剪区域
        $image 
           .cropper('destroy') // 销毁旧的裁剪区域 
           .attr('src', newImgURL) // 重新设置图片路径 
           .cropper(options) // 重新初始化裁剪区域
    })


    // 定义文章发布的状态
    var atr_state = '已发布'

    // 为存为草稿绑定点击事件，修改发布状态
    $('#btnSave2').on('click',function(){
        atr_state = '草稿'
    })

    // 为 form 表单绑定提交事件
    $('#form-pub').on('submit',function(e){
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 基于 form 表单，快速创建一个formData对象
        var fd = new FormData($(this)[0])
        // 将发布状态追加到formdata对象中
        fd.append('state',atr_state)

        // dt.forEach(function(v,k){
        //     console.log(k,v);
        // })

        // 将裁剪过后的封面转换为文件啊对象
        $image 
           .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布 
            width: 400, 
            height: 280 
        })
        .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象 
            // 得到文件对象后，将文件对象存储到 fd 对象中
            fd.append('cover_img',blob) 

            // 发起 ajax 数据请求体，实现发表文章的功能
            publishArticle(fd)
        })
    })

    // 定义发布文章的函数
    function publishArticle(fd){
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据， 
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res){
                if (res.status !== 0){
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})