#!/bin/bash
touch "000.txt"

# V20.55
MANAGER_REPO='/root/zhima-manager'
MANAGER_PATH='/root/zhima-server/public/'
MANAGER_PAGE='/root/zhima-server/public/index.html'
MANAGER_SVG='/root/zhima-server/public/vite.svg'
MANAGER_ASSETS='/root/zhima-server/public/assets'

# echo "克隆远程仓库"
# cd /root
# git clone git@github.com:ouyangsuo/zhima-manager.git

echo "先清除老代码"
cd $MANAGER_REPO
git stash
git clean -f

echo "拉取最新代码"
git pull origin master

echo "安装依赖库"
npm install

echo "运行项目"
npm run build

echo "删除现有部署目录"
rm -f $MANAGER_PAGE
rm -f $MANAGER_SVG
rm -rf $MANAGER_ASSETS

echo "拷贝代码到部署目录"
cp -r dist/* $MANAGER_PATH

echo "部署完毕!"
touch "111.txt"