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
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag
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
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Card)
  .use(Table)
  .use(TableColumn)
  .use(Switch)
  .use(Tooltip)
  .use(Pagination)
  .use(Dialog)
  .use(Tag)
  // .use(Message)
  // 解决 message 自动弹出bug
  Vue.component(Message)
  Vue.prototype.$message = Message
  Vue.prototype.$confirm = MessageBox.confirm