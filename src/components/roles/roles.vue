<!--  -->
<template>
  <div>
   <el-breadcrumb separator="/" class="roles_top">
      <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
 <el-table
            :data="rolesList"
            style="width: 100%"
            :show-header="true"
            border
          >
           <el-table-column type="index"></el-table-column>
            <el-table-column prop="authName" label="权限名称" align="center">
            </el-table-column>
            <el-table-column prop="path" label="路径" align="center">
            </el-table-column>
            <el-table-column  label="权限等级" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" v-show="scope.row.level==0">标签二</el-tag>
                    <el-tag type="info" v-show="scope.row.level==1">标签三</el-tag>
                    <el-tag type="warning" v-show="scope.row.level==2">标签四</el-tag>
                </template>
            </el-table-column>
 </el-table>
    </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
        rolesList:[]
    };
  },
created(){
    this.getRoules();
},
  

  methods: {
    //获取权限列表
     async getRoules(){
    const {data:res} =   await this.$https.get(`rights/list`);
    if(!res.meta.status==200){
return this.$message.error('权限列表获取失败！')
    }else{
this.$message.success('权限列表获取成功！')
this.rolesList=res.data
console.log(this.rolesList)
    }
    }
  }
}

</script>
<style  scoped>
.roles_top{
margin-bottom:25px;
}
</style>