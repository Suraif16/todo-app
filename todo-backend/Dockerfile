# Multi-stage build for Spring Boot application

# Stage 1: Build the application
FROM maven:3.9.4-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml first (for better Docker layer caching)
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application and show what's in target directory
RUN mvn clean package -DskipTests && \
    echo "=== Contents of target directory ===" && \
    ls -la target/ && \
    echo "=== Looking for JAR files ===" && \
    find target/ -name "*.jar" -type f && \
    echo "=== Copying main JAR to app.jar ===" && \
    cp target/*.jar target/app.jar || \
    cp $(find target/ -name "*.jar" -not -name "*-sources.jar" -not -name "*-javadoc.jar" | head -1) target/app.jar

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the specific JAR file from build stage
COPY --from=build /app/target/app.jar app.jar

# Change ownership to spring user
RUN chown spring:spring app.jar

# Switch to non-root user
USER spring

# Expose port 8080
EXPOSE 8080

# Health check - Fixed URL without /api
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/auth/health || exit 1

# Set JVM options for better container performance
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]