# China Province Location

生成中国省市的经纬度数据: 

``` json
[
  {
    "lng": "116.413",
    "lat": "39.911",
    "children": [
      {
        "lng": "116.422",
        "lat": "39.935",
        "name": "东城区",
        "code": "110101"
      },
      {
        "lng": "116.373",
        "lat": "39.918",
        "name": "西城区",
        "code": "110102"
      },
      {
        "lng": "116.450",
        "lat": "39.926",
        "name": "朝阳区",
        "code": "110105"
      },
      ...
    ],
    "name": "北京市",
    "code": "11"
  },
  ...
]
```



## 获取接口AK

> 用户申请注册的key，自v2开始参数修改为“ak”，之前版本参数为“key”

你需要[申请AK](https://lbsyun.baidu.com/apiconsole/key/create#/home)，填写在 `data/baidu-ak.js` 中。

``` javascript
module.exports = "replace this string with your ak";
```
将上面的字符串替换为你申请得到的 `AK`

## Get Started
``` bash
# 安装依赖
yarn 

# 生成经纬度数据, 执行后会生成一份 dist/city-location.json
yarn build
```

## 实现思路
从网络上找到一份省市的数据，遍历数据调用百度地图接口得到经纬度，整合到一起

## 更新 pc-code.json
   访问 [ modood / Administrative-divisions-of-China ](https://github.com/modood/Administrative-divisions-of-China/tree/master/dist) 下载最新的数据

## 参考
   * [ modood / Administrative-divisions-of-China](https://github.com/modood/Administrative-divisions-of-China/tree/master/dist)
   * [百度地理编码服务接口文档](https://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding)

  
