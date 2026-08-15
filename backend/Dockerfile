FROM node:20-alpine

WORKDIR /app

# Install netcat for healthcheck/wait-for scripts
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
RUN npm install --production && npm cache clean --force

COPY . .

RUN mkdir -p /app/uploads

EXPOSE 3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

COPY scripts/wait-for-mongo.sh /app/scripts/wait-for-mongo.sh
COPY scripts/docker-entrypoint.sh /app/scripts/docker-entrypoint.sh
RUN chmod +x /app/scripts/*.sh

ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
