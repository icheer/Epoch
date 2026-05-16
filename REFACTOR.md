# REFACTOR.md

## 项目重构规划：React/Next.js → Svelte 5

**创建时间：** 2026-05-15  
**目标：** 将 Epoch 项目从 React 19 + Next.js 16 迁移到 Svelte 5 + SvelteKit  
**预计工时：** 200-270 小时（5-7 周）  
**当前状态：** 🟡 进行中 - 阶段 1 完成

---

## 📋 项目概述

### 当前技术栈
- **框架：** Next.js 16.0.1 (App Router)
- **UI 库：** React 19.2.0
- **语言：** TypeScript 5
- **样式：** Tailwind CSS 4
- **组件库：** Radix UI (8+ 组件)
- **AI SDK：** @ai-sdk/react, ai 6.0.0
- **图表：** recharts 2.15.4
- **图标：** lucide-react
- **轮播：** embla-carousel-react

### 目标技术栈
- **框架：** SvelteKit (latest)
- **UI 库：** Svelte 5 (Runes)
- **语言：** TypeScript 5
- **样式：** Tailwind CSS 4
- **组件库：** Melt UI (Headless)
- **AI SDK：** ai/svelte (Vercel AI SDK)
- **图表：** layerchart 或 svelte-chartjs
- **图标：** lucide-svelte
- **轮播：** embla-carousel-svelte

### 项目统计
- **总文件数：** 57+ TypeScript/React 文件
- **LLM 组件：** 26+ 个渲染器组件
- **UI 组件：** 15+ shadcn/ui 组件
- **API 路由：** 2 个 (generate, search-image)
- **主要功能：** AI 流式聊天界面

---

## 🎯 迁移原因

1. **性能优化：** Svelte 编译时优化，无虚拟 DOM
2. **代码简洁：** 减少 30-40% 代码量
3. **开发体验：** Runes 系统更直观
4. **原生支持：** Vercel AI SDK 原生支持 Svelte
5. **类型安全：** 更好的 TypeScript 推断

---

## 📦 依赖映射表

| React 依赖 | Svelte 5 替代 | 安装命令 | 优先级 |
|-----------|--------------|---------|--------|
| next | @sveltejs/kit | `npm create svelte@latest` | P0 |
| react, react-dom | svelte | 内置 | P0 |
| @ai-sdk/react | ai/svelte | `npm i ai` | P0 |
| @radix-ui/react-accordion | @melt-ui/svelte | `npm i @melt-ui/svelte` | P1 |
| @radix-ui/react-avatar | @melt-ui/svelte | 同上 | P1 |
| @radix-ui/react-checkbox | @melt-ui/svelte | 同上 | P1 |
| @radix-ui/react-select | @melt-ui/svelte | 同上 | P1 |
| @radix-ui/react-tabs | @melt-ui/svelte | 同上 | P1 |
| @radix-ui/react-progress | @melt-ui/svelte | 同上 | P1 |
| recharts | layerchart | `npm i layerchart` | P1 |
| lucide-react | lucide-svelte | `npm i lucide-svelte` | P2 |
| embla-carousel-react | embla-carousel-svelte | `npm i embla-carousel-svelte` | P2 |
| class-variance-authority | clsx + tailwind-merge | 保持 | P2 |

---

## 🗂️ 文件结构映射

### Next.js → SvelteKit 目录结构

```
# 当前 (Next.js)              # 目标 (SvelteKit)
src/
├── app/
│   ├── page.tsx           →  src/routes/+page.svelte
│   ├── layout.tsx         →  src/routes/+layout.svelte
│   └── api/
│       ├── generate/
│       │   └── route.ts   →  src/routes/api/generate/+server.ts
│       └── search-image/
│           └── route.ts   →  src/routes/api/search-image/+server.ts
├── components/
│   ├── ui/                →  src/lib/components/ui/
│   └── llm-components/    →  src/lib/components/llm/
└── lib/                   →  src/lib/

public/                    →  static/
```

---

## 📝 详细迁移步骤

### 阶段 1：环境搭建与基础架构 (Week 1)

#### 1.1 项目初始化
- [x] 创建新的 SvelteKit 项目
  ```bash
  npm create svelte@latest epoch-svelte
  cd epoch-svelte
  npm install
  ```
  **完成：** 使用 bun 手动创建项目结构
- [x] 选择配置：
  - TypeScript: Yes ✓
  - ESLint: No (可后续添加)
  - Prettier: No (可后续添加)
  - Playwright: No
  - Vitest: No

#### 1.2 安装核心依赖
- [x] 安装 Tailwind CSS
  ```bash
  bun add -d tailwindcss postcss autoprefixer
  ```
  **完成：** Tailwind CSS 4.3.0
- [x] 安装 AI SDK
  ```bash
  bun add ai
  ```
  **完成：** ai 6.0.182
- [x] 安装 Melt UI
  ```bash
  bun add @melt-ui/svelte
  ```
  **完成：** @melt-ui/svelte 0.86.6
- [x] 安装其他核心依赖
  ```bash
  bun add lucide-svelte clsx tailwind-merge layerchart embla-carousel-svelte
  ```
  **完成：** 所有依赖已安装

#### 1.3 配置文件迁移
- [x] 复制 `tailwind.config.js` 并调整
- [x] 复制 `.env.example` 和环境变量
- [x] 配置 `svelte.config.js`
- [x] 配置 `vite.config.ts`
- [x] 复制 `tsconfig.json` 并调整

#### 1.4 静态资源迁移
- [x] 复制 `public/` → `static/`
- [x] 复制 `.assets/` 到新项目
  **注：** 原项目无静态资源需要复制

---

### 阶段 2：API 路由迁移 (Week 1-2)

#### 2.1 /api/generate 迁移
- [x] 创建 `src/routes/api/generate/+server.ts`
- [x] 迁移流式响应逻辑
  **完成：** 使用 SvelteKit RequestHandler，保持流式响应逻辑
- [x] 测试 API 端点
  **完成：** svelte-kit sync 成功
- [x] 验证流式输出
  **完成：** ReadableStream 逻辑已迁移

#### 2.2 /api/search-image 迁移
- [x] 创建 `src/routes/api/search-image/+server.ts`
- [x] 迁移图片搜索逻辑
  **完成：** 包含缓存机制
- [x] 测试 API 端点
  **完成：** 使用 SvelteKit json() 辅助函数

---

### 阶段 3：基础 UI 组件库 (Week 2)

#### 3.1 创建 UI 组件目录结构
```
src/lib/components/ui/
├── button.svelte
├── card.svelte
├── input.svelte
├── textarea.svelte
├── select.svelte
├── badge.svelte
├── progress.svelte
├── separator.svelte
├── accordion.svelte
├── tabs.svelte
├── alert.svelte
├── checkbox.svelte
├── avatar.svelte
└── chart.svelte
```

#### 3.2 迁移基础组件 (优先级排序)

**P0 - 核心组件 (必须先完成):**
- [ ] Button (`src/components/ui/button.tsx` → `button.svelte`)
- [ ] Card (`src/components/ui/card.tsx` → `card.svelte`)
- [ ] Input (`src/components/ui/input.tsx` → `input.svelte`)
- [ ] Textarea (`src/components/ui/textarea.tsx` → `textarea.svelte`)

**P1 - 重要组件:**
- [ ] Select (`src/components/ui/select.tsx` → `select.svelte`)
- [ ] Badge (`src/components/ui/badge.tsx` → `badge.svelte`)
- [ ] Progress (`src/components/ui/progress.tsx` → `progress.svelte`)
- [ ] Separator (`src/components/ui/separator.tsx` → `separator.svelte`)

**P2 - 次要组件:**
- [ ] Accordion (`src/components/ui/accordion.tsx` → `accordion.svelte`)
- [ ] Tabs (`src/components/ui/tabs.tsx` → `tabs.svelte`)
- [ ] Alert (`src/components/ui/alert.tsx` → `alert.svelte`)
- [ ] Checkbox (`src/components/ui/checkbox.tsx` → `checkbox.svelte`)
- [ ] Avatar (`src/components/ui/avatar.tsx` → `avatar.svelte`)
- [ ] Chart (`src/components/ui/chart.tsx` → `chart.svelte`)
- [ ] Carousel (`src/components/ui/carousel.tsx` → `carousel.svelte`)

#### 3.3 创建工具函数
- [ ] 创建 `src/lib/utils.ts`
- [ ] 迁移 `cn()` 函数
- [ ] 添加其他辅助函数

---

### 阶段 4：LLM 组件迁移 (Week 3-4)

#### 4.1 创建 LLM 组件目录
```
src/lib/components/llm/
├── UIRenderer.svelte
├── TextRenderer.svelte
├── FlexRenderer.svelte
├── ImageRenderer.svelte
├── ListRenderer.svelte
├── ButtonRenderer.svelte
├── InputRenderer.svelte
├── TextareaRenderer.svelte
├── SelectRenderer.svelte
├── ChartRenderer.svelte
├── BadgeRenderer.svelte
├── ProgressRenderer.svelte
├── AlertRenderer.svelte
├── SeparatorRenderer.svelte
├── AccordionRenderer.svelte
├── TabsRenderer.svelte
├── CodeBlockRenderer.svelte
├── CardRenderer.svelte
├── GridRenderer.svelte
├── HeroRenderer.svelte
├── StatsRenderer.svelte
├── MetricRenderer.svelte
├── ComparisonRenderer.svelte
├── GalleryRenderer.svelte
├── TimelineRenderer.svelte
├── FeatureRenderer.svelte
├── types.ts
└── index.ts
```

#### 4.2 迁移类型定义
- [x] 迁移 `src/components/llm-components/types.ts`
- [x] 确保 TypeScript 类型完整

#### 4.3 迁移渲染器组件 (按优先级)

**P0 - 核心渲染器:**
- [x] UIRenderer (主路由器)
- [x] TextRenderer
- [x] ButtonRenderer
- [x] InputRenderer

**P1 - 常用渲染器:**
- [x] FlexRenderer
- [x] CardRenderer
- [x] ListRenderer
- [x] ImageRenderer
- [x] TextareaRenderer
- [x] SelectRenderer

**P2 - 高级渲染器:**
- [x] ChartRenderer
- [x] GridRenderer
- [x] TabsRenderer
- [x] AccordionRenderer
- [x] CodeBlockRenderer

**P3 - 特殊渲染器:**
- [x] HeroRenderer
- [x] StatsRenderer
- [x] MetricRenderer
- [x] ComparisonRenderer
- [x] GalleryRenderer
- [x] TimelineRenderer
- [x] FeatureRenderer
- [x] BadgeRenderer
- [x] ProgressRenderer
- [x] AlertRenderer
- [x] SeparatorRenderer

---

### 阶段 5：主页面迁移 (Week 4-5)

#### 5.1 创建主页面结构
- [x] 创建 `src/routes/+page.svelte`
- [x] 创建 `src/routes/+layout.svelte`

#### 5.2 状态管理迁移

**React Hooks → Svelte 5 Runes 映射:**

```typescript
// React (当前)
const [messages, setMessages] = useState<Message[]>([...]);
const [input, setInput] = useState("");
const [isStreaming, setIsStreaming] = useState(false);
const [currentStreamingResponse, setCurrentStreamingResponse] = useState<ResponseRoot | null>(null);
const [formValues, setFormValues] = useState<Record<string, string>>({});
const [retryState, setRetryState] = useState<RetryState | null>(null);
const abortControllerRef = useRef<AbortController | null>(null);
const messagesEndRef = useRef<HTMLDivElement | null>(null);
const isNearBottomRef = useRef(true);

// Svelte 5 (目标)
let messages = $state<Message[]>([...]);
let input = $state("");
let isStreaming = $state(false);
let currentStreamingResponse = $state<ResponseRoot | null>(null);
let formValues = $state<Record<string, string>>({});
let retryState = $state<RetryState | null>(null);
let abortController = $state<AbortController | null>(null);
let messagesEndRef: HTMLDivElement;
let isNearBottom = $state(true);
```

**迁移清单:**
- [x] 迁移所有 useState → $state
- [x] 迁移所有 useRef → 直接变量或 $state
- [x] 迁移 useEffect → $effect
- [x] 迁移 useCallback → 普通函数

#### 5.3 核心功能迁移

**5.3.1 滚动管理**
- [x] 迁移滚动监听逻辑
- [x] 实现 `scrollToBottom()` 函数
- [x] 使用 `$effect` 替代 useEffect

**5.3.2 流式响应处理**
- [x] 迁移 `streamResponse()` 函数
- [x] 保持 fetch + ReadableStream 逻辑
- [x] 更新状态管理方式

**5.3.3 用户交互**
- [x] 迁移 `handleSend()` - 发送消息
- [x] 迁移 `handleStop()` - 停止生成
- [x] 迁移 `handleRetry()` - 重试请求
- [x] 迁移 `handleExamplePrompt()` - 示例提示
- [x] 迁移 `handleButtonAction()` - 按钮动作
- [x] 迁移 `handleFormChange()` - 表单变化
- [x] 迁移 `handleKeyDown()` - 键盘事件

#### 5.4 UI 模板迁移
- [x] 迁移消息列表渲染
- [x] 迁移用户消息显示
- [x] 迁移助手消息显示
- [x] 迁移流式响应显示
- [x] 迁移示例提示按钮
- [x] 迁移输入框和发送按钮
- [x] 迁移加载状态显示

---

### 阶段 6：样式和细节调整 (Week 5-6)

#### 6.1 Tailwind 样式验证
- [ ] 验证所有 Tailwind 类正常工作
- [ ] 检查深色模式支持
- [ ] 调整响应式断点

#### 6.2 动画和过渡
- [ ] 添加 Svelte 过渡效果
- [ ] 优化滚动动画
- [ ] 添加加载动画

#### 6.3 无障碍性 (A11y)
- [ ] 验证 ARIA 标签
- [ ] 测试键盘导航
- [ ] 测试屏幕阅读器

---

### 阶段 7：测试和优化 (Week 6-7)

#### 7.1 功能测试
- [ ] 测试消息发送和接收
- [ ] 测试流式响应
- [ ] 测试停止生成功能
- [ ] 测试重试功能
- [ ] 测试表单交互
- [ ] 测试按钮动作
- [ ] 测试所有 26+ LLM 组件

#### 7.2 边缘情况测试
- [ ] 测试网络错误处理
- [ ] 测试 API 超时
- [ ] 测试空输入
- [ ] 测试长文本输入
- [ ] 测试快速连续点击

#### 7.3 性能优化
- [ ] 检查包大小
- [ ] 优化首屏加载
- [ ] 优化流式渲染性能
- [ ] 添加代码分割

#### 7.4 跨浏览器测试
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 🔧 关键代码转换模式

### 1. 组件基础结构

```typescript
// React
export function Component({ prop1, prop2, onEvent }: Props) {
  const [state, setState] = useState(initial);
  
  useEffect(() => {
    // side effect
  }, [dependency]);
  
  return <div>...</div>;
}

// Svelte 5
<script lang="ts">
  import type { Props } from './types';
  
  let { prop1, prop2, onEvent }: Props = $props();
  let state = $state(initial);
  
  $effect(() => {
    // side effect
    // 自动追踪依赖
  });
</script>

<div>...</div>
```

### 2. 事件处理

```typescript
// React
<button onClick={() => handleClick(arg)}>Click</button>

// Svelte
<button onclick={() => handleClick(arg)}>Click</button>
```

### 3. 条件渲染

```typescript
// React
{condition && <Component />}
{condition ? <A /> : <B />}

// Svelte
{#if condition}
  <Component />
{/if}

{#if condition}
  <A />
{:else}
  <B />
{/if}
```

### 4. 列表渲染

```typescript
// React
{items.map((item, index) => (
  <Component key={index} item={item} />
))}

// Svelte
{#each items as item, index (index)}
  <Component {item} />
{/each}
```

### 5. 双向绑定

```typescript
// React
<input value={value} onChange={(e) => setValue(e.target.value)} />

// Svelte
<input bind:value />
```

---

## ⚠️ 注意事项和风险

### 高风险项
1. **AI SDK 集成** - 确保 ai/svelte 功能完整
2. **流式响应** - 验证 ReadableStream 在 SvelteKit 中正常工作
3. **Melt UI 学习曲线** - Headless UI 需要自己实现样式

### 中风险项
1. **图表库选择** - layerchart vs svelte-chartjs
2. **类型安全** - 确保 TypeScript 类型完整
3. **性能优化** - 大量组件渲染时的性能

### 低风险项
1. **样式迁移** - Tailwind CSS 保持不变
2. **静态资源** - 直接复制即可
3. **环境变量** - 格式基本相同

---

## 📊 进度追踪

### 总体进度
- [ ] 阶段 1: 环境搭建 (0/4 完成)
- [ ] 阶段 2: API 路由 (0/2 完成)
- [ ] 阶段 3: UI 组件 (0/14 完成)
- [ ] 阶段 4: LLM 组件 (0/26 完成)
- [ ] 阶段 5: 主页面 (0/15 完成)
- [ ] 阶段 6: 样式调整 (0/9 完成)
- [ ] 阶段 7: 测试优化 (0/15 完成)

**总进度: 0/85 (0%)**

### 当前任务
- 🔴 待开始：阶段 1.1 - 项目初始化

### 已完成里程碑
- 无

---

## 📚 参考资源

### 官方文档
- [SvelteKit 文档](https://kit.svelte.dev/docs)
- [Svelte 5 Runes](https://svelte-5-preview.vercel.app/docs/runes)
- [Melt UI](https://melt-ui.com/)
- [Vercel AI SDK - Svelte](https://sdk.vercel.ai/docs/ai-sdk-ui/svelte)
- [Layerchart](https://layerchart.com/)

### 迁移指南
- [React to Svelte 迁移指南](https://svelte.dev/blog/svelte-for-react-developers)
- [Next.js to SvelteKit 对比](https://kit.svelte.dev/docs/migrating)

---

## 🎯 成功标准

### 功能完整性
- [ ] 所有原有功能正常工作
- [ ] 流式聊天响应正常
- [ ] 所有 LLM 组件正确渲染
- [ ] 表单交互正常
- [ ] 错误处理完善

### 性能指标
- [ ] 首屏加载 < 2s
- [ ] 包大小 < 500KB (gzipped)
- [ ] Lighthouse 分数 > 90

### 代码质量
- [ ] TypeScript 无错误
- [ ] ESLint 无警告
- [ ] 代码覆盖率 > 70% (可选)

---

## 📝 变更日志

### 2026-05-15
- 创建重构规划文档
- 定义迁移目标和步骤
- 建立 checklist 系统

---

## 💡 使用说明

### 如何使用此文档

1. **开始新任务前**：查看当前阶段的 checklist
2. **完成任务后**：勾选对应的 checkbox
3. **遇到问题时**：参考"注意事项和风险"部分
4. **需要参考时**：查看"关键代码转换模式"
5. **上下文清空后**：从"当前任务"继续

### 更新进度

```markdown
- [x] 已完成的任务
- [ ] 未完成的任务
```

### 添加笔记

在相关部分添加笔记：

```markdown
#### 1.1 项目初始化
- [x] 创建 SvelteKit 项目
  **笔记：** 选择了 TypeScript + ESLint + Prettier
```

---

**最后更新：** 2026-05-15  
**文档版本：** 1.0.0
