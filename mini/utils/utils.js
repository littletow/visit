const md5util = require("./md5");

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day, hour, minute, second].map(formatNumber).join('')
}

const formatDateShort = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()


  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function isEmpty(obj) {
  if (!obj) {
    return true;
  }
  if (obj === '' || obj === "") {
    return true;
  }


  if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
    return true;
  }

  if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
    return true;
  }
  return false;
}

// 是否对象？
function isObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatDateStr(str) {
  const date = new Date(str)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')

}
// 获取毫秒时间戳
function getNowMsTime() {
  return new Date().getTime();
}
// 获取秒时间戳
function getSecTs() {
  return Math.floor(Date.now() / 1000);
}

// 获取当前时间字符串
function getNowStr() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 获取昨天的毫秒时间戳
function getYestMsTime() {
  return new Date().getTime() - 24 * 60 * 60 * 1000;
}

// 获取今天凌晨零点毫秒时间戳
function getTodayZeroMsTime() {
  const d = new Date(new Date().setHours(0, 0, 0, 0)); // 获取当天零点时间
  return d.getTime()
}

// 获取今天235959的时间，毫秒时间戳
function getTodayNearZeroMsTime() {
  const d = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1); // 获取当天23:59:59的时间
  return d.getTime()
}

function decodeBase64(data) {
  let decode = atob(data);
  return decodeURIComponent(decode);
}


function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  var len = Math.max(v1.length, v2.length)
  while (v1.length < len) {
    v1.push('0')
  }

  while (v2.length < len) {
    v2.push('0')
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i])
    var num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}

const getUrl = (url) => {
  // let baseUrl = getBaseUrl();
  if (url.indexOf("://") == -1) {
    url = baseUrl + url;
  }
  return url;
};


// 以逗号分割，先替换中文逗号
function str2arr(str) {
  let str1 = str.replaceAll("，", ",");
  return str1.split(',');
}


// 获取x分钟后时间戳
function getXMinTimeStamp(x) {
  var date = new Date();
  var min = date.getMinutes();
  date.setMinutes(min + x);
  var timestamp = date.getTime();
  return Math.floor(timestamp / 1000);
}


// 获取x秒后时间戳
function getXSecTimeStamp(x) {
  const now = Math.floor(Date.now() / 1000);
  return now + x;
}

// 获取与当前时间戳的差值
function diffNowTs(t) {
  const now = getSecTs();
  return t - now;
}

// JSON字符串转对象数组
function json2ObjArr(jsonStr) {
  const objArr = JSON.parse(jsonStr);
  return objArr;
}

// 包含JSON数据的ArrayBuffer 转对象数组
function ab2ObjArr(content) {
  // Convert ArrayBuffer back to JSON string
  const decoder = new TextDecoder('utf-8');
  const jsonStrFromBuf = decoder.decode(content);

  // Parse JSON string to object array
  const objArr = JSON.parse(jsonStrFromBuf);

  return objArr;
}

/**
* 从对象数组中根据关键词搜索，然后返回新的对象数组
* @param {Array} items - 对象数组
* @param {string} keyword - 搜索关键词
* @returns {Array} - 包含匹配项的新对象数组
*/
function searchItems(items, keyword) {
  // 将关键词转换为小写，忽略大小写
  const lowerCaseKeyword = keyword.toLowerCase();

  // 使用 filter 方法返回包含匹配项的新对象数组
  return items.filter(item => {
    // 检查对象的每个属性值是否包含关键词
    return Object.values(item).some(value =>
      String(value).toLowerCase().includes(lowerCaseKeyword)
    );
  });
}

/**
* 从对象数组中的某些属性根据关键词搜索，然后返回新的对象数组
* @param {Array} items - 对象数组
* @param {string} keyword - 搜索关键词
* @param {Array} properties - 需要搜索的属性数组
* @returns {Array} - 包含匹配项的新对象数组
*/
function searchItemsV2(items, keyword, properties) {
  // 将关键词转换为小写，忽略大小写
  const lowerCaseKeyword = keyword.toLowerCase();

  // 使用 filter 方法返回包含匹配项的新对象数组
  return items.filter(item => {
    // 使用 some 方法检查对象的某些属性值是否包含关键词
    return properties.some(prop =>
      String(item[prop]).toLowerCase().includes(lowerCaseKeyword)
    );
  });
}


/**
* 获取指定目录的文章列表
* @param {Array} items - 对象数组
* @param {string} category - 要查询的目录
* @returns {Array} - 包含匹配项的新对象数组
*/
function getArtListByCategory(items, category) {
  const properties = ['category'];
  const result = searchItemsV2(items, category, properties);
  return result;
}


/**
* 通过关键字查询并获取指定文章列表
* @param {Array} items - 对象数组
* @param {string} keyword - 搜索关键词
* @returns {Array} - 包含匹配项的新对象数组
*/
function getArtListByKeyword(items, keyword) {
  const properties = ['name', 'kw'];
  const result = searchItemsV2(items, keyword, properties);
  return result;
}

// 分页函数
function paginate(array, pageSize, pageNumber) {
  // pageNumber 是从 1 开始的
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty,
  formatDate: formatDate,
  formatDateShort: formatDateShort,
  guid: guid,
  formatDateStr: formatDateStr,
  getNowMsTime: getNowMsTime,
  getYestMsTime: getYestMsTime,
  decodeBase64: decodeBase64,
  getSecTs: getSecTs,
  compareVersion,
  getNowStr,
  str2arr,
  getXMinTimeStamp,
  getXSecTimeStamp,
  diffNowTs,
  getTodayZeroMsTime,
  getTodayNearZeroMsTime,
  json2ObjArr,
  ab2ObjArr,
  searchItems,
  searchItemsV2,
  getArtListByCategory,
  getArtListByKeyword,
  paginate,
  isObject,
}