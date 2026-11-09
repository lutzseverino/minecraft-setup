FROM node:24-bookworm-slim

# The factory adds Git, agent CLIs, the unprivileged agent user and entrypoint.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl wget unzip xz-utils build-essential pkg-config \
    libssl-dev libwebkit2gtk-4.1-dev libgtk-3-dev \
    libayatana-appindicator3-dev librsvg2-dev patchelf file xdg-utils \
    && rm -rf /var/lib/apt/lists/* \
    && npm install --global npm@11.6.2

# Both architectures supported by the factory agent layer use JDK 21.
RUN set -eu; \
    case "$(dpkg --print-architecture)" in \
      amd64) java_arch=x64 ;; \
      arm64) java_arch=aarch64 ;; \
      *) echo 'Unsupported JDK architecture' >&2; exit 1 ;; \
    esac; \
    install_dir=$(mktemp -d /var/tmp/setup-jdk.XXXXXX); \
    curl -fsSL "https://api.adoptium.net/v3/binary/latest/21/ga/linux/${java_arch}/jdk/hotspot/normal/eclipse" \
      -o "$install_dir/jdk.tar.gz"; \
    mkdir -p /opt/java; \
    tar -xzf "$install_dir/jdk.tar.gz" -C /opt/java --strip-components=1; \
    rm -rf "$install_dir"
ENV JAVA_HOME=/opt/java

# Install proxies and the stable toolchain system-wide; per-run Cargo caches
# belong to the agent's writable home, never the root installer's home.
ENV RUSTUP_HOME=/opt/rustup
RUN set -eu; \
    install_dir=$(mktemp -d /var/tmp/setup-rust.XXXXXX); \
    curl -fsSL https://sh.rustup.rs -o "$install_dir/rustup.sh"; \
    CARGO_HOME=/opt/cargo sh "$install_dir/rustup.sh" -y --no-modify-path \
      --profile minimal --default-toolchain stable --component rustfmt,clippy; \
    chmod -R a+rX /opt/rustup /opt/cargo; \
    rm -rf "$install_dir"
ENV CARGO_HOME=/home/agent/.cargo
ENV PATH=/opt/java/bin:/opt/cargo/bin:$PATH
RUN node --version && test "$(npm --version)" = 11.6.2 \
    && java -version && rustc --version && cargo --version \
    && rustfmt --version && cargo clippy --version
