import { requests } from '@/requests'
import qs from 'qs'

const getObjectsReq = async (query) => {
  let url = query.bucketId + '/objects'
  let res = await requests.get(url)
  return res.data
}

const getBucketReq = async (param) => {
  let url = 'bucket'
  let res = await requests.get(url, param)
  return res.data
}

const getPresignedUrlReq = async (pathParam, param) => {
  let url = 'object/' + pathParam.bucketId + '/' + pathParam.objectId + '/presigned-url'
  let res = await requests.get(url, param)
  return res.data
}

const downloadObjectReq = async (param) => {
  let url = 'object/' + param.bucketId + '/' + param.objectId
  let res = await requests.get(url)
  return res.data
}

const removeObjectReq = async (param) => {
  let url = 'object/' + param.bucketId + '/' + param.objectId
  let res = await requests.delete(url)
  return res.data
}

const searchObjectsByTxtReq = async (param, pathParam) => {
  let url = 'img/search/' + pathParam.bucketId + '/txt?'
  let res = await requests.get(url, param)
  return res.data
}

const modifyBucketStatusReq = async (param, pathParam) => {
  let url = '/bucket/' + pathParam.bucketId + '/status'
  let res = await requests.putParam(url, param)
  return res.data
}

const getBucketRuleReq = async (param) => {
  let url = '/bucket/' + param.bucketId + '/rules'
  let res = await requests.get(url)
  return res.data
}

const removeBucketRuleReq = async (param) => {
  let url = '/bucket/' + param.bucketId + '/rule/' + param.userId
  let res = await requests.delete(url)
  return res.data
}

const modifyBucketRuleReq = async (pathParam, param) => {
  let url = '/bucket/' + pathParam.bucketId + '/rule/' + pathParam.userId
  let res = await requests.putParam(url, param)
  return res.data
}

const addBucketRuleFormReq = async (pathParam, param) => {
  let url = '/bucket/' + pathParam.bucketId + '/rule/' + pathParam.userId
  let res = await requests.postParam(url, param)
  return res.data
}

const modifyObjectStatusReq = async (pathParam, param) => {
  let url = '/object/' + pathParam.objectId + '/status?'
  let res = await requests.putParam(url, param)
  return res.data
}
export {
  getObjectsReq,
  getBucketReq,
  getPresignedUrlReq,
  downloadObjectReq,
  removeObjectReq,
  searchObjectsByTxtReq,
  modifyBucketStatusReq,
  getBucketRuleReq,
  removeBucketRuleReq,
  modifyBucketRuleReq,
  addBucketRuleFormReq,
  modifyObjectStatusReq
}
