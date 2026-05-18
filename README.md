# Epoch ✨

一个为大语言模型打造的**可视化交互界面**。Epoch 将传统的文本对话转化为**交互式**、**组件驱动**的体验。每个 AI 回答都被渲染为一个**动态界面**，包含**可点击元素**、**动态表单**、**实时数据可视化**和**可探索的 UI** —— 让 LLM 交互变得直观、引人入胜且真正可视化。

![Epoch 截图](./.assets/screenshot.png)

## 项目动机

传统的 LLM 交互从根本上受限于其文本优先的特性。即使有静态可视化，用户仍然是信息的被动消费者，无法在响应本身内进行双向交互。

Epoch 通过结构化的组件架构消除了这一限制。LLM 生成表示 UI 组件树的类型安全 JSON 模式，这些模式被递归渲染为完全交互式的 React 界面。每个组件——无论是数据可视化、表单输入还是操作按钮——都与对话上下文保持双向状态流。用户交互被序列化回对话中，使 LLM 能够基于先前的界面状态构建，创造真正有状态、可探索的体验。

这种架构将 LLM 从文本生成器转变为界面编译器，每个响应都是一个可组合的交互式组件树，而不是静态标记。

## 核心特性

- **30+ 交互式组件**：完整的 UI 原语，从布局容器（Flex、Grid、Hero）到数据可视化（图表、统计、指标）和表单控件（输入框、选择器、文本域）
- **实时流式传输**：通过 Server-Sent Events 流式传输部分对象更新，LLM 生成组件树时在客户端进行渐进式渲染
- **有状态的对话上下文**：所有用户交互（按钮点击、表单提交、卡片选择）都被序列化并反馈到对话历史中
- **递归渲染引擎**：UIRenderer 递归遍历组件树，在整个树深度中维护表单状态和操作处理器
- **集成搜索**：可插拔的搜索层，支持隐私友好的 SearxNG 或 Serper API 集成，可在生成的界面中直接进行实时网络和图像搜索
- **本地 LLM 支持**：通过 Ollama 集成完全离线运行 - 无 API 成本、完全隐私，支持 Llama、Mistral、Qwen 等开源模型
- **对话历史管理**：侧边栏提供完整的对话历史记录，支持创建、切换和删除对话
- **Docker 容器化**：一键部署，通过 `icheerme/epoch:latest` 镜像快速启动

## 可用组件

Epoch 支持丰富的 UI 组件类型：

- **布局组件**：Flex、Grid、Card、Hero、Separator
- **内容组件**：Text、Blockquote、Image、List、CodeBlock、Gallery、Table
- **数据可视化**：Chart、Stats、Metric、Progress、Badge
- **交互组件**：Button、Input、Textarea、Select、Checkbox、Accordion、Tabs
- **专业组件**：Timeline、Comparison、Feature、Alert

## 工作原理

1. **消息接收**：用户输入被添加到对话历史并发送到 API 路由
2. **结构化输出生成**：后端使用 `z.lazy()` 的递归 Zod 模式调用 LLM，用于自引用组件定义，强制执行类型安全的 JSON 生成
3. **服务器推送事件（SSE）流式传输**：LLM 生成 token 时，部分 JSON 对象通过 SSE 流式传输，模式验证器确保每个块的结构完整性
4. **递归组件渲染**：`UIRenderer` 使用判别联合模式匹配递归遍历组件树，为每个节点实例化 React 渲染器，同时传播操作处理器和表单状态
5. **双向状态流**：用户交互（按钮操作、表单输入）被序列化为自然语言描述并添加到对话历史中，保持有状态的上下文
6. **搜索集成**：带有 `imageQuery` 或 `searchQuery` 字段的组件会触发对 SearxNG 或 Serper 的异步调用（基于配置），进行实时网络/图像搜索，结果在内存中缓存
7. **有状态的重新生成**：LLM 处理交互上下文并生成新的组件树，在对话轮次中创建迭代式、可探索的界面

## 安装部署

### 前置要求

- Node.js 18+
- **以下任一项**：
  - OpenAI API 密钥（用于云端模型）
  - 本地安装 [Ollama](https://ollama.ai)（用于本地 LLM - **推荐用于隐私和成本节省**）
- 搜索提供商（至少配置一个）：
  - SearxNG 实例 URL（自托管或托管）用于隐私友好的元搜索
  - Serper API 密钥，从 [serper.dev](https://serper.dev) 获取，用于 Google 驱动的搜索

### 方式一：Docker 部署（推荐）

使用 Docker 快速部署，无需手动配置环境：

```bash
# 拉取镜像
docker pull icheerme/epoch:latest

# 使用 OpenAI 运行容器
docker run -d \
  -p 3000:3000 \
  -e MODEL_NAME=gpt-4o-mini \
  -e USE_OPENAI=true \
  -e OPENAI_API_KEY=your_api_key_here \
  -e OPENAI_API_URL=https://api.openai.com/v1 \
  -e SEARXNG_API_URL=http://your-searxng-instance \
  --name epoch \
  icheerme/epoch:latest
```

或使用 Ollama 本地模型：

```bash
docker run -d \
  -p 3000:3000 \
  -e MODEL_NAME=llama3.2:3b \
  -e USE_OLLAMA=true \
  -e OLLAMA_API_URL=http://host.docker.internal:11434/api \
  -e SEARXNG_API_URL=http://your-searxng-instance \
  --name epoch \
  icheerme/epoch:latest
```

访问 [http://localhost:3000](http://localhost:3000) 即可使用。

### 方式二：本地开发部署

<!-- markdownlint-disable MD029 -->

1. 克隆仓库：

```bash
git clone https://github.com/itzcrazykns/epoch.git
cd epoch
```

2. 重命名环境文件并配置：

```bash
# Windows
ren .env.example .env

# macOS/Linux
mv .env.example .env
```

3. 打开 `.env` 并配置：

#### 选项 A：使用 OpenAI（云端）

```env
MODEL_NAME=gpt-4o-mini
USE_OPENAI=true
OPENAI_API_KEY=your_api_key_here
OPENAI_API_URL=https://api.openai.com/v1
```

#### 选项 B：使用 Ollama（本地、私密、免费）

```env
MODEL_NAME=llama3.2:3b
USE_OLLAMA=true
OLLAMA_API_URL=http://localhost:11434/api
```

#### 搜索提供商（必需 - 至少配置一个）

```env
SEARXNG_API_URL=  # 设置为你的 SearxNG 实例 URL（例如 http://localhost:8080）
SERPER_API_KEY=   # 设置为你的 Serper API 密钥
```

4. 安装依赖：

```bash
npm install
```

5. 构建项目：

```bash
npm run build
```

6. 启动应用：

```bash
npm run start
```

7. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

<!-- markdownlint-enable MD029 -->

### 开发模式

使用热重载运行开发模式：

```bash
npm run dev
```

## 技术栈

- **框架**：Next.js 16 with App Router
- **语言**：TypeScript
- **样式**：Tailwind CSS 4
- **UI 组件**：shadcn/ui + Radix UI
- **AI SDK**：Vercel AI SDK
- **图表**：Recharts
- **模式验证**：Zod
- **容器化**：Docker

## 路线图

### 🚧 进行中

- **更多组件**
  - 带排序/过滤/分页的数据表格
  - 日历和日期选择器组件
  - 地图集成用于基于位置的界面
  - 视频和音频播放器
  - 文件上传和预览
  - 拖放界面

- **扩展模型支持**
  - LM Studio 集成
  - 自定义模型端点
  - Anthropic Claude 支持
  - Google Gemini 集成

- **网络搜索集成**
  - 自动来源引用
  - 实时内容抓取能力

- **增强的 UI/UX**
  - 深色模式支持
  - 自定义主题引擎
  - 动画预设
  - 更好的无障碍性（WCAG 2.1 AA 合规）
  - 移动端响应式优化
  - 多语言支持

### 🔮 未来计划

- **多模态支持**
  - 图像上传和视觉分析
  - 语音输入/输出集成
  - PDF 文档解析和交互

- **高级功能**
  - 多智能体编排
  - 对话记忆和上下文持久化
  - 用户认证和配置文件
  - 对话导出
  - 将界面导出为 React/Vue/HTML

- **开发者体验**
  - 自定义组件 SDK
  - 扩展插件系统
  - 可视化组件构建器
  - 在线演示和文档

## 贡献

我们非常欢迎贡献！Epoch 的设计初衷就是可扩展和社区驱动的。以下是你可以贡献的方式：

### 贡献方式

- **🐛 Bug 报告**：发现问题？请提交详细的 bug 报告，包含复现步骤
- **💡 功能请求**：有新组件或功能的想法？在讨论区分享它们
- **🔧 Pull Request**：提交 PR 修复 bug、添加新组件或改进性能
- **📖 文档**：帮助改进文档、添加示例或创建教程
- **🎨 组件开发**：构建新的 UI 组件渲染器或扩展现有组件

### 开发指南

1. Fork 仓库并创建功能分支
2. 遵循现有的代码结构和 TypeScript 约定
3. 将新组件添加到 `src/components/llm-components/`
4. 在 `src/app/api/generate/route.ts` 中更新 Zod 模式以支持新组件类型
5. 使用不同的 LLM 输出进行全面测试
6. 提交 PR 时附上清晰的描述和示例

对于重大更改，请先开启 issue 讨论提议的更改。

## 致谢

本项目 fork 自 [itzcrazykns/epoch](https://github.com/itzcrazykns/epoch)，感谢原作者的出色工作。

### 原项目

- **原作者**：itzcrazykns
- **原项目地址**：[https://github.com/itzcrazykns/epoch](https://github.com/itzcrazykns/epoch)
- **原作者联系方式**：
  - 📧 邮箱：`kushagra20103[at]gmail.com`
  - 💬 Discord：`itzcrazykns`

### 本 Fork 版本

本版本在原项目基础上进行了以下改进：
- ✨ 新增 Table、Blockquote 和 Checkbox 组件
- 🎨 统一的 UI/UX 风格优化
- 📝 侧边栏对话历史管理
- 🐳 Docker 容器化部署支持
- 🌐 兼容 OpenAI Completions API 格式
- 🔧 新增 OPENAI_API_URL 环境变量配置

如有问题或建议，欢迎提交 Issue 或 Pull Request。

---

如果你喜欢 Epoch，请在 GitHub 上给原项目和本项目一个 ⭐！
