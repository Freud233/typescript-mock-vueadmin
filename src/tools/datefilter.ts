import Vue from 'vue'
Vue.filter('date', (val: number) => {
  if (!val) return ''
  const d = new Date(val)
  const yy = d.getFullYear()
  const mm = (d.getMonth() + '1').padStart(2, '0')
  const dd = (d.getDate() + '').padStart(2, '0')
  const hours = (d.getHours() + '').padStart(2, '0')
  const minutes = (d.getMinutes() + '').padStart(2, '0')
  const seconds = (d.getSeconds() + '').padStart(2, '0')
  return (`${yy}-${mm}-${dd} ${hours}:${minutes}:${seconds}`)
})