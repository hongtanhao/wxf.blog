---
title: linux如何后台运行node服务？
date: 2020-11-11 09:17:57
tags: nodejs
---

### 1. 安装pm2
> 你要在linux上安装pm2有很多方法，但我是用node的工具npm来完成安装的，所以在安装pm2之前需要先安装node。这里如果不会，就百度一个安装node,这个小事我就不做了，如果不服，那就不服！！

```bash
npm install pm2 -g
# 安装完成运行
pm2 list 
```

`注意`： 有的系统会直接创建命令，有的需要手动创建，当你回车后，看到 `-bash: pm2: command not found`, 就需要手动创建指令了。


### 2. 创建软连接
> 操作描述：在linux上的设置软连接相当于是windows下的配制环境变量一个道理，只是这里用了命令完成的操作。这里我们就开始为pm2创建软连接，这里首先要明确的是，我们要知道谁和谁去连接，问题来了？知道是哪个和哪个连接吗？好了，答案是：我们的linux下的全局$PATH和我们pm2的安装路径。那么我们如何知道他们的路径分别是哪里呢？

1. 首先，需要找到pm2的安装路径，在上面输入 `npm install pm2 -g`全局安装时，/usr/sbin/nodejs/bin/pm2 -> /usr/sbin/nodejs/lib/node_modules/pm2/bin/pm2
/usr/sbin/nodejs/bin/pm2是安装路径（你的可能和我的不一样）
2. 建立软连接
```bash
ln -s /usr/sbin/nodejs/bin/pm2 /usr/local/bin/ #注意空格
```
3. 验证
```bash
pm2 list
```

### 3. pm2的常用命令
```bash
pm2 start app.js # 启动app.js应用程序
pm2 start app.js –name=”api” # 启动应用程序并命名为 “api”
pm2 start app.js –watch # 当文件变化时自动重启应用
pm2 start script.sh # 启动 bash 脚本
pm2 list # 列表 PM2 启动的所有的应用程序
pm2 monit # 显示每个应用程序的CPU和内存占用情况
pm2 show [app-name] # 显示应用程序的所有信息
pm2 logs # 显示所有应用程序的日志
pm2 logs [app-name] # 显示指定用程序的日志
pm2 stop all # 停止所有的应用程序
pm2 stop 0 # 停止 id为 0的指定应用程序
pm2 restart all # 重启所有应用
pm2 reload all # 重启 cluster mode下的所有应用
pm2 gracefulReload all # Graceful reload all apps in cluster mode
pm2 delete all # 关闭并删除所有应用
pm2 delete 0 # 删除指定应用 id 0
pm2 scale api 10 # 把名字叫api的应用扩展到10个实例
pm2 reset [app-name] # 重置重启数量
pm2 startup # 创建开机自启动命令
pm2 save # 保存当前应用列表
pm2 resurrect # 重新加载保存的应用列表
pm2 update # Save processes, kill PM2 and restore processes
pm2 generate # Generate a sample json configuration file
```