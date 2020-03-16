<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="orderlist" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.oerder_pay" type="danger">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" @click="showAddrsDialog" icon="el-icon-edit" circle></el-button>
            <el-button type="success" @click="progressDialog" icon="el-icon-location" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 3, 7, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址弹出框 -->
    <el-dialog title="修改地址" :visible.sync="addrsDialogFormVisible" @close="addrsDialogClose">
      <el-form :model="addrsForm" ref="addrsFormRef">
        <el-form-item label="活动名称">
          <el-cascader v-model="addrsForm.city" :options="cityData" @change="addrsCheckedChange"></el-cascader>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-input v-model="addrsForm.detailAddrs" placeholder="请填写详细地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info">取消</el-button>
          <el-button type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressFormVisible" @close="progressDialogClose">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(item, index) in progressList"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      addrsDialogFormVisible: false,
      progressFormVisible: false,
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      addrsForm: {
        city: [],
        detailAddrs: ''
      },
      progressList: [],
      total: 0,
      orderlist: [],
      cityData
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryinfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    // 分页页码改变
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage
      this.getOrderList()
    },
    // 分页，每页条数改变
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize
      this.getOrderList()
    },
    // 修改地址对话框
    showAddrsDialog() {
      this.addrsDialogFormVisible = true
    },
    // 地址选择改变
    addrsCheckedChange() {},
    // 添加地址对话框关闭事件
    addrsDialogClose() {
      this.addrsForm.city = []
      this.addrsForm.detailAddrs = ''
      this.$refs.addrsFormRef.resetFields()
    },
    // 物流进度对话框关闭事件
    progressDialogClose() {},
    // 点击物流查询按钮
    async progressDialog() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败')
      }
      console.log(res)
      this.progressList = res.data
      this.progressFormVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 30px;
  .el-pagination {
    margin-top: 30px;
  }
}
</style>
