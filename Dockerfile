# 빌드 단계
FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 실제 배포 단계
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
