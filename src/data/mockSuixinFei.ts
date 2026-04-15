export interface SuixinFeiProduct {
  id: string
  name: string
  airline: string
  price: number
  validUntil: string
  description: string
  routes: SuixinFeiRoute[]
}

export interface SuixinFeiRoute {
  id: string
  origin: string
  originCity: string
  destination: string
  destCity: string
  type: 'depart' | 'arrive' | 'roundtrip' | 'transit'
  weekdays: number[] // 1=Mon, 7=Sun
  firstDate: string
  flightNo: string
  depTime: string
  arrTime: string
  duration: number
  visaFree: boolean
}

export const SUIXINFEI_PRODUCTS: SuixinFeiProduct[] = [
  {
    id: 'hainan-666',
    name: '海航666夏秋',
    airline: '海南航空',
    price: 666,
    validUntil: '2026-10-31',
    description: '购买后可在有效期内无限次乘坐海航指定航班，每次提前1天抢票',
    routes: [
      { id: 'r1', origin: 'PEK', originCity: '北京', destination: 'HAK', destCity: '海口', type: 'depart', weekdays: [1,2,3,4,5,6,7], firstDate: '2026-04-18', flightNo: 'HU7603', depTime: '08:00', arrTime: '12:30', duration: 210, visaFree: false },
      { id: 'r2', origin: 'PEK', originCity: '北京', destination: 'SYX', destCity: '三亚', type: 'depart', weekdays: [1,3,5,7], firstDate: '2026-04-20', flightNo: 'HU7801', depTime: '09:30', arrTime: '14:00', duration: 210, visaFree: false },
      { id: 'r3', origin: 'PEK', originCity: '北京', destination: 'XMN', destCity: '厦门', type: 'depart', weekdays: [2,4,6], firstDate: '2026-04-19', flightNo: 'HU7201', depTime: '07:00', arrTime: '10:00', duration: 180, visaFree: false },
      { id: 'r4', origin: 'SHA', originCity: '上海', destination: 'HAK', destCity: '海口', type: 'depart', weekdays: [1,2,3,4,5,6,7], firstDate: '2026-04-18', flightNo: 'HU7401', depTime: '10:00', arrTime: '13:30', duration: 210, visaFree: false },
      { id: 'r5', origin: 'SHA', originCity: '上海', destination: 'CTU', destCity: '成都', type: 'depart', weekdays: [1,3,5,6,7], firstDate: '2026-04-18', flightNo: 'HU7501', depTime: '14:00', arrTime: '16:30', duration: 150, visaFree: false },
    ],
  },
  {
    id: 'chunqiu',
    name: '春秋随心飞',
    airline: '春秋航空',
    price: 399,
    validUntil: '2026-09-30',
    description: '春秋航空全国航线随心飞，每周可飞3次，提前3天预约',
    routes: [
      { id: 'r6', origin: 'SHA', originCity: '上海', destination: 'SZX', destCity: '深圳', type: 'depart', weekdays: [1,2,3,4,5,6,7], firstDate: '2026-04-18', flightNo: '9C8501', depTime: '07:30', arrTime: '10:00', duration: 150, visaFree: false },
      { id: 'r7', origin: 'SHA', originCity: '上海', destination: 'CAN', destCity: '广州', type: 'depart', weekdays: [1,2,3,4,5,6,7], firstDate: '2026-04-18', flightNo: '9C8601', depTime: '09:00', arrTime: '11:30', duration: 150, visaFree: false },
      { id: 'r8', origin: 'SHA', originCity: '上海', destination: 'KMG', destCity: '昆明', type: 'depart', weekdays: [2,4,6,7], firstDate: '2026-04-19', flightNo: '9C8701', depTime: '11:00', arrTime: '14:00', duration: 180, visaFree: false },
      { id: 'r9', origin: 'SHA', originCity: '上海', destination: 'XIY', destCity: '西安', type: 'depart', weekdays: [1,3,5,7], firstDate: '2026-04-18', flightNo: '9C8801', depTime: '08:00', arrTime: '10:30', duration: 150, visaFree: false },
    ],
  },
  {
    id: 'loong-365',
    name: '长龙365',
    airline: '长龙航空',
    price: 365,
    validUntil: '2026-12-31',
    description: '长龙航空全年随心飞，杭州出发为主，每次提前2天抢',
    routes: [
      { id: 'r10', origin: 'HGH', originCity: '杭州', destination: 'SZX', destCity: '深圳', type: 'depart', weekdays: [1,2,3,4,5,6,7], firstDate: '2026-04-18', flightNo: 'GJ8301', depTime: '08:30', arrTime: '11:00', duration: 150, visaFree: false },
      { id: 'r11', origin: 'HGH', originCity: '杭州', destination: 'CKG', destCity: '重庆', type: 'depart', weekdays: [1,3,5,6,7], firstDate: '2026-04-18', flightNo: 'GJ8401', depTime: '10:00', arrTime: '12:30', duration: 150, visaFree: false },
      { id: 'r12', origin: 'HGH', originCity: '杭州', destination: 'KMG', destCity: '昆明', type: 'depart', weekdays: [2,4,6], firstDate: '2026-04-19', flightNo: 'GJ8501', depTime: '13:00', arrTime: '16:00', duration: 180, visaFree: false },
    ],
  },
]

const WEEKDAY_LABELS = ['', '一', '二', '三', '四', '五', '六', '日']
export function formatWeekdays(days: number[]): string {
  if (days.length === 7) return '每天'
  return '周' + days.map(d => WEEKDAY_LABELS[d]).join('/')
}
