import request from './../utils/request'

export function imageUpload(data) {
  return request({
    url: '/image/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function imageDel(data) {
  return request({
    url: '/image/del',
    method: 'post',
    data
  })
}
