<!--  -->
<template>
  <div>
    <el-breadcrumb separator="/" class="roles_top">
      <el-breadcrumb-item :to="{ path: '/goods' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="params_card">
      <el-alert
        class="params_alert"
        type="warning"
        title="注意：只允许为第三级分类设置相关参数"
      ></el-alert>
      <div>
        选择商品分类：
        <el-cascader
          v-model="showSelectvalue"
          :options="gooslists"
          :props="props"
          @change="changeParams"
        ></el-cascader>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="only">
            <el-button type="primary" :disabled="isBtnDisable" @click="dialogVisible=true">
              添加参数
            </el-button>
            <el-table
              :data="paramlists"
              border
              :show-header="true"
              style="width:100%;"
            >
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column type="expand" label="#">
                <template slot-scope="scope">
                  <el-tag type="success" closable
                    >{{ scope.row.arr_name }}{{ scope.row.attr_vals }}</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label="参数名" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作"> </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 添加动态参数 -->
          <el-dialog :title=" '添加'+isTitle" :visible.sync="dialogVisible" width="40%;">
           <el-form :model="paramsAdd"  label-width="80px">
             <el-form-item  :label="isTitle">
             
               <el-input placeholder="输入属性内容" v-model="paramsAdd.params"></el-input>
             </el-form-item>
           </el-form>
          </el-dialog>
          <el-tab-pane label="静态属性" name="many">
            <el-button type="primary" :disabled="isBtnDisable" @click="dialogVisible=true">
              添加属性
            </el-button>
            <el-table
              :data="paramMarylists"
              border
              :show-header="true"
              style="width:100%;"
            >
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column type="expand" label="#">
                <template slot-scope="scope">
                  <el-tag type="success" closable
                    >{{ scope.row.arr_name }}{{ scope.row.attr_vals }}</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label="参数名" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作"> </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 添加静态属性 -->
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paramsAdd:{
        params:''
      },
      dialogVisible:false,
     
      gooslists: [], //选中的值
      showSelectvalue: [],
      //定义规则和子选项的规则
      props: {
        children: 'children',
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover'
      },
      //tab默认选中、
      activeName: 'only',
      paramlists: [],
      paramMarylists:[]
    }
  },
  created() {
    this.getparamsList()
  },
  computed: {
    isBtnDisable() {
      if (this.showSelectvalue.length !== 3) {
        return true
      } else {
        return false
      }
    },
    isTitle(){
      if(this.activeName=='only'){
        return '动态属性'
      }else{
        return '静态属性'
      }
    }
  },
  methods: {
    //获取分类列表数据
    async getparamsList() {
      const { data: res } = await this.$https.get('categories', {
        parsms: { type: 3 }
      })

      if (res.meta.status === 200) {
        this.$message.success('分类获取成功')
        this.gooslists = res.data
        console.log(this.gooslists)
      } else {
        return this.$message.error('分类获取失败')
      }
    },
    //分类选择改变时
    async changeParams() {
      this.getparams()
    }, //tab切换
    handleClick(tab, event) {
      console.log(tab.name)
      this.activeName=tab.name
    }
    , async getparams() {
    console.log(this.showSelectvalue[this.showSelectvalue.length - 1])
    const { data: res } = await this.$https.get(
      `categories/${
        this.showSelectvalue[this.showSelectvalue.length - 1]
      }/attributes`,
      { params: { sel: this.activeName } }
    )
    if (res.meta.status === 200) {
      console.log(res.data)
      if (this.activeName === 'only') {
        this.paramlists = res.data
      } else {
        this.paramMarylists = res.data
      }
    }
  }
  },
 
 
}
</script>
<style scoped>
.params_card {
  margin-top: 25px;
}
.params_alert {
}
</style>
