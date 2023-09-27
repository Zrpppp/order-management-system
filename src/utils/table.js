/**
 * 获取表格选中的数据
 * @param action 操作
 * @param object 操作对象
 * @returns {ElNotificationComponent|*[]}
 */
export function getCheckboxRecordsEvent(action, object) {
  if (this.$refs.table.getCheckboxRecords(1) < 1) return this.$notify.error({
    title: '提示',
    message: '请选择要' + action + '的' + object,
    position: 'bottom-left'
  })
  let ids = []
  this.$refs.table.getCheckboxRecords(1).map(item => ids.push(item.id))
  return ids
}
