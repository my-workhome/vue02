<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 新增角色按钮区 -->
    <el-row class="btnRow">
      <el-button type="primary" @click="addSolesFlag = true">添加角色</el-button>
    </el-row>
    <!-- 表格区 -->
    <el-table :data="rolesList" width="100%" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            class="bottom center"
            :class="[i1==0?'top':'']"
            v-for="(item1,i1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag
                @close="closePower(scope.row,item1.id)"
                :closable="true"
                type="primary"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级和三级权限 -->
            <el-col :span="19">
              <el-row
                class="center"
                :class="[i2==0?'':'top']"
                v-for="(item2,i2) in item1.children"
                :key="item2.id"
              >
                <!-- 二级权限 -->
                <el-col :span="6">
                  <el-tag
                    @close="closePower(scope.row,item2.id)"
                    :closable="true"
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="18">
                  <el-tag
                    :closable="true"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    @close="closePower(scope.row,item3.id)"
                    type="warning"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip :enterable="false" effect="dark" content="修改" placement="top">
            <el-button @click="editBtn(scope.row)" class="item" type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" :enterable="false" effect="dark" content="删除" placement="top">
            <el-button @click="deleteSoles(scope.row.id)" type="danger" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip class="item" :enterable="false" effect="dark" content="设置" placement="top">
            <el-button @click="showSetPowerDialog(scope.row)" type="warning" icon="el-icon-setting"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增角色区 -->
    <el-dialog title="新增角色" :visible.sync="addSolesFlag" width="50%" @close="closeAddDialog">
      <el-form :model="solesform" :rules="solesRules" ref="addRolesFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="solesform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="solesform.roleDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addSolesFlag = false">取 消</el-button>
          <el-button type="primary" @click="addSoles">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改角色区 -->
    <el-dialog title="修改角色" :visible.sync="editSolesFlag" width="50%" @close="closeEditDialog">
      <el-form :model="editSolesform" label-width="80px" :rules="solesRules" ref="editRolesFormRef">
        <el-form-item label="ID">
          <el-input disabled v-model="editSolesform.id"></el-input>
        </el-form-item>

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editSolesform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editSolesform.roleDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editSolesFlag = false">取 消</el-button>
          <el-button type="primary" @click="editSoles">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分配权限区 -->
    <el-dialog title="分配权限" :visible.sync="setPowerFlag" width="50%" @close="closeSetPowerDialog">
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="rightRules"
        :default-checked-keys="defaultKeys"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
      ></el-tree>
      <el-button @click="setPowerFlag = false">取 消</el-button>
      <el-button type="primary" @click="setPower(checkScopes)">确 定</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      setPowerFlag: false,
      addSolesFlag: false,
      editSolesFlag: false,
      rolesId: '',
      checkScope: {},
      rolesList: [],
      rightsList: [],
      defaultKeys: [],
      solesform: {
        roleName: '',
        roleDesc: ''
      },
      // 树形控件的属性绑定对象
      rightRules: {
        label: 'authName',
        children: 'children'
      },
      editSolesform: [],
      // 角色验证规则
      solesRules: {
        roleName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    checkScopes: function() {
      return this.checkScope
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.console.error('获取角色数据失败')
      }
      this.rolesList = res.data
      console.log(res)
    },
    // 增加角色
    addSoles() {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.solesform)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.getRolesList()
        this.$message.success('添加角色成功')
        this.addSolesFlag = false
      })
    },
    // 新增角色窗口关闭
    closeAddDialog() {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 修改框关闭事件
    closeEditDialog() {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 修改按钮
    editBtn(scope) {
      console.log(scope)
      this.editSolesform = scope
      this.editSolesFlag = true
    },
    // 保存修改
    editSoles() {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `roles/${this.editSolesform.id}`,
          this.editSolesform
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败')
        }
        this.getRolesList()
        this.editSolesFlag = false
        this.$message.success('修改成功')
      })
    },
    // 删除角色
    async deleteSoles(solesId) {
      const deletConf = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (deletConf === 'cancel') {
        return this.$message.success('用户已取消了删除')
      }
      const { data: res } = await this.$http.delete(`roles/${solesId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.getRolesList()
      this.$message.success('删除成功')
    },
    async closePower(role, powerId) {
      const deletPowerFlog = await this.$confirm('是否删除权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).catch(err => err)
      if (deletPowerFlog !== 'confirm') {
        return this.$message.error('用户取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${powerId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
      this.$message.success('删除权限成功')
      console.log(res)
    },
    // 关闭权限分配
    closeSetPowerDialog() {
      this.defaultKeys = []
    },
    // 提交权限申请
    async setPower(scope) {
      const arr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const treeid = arr.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.rolesId}/rights`,
        {
          rids: treeid
        }
      )
      if (res.meta.status !== 200) {
        this.showSetPowerDialog(scope)
        return this.$message.error('全选获取失败')
      }
      this.$message.success('权限设置成功')
      this.setPowerFlag = false
      this.getRolesList()
    },
    // 获取权限节点并和第三级节点的id
    async showSetPowerDialog(scope) {
      this.rolesId = scope.id
      this.checkScope = scope
      console.log(this.checkScopes)
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      console.log(scope)
      this.getPowerId(scope, this.defaultKeys)
      this.setPowerFlag = true
    },

    // 递归函数获取所有三级节点id
    getPowerId(obj, arr) {
      if (!obj.children) {
        return arr.push(obj.id)
      }
      obj.children.forEach(item => {
        this.getPowerId(item, arr)
      })
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
.btnRow {
  margin-top: 20px;
}

.bottom {
  border-bottom: #686262 1px solid;
}
.center {
  display: flex;
  align-items: center;
}
.top {
  border-top: #686262 1px solid;
}
.el-tag {
  margin: 10px;
}
</style>
