$(function(){

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage


    


    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n){
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候， 
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,  // 页码值；默认请求第一页数据
        pagesize: 2,  // 每页显示多少条数据；默认显示两条数据
        cate_id: '',  // 文章分类的 Id
        state: '',  // 文章的状态，可选值有：已发布、草稿
    }

    initTable()

    initCate()

    // 获取文章列表数据
    function initTable(){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res){
                if (res.status !== 0){
                    return layer.msg("获取文章列表失败！")
                }
                // console.log(res);
                // 使用模板引擎渲染文章数据到页面
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if (res.status !== 0){
                    return layer.msg('获取文章分类失败！')
                }
                // 使用模板引擎渲染分类选项
                var htmlStr = template('tpl-cate',res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 通知 layui 重新渲染表单ui结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定提交事件
    $('#form-search').on('submit',function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        // 获取表单中选项中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中的对应属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格数据
        initTable( )
    })

    // 定义渲染分页的方法
    function renderPage(total){
        // console.log(total);
        laypage.render({
            elem: 'pageBox', // 存放分页的容器
            count: total, // 数据总数
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum,  // 显示的页码
            // 页码区域显示样式
            layout: ['count','limit','prev','page','next','skip'],
            // 定义每页显示条数
            limits: [2,3,5,10],
            // 页码发生切换时，触发 jump 回调
            // 触发 jump 回调的方式有两种
            // 1. 点击页码的时候，触发回调
            // 2. 调用 laypage.render 时，触发回调
            jump: function(obj,first){
                // 通过 first 的值，判断是哪种方式触发的回调
                // first = ture 是 调用 laypage.render 触发
                // first = undefined 是 点击页码的时候 触发
                // console.log(first);
                // console.log(obj.curr);
                // 将最新的页面赋值给 q 查询参数对象
                q.pagenum = obj.curr
                // 将最新的条目赋值给 q 查询参数对象
                q.pagesize = obj.limit
                // 判断触发回调方式
                if (!first){
                    // 根据最新的q获取对应的数据列表，渲染到页面
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(){
        // 获取页面删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        // 获取删除文章的id值
        var id = $(this).attr('data-id')
        // 弹出层 提示框
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res){
                    if (res.status !== 0){ 
                        console.log(res);
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除成功后，需要判断当前这一页中，是否还有数据
                    // 如果没有其他的数据，则让页码-1
                    if (len === 1){
                        // 如果 len = 1，证明删除完成后，该页面没有数据了
                        // 页码最小值必须为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 重新获取文章列表
                    initTable()
                }
            })
            layer.close(index);
          });
    })


    // // 1. 初始化图片裁剪器 
    // var $image = $('#image') 
    // // 2. 裁剪选项 
    // var options = { aspectRatio: 400 / 280, preview: '.img-preview' }
    // // 3. 初始化裁剪区域 
    // $image.cropper(options)
    // 1. 初始化图片裁剪器 
    var $image = $('#image') 
    // 2. 裁剪选项 
    var options = { aspectRatio: 400 / 280, preview: '.img-preview' }
    

    // 通过代理的形式为编辑绑定点击事件
    $('tbody').on('click','.btn-edit',function(){
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res){
                if (res.status !== 0){
                    return layer.msg('获取文章信息失败！')
                }
                // console.log(res);
                layer.msg('获取文章信息成功！')
                $('.art-list').hide()
                $('.art-edit').show()
                form.val('formAtrInfo',res.data)
                $('#image').attr("src","http://api-breakingnews-web.itheima.net"+res.data.cover_img)
                // 初始化富文本编辑器
                initEditor()
                
                // 3. 初始化裁剪区域 
                $image.cropper(options)
            }
        })
    })


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
    
    // 定义状态 
    var atr_state = '已发布'
    // 为存为草稿绑定点击事件，修改发布状态
    $('#btnSave2').on('click',function(){
        atr_state = '草稿'
    })

    // 为 form 表单绑定提交事件
    $('#form-edit').on('submit',function(e){
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 基于 form 表单，快速创建一个formData对象
        var fd = new FormData($(this)[0])
        // fd.forEach(function(v,k){
        //     console.log(k,v);
        // })

        // 将发布状态追加到formdata对象中
        fd.append('state',atr_state)

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
            editArticle(fd)
        })
    })

    // 定义发布文章的函数
    function editArticle(fd){
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据， 
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res){
                if (res.status !== 0){
                    console.log(res);
                    return layer.msg('修改文章失败！')
                    
                }
                layer.msg('修改文章成功！')
                // 发布成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})