# ---- 阶段1: 安装依赖 + 构建 ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# ---- 阶段2: 只保留运行时需要的东西 ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 复制 standalone 输出
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
