# The builder container
FROM rust:latest as builder
WORKDIR /app

# Copy source code over
COPY . .
# Compile the app
RUN cargo build --release

# The app container
FROM gcr.io/distroless/cc 
LABEL Author="Luke Ballmer"
WORKDIR /app

# Copy binary to the app
COPY --from=builder /app/target/release/backend /app/school-website

COPY ./json /app/json
COPY ./img /app/img

# Expose the port
EXPOSE 8000

# Run the app
CMD ["./school-website"]