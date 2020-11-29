// 定义 一个查询参数，将来请求数据的时候
// 【全局变量】 分页 查询对象
let q = {
    pagenum: 1,  // 当前页码
    pagesize: 4,  // 页容量
    cate_id: '',  // 分类筛选 id
    state: ''   // 发布状态
};


$(function () {
    // 创建 时间格式化过滤器
    template.defaults.imports.dataFormat = function (date) {
        let dt = new Date(date);

        let y = dt.getFullYear();
        let f = dt.getMonth() + 1;
        let d = dt.getDate();

        let h = dt.getHours();
        let m = dt.getMinutes();
        let s = dt.getSeconds();

        return `${y}-${f}-${d} ${h}:${m}:${s}`;

    }

    //1. 加载文章列表
    initTable();

    //2. 初始化文章分类列表
    initCate();

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', search);

    // 通过代理事件 委托
    $('tbody').on('click', '.btn-delete', del);
})

//1.  加载文章列表-----------
function initTable() {
    $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: q,
        success(res) {
            // console.log(res);
            // 1、 遍历 数组 生成html 字符串
            let strHtml = template('tpl-list', res);
            // 2、将 html 字符串 渲染到 tobdy里面
            $('tbody').html(strHtml);
            // 3. 调用 生成页码条
            renderPage(res.total);
        }

    })
}

// 2. 初始化文章分类的方法---------------
function initCate() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        data: q,
        success(res) {
            // console.log(res);
            // 1、 遍历 数组 生成html 字符串
            let htmlStr = template('tpl-cate', res);
            // console.log(htmlStr);
            // 2、将 html 字符串 添加到 分类下拉框
            $('select[name=cate_id]').html(htmlStr);
            // 通知 layui 重新渲染 下拉框 和 其他表单元素
            layui.form.render();
        }

    })
}

// 3 、 查询事件处理事件函数------
function search(e) {
    // 阻断表单提交
    e.preventDefault();
    q.cate_id = $('select[name=cate_id]').val();
    q.state = $('select[name=state]').val();
    // console.log(q);
    // 设置给分页查询对象
    // 重新加载
    initTable();
}

// 4、 生成页码条--------------------
// 1. laypage.render  会首次触发
// 2. 点击页码时触发
// 3. 切换页容量下拉框十触发
function renderPage(total) {
    layui.laypage.render({
        elem: pageBox,   // 页码条容器
        count: total,   //  总行数
        limit: q.pagesize,  //   获取起始页码
        curr: q.pagenum,  // 页容量
        limits: [2, 5, 10, 15, 20],  // 页容量选择
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],// 页码条功能 
        // 当我们点击  页码条的时候   
        jump: function (obj, first) {
            //obj包含了当前分页的所有参数，比如：
            console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            // console.log(obj.limit); //得到每页显示的条数
            // 获取当前页码 ，设置给 分页查询参数 
            q.pagenum = obj.curr;

            //获取下拉框中 选中的 页容量，设置给 分页查村参数
            q.pagesize = obj.limit;

            //当点击页码时   首次不执行
            if (!first) {
                // 根据最新的 q 后去对应的 数据列表 并渲染
                initTable();
            }

        }
    });

}

// 5. 删除业务---------------
function del() {
    let id = this.dataset.id;
    // console.log('要删除的是',id);
    // 如果用户点击   确认，则执行回调函数
    layui.layer.confirm('你确认要删除这条数据?', function (index) {
        // 获取页面上  剩余行数
        let rows = $('tbody tr .btn-delete').length;
        $.ajax({
            url: '/my/article/delete/' + id,
            method: 'get',
            success(res) {
                layui.layer.msg(res.message);
                // 删除失败
                if (res.status != 0) return;
                // 成功删除后 判断是否已经没有了 ，如果没有，则 页码 -1 
                if (rows <= 1) {
                    // 如果当前是第一页 就不删除
                    // 如果不是第一页 则页码 -1
                    q.pagenum = q.pagenum == 1 ? 1 : q.pagenum-1;
                }
                // 成功删除  则重新获取列表数据
                initTable();
            }
        })
        // 删除后关闭弹出框
        layui.layer.close(index);
    });
}