import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Row,
  Col,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup
} from 'element-ui'
Vue.use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Row)
  .use(Col)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(MenuItemGroup)
  // .use(Message)
  // 解决 message 自动弹出bug
  Vue.component(Message)
  Vue.prototype.$message = Message