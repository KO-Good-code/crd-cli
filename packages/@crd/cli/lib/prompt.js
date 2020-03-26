// 配置输出

const prompts = [
  {
    type: "list",
    name: "template",
    message: "选择模板类型",
    choices: [
      "react",
      "vue"
    ],
    default: "react"
  },
  {
    type: "list",
    name: "lang",
    message:"选择编程语言",
    choices: [
      "JavaScript",
      "TypeScript",
    ],
    default: "JavaScript"
  },
  {
    type: "list",
    name: "style",
    message:"选择css样式",
    choices: [
      "stylus",
      "scss",
      "css",
    ],
    default: "css"
  }
]

module.exports = prompts