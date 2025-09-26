# =================================================================
# BLOTTR PRODUCTION DOCKERFILE
# =================================================================
# Multi-stage build for optimized production image

# =================================================================
# BUILD STAGE
# =================================================================
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    postgresql-client

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Remove dev dependencies
RUN npm ci --only=production && npm cache clean --force

# =================================================================
# PRODUCTION STAGE
# =================================================================
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    dumb-init \
    postgresql-client \
    curl

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S blottr -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=blottr:nodejs /app/build ./
COPY --from=builder --chown=blottr:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=blottr:nodejs /app/package*.json ./

# Create necessary directories
RUN mkdir -p /app/uploads /app/logs && \
    chown -R blottr:nodejs /app/uploads /app/logs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3333}/api/health/contact-inquiries || exit 1

# Switch to non-root user
USER blottr

# Expose port
EXPOSE 3333

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "bin/server.js"]