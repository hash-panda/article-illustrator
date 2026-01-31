// pages/index/index.js
Page({
  data: {
    article: "",
    style: "tech",
    isGenerating: false,
    freeCount: 10
  },

  onLoad() {
    this.checkFreeCount()
  },

  // 文章输入
  onArticleInput(e) {
    this.setData({
      article: e.detail.value
    })
  },

  // 选择风格
  selectStyle(e) {
    const style = e.currentTarget.dataset.style
    this.setData({ style })
  },

  // 检查免费额度
  checkFreeCount() {
    const app = getApp()
    wx.cloud.database().collection('users').doc(app.globalData.userId).get()
      .then(res => {
        if (res.data) {
          this.setData({
            freeCount: res.data.freeCount || 10
          })
        }
      })
      .catch(err => {
        console.log("获取免费额度失败", err)
      })
  },

  // 开始配图
  startGenerate() {
    if (!this.data.article.trim()) {
      wx.showToast({
        title: "请输入文章内容",
        icon: "none"
      })
      return
    }

    if (this.data.freeCount <= 0) {
      wx.showModal({
        title: "免费额度已用完",
        content: "升级到付费版可继续使用，或等待下月重置",
        showCancel: false
      })
      return
    }

    this.setData({ isGenerating: true })

    // 调用云函数分析文章
    this.analyzeArticle()
  },

  // 分析文章
  analyzeArticle() {
    wx.cloud.callFunction({
      name: 'article-analyzer',
      data: {
        article: this.data.article,
        style: this.data.style
      }
    })
    .then(res => {
      const { imagePositions, recommendedStyle } = res.result
      this.generateImages(imagePositions, recommendedStyle)
    })
    .catch(err => {
      console.error("文章分析失败", err)
      wx.showToast({
        title: "分析失败，请重试",
        icon: "none"
      })
      this.setData({ isGenerating: false })
    })
  },

  // 生成图片
  generateImages(imagePositions, recommendedStyle) {
    wx.cloud.callFunction({
      name: 'image-generator',
      data: {
        imagePositions: imagePositions,
        style: recommendedStyle || this.data.style,
        articleId: this.generateArticleId()
      }
    })
    .then(res => {
      const { images, total } = res.result

      // 保存到全局数据
      const app = getApp()
      app.globalData.article = this.data.article
      app.globalData.images = images
      app.globalData.style = recommendedStyle || this.data.style

      // 扣除免费额度
      this.deductFreeCount(total)

      // 跳转到预览页
      wx.navigateTo({
        url: '/pages/preview/preview'
      })
    })
    .catch(err => {
      console.error("图片生成失败", err)
      wx.showToast({
        title: "生成失败，请重试",
        icon: "none"
      })
      this.setData({ isGenerating: false })
    })
  },

  // 生成文章ID
  generateArticleId() {
    return `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  // 扣除免费额度
  deductFreeCount(count) {
    const app = getApp()
    const newCount = Math.max(0, this.data.freeCount - count)

    wx.cloud.database().collection('users').doc(app.globalData.userId).update({
      data: {
        freeCount: newCount,
        lastUsed: new Date()
      }
    }).then(() => {
      this.setData({ freeCount: newCount })
    }).catch(err => {
      console.log("更新免费额度失败", err)
    })
  },

  // 跳转到结果页
  goToResult() {
    wx.navigateTo({
      url: '/pages/result/result'
    })
  }
})
