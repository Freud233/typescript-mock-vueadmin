# vueadmin-mock-ts

## 遇到的问题
1. 组件中定义数据的报错 
`Type string trivially inferred from a string literal, remove type annotation (no-inferrable-types)`
```js
// 在tsconfig.json 关闭类型推断
// 关闭类型推断
 "no-inferrable-types": [
   true,
   "ignore-params",
   "ignore-properties"
 ]
 ```
 2. 代码格式化问题
 ```js
 编辑器自带的格式化会自动为双引号(与 eslint 冲突)
//  在根目录中 添加 .prettierrc 文件
{
  "semi": false,
  "singleQuote": true
}
 ```
 3. Cate 中的表格用插件
 + vue-table-with-tree-grid