<!--  -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--主体区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12"
          ><div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              v-model="userInfo.query"
              clearable
              @clear="cleardata"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getFilterUsers"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="dialogVisible = true"
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>

      <div>
        <!-- 添加用户的弹框 -->
        <!--弹框的头部信息 -->
        <el-dialog title="人员信息" :visible.sync="dialogVisible" width="30%">
            <!-- 弹框主体 -->
          <el-form
            :model="ruleForm"
            
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="emial">
              <el-input v-model="ruleForm.emial"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
          </el-form>


         
          <!-- 弹框尾部信息 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="adduser"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <template>
          <el-table
            :data="userList"
            style="width: 100%"
            :show-header="true"
            border
          >
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="role_name" label="角色" align="center">
            </el-table-column>
            <el-table-column prop="username" label="登录名" align="center">
            </el-table-column>
            <el-table-column prop="create_time" label="创建日期" align="center">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" align="center">
            </el-table-column>
            <el-table-column prop="embile" label="邮箱" align="center">
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope"
                ><el-switch
                  v-model="scope.row.mg_state"
                  @change="changeUserStatus(scope.row)"
                >
                </el-switch
              ></template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
              <template slot-scope="scope">
                <el-tooltip content="编辑">
                  <el-button
                    type="primary"
                    @click="changeUser(scope.row.id)"
                    size="small"
                    >编辑</el-button
                  >
                </el-tooltip>
               
                  <el-tooltip content="删除" :enterable="false">
                    <el-button
                      type="danger"
                      size="small"
                      @click="deleteUser(scope.row)"
                      >删除</el-button
                    >
                  </el-tooltip>
        

                <el-tooltip content="分配权限" >
                  <el-button type="warning" size="small" @click="getcurrentUserRole(scope.row)"
                    >分配权限</el-button
                  ></el-tooltip
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <!-- 分权页面 -->
      <el-dialog
  title="分配权限"
  :visible.sync="dialogVisibles"
  width="40%"
  >
 <div>
   <p>人员名称: {{currentObj.username}}</p>
   <p>
     角色名称:{{currentObj.role_name}}
   </p>

<template>
  新角色:
  <el-select v-model="value" placeholder="请选择" >
    <el-option
      v-for="item in allrolelist"
      :key="item.id"
      :label="item.roleName"
      :value="item.id"
      >
    </el-option>
  </el-select>
</template>
 </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibles = false">取 消</el-button>
    <el-button type="primary" @click="sureNewRole">确 定</el-button>
  </span>
</el-dialog>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="userInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },

  data() {
    return {
      currentROLE:{},
      value:'',
      dialogVisibles:false,
      ruleForm:{
        username:'',
        password:'',
        emial:'',
        mobile:''
      },
     currentObj:{
       username:'',
       role_name:''
     },

      userList: [],
      dialogVisible: false,
      userInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      allrolelist:[]
    }
  },
  methods: {
    //添加用户
   async adduser(){
      const {data:res}=  await this.$https.post(`users`,this.ruleForm);
      if(res.meta.status==201){
        this.$message.success('用户添加成功')
        
      }else{
        return this.$message.error('用户添加失败！')
      }
      this.ruleForm={
        username:'',
        password:'',
        emial:'',
        mobile:''
      }
   
       this.dialogVisible = false
        this.getUserList()
    },
  
    //修改用户的权限
   async  sureNewRole(){
     console.log(this.value)
const {data:res}=  await this.$https.put(`users/${this.currentROLE.id}/role`,{rid:this.value});
//console.log(res)
  this.getUserList()
     this.dialogVisibles=false;
     this.value=''
    },
    //获取所有的角色
    async getAllRoleList(){
     
const {data:res}=  await this.$https.get(`roles`);
this.allrolelist=res.data;
console.log(res)

    },
    //获取当前用户的角色
    getcurrentUserRole(role){
      this.currentROLE=role;
      console.log(role)
    this.dialogVisibles=true;
    // const {data:res}=  await this.$https.get(`roles/${role.id}`)
    // console.log(res)
    this.currentObj=role;
    this.getAllRoleList();

    },
    //删除人员
    async deleteUser(people) {
      const { data: res } = await this.$https.delete(`users/${people.id}`)
      if (res.meta.status == 200) {
        this.$message.success('人员删除成功')
        this.getUserList()
      } else {
        return this.$message.error('人员删除失败')
      }
    },
    cleardata() {
      this.getUserList()
    },
    //搜索人员
    getFilterUsers() {
      this.getUserList()
    },
    //修改人员状态的值。
    async changeUserStatus(status) {
      console.log(status)
      //发送请求，修改人员的信息
      const { data: res } = await this.$https.put(
        `users/${status.id}/state/${status.mg_state}`
      )
      console.log(res)
      if (res.meta.status == 200) {
        this.$message.success('人员状态修改成功')
        //重新获取人员的列表
        this.getUserList()
      } else {
        this.$message.error('人员状态修改失败！')
        status.mg_state = !satatus.mg_state
        return
      }
    },
    //发送请求获取用户列表的数据
    async getUserList() {
      const { data: meta } = await this.$https.get('users', {
        params: this.userInfo
      })
      //判断如果过去数据成功择进行赋值操作
      if (meta.meta.status == '200') {
        console.log(meta)
        this.userList = meta.data.users
        this.total = meta.data.total
      } else {
        return this.$message.error('数据获取失败')
      }
    },
    //页码显示条数改变时触发
    handleSizeChange(newSize) {
      this.userInfo.pagesize = newSize
      this.getUserList()
    },
    //当前页码改变时触发
    handleCurrentChange(newpage) {
      this.userInfo.pagenum = newpage
      this.getUserList()
    }
  }
}
</script>
<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.box-card {
  box-shadow: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 20px;
}
 .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
