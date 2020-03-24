import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Row,
  Col,
  Message
} from 'element-ui'
Vue.use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Row)
  .use(Col)
  // .use(Message)
  Vue.component(Message)
  Vue.prototype.$message = Message