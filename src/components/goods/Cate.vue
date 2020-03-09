<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 新增分类按钮区 -->
      <el-row class="btnRow">
        <el-button type="primary" @click="addCateBtn">添加角色</el-button>
      </el-row>
      <!-- 表格区 -->
      <tree-table
        :data="cateList"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        :expand-type="false"
        :selection-type="false"
        :columns="columns"
      >
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted" style="color:lightgreen;" class="el-icon-success"></i>
          <i v-else style="color:red;" class="el-icon-error"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope>
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addDialogFlog" width="50%" close="addCateDialogClose">
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :props="cascaderProps"
            v-model="cascaderChoose"
            :options="cateParentForm"
            @change="addCateCascaderChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetAddCateForm">取 消</el-button>
          <el-button type="primary" @click="comitAddCateForm">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addDialogFlog: false,
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      addCateFrom: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      cateParentForm: [],
      cateList: [],
      cascaderChoose: [],
      total: 0,
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        // 自定义模板列
        {
          label: '是否有效',
          type: 'template', // 将该列定义为模板列
          template: 'isok' // 表示当列的模板名称
        },
        {
          label: '等级',
          type: 'template', // 将该列定义为模板列
          template: 'order' // 表示当列的模板名称
        },
        {
          label: '操作',
          type: 'template', // 将该列定义为模板列
          template: 'opt' // 表示当列的模板名称
        }
      ],
      addCateFromRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.total = res.data.total
      this.cateList = res.data.result
      console.log(res.data)
    },
    // 分页改变每页的条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 分页改变当前页
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },

    // 级联选择框值改变
    addCateCascaderChange() {
      if (this.cascaderChoose.length > 0) {
        this.addCateFrom.cat_pid = this.cascaderChoose[
          this.cascaderChoose.length - 1
        ]
        this.addCateFrom.cat_level = this.cascaderChoose.length
        console.log(this.cascaderChoose)
      } else {
        this.addCateFrom.cat_level = 0
        this.addCateFrom.cat_pid = 0
      }
    },
    // 添加按钮
    addCateBtn() {
      this.getParentCateList()
      this.addDialogFlog = true
    },
    // 获取所有父级元素
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.cateParentForm = res.data
    },
    // 表单提交按钮
    comitAddCateForm() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('信息填写有误')
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateFrom
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addDialogFlog = false
      })
    },
    // 表单重置按钮
    resetAddCateForm() {
      this.$refs.addCateFormRef.resetFields()
      this.cascaderChoose = []
      this.addCateFrom.cat_level = 0
      this.addCateFrom.cat_pid = 0
    },
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.cascaderChoose = []
      this.addCateFrom.cat_level = 0
      this.addCateFrom.cat_pid = 0
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin: 30px 0;
}
</style>
