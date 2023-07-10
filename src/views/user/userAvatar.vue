<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img
        v-if="!avatar"
        class="the_img"
        src="../../assets/images/avatar.jpg"
        alt=""
      />
      <img v-else class="the_img" :src="avatar" alt="" />
      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="iptRef"
          @change="onFileChange"
        />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg"
          >选择图片</el-button
        >
        <el-button
          type="success"
          icon="el-icon-upload"
          :disabled="avatar === ''"
          @click="uploadFn"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateUserAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    // 选择图片
    chooseImg () {
      this.$refs.iptRef.click()
      // 目的:为了让input[type=file]标签，让他再用JS代码来触发它的点击事件(导致它默认行为给个文件选择窗口)
      // 原因: input[type=file]它是原生标签,样式不太好改// 解决: 移花接木
    },
    onFileChange (e) {
      const files = e.target.files // 拿到用户选择的文件
      if (files.length === 0) {
        console.log(1)
      } else {
        // 解决方案1: 文件 ->内存临时地址(这个地址只能在js里内存里不能发给后台)
        // 语法: URL.createobjectURL(文件)
        // 返回值: 内存临时地址
        // this.avatar = URL.createObjectURL(files[o])
        // this.avatar = URL.createObjectURL(files[0])
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.onload = (e) => {
          this.avatar = e.target.result
        }
      }
    },
    async uploadFn () {
      const { data: res } = await updateUserAvatarAPI(this.avatar)
      console.log(res)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.$store.dispatch('getUserInfoActions')
      console.log(this.$store.state.userInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
