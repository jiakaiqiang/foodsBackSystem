<!--  -->
<template>
  <div class="conter-login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!--登录组件-->
      <el-form
        label-width="60px"

        :rules="ruless"
        class="login_form"
        ref="loginformRef"
      >

          <el-input
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input

            show-password
            v-model="loginform.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="loginfsdfa_btn">
                <el-button type="info" @click="onResetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <template>

</template>
  </div>
</template>

<script>
export default {
   data() {
    return {
      loginform: {
        username: "admin",
        password: "123456"
      },
      ruless: {
        username: [

          {
            min: 3,
            max: 10,
            message: "长度在3-1dsfsdaf0之间",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: false,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 10,
            message: "长度在4-10个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //消息提示信息

    onResetLogin() {
      console.log(this);
      //通过ref绑定from表单的实例然后在通过$Refs获取实例，调用重置的方法即可
      this.$refs.loginformRef.resetFields();
      this.loginform = {
        username: "",
        password: ""
      };
    },
    //表单的预验证,通过表单中的实例validate进行表单的预验证，其实回调函数中的丢一个参数是，判断验证是否通过，参数值为boolean类型

   async login() {
      console.log(this.loginform)
       let data=await this.$https.post('login',this.loginform,);
       console.log(data.data.data);
       //对于请求过来的数据进行实话
      if(data.data.meta.status==200){
        //将返回过来的token值保存到session中，用于其他页面的使用
        window.sessionStorage.setItem('token',data.data.data.token);
        //登录成功后我们将访问系统
        this.$router.push('/home')
      this.$message({
          message: '登录成功！',
          type: 'success',
          duration:1000
        });
      }else{
      this.$message({
          message: '用户名或者密码不正确！',
          type: 'error',
          duration:1000
        });
      }


     ///发送登录请求数据
      //this.$refs.loginformRef.validate((valid)=>{
      //通过判断data的值，我们可以获取到表单中验证是否通过，通过的话则发送请求、、
      //console.log(valid)
      //})
    }
  }
};
</script>
<style scoped>
.conter-login {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  height: 300px;
  width: 450px;
  position: absolute;
  background-color: #eee;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid silver;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: -65px;
  transform: translate(-50%, 0);
  box-shadow: 0 0 10px #ddd;
  padding: 10px;
  background-color: #fff;
}
.avatar_box > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
/* 登录组件 */
.login_btn {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  padding: 0 20px;
  width: 100%;
  position: absolute;
  bottom: 0px;
  box-sizing: border-box;
}
</style>
