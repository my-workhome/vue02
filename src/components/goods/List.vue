<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框和添加按钮 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" @clear="serachClear" clearable v-model="queryInfo.query">
            <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGood">新增商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="goodsList.goods" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column width="400px" label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button
              type="danger"
              @click="deleteGoods(scope.row.goods_id)"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodsList: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.total = res.data.total
      this.goodsList = res.data
      console.log(res)
      console.log(this.total)
    },
    // 搜索按钮
    search() {
      console.log('点击')
      this.getGoodsList()
    },
    // 清楚搜索
    serachClear() {
      this.queryInfo.query = ''
      this.getGoodsList()
    },
    // 分页，每页数量改变
    handleSizeChange(newPage) {
      this.queryInfo.pagesize = newPage
      this.getGoodsList()
    },
    // 分页页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    async deleteGoods(goodsId) {
      const confirmChoose = await this.$confirm(
        '是否确认删除该商品',
        '删除提醒',
        {
          type: 'warning',
          confrimButtonText: '确定',
          cancelButtonText: '取消'
        }
      ).catch(err => err)
      if (confirmChoose !== 'confirm') {
        return this.$message.warning('用户取消删除')
      }
      const { data: res } = await this.$http.delete(`goods/${goodsId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsList()
      console.log(res)
    },
    // 添加商品按钮
    goAddGood() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 30px;
  .el-row {
    .el-col {
      margin: 0 10px;
    }
  }
  .el-table {
    margin-top: 20px;
  }
}
</style>
