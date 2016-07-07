# 基于ES6编译bootstrap

## 安装node  
下载地址：[Node](https://nodejs.org/en/)  
解决网速慢问题：[淘宝NPM](https://npm.taobao.org/)

## 安装gulp
npm install -g gulp  

## 安装bower
npm install -g bower  

## 安装bootstrap-sass
bower install bootsrap-sass  

## 新建 .babelrc
内容为：  
    {
      "presets": [
        "es2015"
      ]
    }

## 新建 .bowerrc
内容为：  
    {
        "directory": "bower_components"
    }

## 新建gulpfile.babel.js
内容在gulpfile.babel.js。  

## 安装需要的模块
node install  
bower install 

## 执行gulp
### 生成样式
新建 assets/stylesheets/bootstrap.scss
内容：
    @import "_bootstrap";
#### 执行
    gulp styles
### 生成js
    gulp scripts
### 检查语法错误
    gulp lint
### html处理
    gulp html
### 图片压缩等处理
    gulp images
### 字体处理
    gulp fonts
### 其他文件处理
    gulp extras
### 依赖（在bower.json的dependencies里）处理
    gulp wiredep
### 服务器实时监控
    gulp serve
### 删除
    gulp clean
### 批量任务处理
    gulp

