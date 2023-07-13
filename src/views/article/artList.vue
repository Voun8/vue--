<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                v-for="item in cateList"
                :key="item.id"
                :label="item.cate_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="showPubDialogFn"
          >发表文章</el-button
        >
      </div>

      <!-- 文章表格区域 -->
      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title"></el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="dialogColseFn"
    >
      <!-- 发布文章的对话框 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.cate_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor
            v-model="pubForm.content"
            @blur="contentChangeFn"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img
            src="../../assets/images/cover.jpg"
            alt=""
            class="cover-img"
            ref="imgRef"
          />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="iptFileRef"
            @change="changeCoverFn"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="selCoverFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')"
            >发布</el-button
          >
          <el-button type="info" @click="pubArticleFn('草稿')"
            >存为草稿</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateAPI, uploadArticleAPI, getArticleListAPI } from '@/api'
import imgObj from '../../assets/images/cover.jpg'
export default {
  name: 'ArtList',
  created () {
    this.getCateListFn()
    this.getArticleListFn()
  },
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1, // 默认拿几条
        pagesize: 5, // 默认当前页拿几条
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false,
      // ...其他
      pubForm: {
        // 表单的数据对象
        title: '',
        cate_id: '',
        content: '',
        cover_img: '',
        state: ''
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        // content 对应的是quill-editor富文本编辑器
        // 原因：
        // el-input等输入框的再blur事件时校验，
        // 下拉菜单 复选框 单选框 是在change时发生校验
        // quill-editor 2个事件都没有，所以输入内容不会走校验
        // 解决：
        // 自己来给quill-editor来绑定change事件（文档中查到的）
        // 在事件函数中用el-form组件对象内，调用某规则重新校验(validateField)
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' }
        ],
        cover_img: [
          { required: true, message: '请选择封面', trigger: 'change' }
        ]
      },
      cateList: [],
      artList: [],
      total: 0
    }
  },
  methods: {
    async handleClose (done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    showPubDialogFn () {
      this.pubDialogVisible = true
    },
    // 获取所有的分类
    async getCateListFn () {
      const { data: res } = await getArtCateAPI()
      this.cateList = res.data
    },
    // 获取所以文章列表
    async getArticleListFn () {
      const { data: res } = await getArticleListAPI(this.q)
      this.artList = res.data
      this.total = res.total
    },
    selCoverFn () {
      this.$refs.iptFileRef.click()
    },
    changeCoverFn (e) {
      const files = e.target.files
      if (files.length === 0) {
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', imgObj)
      } else {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      this.$refs.pubFormRef.validateField('cover_img')
    },
    pubArticleFn (str) {
      this.pubForm.state = str
      this.$refs.pubFormRef.validate(async (valid) => {
        if (valid) {
          // 通过校验 发送请求
          const fd = new FormData()
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await uploadArticleAPI(fd)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          // 关闭对话框
          this.pubDialogVisible = false
          // 刷新文章列表
          this.getArticleListFn()
        } else {
          // 未通过校验
          return false
        }
      })
    },
    // 富文本改变触发此事件
    contentChangeFn () {
      this.$refs.pubFormRef.validateField('content')
    },
    // 对话框关闭时，清空表单
    dialogColseFn () {
      this.$refs.pubFormRef.resetFields()
      // 需要给封面重置，因为它时格外的组件
      this.$refs.imgRef.setAttribute('src', imgObj)
    },
    // 分页-》每页条数改变时触发
    handleSizeChangeFn (sizes) {
      // sizes：当前需要每页现实的条数
      // this.q.pagesize = sizes
      this.getArticleListFn()
    },
    // 当前页码改变时触发
    handleCurrentChangeFn (noPage) {
      // noPage：当前要看的第几页，页数
      // 添加了.sync 数字已经变了，没必要再改
      // this.q.pagenum = noPage
      this.getArticleListFn()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.el-pagination {
  margin-top: 15px;
}
</style>
