FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copy the pom.xml first so this dependency download layer is cached separately
# from source changes - only re-runs when pom.xml itself changes.
COPY pom.xml ./
RUN mvn -B -DskipTests dependency:resolve dependency:resolve-plugins

# Copy the source code and build the application
COPY src ./src
RUN mvn -B clean package -DskipTests

# Copy exactly one executable JAR to a predictable filename
RUN JAR_FILE=$(find target -maxdepth 1 -type f -name "*.jar" ! -name "*original.jar" ! -name "*-javadoc.jar" | head -n 1) \
    && echo "Using JAR file: ${JAR_FILE}" \
    && cp "${JAR_FILE}" /workspace/app.jar

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

ENV SERVER_PORT=8080
ENV JAVA_OPTS=""

COPY --from=build /workspace/app.jar app.jar

EXPOSE 8080

# 127.0.0.1 (not localhost) - avoids the IPv6-vs-IPv4 healthcheck bug seen in earlier exercises
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -q -O - http://127.0.0.1:8080/api/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
