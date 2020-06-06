<!--  -->
<template>
  <div>
    <el-breadcrumb separator="/" class="roles_top">
      <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table
        :data="rolesList"
        style="width: 100%"
        :show-header="true"
        border
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :gutter="20"
              v-for="(item1, index) in scope.row.children"
              :key="index" :class="['roles_border', 'row',index==0?'top':'']"
            >
         
              <el-col :span="5">
                <el-tag type="success" class="index_tag" closable @close="deleteRoles(scope.row,item1.id)">
                  {{ item1.authName }}
                </el-tag>
                 <i class="el-icon-caret-right"></i>
              </el-col>
             <el-col :span='19'>
  
                <el-row  :gutter="20"  v-for="(item2,index) in item1.children" :key="item2.id" :class="['roles_border', 'row',index==0?'top':'']" >
                 <el-col :span='12'>
                    <el-tag type="danager" class="index_tag" closable @close="deleteRoles(scope.row,item2.id)">
                    {{ item2.authName }}
                      <i class="el-icon-caret-right"></i>
                  </el-tag>
                
                 </el-col>
                  <el-col :span="12">
               
                  <el-tag type="success" class="index_tag" v-for="item3 in item2.children" :key="item3.id"  closable @close="deleteRoles(scope.row,item3.id)">
                    {{ item3.authName }}
                     <i class="el-icon-caret-right"></i>
                  </el-tag>
              
              </el-col>
                </el-row>

            
             
             </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary">编辑</el-button>
            <el-button type="warning">删除</el-button>
            <el-button type="danger" @click="setRoules(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配佩权限的弹框 -->
      <el-dialog
  title="权限列表"
  :visible.sync="dialogVisible"
  width="40%"
  @close="handleClose">
  <el-tree :data="datalist" :props="defaultProps"    show-checkbox   node-key="id"  ref="treeREF" :default-checked-keys='dfkeys' :default-expanded-keys="dfkeys"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sureSetRoules">确 定</el-button>
  </span>
</el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
     
      dialogVisible:false,
      roleID:0,
      expend: 'expend',
      rolesList: [],
      datalist: [],
      defaultProps: {
          children: 'children',
          label: 'authName'
        },
        dfkeys:[],
    }
  },

  created() {
    this.getRoulesList();

  },
  methods: {
    //确认设置权限
   async  sureSetRoules(){
      const arr=[...this.$refs.treeREF.getCheckedKeys(),...this.$refs.treeREF.getHalfCheckedKeys()].join(',')
    const{data:res}=  await this.$https.post(`roles/${this.roleID}/rights`,{rids:arr})
    ///console.log([...this.$refs.treeREF.getCheckedKeys(),...this.$refs.treeREF.getHalfCheckedKeys()])
console.log(res);
this.getRoulesList();
this.dialogVisible=false;
    },
    //获取所有权限列表
    async getRulesList(){
      const {data:res}=   await this.$https.get(`rights/tree`);
    if(res.meta.status!==200){
      return this.$message.error("权限列表获取失败！"
      )
    }else{
      this.datalist=res.data
    }

        
    },
    //弹框关闭的时候执行的操作
    handleClose(){
    this.dfkeys=[]
     this.dialogVisible=false;
    },
    

    //为角色设置分配权限
     setRoules(role){
      this.roleID=role.id;
       console.log(this.dfkeys);
      this.getAll(role,this.dfkeys);
    this.dialogVisible=true;
    //获取所以的权限列表
    this.getRulesList();
  //将已有的权限渲染到树结构中
    
    
  
   

    },
    getAll(role,arrs){
      console.log(arrs)
    //   console.log('fff',role)
    //  role.forEach((item)=>{
    //   arr.push(item.id)
    //   if(item.children.length!=0){
    //     getAll(arr,item.children);
    //   }


    //  })
    // return arr;
    if(!role.children){
      return arrs.push(role.id)
    }
    role.children.forEach((item)=>{
      this.getAll(item,arrs)
    })
    },

  //删除权限
  
  async deleteRoles(roles,roleid){
    
    console.log(roles.id,roleid)
    // const ss=  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //        distinguishCancelAndClose: true,
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!',
          
    //       });
    //     }).catch((action) => {

    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除',
        
    //       });  
    //       if(action=='cancel'||'close'){
    //         return ;
    //       }       });
        
   const {data:res}=await this.$https.delete(`roles/${roles.id}/rights/${roleid}`);
   console.log(res);
   if(res.meta.status===200){
     this.$message.success('权限删除成功！');
     //将当前服务器返回的数据赋给当前的对象
     roles.children=res.data;
   }else{
     this.$message.error('权限删除失败！')
     this.rolesList=res.data;
   }





  },
    //获取角色列表
    async getRoulesList() {
      const { data: res } = await this.$https.get('roles')
      console.log(res)
      this.rolesList = res.data
    }
  }
}
</script>
<style scoped>
.roles_top {
  margin-bottom: 25px;
}
.el-button {
  margin-bottom: 20px;
}
.index_tag {
  margin-top: 10px;
  margin-right:20px;

}
.roles_border{
  border-top:1px solid silver;
}
.top{
  border-top:0px ;

}
.row{
  display:flex;
  justify-content: space-between;
  align-items: center;
}
</style>
