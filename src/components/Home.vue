<template>
  <el-container>
    <el-header height="80px">
      <div>
        <img src="../assets/heima.png" alt="" /><span>电商后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapseFlag ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleButton">
          |||
        </div>
        <el-menu
          background-color="#220101"
          text-color="#ffffff"
          active-text-color="#0e1575"
          unique-opened
          :collapse="collapseFlag"
          :collapse-transition="false"
          router
          :default-active="defaultActive"
          @select="menuSelect"
        >
          <el-submenu
            v-for="item in menuList"
            :key="item.id"
            :index="'/' + item.path"
          >
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 一级菜单图标 -->
              <i :class="iconListCp[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + chitem.path"
              v-for="chitem in item.children"
              :key="chitem.id"
            >
              <template slot="title">
                <!-- 二级菜单图标 -->
                <i class="el-icon-menu"></i>
                <span>{{ chitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      defaultActive: '',
      collapseFlag: false,
      menuList: [],
      iconList: [
        'iconfont icon-user',
        'iconfont icon-tijikongjian',
        'iconfont icon-3702mima',
        'iconfont icon-danju',
        'iconfont icon-baobiao'
      ]
    }
  },
  created() {
    this.getMenuList()
    this.defaultActive = window.sessionStorage.getItem('selectPath')
  },
  methods: {
    menuSelect(index, path) {
      window.sessionStorage.setItem('selectPath', index)
      this.defaultActive = window.sessionStorage.getItem('selectPath')
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message({ message: res.meta.msg, type: 'warning' })
      }
      this.menuList = res.data
      console.log(res)
    },
    toggleButton() {
      this.collapseFlag = !this.collapseFlag
    }
  },
  computed: {
    iconListCp: function() {
      var arr = {}
      this.menuList.forEach((item, index) => {
        arr[item.id] = this.iconList[index]
      })
      return arr
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.el-header {
  background-color: #000000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > div {
    text-align: center;
    display: flex;
    align-items: center;
    > span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #220101;
  color: white;
  .el-menu {
    border: none;
  }
  .toggle-button {
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
    color: white;
    font-size: 10px;
    line-height: 24px;
    background-color: #5f1010;
  }
}
.el-main {
  background-color: white;
  color: black;
}
</style>
