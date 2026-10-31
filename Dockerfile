FROM node:22-alpine

WORKDIR /app

RUN npm install -g bun@1.4.2

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["sh", "-lc", "CI=true bun install && bunx next dev -H 0.0.0.0 -p 3000"]
