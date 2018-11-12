# cityMultiple

省市多选插件,通过选取，可以同时获得多个城市的集合。

### Documentation
http://cyyjs.github.io/cityMultiple/

![](http://ww3.sinaimg.cn/mw690/73fb4b1djw1ehwgzufhluj20fg06ot9t.jpg)
## 使用方法
1. 引入jquery、css和js文件
2. 在页面上添加一个div标签
`<div id="demo"></div>`

3. 编写js代码
`var demo = $("#cityDemo").cityMultiple();`
至此便可以看到生成的画面

4. 获取选中的城市集合
`demo.get()`
这将返回一个已选中的城市集合数组

5. 设置初始选中城市列表
`demo.set(["上海市 宝山区", "上海市 奉贤区", "河南省 焦作市", "河南省 开封市"]);`
