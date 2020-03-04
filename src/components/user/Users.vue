<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索框和添加按钮区 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input v-model="searchMsg" suffix-icon="el-icon-search"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="设置"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userRule.pagenum"
        :page-sizes="[1, 3, 5, 7]"
        :page-size="userRule.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total - 0"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userRule: { query: '', pagenum: 1, pagesize: 2 },
      searchMsg: '',
      userList: [],
      total: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.userRule
      })
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          type: 'warning'
        })
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange(pagesize) {
      this.userRule.pagesize = pagesize
      this.getUserList()
    },
    handleCurrentChange(pagenum) {
      this.userRule.pagenum = pagenum
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>
.box-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
  text-align: center;
}
.el-pagination {
  margin-top: 20px;
}
</style>
