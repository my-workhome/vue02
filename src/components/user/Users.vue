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
          <el-input v-model="userRule.query" clearable @clear="clearSwitch">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="switchClick(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button
                size="mini"
                @click="editUser(scope.row)"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                size="mini"
                @click="deleteUser(scope.row.id)"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="设置" placement="top" :enterable="false">
              <el-button
                size="mini"
                @click="setSoles(scope.row)"
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
      ></el-pagination>
    </el-card>
    <!-- 增加用户 -->
    <el-dialog title="添加用户" :visible.sync="addUserFlag" width="30%" @close="closeAddUser">
      <el-form :model="addForm" :rules="rulesAddUser" ref="ruleAddForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserFlag = false">取 消</el-button>
        <el-button type="primary" @click="addUserUp">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editUserFlag" width="50%" @close="closeEditUser">
      <el-form :model="editForm" :rules="rulesAddUser" ref="ruleAditForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserFlag = false">取 消</el-button>
        <el-button type="primary" @click="editUserUp()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色区 -->
    <el-dialog title="分配角色" :visible.sync="setUserFlag" width="50%" @close="closeSetUser">
      <div class="margin30">当前账户：{{setScope.username}}</div>
      <div class="margin30">当前角色：{{setScope.role_name}}</div>
      <div class="margin30">
        分配角色：
        <el-select v-model="checkRolesId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <el-button @click="setUserFlag=false">取 消</el-button>
      <el-button type="primary" @click="setUserUp(setScope.id)">确 定</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkRolesId: '',
      rolesList: [],
      userRule: { query: '', pagenum: 1, pagesize: 3 },
      searchMsg: '',
      userList: [],
      total: '',
      setScope: {},
      addUserFlag: false,
      editUserFlag: false,
      setUserFlag: false,
      addForm: { username: '', password: '', email: '', mobile: '' },
      editForm: {},
      rulesAddUser: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
          { min: 3, max: 10, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { min: 6, max: 15, trigger: 'blur' }
        ],
        email: [{ required: true, message: '请填写密码', trigger: 'blur' }],
        mobile: [{ required: true, message: '请填写密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 打开分配角色窗口并渲染
    async setSoles(scope) {
      this.setScope = scope
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      console.log(this.rolesList)
      this.setUserFlag = true
    },
    // 保存分配角色结果
    async setUserUp(userId) {
      const { data: res } = await this.$http.put(`users/${userId}/role`, {
        rid: this.checkRolesId
      })
      if (res.meta.status !== 200) {
        this.checkRolesId = []
        return this.$message.error('分配角色失败')
      }
      this.getUserList()
      this.$message.success('分配角色成功')
      this.setUserFlag = false
      console.log(res)
    },
    // 关闭分配角色窗口
    closeSetUser() {
      this.checkRolesId = []
    },
    addUser() {
      this.addUserFlag = true
    },
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
      if (res.data.users.length < 1) {
        this.userRule.pagenum--
        this.getUserList()
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(pagesize) {
      this.userRule.pagesize = pagesize
      this.getUserList()
    },
    handleCurrentChange(pagenum) {
      this.userRule.pagenum = pagenum
      this.getUserList()
    },
    async switchClick(scope) {
      const { data: res } = await this.$http.put(
        `users/${scope.id}/state/${scope.mg_state}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        scope.mg_state = !scope.mg_state
        return this.$message({
          message: '用户状态修改失败',
          type: 'warning'
        })
      }
      this.$message({
        message: '用户状态修改成功',
        type: 'success'
      })
    },
    searchUser() {
      this.getUserList()
    },
    clearSwitch() {
      this.getUserList()
    },
    closeAddUser() {
      this.$refs.ruleAddForm.resetFields()
      this.addUserFlag = false
    },
    addUserUp() {
      this.$refs.ruleAddForm.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }

        this.$message.success('添加用户成功')
        this.getUserList()
        this.addUserFlag = false
      })
    },
    editUser(scope) {
      this.editForm = scope
      this.editUserFlag = true
    },
    editUserUp() {
      this.$refs.ruleAditForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败')

        this.$message.success('修改成功')
        this.getUserList()
        this.editUserFlag = false
      })
    },
    closeEditUser() {
      this.$refs.ruleAditForm.resetFields()
    },
    async deleteUser(id) {
      const confirmCheck = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      ).catch(err => err)
      if (confirmCheck === 'confirm') {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        console.log(this.userRule.pagenum)
        this.getUserList()
      } else {
        this.$message('用户取消了删除')
      }
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
.margin30 {
  margin: 30px;
}
</style>
