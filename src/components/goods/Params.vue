/* eslint-disable no-constant-condition */
<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="警告提示的文案" type="warning" show-icon></el-alert>
      <span>选择商品分类</span>
      <!-- 联级选择区 -->
      <el-cascader
        v-model="selectedCateKeys"
        :options="cateList"
        :props="cateProps"
        expand-trigger="hover"
        clearable
        @change="cateCascaderChange"
      ></el-cascader>
      <!-- tabs页签区 -->
      <el-tabs v-model="tabsActiveName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="btnFlog"
            @click="addDialogFlog = true"
            type="primary"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="paramsManyList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  type="primary"
                  @close="tagClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="editDialogBtn(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="btnFlog"
            @click="addDialogFlog = true"
            type="primary"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="paramsOnlyList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  type="primary"
                  @close="tagClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="editDialogBtn(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性-参数对话框 -->
    <el-dialog
      :title="'添加' + title"
      :visible.sync="addDialogFlog"
      width="50%"
      @close="handleAddClose"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogFlog = false">取 消</el-button>
        <el-button type="primary" @click="commitAddForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + title"
      :visible.sync="editDialogFlog"
      width="50%"
      @close="handleEditClose"
    >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef">
        <el-form-item :label="editTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogFlog = false">取 消</el-button>
        <el-button type="primary" @click="commitEditForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      tabsActiveName: 'many',
      selectedCateKeys: [],
      paramsManyList: [],
      paramsOnlyList: [],
      addDialogFlog: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请填写参数', trigger: 'blur' }]
      },
      editDialogFlog: false,
      editForm: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.cateList = res.data
      console.log(res)
    },
    // 级联选择框改变值
    async cateCascaderChange() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.paramsManyList = []
        this.paramsOnlyList = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cat_id}/attributes`,
        {
          params: { sel: this.tabsActiveName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      res.data.forEach(element => {
        element.attr_vals = element.attr_vals
          ? element.attr_vals.split(' ')
          : []
        element.inputVisible = false
        element.inputValue = ''
      })
      if (this.tabsActiveName === 'many') {
        this.paramsManyList = res.data
      } else {
        this.paramsOnlyList = res.data
      }
      console.log(res)
    },
    // tabs 页签切换
    handleTabsClick() {
      this.cateCascaderChange()
    },
    // 添加对话框关闭事件
    handleAddClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交添加表单
    commitAddForm() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cat_id}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.tabsActiveName
          }
        )
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.cateCascaderChange()
        this.addDialogFlog = false
      })
    },
    // 修改对话框关闭事件
    handleEditClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改
    commitEditForm() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.cat_id}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.tabsActiveName }
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.cateCascaderChange()
        this.editDialogFlog = false
      })
    },
    // 打开编辑对话框
    async editDialogBtn(attrId) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cat_id}/attributes/${attrId}`,
        { params: { attr_sel: this.tabsActiveName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.editForm = res.data
      this.editDialogFlog = true
    },
    // 删除动态参数和静态属性
    async deleteParams(attrId) {
      const confirm = await this.$confirm('数据将永久删除', '删除提示', {
        type: 'warning',
        confirmButtonText: '确定',
        canselButtonText: '取消'
      })
      if (confirm !== 'confirm') return
      const { data: res } = await this.$http.delete(
        `categories/${this.cat_id}/attributes/${attrId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.cateCascaderChange()
    },
    // 动态添加tag标签
    async handleInputConfirm(scope) {
      const inputValue = scope.inputValue
      if (scope.inputValue.trim().length === 0) {
        scope.inputValue = ''
        scope.inputVisible = false
        return
      }
      scope.attr_vals.push(inputValue)
      scope.inputVisible = false
      scope.inputValue = ''
      this.saveAttr(scope)
    },
    // 修改参数的ajax
    async saveAttr(scope) {
      const { data: res } = await this.$http.put(
        `categories/${this.cat_id}/attributes/${scope.attr_id}`,
        {
          attr_name: scope.attr_name,
          attr_sel: scope.attr_sel,
          attr_vals: scope.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('属性修改失败')
      }
      this.$message.success('属性修改成功')
    },
    // tag标签，展示文本框
    showInput(scope) {
      scope.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag标签
    tagClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttr(row)
    }
  },
  computed: {
    // 判断是否是第三级分类
    btnFlog() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取分类id
    cat_id() {
      return this.selectedCateKeys[this.selectedCateKeys.length - 1]
    },
    // 添加属性标题
    title() {
      if (this.tabsActiveName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
    editTitle() {
      if (this.tabsActiveName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 30px;
  .el-alert {
    margin-bottom: 20px;
  }
  .el-tag {
    margin: 0 20px;
  }
  .el-input {
    width: 120px;
  }
}
</style>
