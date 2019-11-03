<template>
   
    <el-container class="home-container">
   <!-- 头部 -->
   <el-header>
       <div>
           <img src="../assets/img/home.png" alt="">
           <span>电商管理系统</span>
       </div>
       <el-button type="info" @click="logoout">退出</el-button>
   </el-header>
  <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 侧边栏菜单区域 -->
        <div class="button-btn" @click="toogle">|||</div>
       <el-menu
       background-color="#333F4B"
       text-color="#fff"
       active-text-color="#409eff"
       unique-opened 
       :collapse="isCollapse"
       :collapse-transition="false"
       :default-active="activePath" 
       router>
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in  mesulist" :key="item.id">
          <!-- 一级菜单模板区域 -->
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconsObj[item.id]" class="icon"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
      
         <!-- 二级菜单 -->
          <el-menu-item :index="'/'+item.path" v-for="item in  item.children" :key="item.id" @click="saveNavState('/'+item.path)">
          <template slot="title">
            <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
          </el-menu-item>
     
      </el-submenu>
      
    </el-menu>
        
    </el-aside>
    <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
export default {
    data() {
        return {
           mesulist:[],
           iconsObj:{
               '125':'iconfont icon-users',
               '103':'iconfont icon-tijikongjian',
               '101':'iconfont icon-shangpin',
               '102':'iconfont icon-danju',
               '145':'iconfont icon-baobiao'
           },
           isCollapse:false,
           activePath:''
        };
    },
    created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('navPath')
    },
    methods: {
    logoout(){
    //清空token
    window.sessionStorage.clear()
    this.$router.push('/login')
    },
    getMenuList(){
        this.$http.get('menus').then((res)=>{
           
            if(res.data.meta.status!==200) return this.$message.error(res.meta.msg)
            this.mesulist=res.data.data
            //  console.log(this.mesulist)
        })
    },
    //点击实现切换
    toogle(){
        this.isCollapse=!this.isCollapse
    },
    saveNavState(navPath){
        window.sessionStorage.setItem('navPath',navPath)
        this.activePath=navPath
    }
    
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.home-container{
    height: 100%;
    .button-btn{
        background-color: #4a5064;
        text-align: center;
        letter-spacing: 0.2em;
        color: #fff;
        cursor: pointer;
        font-size: 10px;
        line-height: 24px;
    }
.el-header{
    background-color: #63ACF1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    >div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
       img{
        width: 60px;
        height: 60px;
    }  
    }
   
}
.el-aside{
    background-color: #333F4B;
    .el-menu{
        // box-sizing: border-box!important;
        border-right: 0
    }
}
.el-main{
    background-color: #FBFDFC;
}
.icon{
    margin-right: 10px;
}
}
</style>
