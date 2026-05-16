"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Square } from "lucide-react";
import { UIRenderer, ResponseRoot } from "@/components/llm-components";

const ALL_EXAMPLE_PROMPTS = [
  "比较北京、上海、深圳的房价走势",
  "用图表分析 AI 行业发展趋势",
  "分析特斯拉最近一年的股价变化",
  "推荐几个适合周末游玩的城市",
  "用时间线展示互联网发展历史",
  "展示日本最值得去的旅游景点",
  "分析不同编程语言的流行度趋势",
  "推荐适合新手的健身训练计划",
  "展示世界著名建筑的卡片集合",
  "用图表对比不同手机品牌的市场份额",
  "介绍世界上最高的十座建筑",
  "展示奥运会金牌榜前十名国家",
  "推荐几部高分科幻电影",
  "比较iPhone和华为手机的参数配置",
  "分析气候变化的数据可视化",
  "展示2024年全球票房前十的电影",
  "帮我计算房贷月供和总利息",
  "展示太阳系八大行星的信息卡片",
  "用图表分析全球咖啡消费量分布",
  "展示世界新七大奇迹的图片画廊",
  "比较不同城市的生活成本",
  "展示最受欢迎的编程语言排行榜",
  "用时间线展示苹果公司产品发布历史",
  "分析中国历史朝代更替时间线",
  "推荐健康饮食食谱",
  "展示NBA球队排名",
  "对比主流云服务商",
  "分析全球气温变化",
  "推荐编程学习路线",
  "展示中国名山大川",
];

function getRandomPrompts(count: number): string[] {
  const shuffled = [...ALL_EXAMPLE_PROMPTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface Message {
  role: "user" | "assistant";
  content: string | ResponseRoot;
  isAction?: boolean;
  actionLabel?: string;
  isError?: boolean;
}

interface RetryState {
  userMessage: string;
  apiBase: Message[];
}

export default function Home() {
  const examplePrompts = useMemo(() => getRandomPrompts(4), []);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "你好！我会把回答转化为可交互的界面——图表、卡片、表单、画廊，而不只是文字。试试下面的例子，或直接说出你的想法。",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingResponse, setCurrentStreamingResponse] =
    useState<ResponseRoot | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [retryState, setRetryState] = useState<RetryState | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);

  // Track whether user has scrolled away from the bottom
  useEffect(() => {
    const onScroll = () => {
      const distanceToBottom =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      isNearBottomRef.current = distanceToBottom < 200;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (force || isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Always scroll when a completed message is added (user sent or AI done)
  useEffect(() => {
    scrollToBottom(true);
  }, [messages, scrollToBottom]);

  // During streaming, only scroll if user is already near the bottom
  useEffect(() => {
    if (currentStreamingResponse) {
      scrollToBottom(false);
    }
  }, [currentStreamingResponse, scrollToBottom]);

  const streamResponse = async (userMessage: string, apiBase?: Message[]) => {
    setIsStreaming(true);
    setCurrentStreamingResponse(null);
    setRetryState(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const baseMessages = apiBase ?? messages;
    let latestResponse: ResponseRoot | null = null;

    const apiMessages = baseMessages.map((msg) => ({
      role: msg.role,
      content:
        typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content),
    }));
    apiMessages.push({ role: "user", content: userMessage });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              if (latestResponse) {
                const finalResponse: ResponseRoot = latestResponse;
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: finalResponse },
                ]);
              }
              setCurrentStreamingResponse(null);
              setIsStreaming(false);
              setFormValues({});
              return;
            }

            try {
              const parsed = JSON.parse(data) as ResponseRoot;
              latestResponse = parsed;
              setCurrentStreamingResponse(parsed);
            } catch (e) {
              console.error("Failed to parse JSON:", e);
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        if (latestResponse) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: latestResponse! },
          ]);
        }
      } else {
        console.error("Streaming error:", err);
        setRetryState({ userMessage, apiBase: baseMessages });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "响应出现错误，请检查网络或 API 配置后重试。",
            isError: true,
          },
        ]);
      }
      setIsStreaming(false);
      setCurrentStreamingResponse(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    await streamResponse(userMessage);
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  const handleRetry = async () => {
    if (!retryState || isStreaming) return;
    const { userMessage, apiBase } = retryState;
    setRetryState(null);
    setMessages((prev) => prev.slice(0, -1));
    await streamResponse(userMessage, apiBase);
  };

  const handleExamplePrompt = async (prompt: string) => {
    if (isStreaming) return;
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    await streamResponse(prompt);
  };

  const handleButtonAction = async (action: string, label: string) => {
    if (isStreaming) return;

    let apiContent = `用户点击了按钮："${label}"`;
    if (Object.keys(formValues).length > 0) {
      apiContent +=
        "\n\n表单数据：\n" +
        Object.entries(formValues)
          .map(([key, value]) => `- ${key}: ${value}`)
          .join("\n");
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", content: apiContent, isAction: true, actionLabel: label },
    ]);
    await streamResponse(apiContent);
  };

  const handleFormChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="bg-background h-[100dvh] overflow-hidden flex flex-col">

      <div
        role="log"
        aria-live="polite"
        aria-label="对话历史"
        className="flex-1 overflow-y-auto max-w-3xl 2xl:max-w-4xl mx-auto w-full flex flex-col space-y-6 md:space-y-10 pt-6 md:pt-10 pb-32 md:pb-40 px-4 md:px-0"
      >
        {messages.map((message, index) => (
          <div key={index}>
            {message.role === "user" ? (
              message.isAction ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    点击了
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                    {message.actionLabel}
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2 justify-end">
                  <p className="text-black/50 dark:text-white/60 text-sm font-[450] mt-1">
                    {message.content as string}
                  </p>
                  <div className="size-6 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 mt-0.5" />
                </div>
              )
            ) : (
              <Card className="shadow-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardContent className="text-gray-600 dark:text-gray-300 text-sm font-[450] px-3 md:px-5">
                    {typeof message.content === "string" ? (
                      message.isError ? (
                        <div className="flex flex-col gap-3">
                          <p className="text-red-500 dark:text-red-400 leading-relaxed">
                            {message.content}
                          </p>
                          {retryState && index === messages.length - 1 && (
                            <button
                              onClick={handleRetry}
                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full w-fit transition-colors duration-150"
                            >
                              重试
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="leading-relaxed">{message.content}</p>
                      )
                    ) : (
                      <div className="space-y-4">
                        {message.content.children?.map((child, childIndex) => (
                          <UIRenderer
                            key={childIndex}
                            component={child}
                            onAction={handleButtonAction}
                            formValues={formValues}
                            onFormChange={handleFormChange}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
            )}

            {/* Example prompts — only shown after the initial greeting */}
            {index === 0 && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleExamplePrompt(prompt)}
                    disabled={isStreaming}
                    className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full transition-colors duration-150 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isStreaming && currentStreamingResponse && (
          <div aria-busy="true">
            <Card className="shadow-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="text-gray-600 dark:text-gray-300 text-sm font-[450] px-3 md:px-5">
                <div className="space-y-4">
                  {currentStreamingResponse.children?.map((child, index) => (
                    <UIRenderer
                      key={index}
                      component={child}
                      onAction={handleButtonAction}
                      formValues={formValues}
                      onFormChange={handleFormChange}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs mt-4">
                  <div className="animate-spin h-3 w-3 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300 rounded-full" />
                  <span>生成中...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[802px] 2xl:max-w-[930px] mx-auto px-4 md:px-0 z-50">
        <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <div className="bg-background pt-1 pb-6 md:pb-8">
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 pr-2 pl-3 py-2.5">
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              aria-label="输入消息"
              className="flex-1 resize-none text-sm bg-transparent border-0 shadow-none py-0 px-0 placeholder:font-[490] placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-700 dark:text-gray-200 max-h-32 overflow-y-auto leading-relaxed"
              placeholder="Ask anything..."
            />
            {isStreaming ? (
              <button
                onClick={handleStop}
                aria-label="停止生成"
                className="bg-gray-800 dark:bg-gray-600 text-white p-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors duration-200 cursor-pointer shrink-0 self-end"
              >
                <Square size={13} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                aria-label="发送消息"
                className="bg-brand text-brand-foreground p-2 rounded-full text-sm font-medium shadow-sm hover:brightness-105 transition-[filter] duration-200 cursor-pointer shrink-0 self-end disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUp size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
