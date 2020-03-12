<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- alert警告区 -->
      <el-alert title="添加商品信息" center type="info" show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="stepsActive-0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs页签区 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        label-position="top"
        ref="addGoodsFormRef"
        hide-required-asterisk
      >
        <el-tabs
          @tab-click="tabsClick"
          stretch
          tab-position="left"
          :before-leave="tabsCheckout"
          v-model="stepsActive"
        >
          <!-- 商品信息 -->
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight "></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="name">
              <!-- 连级选择器 -->
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="goodsCateList"
                :props="goodsCascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane name="1" label="商品参数">
            <el-form-item :label="item.attr_name" v-for="item in goodsManyList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(iten2,i) in item.attr_vals" :key="i" :label="iten2"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品实行 -->
          <el-tab-pane name="2" label="商品属性">
            <el-form-item :label="item.attr_name" v-for="item in goodsOnlyList" :key="item.cat_id">
              <el-input v-model="item.attr_vals" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane name="3" label="商品图片">
            <el-form-item>
              <el-upload
                class="upload-demo"
                :headers="headersopj"
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :on-success="handleSuccess"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor v-model="addGoodsForm.goods_introduce" />
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览窗口 -->
    <el-dialog title="提示" :visible.sync="imgdialogVisible" width="50%" :before-close="handleClose">
      <img :src="imgsrcdialogVisible" width="100%" height="100%" alt />
    </el-dialog>
  </div>
</template>
<script>
// 安装深拷贝包
import _ from 'lodash'
export default {
  data() {
    return {
      headersopj: { Authorization: window.sessionStorage.getItem('token') },
      stepsActive: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      imgdialogVisible: false,
      imgsrcdialogVisible: '',
      goodsCateList: [],
      goodsManyList: [],
      goodsOnlyList: [],
      goodsCascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    goodsCateId() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        return []
      }
      return this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1]
    }
  },
  created() {
    this.getGoodsCateList()
  },
  methods: {
    async getGoodsCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.goodsCateList = res.data
      console.log(res)
    },
    // 选择器数值改变
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        return (this.addGoodsForm.goods_cat = [])
      }
    },
    // 标签页组织切换
    tabsCheckout(to, from) {
      if (from === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先填写商品信息')
        return false
      }
    },
    // 标签页被选中
    async tabsClick() {
      if (this.stepsActive === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.goodsCateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }

        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.goodsManyList = res.data
        console.log(res.data)
      }
      if (this.stepsActive === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.goodsCateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }

        this.goodsOnlyList = res.data
        console.log(res.data)
      }
    },
    // 预览图片
    handlePreview(file) {
      console.log(file)
      this.imgsrcdialogVisible = file.response.data.url
      this.imgdialogVisible = true
    },
    // 关闭预览窗口
    handleClose() {
      this.imgdialogVisible = false
      this.imgsrcdialogVisible = ''
    },
    // 关闭图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex(x => {
        x.pic = filePath
      })
      this.addGoodsForm.pics.splice(index, 1)
    },
    // 图片上传成功
    handleSuccess(response) {
      const tmpPath = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(tmpPath)
      console.log(response)
    },
    // 新建商品
    add() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) return
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        this.goodsManyList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        this.goodsOnlyList.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodsForm.attrs.push(newInfo)
        })
        form.attrs = this.addGoodsForm.attrs
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('goods')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 30px;
}
.el-steps {
  margin-top: 30px;
}
.el-tab {
  height: fit-content !important;
}
</style>
