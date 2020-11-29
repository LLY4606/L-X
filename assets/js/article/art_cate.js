$(function () {
    // 1. 加载文章分类列表
    initArrtCateList()

    // 2. 添加类别按钮 点击事件
    $('#btnAddCate').on('click', showWindow);

    // 3. 通过代理方式 为未来的 新增按钮   绑定点击事件
    $('body').on('submit', '#formAdd', doAdd);

    // 4. 通过代理方式 为未来的 删除按钮 点击绑定事件
    $('tbody').on('click', '.btn-delete', doDelete);

    // 5. 通过代理方式 为未来的 编辑按钮 点击绑定事件
    $('tbody').on('click', '.btn-edit', addClass);
})

// 1、加载 文章分类 列表----------------
function initArrtCateList() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success(res) {
            // console.log(res);
            // 1、 遍历 数组 生成html 字符串
            let strHtml = template('tpl-table', res);
            // 2、将 html 字符串 渲染到 tobdy里面
            $('tbody').html(strHtml);
        }

    })
}

// 2、 显示新增窗口    -----------------
function showWindow() {
    layerID = layui.layer.open({
        type: 1,
        area: ['500px', '300px'],
        title: '添加文章分类',
        content: $('#dialog-add').html()
    });
}

let layerID = null;

// 3、 执行新增        ----------------
function doAdd(e) {
    e.preventDefault();
    // console.log('要加是提交了');
    //  获取弹出层  标题
    let title = $('.layui-layer-title').text().trim();
    // 获取数据
    let dataStr = $(this).serialize();
    // 判断 当前 提交，是 【新增】 还是【编辑】 操作
    // 新增操作------------
    if (title == '添加文章分类') {

        // 将 数组字符串 id=''$  替换成 空字符串
        dataStr = dataStr.replace('Id=&', '');
        // 发送异步请求
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: dataStr,
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;

                // 重新 获取分类列表
                initArrtCateList();
                // 关闭弹出框
                layui.layer.close(layerID);
            }
        });
    } else {
        $.ajax({
            url: '/my/article/updatecate',
            method: 'post',
            data: dataStr,
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;

                // 重新 获取分类列表
                initArrtCateList();
                // 关闭弹出框
                layui.layer.close(layerID);
            }
        })
    }
}
// 4、新增        ---------------------
// function doAdd(e) {
//     e.preventDefault();
//     // 获取数据
//     let strData = $(this).serialize();
//     // 发送请求
//     $.ajax({
//         url: '/my/article/addcates',
//         method: 'POST',
//         data: strData,
//         success(res) {
//             // 判断是否添加成功
//             layui.layer.msg(res.message);
//             if (res.status != 0) return;
//             // 重新获取列表
//             initArrtCateList();
//             // 关闭弹出框
//             layui.layer.close(layerID)

//         }
//     })
// }


// 4、删除按钮      --------------------
function doDelete() {
    // 获取自定义属性
    // let id = this.getAttribute('data-id');
    // h5 中 提供了 获取 data- 属性 的快捷语法：
    let id = this.dataset.id;
    // console.log('要删除的是',id);
    // 如果用户点击   确认，则执行回调函数
    layer.confirm('你确认要删除这条数据?', function (index) {

        $.ajax({
            url: '/my/article/deletecate/' + id,
            method: 'get',
            success(res) {
                layui.layer.msg(res.message);
                // 删除失败
                if (res.status != 0) return;

                // 成功删除  则重新获取列表数据
                initArrtCateList();
            }
        })
        // 删除后关闭弹出框
        layui.layer.close(index);
    });

}

// 5、编辑文章按钮 ---------------------
function addClass() {
    // console.log(this.dataset.id);
    // 1.弹出一个修改文章信息的层
    layerID = layui.layer.open({
        type: 1,
        area: ['500px', '300px'],
        title: '修改文章分类',
        content: $('#dialog-add').html()
    });
    // 2. 获取id 
    let id = this.dataset.id;
    // 3. 将当前行的数据 显示到 弹出框  的文本中
    $.ajax({
        url: '/my/article/cates/' + id,
        method: 'get',
        success(res) {
            console.log(res);

            // 将获取的  文章分类 数据 自动装填到 调单元素中
            layui.form.val('formData', res.data);
        }
    })
}