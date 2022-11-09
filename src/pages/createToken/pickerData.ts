import type { PickerColumn } from 'antd-mobile/es/components/picker'

const formatNum = (num: number) => num < 10 ? ('0' + num) : ('' + num);

const hourList: PickerColumn = [];
for(let i = 0; i < 12; i++) {
  hourList.push({
    label: i + 1 + '',
    value: i + 1 + ''
  })
}

const minuteList: PickerColumn = [];
for(let i = 0; i < 60; i++) {
  hourList.push({
    label: formatNum(i + 1),
    value: i + 1 + ''
  })
}

export const timeColumns = [
  hourList,
  minuteList,
]