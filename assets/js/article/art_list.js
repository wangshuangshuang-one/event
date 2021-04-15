$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  // 1.定义时间过滤器
  template.defaults.imports.dataFormat = function (dates) {
    const dt = new Date(dates);
    const year = dt.getFullYear();
    const month = padZero(dt.getMonth() + 1);
    const day = padZero(dt.getDate());

    const hours = padZero(dt.getHours());
    const minutes = padZero(dt.getMinutes());
    const seconds = padZero(dt.getSeconds());

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  }

  function padZero(times) {
    return times > 9 ? times : "0" + times;
  }

  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  initTable();
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        };
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        renderPage(res.total);
      }
    })
  };
  initCate()
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10, 15],
      // 分页发生切换的时候，触发 jump 回调
      jump: function (obj, first) {
        // console.log(obj.curr)
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      }
    });
  }
  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      }
    })
  };
  $("#form-search").on('submit', function (e) {
    e.preventDefault();
    const cate_id = $('[name=cate_id]').val();
    const state = $('[name=state]').val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  $('tbody').on('click', '.btn-delete', function () {
    let len = $(".btn-delete").length;
    console.log(len);
    const id = $(this).attr('data-id');
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        type: 'GET',
        url: '/my/article/delete/' + id,
        success(res) {
          if (res.status !== 0) {
            return layer.msg("删除失败！")
          }
          layer.msg("删除成功！");
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        }
      });
      layer.close(index);
    });
  });
});