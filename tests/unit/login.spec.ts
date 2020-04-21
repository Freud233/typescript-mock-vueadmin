// 1. 导入 vue/test-utils 
import { shallowMount } from '@vue/test-utils'
// 2. 导入被测试组件
import Login from '@/views/Login.vue'
// 3. 导入 chai 断言库
import { expect } from 'chai'

// 4. 创建一个测试
describe('Login.vue', () => {
  it('登录组件是否渲染', () => {
    const users = '登录'
    const wrapper = shallowMount(Login, {
      propsData: { users }
    })
    expect(wrapper.html()).to.include(users)
  })
  it('测试密码框点击事件是否切换成功', () => {
    const wrapper = shallowMount(Login)
    wrapper.find('.el-input__clear').trigger('click')
    expect(wrapper.html()).to.include('type="text"')
  })
})