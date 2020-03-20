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