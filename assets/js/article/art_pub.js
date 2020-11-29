var $image = null;
var options = null;

$(function () {
    // 0. 初始化富文本编辑器-----------------
    initEditor()

    // 1. 请求分类渲染下拉框------------------------
    initArrtCateList();

    // 2.  初始化 裁剪区--------------------
    // 1. 初始化图片裁剪器
    $image = $('#image');
    // 2. 裁剪选项
    options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 3.  文选择分面按钮  添加事件
    $('#btnChooseIamage').on('click', function () {
        // 模拟文件选择被点击
        $('#coverFile').click();
    })

    // 1.5、为文件选择框绑定onchange事件，获取选中文件信息  文件发生改变的时候 '请选择文件！'才会弹起
    $('#coverFile').on('change', fileChange);

    //5.  为发布 和草稿 按钮 绑定事件
    $('#btnSave1').on('click', pubList);
    $('#btnSave2').on('click', draft);

    // 6. 为表单绑定 提交事件
    $('#form-pub').on('submit', submitSearch);
})

// 1. 加载文章分类--------------------------
function initArrtCateList() {
    // let strData = $('.layui-form').serialize();
    $.ajax({
        url: '/my/article/cates',
        method: 'get',
        // data: strData,
        success(res) {
            // console.log(res);
            // 读取 模板 并 结合res 生成下拉框
            let strHtml = template('tpl-pub', res);
            // 将 下拉框 html 设置给 select 标签
            // 重新渲染
            console.log(strHtml);
            $('select[name=cate_id]').html(strHtml);
            layui.form.render();
        }
    })
}

// 2.选中文件------------------------------
function fileChange(e) {
    // console.log(e);
    // 获取选中文件列表
    // 0.获取选中文件信息的数组
    let fileList = e.target.files
    if (fileList.length == 0) {
        return layui.layer.msg('请选择文件！')
    }
    // console.log(fileList);
    // 1.获取选中的第一个文件 信息对象
    var file = fileList[0]
    // 2.创建文件虚拟路径
    var newImgURL = URL.createObjectURL(file)
    // 显示新图片
    // 调用 裁剪组件 销毁之前的图片设置新的虚拟路径给他 并重新创建裁剪区
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', newImgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
}

// 文章状态
let state = '已发布';
// 3、发布和草稿 共用的  点击事件处理函数-----------------------------
function pubList() {
    state = '已发布';
}
function draft() {
    state = '草稿';
}

// 4. 为表单 提交事件-------------------------
function submitSearch(e) {
    // a. 阻断表单事件
    e.preventDefault();
    // b. 获取 表单数据 装入  FormData 对象
    let fd = new FormData(this);
    // c. 为 FormData 追加 state 值 (已发布 / 草稿)
    fd.append('state', state);
    // d. 为 FormData 追加 裁剪后的文件数据'
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob);
            
            //d.提交到服务器 接口
            $.ajax({
                method: 'post',
                url: '/my/article/add',
                data: fd,
                processData: false,
                contentType: false,
                success: function (res) {
                    console.log(res);
                    // b.如果失败，提示错误消息
                    if (res.status !== 0)  return layui.layer.msg(res.message);                
                    // c.如果上传成功 直接跳转页面息
                    location.href = '/article/art_list.html';
                }
            })
        })
    
}
