<template>
  <div class="add-goods">
    <el-card>
      <!-- 步骤条 -->
      <el-steps :active="active - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品价格"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <el-form
        :model="goodsParams"
        :rules="goodsParamsRules"
        ref="goodsParamsRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- tabs -->
        <el-tabs tab-position="left" v-model="active" :before-leave="handleBeforeLeaveTabs">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品参数" prop="goods_name">
              <el-input v-model="goodsParams.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="goodsParams.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="goodsParams.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_weight">
              <el-input type="number" v-model="goodsParams.goods_weight"></el-input>
            </el-form-item>
            <el-form-item>
              <el-cascader
                v-model="goodsParams.goods_cat"
                :options="cateList"
                :props="cateListProps"
                @change="cateHandleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique eius ea consequuntur accusantium iste minima vel, omnis natus voluptates tempora? Tenetur id repellat ea maiores fugit iure, modi quos molestiae.</el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit error dicta iusto, laborum mollitia rerum omnis, ea nam a veritatis illum optio ipsa dignissimos. Eaque iste quibusdam earum ullam dolores!</el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              :headers="upLoadHeader"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="goodsParams.goods_introduce"
              ref="myQuillEditor"
              :options="editorOption"
              @focus="onEditorFocus($event)"
              @blur="onEditorBlur($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
            <!-- 提交商品按钮 -->
            <el-button type="warning" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 上传图片的预览 -->
    <el-dialog title="提示" :visible.sync="upLoadDialogVisible" width="50%">
      <img :src="uploadSrc" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class AddGoods extends Vue {
  // 商品分类
  private cateList = []
  private active = '0'
  private goodsParams = {
    goods_name: '123',
    goods_price: 0,
    goods_number: 0,
    goods_weight: 0,
    goods_cat: [],
    goods_introduce: '',
    attrs: [],
    pics: {}
  }
  private goodsParamsRules = {
    goods_name: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ]
  }
  private cateListProps = {
    expandTrigger: 'hover',
    value: 'cat_id',
    label: 'cat_name'
  }
  private fileList = []
  // 上传图片的header
  private upLoadHeader = {
    Authorization: sessionStorage.getItem('token') || ''
  }
  private uploadSrc = ''
  private upLoadDialogVisible = false
  private created() {
    this.getCateList()
  }
  private content = ''
  private editorOption = {
    'theme': 'snow',
  }

  // 获取所有分类数据
  private async getCateList() {
    const { data } = await (this as any).$http.get('categories')
    console.log(data)
    this.cateList = data.data
  }
  private cateHandleChange() {
    if (this.goodsParams.goods_cat.length !== 3) {
      this.goodsParams.goods_cat = []
    }
    if (this.goodsParams.goods_cat.length === 3) {
      this.active = '1'
    }
  }
  // tabs 切换之前
  private handleBeforeLeaveTabs(n: string, o: string) {
    console.log(n, o)
    if (this.goodsParams.goods_cat.length !== 3 && o === '0') {
      this.$message.error('请选择三级分类')
      return false
    }
  }
  private handlePreview(file: any) {
    this.uploadSrc = file.url
    this.upLoadDialogVisible = true
    console.log(file)
  }
  private handleRemove(file: object) {
    console.log(file)
  }
  private handleSuccess(file: object) {
    console.log(file, 'onSuccess')
  }
  onEditorBlur(quill: object) {
    console.log('editor blur!', quill)
  }
  onEditorFocus(quill: object) {
    console.log('editor focus!', quill)
  }
  onEditorReady(quill: object) {
    console.log('editor ready!', quill)
  }
  onEditorChange({ quill, html, text }: any) {
    console.log('editor change!', quill, html, text)
    this.content = html
  }
  // 添加商品
  private addGoods () {
    const arr = JSON.parse(JSON.stringify(this.goodsParams))
    arr.goods_cat = arr.goods_cat.join(',')
    console.log(arr);
    console.log(this.goodsParams, 'this.goodsParams');
  }
}
</script>

<style lang="less" scoped>
.add-goods /deep/ .el-step__title {
  text-align: center;
}

.quill-editor /deep/ .ql-container{
  min-height: 300px;
}
</style>
