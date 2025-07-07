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

// 获取昨天凌晨零点毫秒时间戳
function getYesterdayZeroMsTime() {
  const now = new Date();
  // 设置时间为今天的凌晨
  now.setHours(0, 0, 0, 0);
  // 减去一天的毫秒数
  const yesterdayMidnight = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return yesterdayMidnight.getTime();
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

// 检查服务器是否通畅？
function checkServerAccessibility(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // 使用 wx.request 发送 HEAD 请求
    wx.request({
      url: url,
      method: 'HEAD', // 使用 HEAD 方法
      timeout: timeout, // 设置超时时间
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve('ok');
        } else {
          reject(new Error('Server returned an error status'));
        }
      },
      fail: (err) => {
        if (err.errMsg.includes('timeout')) {
          reject(new Error('Request timed out'));
        } else {
          reject(new Error('There was a problem with the request: ' + err.errMsg));
        }
      }
    });
  });
}

// 下载文件
function downloadFile(url, timeout = 5000, successCallback, failCallback, progressCallback) {
  // 创建一个超时定时器
  let timeoutId;

  // 调用 wx.downloadFile 接口下载文件
  const downloadTask = wx.downloadFile({
    url: url, // 文件下载链接
    success: (res) => {
      clearTimeout(timeoutId); // 请求成功，清除超时定时器
      if (res.statusCode === 200) {
        // 下载成功，调用成功回调函数
        if (typeof successCallback === 'function') {
          successCallback(res.tempFilePath); // 临时文件路径
        }
      } else {
        // 下载失败，调用失败回调函数
        if (typeof failCallback === 'function') {
          failCallback(new Error('Download failed with status code ' + res.statusCode));
        }
      }
    },
    fail: (err) => {
      clearTimeout(timeoutId); // 请求失败，清除超时定时器
      // 请求失败，调用失败回调函数
      if (typeof failCallback === 'function') {
        failCallback(err);
      }
    }
  });

  // 监听下载进度变化事件
  downloadTask.onProgressUpdate((res) => {
    if (typeof progressCallback === 'function') {
      progressCallback(res.progress); // 下载进度百分比
    }
  });

  // 设置超时定时器
  timeoutId = setTimeout(() => {
    downloadTask.abort(); // 中止下载任务
    if (typeof failCallback === 'function') {
      failCallback(new Error('Request timed out'));
    }
  }, timeout);
}

// 网络请求，带有兜底处理和超时设置
function requestWithFallback(mainUrl, fallbackUrl, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // 创建一个 AbortController 实例
    let timeoutId;

    // 定义请求函数
    const fetchData = (url, isFallback = false) => {
      const requestTask = wx.request({
        url: url,
        method: 'GET',
        timeout: timeout,
        success: (res) => {
          clearTimeout(timeoutId); // 请求成功，清除超时定时器
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve(res.data); // 成功处理
          } else {
            if (isFallback) {
              reject(new Error('Both main and fallback requests failed with status code ' + res.statusCode));
            } else {
              fetchData(fallbackUrl, true); // 尝试兜底请求
            }
          }
        },
        fail: (err) => {
          clearTimeout(timeoutId); // 请求失败，清除超时定时器
          if (isFallback) {
            reject(new Error('Both main and fallback requests failed: ' + err.errMsg));
          } else {
            fetchData(fallbackUrl, true); // 尝试兜底请求
          }
        }
      });

      // 设置超时定时器
      timeoutId = setTimeout(() => {
        requestTask.abort(); // 中止请求
        if (isFallback) {
          reject(new Error('Both main and fallback requests timed out'));
        } else {
          fetchData(fallbackUrl, true); // 尝试兜底请求
        }
      }, timeout);
    };

    // 先尝试主请求
    fetchData(mainUrl);
  });
}

// 根据关键词查找，并返回最多三个结果
function searchListByKeyword3(list, keyword) {
  // 过滤出kw字段包含keyword的对象，并去重
  const filteredList = list.filter(item => item.kw.includes(keyword)).slice(0, 3);
  // 返回结果
  return filteredList;
}

// 从列表中随机返回包含关键字的列表项
function getRandomItemsWithKeyword(list, keyword, count) {
  // 过滤包含关键字的项
  const filteredList = list.filter(item => item.kw.includes(keyword));

  // 随机打乱过滤后的列表
  const shuffledList = filteredList.sort(() => 0.5 - Math.random());

  // 返回最多3个项
  return shuffledList.slice(0, count);
}


// 根据关键词查找，随机返回最多三个结果
function searchRandListByKeyword3(list, keyword) {
  const filteredList = getRandomItemsWithKeyword(list, keyword, 3);
  // 返回结果
  return filteredList;
}

/**
 * 检查文件是否存在
 * @param {string} fileUrl - 文件的URL
 * @returns {Promise<boolean>} - 一个Promise，表示文件是否存在
 */
function checkFileExists(fileUrl) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('请求超时')), 5000); // 设置超时时间为5秒

    wx.request({
      url: fileUrl,
      method: 'HEAD',
      success: (res) => {
        clearTimeout(timeout);
        resolve(res.statusCode === 200);
      },
      fail: (err) => {
        clearTimeout(timeout);
        console.error(`Error checking file existence: ${err.errMsg}`);
        resolve(false);
      }
    });
  });
}

/**
* 下载文件并验证内容
* @param {string} fileUrl - 文件的URL
* @returns {Promise<boolean>} - 一个Promise，表示文件是否下载成功
*/
function downloadGitFile(fileUrl) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('请求超时')), 10000); // 设置超时时间为10秒

    wx.downloadFile({
      url: fileUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.getFileSystemManager().saveFile({
            tempFilePath: res.tempFilePath,
            success: (result) => {
              clearTimeout(timeout);
              resolve(true);
              // 删除临时文件
              wx.getFileSystemManager().unlink({
                filePath: result.savedFilePath,
                fail: (err) => {
                  console.error(`Error deleting temp file: ${err.errMsg}`);
                }
              });
            },
            fail: (err) => {
              clearTimeout(timeout);
              console.error(`Error saving file: ${err.errMsg}`);
              resolve(false);
            }
          });
        } else {
          clearTimeout(timeout);
          resolve(false);
        }
      },
      fail: (err) => {
        clearTimeout(timeout);
        console.error(`Error downloading file: ${err.errMsg}`);
        resolve(false);
      }
    });
  });
}



/**
 * 检查服务器文件的存在性
 * @param {string} fileUrl - 文件的URL
 * @returns {Promise<boolean>} - 表示服务器是否通畅
 */
async function checkServer(fileUrl) {
  try {
    const exists = await checkFileExists(fileUrl);
    return exists;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

/**
* 检查服务器文件的存在性和可下载性
* @param {string} fileUrl - 文件的URL
* @returns {boolean} - 表示服务器是否通畅
*/
async function checkServerV2(fileUrl) {
  try {
    const exists = await checkFileExists(fileUrl);
    if (!exists) {
      return false;
    }

    const success = await downloadGitFile(fileUrl);
    return success;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

// 计算毫秒时间戳之间经历的天数
function calculateDaysBetween(currentTimestamp, pastTimestamp) {
  // 计算时间差（毫秒）
  const timeDiff = currentTimestamp - pastTimestamp;

  // 将时间差转换为天数，并取最小整数
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
}

// 使用该函数检查服务器是否通畅
// const serverUrl = 'https://example.com/api/test';

// checkServerAccessibility(serverUrl, 5000)
//     .then((message) => {
//         console.log(message);
//     })
//     .catch((error) => {
//         console.error(error.message);
//     });


// 使用示例
// const fileUrl = 'https://example.com/path/to/file';

// downloadFile(
//     fileUrl,
//     5000, // 超时时间
//     (tempFilePath) => {
//         console.log('Download successful, file saved at:', tempFilePath);
//         // 可以在这里对下载的文件进行进一步处理
//     },
//     (error) => {
//         console.error('Download failed:', error);
//     },
//     (progress) => {
//         console.log('Download progress:', progress + '%');
//     }
// );

// 使用示例
// const mainUrl = 'https://example.com/api/main';
// const fallbackUrl = 'https://fallback.example.com/api/main';

// requestWithFallback(mainUrl, fallbackUrl, 5000)
//     .then((data) => {
//         console.log('Request success:', data);
//     })
//     .catch((error) => {
//         console.error('Request failed:', error.message);
//     });

const cache = new Map();

function getFilteredData(sourceArray,searchValue) {
  if (cache.has(searchValue)) {
    return cache.get(searchValue);
  }
  // 执行筛选，假设原数组为 sourceArray
  const filtered = sourceArray.filter(item => 
    Object.values(item).some(val => 
      String(val).includes(searchValue)
    )
  );
  cache.set(searchValue, filtered);
  return filtered;
}

function getPaginatedData(filteredData, page, pageSize) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: filteredData.slice(start, end),
    total: filteredData.length,
    totalPages: Math.ceil(filteredData.length / pageSize)
  };
}

function fetchArtData(sourceArray,searchValue, page, pageSize) {
  const filtered = getFilteredData(sourceArray,searchValue);
  return getPaginatedData(filtered, page, pageSize);
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
  getYesterdayZeroMsTime,
  getTodayNearZeroMsTime,
  json2ObjArr,
  ab2ObjArr,
  searchItems,
  searchItemsV2,
  getArtListByCategory,
  getArtListByKeyword,
  paginate,
  isObject,
  checkServerAccessibility,
  checkServer,
  checkServerV2,
  requestWithFallback,
  downloadFile,
  searchListByKeyword3,
  searchRandListByKeyword3,
  calculateDaysBetween,
  fetchArtData,
}