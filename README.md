# Weibo-Keep-V5

这是一个用户脚本。她的主要功能是在你浏览新浪微博网页版时，尽可能恢复 V5 界面，你懂的。

## 原理

新浪微博已经全面升级到 V6，但网友发现，新浪微博是通过某个 Cookie 值来标记版本模式的，通过修改这个值，一些主要的微博页面仍然可以以 V5 的界面运行。因此这个用户脚本所做的主要工作就是在你浏览微博时，努力保持住这个 Cookie 的值。

这也意味着，一旦新浪微博取消了这个触发机制，或把 V5 彻底下线，本项目也就完成历史使命了。

## 系统需求

你的浏览器需要安装特定扩展，用于管理和运行用户脚本：

* Chrome 用户： [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* Firefox 用户： [Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)

## 安装

1. 点击 [此链接](https://rawgit.com/UserScript/weibo-keep-v5/master/dist/weibo-keep-v5.user.js) 开始安装。
2. 如果浏览器正确安装了上述扩展，会提示安装。确认即可。
3. 此后登录新浪微博网页版，此脚本会自动工作，无需任何额外操作。

***

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
