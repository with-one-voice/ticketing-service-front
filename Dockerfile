# 1단계: React 앱 빌드
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2단계: NGINX로 정적 파일 + proxy 서빙
FROM nginx:stable-alpine

# NGINX 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# React 빌드 결과 복사
COPY --from=builder /app/build /usr/share/nginx/html

# NGINX 기본 포트
EXPOSE 80

# NGINX 실행
CMD ["nginx", "-g", "daemon off;"]
