// cloudfunctions/article-analyzer/index.js
const cloud = require("wx-server-sdk")
cloud.init()
const db = cloud.database()
const _ = db.Command
const ai = cloud.ai()

exports.main = async (event, context) => {
  const { article, style = "auto" } = event

  console.log("开始分析文章...", { articleLength: article.length })

  try {
    // 1. 分析文章结构，找出需要配图的位置
    const structureAnalysis = await ai.textGeneration({
      model: "hunyuan-lite",
      messages: [
        {
          role: "system",
          content: `你是专业的文章配图分析师。
任务：分析文章结构，找出需要配图的位置。

配图触发条件：
- 段落超过200字
- 出现核心概念（如"AI"、"算法"、"趋势"、"技术"）
- 有数据/统计需要可视化
- 流程步骤超过3步
- 小标题后
- 抽象概念需要解释

配图策略：
- "宁多勿少"：多生成让用户挑选
- 根据文章长度自动调整数量（3-8张）
- 避免重复信息
- 配图应该辅助理解，而非装饰

输出格式（必须是有效的JSON）：
{
  "imagePositions": [
    {
      "position": 3,
      "purpose": "强化论点|可视化数据|流程图解|具象概念",
      "visualContent": "具体的画面描述",
      "fileName": "img_01.png"
    }
  ],
  "total": 5,
  "reason": "选择这些位置的理由"
}

重要：只输出JSON，不要有其他文字！`
        },
        {
          role: "user",
          content: `分析以下文章，找出需要配图的位置：\n\n${article}`
        }
      ]
    })

    // 解析JSON结果
    let analysisResult
    try {
      const content = structureAnalysis.choices[0].message.content.trim()
      // 清理可能的markdown标记
      const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      analysisResult = JSON.parse(jsonContent)
    } catch (e) {
      console.error("JSON解析失败", e)
      // 如果解析失败，使用默认配置
      analysisResult = {
        imagePositions: [
          {
            position: 2,
            purpose: "强化论点",
            visualContent: "文章核心概念的可视化表现",
            fileName: "img_01.png"
          },
          {
            position: 5,
            purpose: "具象概念",
            visualContent: "关键概念的图解",
            fileName: "img_02.png"
          }
        ],
        total: 2,
        reason: "AI分析失败，使用默认配置"
      }
    }

    // 2. 如果是自动模式，匹配风格
    let selectedStyle = style
    if (style === "auto") {
      try {
        const styleMatch = await ai.textGeneration({
          model: "hunyuan-lite",
          messages: [
            {
              role: "system",
              content: `根据文章内容推荐配图风格。

风格库：
- tech: 科技、AI、算法、代码、技术文档
- warm: 个人成长、情感、生活、励志
- minimal: 专业、商务、简洁、报告
- playful: 趣味、轻松、创意、年轻
- notion: 教程、知识分享、笔记、学习
- business: 商业、金融、财报、市场
- nature: 健康、环保、生态、生活
- creative: 设计、艺术、创意、美学
- illustration: 通用场景、综合内容

只输出风格名称，如：tech，不要有其他文字！`
            },
            {
              role: "user",
              content: article.substring(0, 800)
            }
          ]
        })
        selectedStyle = styleMatch.choices[0].message.content.trim().toLowerCase()
      } catch (e) {
        console.error("风格匹配失败", e)
        selectedStyle = "tech" // 默认风格
      }
    }

    console.log("分析完成", {
      imageCount: analysisResult.imagePositions.length,
      style: selectedStyle
    })

    return {
      success: true,
      imagePositions: analysisResult.imagePositions,
      total: analysisResult.total,
      style: selectedStyle,
      reason: analysisResult.reason
    }

  } catch (error) {
    console.error("文章分析失败", error)
    return {
      success: false,
      error: error.message
    }
  }
}
