// cloudfunctions/image-generator/index.js
const cloud = require("wx-server-sdk")
cloud.init()
const db = cloud.database()
const ai = cloud.ai()

// 风格提示词模板
const stylePrompts = {
  tech: `创建科技风格的信息图插画。
风格：蓝紫色调，电路元素，数据流动，科技感
内容：{{content}}
规格：16:9，横向，信息图
原则：简洁、突出关键词、充足留白、科技感`,

  warm: `创建温暖亲和风格的信息图插画。
风格：暖色调（橙色、黄色），人物元素，温馨场景，柔和
内容：{{content}}
规格：16:9，横向，信息图
原则：柔和、温暖、情感化、亲和力`,

  minimal: `创建极简主义风格的信息图插画。
风格：灰度色调，几何元素，线条，留白
内容：{{content}}
规格：16:9，横向，信息图
原则：简洁、专业、极简、清晰`,

  playful: `创建趣味涂鸦风格的信息图插画。
风格：高饱和度，卡通元素，活泼，创意
内容：{{content}}
规格：16:9，横向，信息图
原则：轻松、有趣、活泼、年轻化`,

  notion: `创建线稿风格的信息图插画。
风格：简约线条，图标，流程图，笔记风格
内容：{{content}}
规格：16:9，横向，信息图
原则：清晰、易懂、图标化、教程风`,

  business: `创建商务风格的信息图插画。
风格：蓝色绿色调，图表元素，商务场景，专业
内容：{{content}}
规格：16:9，横向，信息图
原则：专业、商务、图表、清晰`,

  nature: `创建自然风格的信息图插画。
风格：绿色棕色调，植物元素，自然场景，环保
内容：{{content}}
规格：16:9，横向，信息图
原则：自然、环保、清新、和谐`,

  creative: `创建创意艺术风格的信息图插画。
风格：多彩，抽象，创意元素，艺术感
内容：{{content}}
规格：16:9，横向，信息图
原则：创意、艺术、多彩、独特`,

  illustration: `创建通用插画风格的信息图插画。
风格：中性色调，通用插画元素，简洁明了
内容：{{content}}
规格：16:9，横向，信息图
原则：通用、简洁、清晰、易懂`
}

exports.main = async (event, context) => {
  const { imagePositions, style, articleId } = event

  console.log("开始生成图片", { count: imagePositions.length, style })

  const generatedImages = []
  let successCount = 0
  let failCount = 0

  // 逐张生成图片
  for (let i = 0; i < imagePositions.length; i++) {
    const position = imagePositions[i]
    const promptTemplate = stylePrompts[style] || stylePrompts.tech
    const prompt = promptTemplate.replace("{{content}}", position.visualContent)

    console.log(`生成第${i + 1}张图`, { fileName: position.fileName })

    try {
      // 调用混元文生图
      const result = await ai.imageGeneration({
        model: "hunyuan-image-pro", // 高质量模型
        prompt: prompt,
        width: 1024,
        height: 576, // 16:9 比例
        response_format: "url"
      })

      // 生成图片URL
      const imageUrl = result.imageURL || result.data?.[0]?.url

      if (imageUrl) {
        // 保存图片到云存储
        const cloudPath = `images/${articleId}/${position.fileName}`

        try {
          // 注意：实际使用时需要先下载临时文件再上传
          // 这里简化处理，直接返回URL
          generatedImages.push({
            fileName: position.fileName,
            cloudPath: cloudPath,
            cloudUrl: imageUrl,
            prompt: prompt,
            position: position.position
          })
          successCount++

        } catch (uploadError) {
          console.error("上传到云存储失败", uploadError)
          failCount++
        }
      } else {
        console.error("生成图片URL为空")
        failCount++
      }

    } catch (error) {
      console.error(`生成第${i + 1}张图失败`, error)
      failCount++

      // 失败时尝试用轻量级模型重试
      try {
        console.log("尝试用轻量级模型重试...")
        const retryResult = await ai.imageGeneration({
          model: "hunyuan-image-lite",
          prompt: prompt,
          width: 1024,
          height: 576,
          response_format: "url"
        })

        const imageUrl = retryResult.imageURL || retryResult.data?.[0]?.url

        if (imageUrl) {
          const cloudPath = `images/${articleId}/${position.fileName}`
          generatedImages.push({
            fileName: position.fileName,
            cloudPath: cloudPath,
            cloudUrl: imageUrl,
            prompt: prompt,
            position: position.position
          })
          successCount++
        }
      } catch (retryError) {
        console.error("重试也失败", retryError)
      }
    }

    // 延迟避免并发限制
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log("图片生成完成", { successCount, failCount })

  // 保存到数据库
  try {
    await db.collection('articles').add({
      data: {
        articleId: articleId,
        images: generatedImages,
        style: style,
        createdAt: new Date(),
        status: 'completed'
      }
    })
  } catch (dbError) {
    console.error("保存到数据库失败", dbError)
  }

  return {
    success: true,
    images: generatedImages,
    total: generatedImages.length,
    successCount: successCount,
    failCount: failCount
  }
}
