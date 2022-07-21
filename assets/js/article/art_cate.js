$(function(){

    var layer = layui.layer

    var form = layui.form

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                // console.log(res);
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    // 为关闭弹出层提供索引
    var indexAdd = null
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            type: 1, // 基本层类型：页面层
            area: ['500px', '250px'],  // 页面宽高
            title: '添加文章类型',
            // 通过 js 动态拼接到网页
            content: $('#dialog-add').html()
        });   
    })

    // 通过代理的方式，为弹出表单绑定提交事件
    $('body').on('submit','#form-add',function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        // console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res){
                if (res.status !== 0){
                    console.log(res);
                    return layer.msg('新增分类失败！')
                }
                // 初始化分类列表
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 通过代理的形式，为 btn-edit 绑定点击事件
    var indexEdit = null
    $('tbody').on('click','.btn-edit',function(){
        indexEdit = layer.open({
            type: 1, // 基本层类型：页面层
            area: ['500px', '250px'],  // 页面宽高
            title: '修改文章分类',
            // 通过 js 动态拼接到网页
            content: $('#dialog-edit').html()
        }); 

        // 获取修改分类的id
        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res){
                // console.log(res);
                // 注： 参数1： lay-filter属性
                form.val('form-edit', res.data)
                // console.log(res);
            }
        })
    })

    // 通过代理的形式，为 form-edit 表单绑定提交事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                if (res.status !== 0){
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })


    // 通过代理的形式为删除按钮绑定点击事件
    $('body').on('click','.btn-delete',function(){
        var id = $(this).attr('data-id')
        // 弹出确认删除提示框
        layer.confirm('确认删除?', {icon: 3, title:'提示'},function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    if (res.status !== 0){
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })
        });
    })
})