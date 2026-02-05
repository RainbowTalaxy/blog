#!/bin/bash

# 备份 storage 目录到 blog_backup
# 用法: ./backup_storage.sh

# 配置
SOURCE_DIR="$HOME/storage"
BACKUP_DIR="$HOME/blog_backup"
DATE_SUFFIX=$(date +"%y_%m_%d")
BACKUP_NAME="storage_${DATE_SUFFIX}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# 检查源目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    echo "错误: 源目录 $SOURCE_DIR 不存在"
    exit 1
fi

# 检查备份目录是否存在，不存在则创建
if [ ! -d "$BACKUP_DIR" ]; then
    echo "创建备份目录: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# 检查是否已存在同名备份
if [ -d "$BACKUP_PATH" ]; then
    echo "警告: 备份 $BACKUP_NAME 已存在"
    read -p "是否覆盖? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "取消备份"
        exit 0
    fi
    rm -rf "$BACKUP_PATH"
fi

# 执行备份
echo "开始备份..."
echo "源目录: $SOURCE_DIR"
echo "目标: $BACKUP_PATH"

cp -r "$SOURCE_DIR" "$BACKUP_PATH"

if [ $? -eq 0 ]; then
    echo "备份完成: $BACKUP_NAME"
    # 显示备份大小
    du -sh "$BACKUP_PATH"
else
    echo "错误: 备份失败"
    exit 1
fi
