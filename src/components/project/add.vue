<!--  -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="foods">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center> </el-alert>
      <el-steps :active="active - 0" finish-status="success" align-center>
        <el-step title="基础信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="goodslist"
        :rules="addrules"
        :label-position="labelPosition"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="active"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodslist.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="goodslist.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="goodslist.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="goodslist.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="selectGoogsList"
                :options="goodsListOption"
                :props="rules"
                @change="handlechange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="(item, index) in paramsLists"
              :key="index"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox
                  :label="items"
                  v-for="(items, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <div v-for="(item, index) in paramsList" :key="index">
              <el-form-item :label="item.attr_name">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="pigURL"
              list-type="picture"
              :headers="headerOBJ"
              :on-success="uploadSuccess"
              :on-remove="removepic"
              :on-preview="previewPics"
            >
              <el-button type="primary" size="small">上传图片</el-button>
            </el-upload>
            <el-dialog title="预览" :visible.sync="previewdia" @close="previewDiaClose">
              <el-image :src="previewPic">
               <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
                </div>
              </el-image>

            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="goodslist.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addgoodslist">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
     
      previewdia:false,
      //图片上传的路径
      pigURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      checked: true,
      //form表单的对其方式
      labelPosition: 'top',
      active: '0',
      tabPosition: 'left',
      goodslist: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        goods_introduce:'',
        pics:[],
        attrs:[]
      
        
      },
      //设置图片上传的请求头
      headerOBJ: {
        Authorization: window.sessionStorage.getItem('token')
      },

      //from表单校验规则
      addrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          {
            type: 'number',
            message: '价格只能是数字',
            trigger: 'blur',
            transform: value => Number(value)
          }
        ],
        goods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          {
            type: 'number',
            message: '数量只能是数字',
            trigger: 'blur',
            transform: value => Number(value)
          }
        ],
        goods_weight: [
          { required: true, message: '请输入重量', trigger: 'blur' },
          {
            type: 'number',
            message: '重量只能是数字',
            trigger: 'blur',
            transform: value => Number(value)
          }
        ]
      },
      //商品分类选择的值
      selectGoogsList: [],
      paramsList: [],
      paramsLists: [],
      //分类数据
      goodsListOption: [],
      foodsquery: {
        query: '',
        pagenum: '',
        pagesize: ''
      },
      //级联选择框的规则
      rules: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //定义图片数组
      pic: [],
      //预览的图片
      previewPic:'',
      //商品的id
      id:''
    }
  },
  created() {
    //获取商品的id
   this.id= this.$route.query.id
this.getEditorfood()
    this.getFoodList()
  },
  //定义计算属性
  computed: {
    activeName() {
      if (this.active == 1) {
        return 'many'
      } else if (this.active == 2) {
        return 'only'
      }
    }
  },

  methods: {
    //通过id获取编辑商品的信息
 async    getEditorfood(){
      const {data:res}=await this.$https.get(`goods/${this.id}`)
      if(res.meta.status===200){
       this.goodslist=res.data
      }
    },
    //添加商品
   async addgoodslist(){
      this.goodslist.attrs=this.paramsLists.concat(this.paramsList);
      this.goodslist.goods_cat=this.selectGoogsList.join(',')
      console.log(this.goodslist)
  const {data:res}=await this.$https.post('goods',this.goodslist);
if(res.meta.status==200){
  this.$message.success('商品添加成功')
  this.getFoodList();
}else{
  return this.$message.error('商品添加失败');
}
     
    },
    //图片上传成功的时候
    uploadSuccess(response, file, filelist) {
      //获取商品图片的虚拟路径
      this.goodslist.pics.push(response.data.tmp_path)

      
    },
    //图片移除
    removepic(file, filelist) {
      let filename = file.response.data.tmp_path
      this.goodslist.pics.forEach((item, index) => {
        if (item == filename) {
          this.goodslist.pics.splice(index, 1)
        }
      })
      
    },
    //图片预览
previewPics(file){
  this.previewdia=true;
  this.previewPic=file.response.data.url

},
//dialog关闭的时候
previewDiaClose(){
  this.previewdia=false
},
    //根据选择的商品分类进行属性的获取和参数的获取
    async getParams() {
      const { data: res } = await this.$https.get(
        `categories/${
          this.selectGoogsList[this.selectGoogsList.length - 1]
        }/attributes`,
        { params: { sel: this.activeName } }
      )
      //格式化数据
      if (this.active == 1) {
        res.data.forEach(item => {
          if (item.attr_vals != '') {
            item.attr_vals = item.attr_vals.split(',')
          } else {
            item.attr_vals = []
          }
        })
         this.paramsLists=res.data
      }
       this.paramsList=res.data
    },
    //卡片选中的时候判断分类是否选中，如果没有选中则不允许点击
    tabClick() {
      console.log(this.selectGoogsList.length)
      if (this.selectGoogsList.length === 0 && this.active != 0) {
        return this.$message.error('商品分类没有选择！')
        this.active = 0
      } else {
        if (this.active == 1 || this.active == 2) {
          this.getParams()
        }
      }
    },
    //获取分类的数据
    async getFoodList() {
      const { data: res } = await this.$https.get('categories')
      if (res.meta.status === 200) {
        this.goodsListOption = res.data
      } else {
        return this.$message.error('分类获取失败')
      }
    },
    handlechange() {
      console.log(this.selectGoogsList)
    }
  }
}
</script>
<style scoped>
.el-card {
  margin-top: 25px;
  margin-bottom: 25px;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>
