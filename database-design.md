# 数据库设计

## 1. users 集合（用户信息）

```json
{
  "_id": "用户ID",
  "openId": "微信OpenID",
  "nickname": "昵称",
  "avatar": "头像URL",
  "freeCount": 10,
  "totalUsed": 100,
  "isVip": false,
  "vipExpireAt": null,
  "createdAt": "2026-01-31",
  "lastUsed": "2026-01-31"
}
```

---

## 2. articles 集合（文章记录）

```json
{
  "_id": "记录ID",
  "articleId": "article_xxx",
  "userId": "用户ID",
  "article": "文章内容（前1000字）",
  "style": "tech",
  "imageCount": 5,
  "images": [
    {
      "fileName": "img_01.png",
      "cloudPath": "images/xxx/img_01.png",
      "cloudUrl": "https://...",
      "prompt": "提示词",
      "position": 3
    }
  ],
  "status": "completed",
  "createdAt": "2026-01-31",
  "exportedAt": null
}
```

---

## 3. images 集合（图片详情）

```json
{
  "_id": "图片ID",
  "articleId": "article_xxx",
  "userId": "用户ID",
  "fileName": "img_01.png",
  "cloudPath": "images/xxx/img_01.png",
  "cloudUrl": "https://...",
  "prompt": "提示词",
  "style": "tech",
  "position": 3,
  "regenerated": false,
  "createdAt": "2026-01-31"
}
```

---

## 4. styles 集合（风格配置）

```json
{
  "_id": "风格ID",
  "name": "tech",
  "displayName": "科技",
  "emoji": "🔬",
  "description": "科技、AI、算法、代码",
  "colors": ["#667eea", "#764ba2", "#4A90E2"],
  "promptTemplate": "...",
  "isActive": true,
  "sortOrder": 1
}
```

---

## 索引设计

### users 集合索引
```javascript
db.collection('users').createIndex({
  openId: 1,
  isVip: 1,
  createdAt: -1
})
```

### articles 集合索引
```javascript
db.collection('articles').createIndex({
  userId: 1,
  createdAt: -1,
  status: 1
})
```

### images 集合索引
```javascript
db.collection('images').createIndex({
  articleId: 1,
  createdAt: -1
})
```
