import request from './../utils/request'

export function articlePub(data) {
  return request({
    url: '/article/pub',
    method: 'post',
    data
  })
}

export function articleSave(data) {
  return request({
    url: '/article/save',
    method: 'post',
    data
  })
}

export function articleSort() {
  return request({
    url: '/article/sort',
    method: 'get'
  })
}

export function getClassification() {
  return request({
    url: '/article/classification',
    method: 'get'
  })
}

export function getArticleList(data) {
  return request({
    url: '/article/list',
    method: 'get',
    params: data
  })
}

export function getArticle(data) {
  return request({
    url: '/article/id',
    method: 'get',
    params: data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function delArticle(data) {
  return request({
    url: '/article/del',
    method: 'get',
    params: data
  })
}

export function updatePub(data) {
  return request({
    url: '/article/updatepub',
    method: 'get',
    params: data
  })
}
