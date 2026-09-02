// src/data/portfolio.ts
import type { PortfolioData } from './types';

// basePath：GitHub Pages 子路径部署时需要前缀
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

function p(path: string): string {
  if (!BASE_PATH) return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  if (path.startsWith('/')) {
    return BASE_PATH + path;
  }
  return BASE_PATH + '/' + path;
}

export const portfolioData: PortfolioData = {
  profile: {
    name: '嗨！我是钱一鹏！',
    nameEn: "Hi！I'm Aubyn！",
    title: 'AI产品经理方向 · 2027届应届生',
    status: '',
    tagline: {
      lines: [
        { text: '不再仅是传统产品经理设计流程与需求，用 PRD 展示说服用户', variant: 'tertiary' },
        { text: '而是用从需求翻译转向了场景拆解、量化效果和技术边界的把控，', variant: 'primary' },
        { text: '产出 Demo 让用户的隐形需求浮出水面，用 Demo 演示打动用户。', variant: 'primary' },
      ],
    },
    avatar: p('/portrait.jpg'),
    bio: '专注于 AI 产品设计与用户体验研究，擅长将复杂技术转化为用户可感知的价值。曾在多家科技公司实习，参与过 3 款 AI 产品从 0 到 1 的落地，累计服务用户超 10 万。相信好的产品始于对人的深度理解。',
    bioParagraphs: [
      '我是钱一鹏 Aubyn。一个热爱于挖掘有趣的 agent 项目并将其落地的产品人。',
      '误闯天家的我：AI 像我的兴奋剂。在产品实习时，我发现团队每天花大量时间使用大模型做数据量大且重复性高的表格整理工作，于是我自己用 Coze 搭了一套工作流。后来我在多个部门推广，根据同事反馈不断迭代，把处理时间压缩了 80%，准确率基本可以达到 90% 以上。',
      '我相信 AI 产品的价值绝不在于技术有多炫酷，而在于能否真正解决用户的问题、提升效率。这就是我想要做的事！',
    ],
    contact: {
      email: 'aubynbear@outlook.com',
      wechat: 'Rinn_Aubyn',
      phone: '13621721130',
      github: 'https://github.com/Auregaga?tab=repositories',
      xiaohongshu: 'Auregaga',
    },
    highlights: [
      {
        id: 'h1',
        icon: '🎯',
        title: '用户洞察',
        description: '深度用户研究与需求分析，擅长从数据中发现机会',
      },
      {
        id: 'h2',
        icon: '🤖',
        title: 'AI 产品思维',
        description: '理解大模型能力边界，设计合理的产品交互方案',
      },
      {
        id: 'h3',
        icon: '📊',
        title: '数据驱动',
        description: '用数据验证假设，持续迭代优化产品体验',
      },
    ],
  },
  navigation: [
    { id: 'about', label: 'About', href: '#about' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'internship', label: 'Work', href: '#internship' },
    { id: 'skills', label: 'Skills', href: '#skills' },
    { id: 'life', label: 'Life', href: '#life' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ],
  projects: [
    {
      id: 'p1',
      name: '项目名称一',
      role: '前端负责人',
      period: '2023.06 - 至今',
      tags: ['React', 'TypeScript', 'Node.js'],
      description: '这是一个占位项目描述，介绍项目的背景、目标和主要功能模块。',
      outcome: '项目上线后用户增长 200%，性能提升 50%',
      link: 'https://example.com',
      images: ['/project1-1.jpg', '/project1-2.jpg'],
    },
    {
      id: 'p2',
      name: '项目名称二',
      role: '全栈开发',
      period: '2022.03 - 2023.05',
      tags: ['Next.js', 'Tailwind CSS', 'PostgreSQL'],
      description: '这是另一个占位项目描述，展示不同类型的项目经验。',
      outcome: '独立完成从设计到上线的全流程',
      images: ['/project2-1.jpg'],
    },
  ],
  showcaseProjects: [
    {
      id: 'ai-bedge',
      name: 'AI 工牌',
      description:
        'AI工牌不执行任务，它站在「Agent 想做的事」和「电脑真正发生的事」之间——审查 Agent 提交的每一步操作计划，按风险 L0–L4 分级，决定放行、要确认、还是直接拦下。面向每一个「让 AI 帮忙操作电脑/文件」的普通用户。',
      mediaType: 'image',
      mediaSrc: p('/projects/cover-ai-bedge.jpg'),
      mediaLayout: 'right-large',
      hasStaircase: false,
      scrollNum: 1,
      link: p('/projects/ai-bedge/'),
    },
    {
      id: 'action-to-skill',
      name: 'Action to Skill',
      description:
        '「做一遍就会」是给不懂代码、不写 Prompt 的普通人做的工具。你在浏览器里把重复操作示范一遍，AI 自动把它抽象成可重复执行的 Skill。之后填参数、点执行，浏览器自动把整件事做完。',
      mediaType: 'image',
      mediaSrc: p('/projects/cover-action-to-skill.jpg'),
      mediaLayout: 'right-large',
      hasStaircase: false,
      scrollNum: 2,
      link: p('/projects/action-to-skill/'),
    },
    {
      id: 'pcb-copilot',
      name: 'PCB Wire Table Copilot',
      description:
        '源于泰莫芯半导体线缆组件产线的真实痛点。我在做产品期间，发现结构工程师手工编制 LM512 等连接器的线序表耗时久、容易出错，于是主导做了 v1 版本并落地到内部使用。v2 是在 v1 基础上，用多 Agent 架构做的能力拓展版。系统用 Vue 3 + Express 搭建前端界面，后端通过 SSE 流式推送 Agent 执行状态，工程师上传连接器图纸 PDF，解析、审核、异常处理三个 Agent 分工协作，产出打线加工和 ATE 导通测试用的线序表（Excel / JSON）。质检不到 100 分，系统拒绝交付。',
      mediaType: 'image',
      mediaSrc: p('/projects/cover-pcb-copilot.jpg'),
      mediaLayout: 'right-large',
      hasStaircase: false,
      scrollNum: 3,
      link: p('/projects/pcb-copilot/'),
    },
    {
      id: 'lifting-platform',
      name: '便携式升降台开发',
      description:
        '基于上海地铁一线维护场景深度调研，量化分析用户痛点，识别"体积大、重量高、搬运困难"三大核心问题，主导产品功能架构设计与三大核心模块拆解，推动材料选型与受力仿真优化。产品顺利交付并通过现场验证，整机重量较原有设备降低约35%，空间利用率提升20%，获上海地铁方面认可。',
      mediaType: 'image',
      mediaSrc: p('/projects/cover-lifting-platform.jpg'),
      mediaLayout: 'right-large',
      hasStaircase: false,
      scrollNum: 4,
    },
    {
      id: 'maintenance-vehicle',
      name: '多功能自动化维护车研发',
      description:
        '针对长路线公路维护中人工作业密度低、人力成本高的问题，主导5人多专业团队完成需求拆解与功能设计，明确机械底盘、控制模块、视觉传感器三大技术路径。制作等比原型车实地测试并调整结构设计，项目顺利结题，获2024年"新迪杯"创新创业大赛二等奖、2025年大学生创新大赛/互联网+三等奖。',
      mediaType: 'image',
      mediaSrc: p('/projects/cover-maintenance-vehicle.png'),
      mediaLayout: 'right-large',
      hasStaircase: false,
      scrollNum: 5,
    },
    {
      id: 'voice-layer',
      name: '实时语音层',
      description:
        '想做一个人人能用的实时语音层——用户自由接入自己的 LLM API 和音色 API，产品只做交互编排和体验打磨。V1 想零成本纯前端，4 小时后因 CORS 毙掉；V2 找到了端到端实时语音 API 的路径，但零成本做不到，需要至少一个 Edge 中继。',
      mediaType: 'image',
      mediaSrc: p('/projects/cover-voice-layer.jpg'),
      mediaLayout: 'right-large',
      hasStaircase: false,
      scrollNum: 6,
      link: p('/projects/voice-layer/'),
    },
  ],
  experiences: [
    {
      id: 'e1',
      company: '某科技公司',
      title: '高级前端工程师',
      period: '2022.01 - 至今',
      description: '负责核心产品的前端架构设计与团队技术选型。',
      achievements: [
        '主导前端架构升级，构建效率提升 60%',
        '建立组件库与设计规范，覆盖 10+ 业务线',
        '带领 5 人团队完成多个重点项目',
      ],
    },
    {
      id: 'e2',
      company: '某互联网公司',
      title: '前端工程师',
      period: '2020.07 - 2021.12',
      description: '参与多个 B 端产品的开发与维护工作。',
      achievements: [
        '独立负责 3 个核心模块的开发',
        '优化首屏加载时间，从 3s 降至 1.2s',
      ],
    },
  ],
  internships: [
    {
      id: 'intern-1',
      number: '01',
      company: '杭州泰莫芯微电子有限公司',
      position: '产品经理实习生',
      period: '2026.06 — 2026.08',
      summary: '主导AI工作流项目落地，将线序表处理效率提升80%，并全程参与512PIN连接器产品定义到试产交付。',
      achievements: [
        '业务链路拆解：完整梳理研发线序表制作全业务流程，识别数据复制、表格整理等大量重复人工操作卡点，评估人工处理效率瓶颈，通过AI工作流替代标准化重复工作。',
        'AI自动化工作流&人机分工：基于Coze平台搭建线序表生成AI工作流与配套Skill，AI负责提取数据生成规范式表格，人工负责数据复核、校验、非标场景修正，规避AI数据错误引发设计风险。',
        '跨部门协同&效果验证：在研发/测试多部门推广AI工具，持续收集一线使用反馈，完成多轮Prompt调优与流程逻辑迭代；量化AI工具落地价值，将单次线序表处理时间压缩80%。',
        '全流程需求落地：对接客户技术诉求，完成需求拆解转化输出PRD，组织3轮内部研发评审+多轮客户评审；主导512PIN连接器从需求定义、方案评估到试产的全流程。',
      ],
      image: p('/internships/intern-1.jpg'),
    },
    {
      id: 'intern-2',
      number: '02',
      company: '上海烟草机械有限责任公司',
      position: '项目管理（数据方向）',
      period: '2025.03 — 2025.08',
      summary: '搭建团队数据看板与进度监控体系，优化任务分配策略，实现团队周度进度稳定超预期约5%。',
      achievements: [
        '搭建团队数据看板与进度监控体系：基于腾讯文档设计团队任务分配表与实时登记，建立"任务量-初审完成量-复审完成量"三级监控指标，实现组员工作进度的可视化追踪。',
        '基于能力画像任务分配：深入了解组内成员技术能力与工作负荷，建立人员能力与工作量级分类，借助VLOOKUP实现任务分配时的人员匹配，优化团队整体产出效率。',
        '数据进度预警与优化：通过数据透视表对历史完成数据进行工作积压识别，提前预警风险任务；持续优化任务分配策略，团队周度进度稳定超预期约5%。',
        '部门数据确认与汇报：统筹组内实时数据录入，定期输出进度报告，确保数据信息同步准确，基于数据向项目经理进行汇报。',
      ],
      image: p('/internships/intern-2.jpg'),
    },
  ],
  skills: [
    {
      key: 'product',
      label: '产品能力',
      items: [
        { name: '需求拆解与场景分析', level: 90 },
        { name: 'PRD 撰写与输出', level: 88 },
        { name: '功能优化与迭代闭环', level: 85 },
        { name: '项目进度与风险管控', level: 82 },
        { name: '成本控制与 ROI 评估', level: 78 },
        { name: '用户反馈驱动迭代', level: 86 },
        { name: '跨部门协同推进', level: 84 },
      ],
    },
    {
      key: 'technical',
      label: '技术理解',
      items: [
        { name: 'LLM 选型与能力边界判断', level: 82 },
        { name: 'Agent 架构与工作流设计', level: 85 },
        { name: 'Prompt Engineering', level: 90 },
        { name: 'Vibe Coding 协作开发', level: 78 },
        { name: '前端开发基础认知', level: 70 },
        { name: 'API 对接与数据流理解', level: 72 },
      ],
    },
    {
      key: 'ai',
      label: 'AI 工具',
      items: [
        { name: 'Coze / 扣子 工作流搭建', level: 92 },
        { name: 'Coze Skill 开发与调优', level: 88 },
        { name: 'Codex / Claude Code 智能编码', level: 85 },
        { name: 'Gemini 多模态综合产出', level: 80 },
        { name: 'Figma AI 设计辅助', level: 75 },
        { name: 'Dify / Flowise 低代码平台', level: 72 },
      ],
    },
    {
      key: 'data',
      label: '设计 & 数据',
      items: [
        { name: 'Figma / 墨刀 原型设计', level: 85 },
        { name: 'ProcessOn 流程图绘制', level: 82 },
        { name: 'Xmind 思维导图梳理', level: 80 },
        { name: 'Excel 高级数据处理', level: 88 },
        { name: '数据看板与进度监控', level: 82 },
        { name: 'SolidWorks 三维建模', level: 75 },
        { name: 'Keyshot 渲染', level: 70 },
      ],
    },
  ],
  lifePosts: [
    {
      id: 'life-1',
      title: '东京塔下',
      author: 'Aubyn',
      avatar: p('/life/avatar.jpg'),
      image: p('/life/image1.jpeg'),
    },
    {
      id: 'life-2',
      title: '我的第一只宠物，还想听他半夜跑跑轮把我吵醒',
      author: 'Aubyn',
      avatar: p('/life/avatar.jpg'),
      image: p('/life/image2.jpeg'),
    },
    {
      id: 'life-3',
      title: '当猫奴真正去养一只小茂',
      author: 'Aubyn',
      avatar: p('/life/avatar.jpg'),
      image: p('/life/image3.jpeg'),
    },
    {
      id: 'life-4',
      title: '我不懂什么是蓝调，但我知道这是我在北海道为数不多动手记录下来的美景之一',
      author: 'Aubyn',
      avatar: p('/life/avatar.jpg'),
      image: p('/life/image4.jpeg'),
    },
    {
      id: 'life-5',
      title: '南方小朋友制作的第一个雪喵',
      author: 'Aubyn',
      avatar: p('/life/avatar.jpg'),
      image: p('/life/image5.jpeg'),
    },
    {
      id: 'life-6',
      title: '人生第一次因为一项运动结实这么多伙伴',
      author: 'Aubyn',
      avatar: p('/life/avatar.jpg'),
      image: p('/life/image6.jpeg'),
    },
    {
      id: 'life-7',
      title: '上辈子没吃的美食在顺德给我补上了',
      author: 'Aubyn',
      avatar: p('/life/avatar.jpg'),
      image: p('/life/image7.jpeg'),
    },
    {
      id: 'life-8',
      title: '还有几个暑假能再复现大阪的那个夏天？',
      author: 'Aubyn',
      avatar: p('/life/avatar.jpg'),
      image: p('/life/image8.jpeg'),
    },
    {
      id: 'life-9',
      title: '和身后的老家伙刚完成河口湖35km骑行，可靠旅行伙伴也不一定非得是人',
      author: 'Aubyn',
      avatar: p('/life/avatar.jpg'),
      image: p('/life/image9.jpeg'),
    },
  ],
};
