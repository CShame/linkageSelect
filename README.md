﻿
# linkageSelect

####语言：angularjs

#### 功能： 
三级联动选择框

#### 参数：
##### options            <类型：obj>    双向绑定的数据
    属性：title           <类型：string> 标题
    属性：list            <类型：array>  对象数组，三级选择的数据，注意子节点叫‘Children’
    属性：levelOneAttr    <类型：string> 一级下拉框要显示的属性的属性名
    属性：levelTwoAttr    <类型：string> 二级下拉框要显示的属性的属性名
    属性：levelThreeAttr  <类型：string> 三级下拉框要显示的属性的属性名

#### 返回值：
      options.selectedValues  <类型：array> 长度为三对象数组[{},{},{}]


#### 用法：
##### html：
```html
<linkage-select options="options"></linkage-select>
```

##### js:
```javascript 
$scope.options ={
          list:[
            {
              "ProjectCode": null,
              "NodeCode": "001",
              "NodeText": "东北地区",
              "Children": [
                {
                  "ProjectCode": null,
                  "NodeCode": "001001",
                  "NodeText": "沈阳市",
                  "Children": [
                    {
                      "ProjectCode": null,
                      "NodeCode": "001001006",
                      "NodeText": "浑南区",
                      "Children": [{
                        "ProjectCode": 395,
                        "NodeCode": "001001006-395",
                        "NodeText": "沈阳金地长青湾",
                        "Children": []
                      }]
                    }
                  ]
                }]
            }],
          title:'项目范围选择',
          levelOneAttr:'NodeText',
          levelTwoAttr:'NodeText',
          levelThreeAttr:'NodeText',
        };
```
#### 效果图
![](https://github.com/CShame/linkageSelect/blob/master/linkageSelect/1.png"效果图")