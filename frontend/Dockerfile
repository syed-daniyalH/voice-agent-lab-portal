FROM node:18-alpine

WORKDIR /app

COPY package.json tsconfig.json next.config.js ./
RUN npm install

COPY src ./src

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
