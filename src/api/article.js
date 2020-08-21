import request from './../utils/request'

export function articlePub(data) {
  return request({
    url: '/article/pub',
    method: 'post',
    data
  })
}
