# 基于ES6编译bootstrap

## 安装node  
下载地址：https://nodejs.org/en/

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

## 执行
node install  
bower install 

## 执行gulp
gulp

