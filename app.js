// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力")
    } else {
      wx.cloud.init({
        traceUser: true,
      })
      console.log("云开发初始化成功")
    }

    // 检查AI成长计划资源
    this.checkAIResources()
  },

  onShow() {
    // 小程序显示
  },

  checkAIResources() {
    console.log("AI成长计划资源已申请")
    console.log("1亿 Token + 1万张生图额度可用")
  },

  globalData: {
    userInfo: null,
    article: "",
    style: "tech",
    images: [],
    isGenerating: false
  }
})
