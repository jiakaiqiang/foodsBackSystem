<!--这是系统的首页  -->
<template>
  <el-container class="container_home">
    <!-- 头部区域 -->
    <el-header class="header_home">
      <div class="header_logo">
        <div>
          <img src="../assets/imgs/heima.png" alt="">
        </div>
        <div>商品后台管理系统</div>
      </div>
      <div>
        <el-button type="info" @click="exitHome"> 退出</el-button>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="istoolge?'64px':'200px'">
        <!-- 菜单折叠 -->
        <div class="aside_toogle" v-on:click="toogleCollasp">|||</div>
       <!-- 菜单主体 -->

<el-menu
      
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b" unique-opened :collapse="istoolge" :collapse-transition="false" router :default-active="activePath">
      <!-- 第一菜单列 -->
      <el-submenu :index="'/home/'+item.path"   v-for="item in asideList" :key="item.id">
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-location"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item :index="'/'+items.path" v-for="items in item.children" :key="items.id" v-on:click="activePaths(items.path)">{{items.authName}}</el-menu-item>
      </el-submenu>
     
      
    </el-menu>


      </el-aside>
      <!-- 主体区域 -->
      
      <el-main>
         



         <router-view></router-view>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created(){

this.activePath=window.sessionStorage.getItem('path');
//页面加载的时候发送请求
this.getSidedta();
  },
  methods:{
    //点击的时候高亮显示
    activePaths(a){
    
      window.sessionStorage.setItem('path','/'+a);
    },
    //退出系统
    exitHome(){
//获取token
window.sessionStorage.clear('token');
//然后页面跳转
this.$router.push('/login')

    },

     //侧边栏隐藏
    toogleCollasp(){
      this.istoolge=!this.istoolge;

    },
    //获取侧面栏的数据
    getSidedta: async function(){
     let {data:mes}= await this.$https.get('menus');
     console.log(mes);
//获取数据
this.asideList=mes.data;
    },
   
  }
,
  data() {
    return {
      asideList:[],
      istoolge:false,
      activePath:''
    }
  }
}
</script>
<style scoped>
.header_logo{
  display:flex;
  align-items: center;
  
}
.header_logo div:last-child{
  font-size:20px;
   color:white;
}
.el-menu{
  border-right: 0px;
}
.header_home{
  display: flex;
  justify-content:space-between;
  align-items:center
}
.el-header{
  padding-left:0px;
  background-color: #373d41;
}
.el-aside{
  background-color: #333744;
}
.el-main{
background-color: #eaedf1;
}
.container_home{
  height:100%;
}
.aside_toogle{
  width:100%;
  text-align: center;
  font-size:20px;
  color:white;
}
</style>
