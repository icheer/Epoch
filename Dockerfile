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

# 只装 production 依赖
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# 从 builder 复制 build 产物
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["./node_modules/.bin/next", "start"]
