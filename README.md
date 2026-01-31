# 🎨 一键配图助手 - 微信小程序

**基于腾讯AI成长计划开发**

---

## 🎯 项目介绍

一键配图助手是一个智能的公众号文章配图工具，通过AI自动分析文章内容，智能生成符合风格的配图并插入到文章中。

### 核心功能
- ✅ 智能分析文章结构
- ✅ 自动识别配图位置
- ✅ 9种预设风格
- ✅ 一键生成配图
- ✅ 预览与编辑
- ✅ 导出多种格式

---

## 🏗️ 技术架构

```
微信小程序
    ↓
云开发 CloudBase
    ├─ 云函数
    │  ├─ article-analyzer（文章分析）
    │  └─ image-generator（图片生成）
    ├─ 数据库
    │  ├─ users（用户信息）
    │  ├─ articles（文章记录）
    │  ├─ images（图片详情）
    │  └─ styles（风格配置）
    └─ 云存储
       └─ images/（图片存储）
    ↓
混元 AI
    ├─ 文生文（1亿Token免费）
    └─ 文生图（1万张免费）
```

---

## 📦 项目结构

```
article-illustrator/
├── app.js              # 小程序入口
├── app.json            # 小程序配置
├── app.wxss            # 全局样式
├── pages/              # 页面
│   ├── index/          # 首页（输入文章）
│   └── preview/        # 预览页（编辑导出）
├── cloudfunctions/     # 云函数
│   ├── article-analyzer/
│   │   ├── index.js
│   │   └── package.json
│   └── image-generator/
│       ├── index.js
│       └── package.json
├── images/             # 图片资源
├── project.config.json # 项目配置
├── database-design.md  # 数据库设计
└── README.md          # 本文件
```

---

## 🚀 快速开始

### 前置条件
1. 微信开发者工具
2. 已申请AI小程序成长计划
3. 已开通云开发

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd article-illustrator
```

2. **配置云开发**
- 打开微信开发者工具
- 导入项目
- 开通云开发
- 在 `project.config.json` 中填入你的 appid

3. **上传云函数**
```bash
# 在微信开发者工具中
右键 cloudfunctions/article-analyzer → 上传并部署：云端安装依赖
右键 cloudfunctions/image-generator → 上传并部署：云端安装依赖
```

4. **创建数据库集合**
```javascript
// 在云开发控制台创建集合
users
articles
images
styles
```

5. **运行项目**
- 点击"编译"按钮
- 在真机或模拟器中测试

---

## 📱 使用说明

### 1. 输入文章
在首页粘贴你的公众号文章内容

### 2. 选择风格
选择适合文章的配图风格：
- 🔬 科技（AI、算法、技术）
- ☀️ 温暖（成长、情感、生活）
- ⬜ 极简（专业、商务、简洁）
- 🎮 趣味（轻松、创意、活泼）
- 📝 线稿（教程、知识、笔记）
- 💼 商务（金融、商业、报告）
- 🌿 自然（健康、环保、生态）
- 🎨 创意（设计、艺术、美学）
- 🖼️ 通用（综合内容）

### 3. 开始配图
点击"开始配图"，等待AI分析并生成

### 4. 预览编辑
- 查看生成的配图
- 重新生成不满意的图片
- 调整图片位置
- 删除不需要的图片

### 5. 导出
- 导出为Markdown（带图片链接）
- 导出为HTML
- 保存全部图片到相册

---

## 🔧 云函数说明

### article-analyzer
分析文章结构，找出需要配图的位置

**输入参数：**
```json
{
  "article": "文章内容",
  "style": "tech|warm|minimal|..."
}
```

**返回结果：**
```json
{
  "success": true,
  "imagePositions": [
    {
      "position": 3,
      "purpose": "强化论点",
      "visualContent": "画面描述",
      "fileName": "img_01.png"
    }
  ],
  "style": "tech",
  "total": 5
}
```

---

### image-generator
根据分析结果生成配图

**输入参数：**
```json
{
  "imagePositions": [...],
  "style": "tech",
  "articleId": "article_xxx"
}
```

**返回结果：**
```json
{
  "success": true,
  "images": [
    {
      "fileName": "img_01.png",
      "cloudPath": "images/xxx/img_01.png",
      "cloudUrl": "https://...",
      "prompt": "提示词",
      "position": 3
    }
  ],
  "total": 5
}
```

---

## 💰 免费资源（AI成长计划）

- ✅ 1亿混元Token（文生文）
- ✅ 1万张生图额度（文生图）
- ✅ 免费云开发资源
- ✅ 免开发广告接入

---

## 📈 开发计划

- [x] 第一周：基础架构
- [x] 第二周：核心功能
- [x] 第三周：优化与导出
- [x] 第四周：上线准备

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 📞 联系方式

- 微信小程序：一键配图助手
- 公众号：勇哥的AI实战室
- GitHub：[待补充]

---

**Powered by 腾讯AI小程序成长计划** 🚀
