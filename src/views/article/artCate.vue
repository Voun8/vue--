<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateShowDialogFn">添加分类</el-button>
      </div>
      <!-- 分类表格标签 -->
      <el-table :data="cateList" style="width: 100%" border stripe>
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cata_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini">修改</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加文章分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateAPI } from '@/api'
export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [],
      dialogVisible: false
    }
  },
  created () {
    this.getArtCateFn()
  },
  methods: {
    async getArtCateFn () {
      const res = await getArtCateAPI()
      this.cateList = res.data.data
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    addCateShowDialogFn () {
      this.dialogVisible = true
    },
    cancelFn () {
      this.dialogVisible = false
    },
    confirmFn () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
