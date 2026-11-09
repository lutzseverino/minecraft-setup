#!/usr/bin/env bash
# Run on a Mac with Docker Desktop and Git; no credentials or host configuration.
set -euo pipefail
head_sha=${1:?Usage: bash verify-agent-sandbox.sh FULL_PR_HEAD_SHA}
case "$head_sha" in
  *[!0-9a-f]*|'') echo 'Expected a full lowercase Git commit SHA' >&2; exit 2 ;;
esac
[[ ${#head_sha} == 40 ]] || exit 2
scratch=$(mktemp -d /var/tmp/minecraft-setup-sandbox.XXXXXX)
export TMPDIR="$scratch"
image="minecraft-setup-sandbox:${head_sha}"
toolchain="${image}-toolchain"
container="minecraft-setup-check-${head_sha:0:12}-$$"
cleanup() {
  docker rm -f "$container" >/dev/null 2>&1 || true
  docker image rm "$image" "$toolchain" >/dev/null 2>&1 || true
  rm -rf "$scratch"
}
trap cleanup EXIT

# Fetch exactly the reviewed commit into a new checkout, without submodules.
git init -q "$scratch/source"
git -C "$scratch/source" remote add origin https://github.com/lutzseverino/minecraft-setup.git
git -C "$scratch/source" fetch --depth 1 origin "$head_sha"
git -C "$scratch/source" checkout --detach FETCH_HEAD
test "$(git -C "$scratch/source" rev-parse HEAD)" = "$head_sha"

# Use the published factory's real agent layer, pinned to its immutable release
# commit. Neither Docker build receives the checkout as a build context.
layer_revision=008d3594c249e74b4fa8b21488b6bb124c602228
curl -fsSL "https://raw.githubusercontent.com/lutzseverino/scriptorium/${layer_revision}/src/agent-layer.Dockerfile" \
  -o "$scratch/agent-layer.Dockerfile"
docker build --tag "$toolchain" - < "$scratch/source/.factory/Dockerfile"
docker build --tag "$image" --build-arg "TOOLCHAIN_IMAGE=$toolchain" \
  --build-arg "AGENT_UID=$(id -u)" --build-arg "AGENT_GID=$(id -g)" \
  - < "$scratch/agent-layer.Dockerfile"
image_digest=$(docker image inspect --format '{{.Id}}' "$image")
test "$(docker image inspect --format '{{.Config.User}}' "$image")" = agent

# Clone inside the image, so checks run on a fresh Linux-owned tree, not a
# privileged host-mounted checkout. No provider credentials enter the container.
docker run -i --name "$container" --entrypoint bash "$image" -s -- "$head_sha" "$image_digest" "$layer_revision" <<'CHECKS'
set -uo pipefail
head_sha=$1
image_digest=$2
layer_revision=$3
test "$(id -u)" -ne 0 && test "$(id -un)" = agent || exit 2
printf 'identity: '; id
printf 'HOME: %s\n' "$HOME"
node --version; npm --version; java -version
rustc --version; cargo --version; rustfmt --version; cargo clippy --version
mkdir -p /var/tmp/setup-checks
export TMPDIR=/var/tmp/setup-checks CARGO_BUILD_JOBS=4
cd /home/agent
git init -q checkout && cd checkout
git remote add origin https://github.com/lutzseverino/minecraft-setup.git
git fetch --depth 1 origin "$head_sha" && git checkout --detach FETCH_HEAD || exit 2
test "$(git rev-parse HEAD)" = "$head_sha" || exit 2
names=(); outcomes=(); failed=0
check() {
  local name=$1 directory=$2
  shift 2
  printf '\nCHECK %s cwd=%s command=' "$name" "$PWD/$directory"
  printf '%q ' "$@"; printf '\n'
  (cd "$directory" && "$@")
  local result=$?
  names+=("$name"); outcomes+=("$result")
  if [[ $result != 0 ]]; then failed=1; fi
}
check root-install . npm ci
check protocol-install protocol npm ci
check manager-install manager npm ci
check root-lint . npm run lint
check release-routing . npm test
check protocol protocol npm run check
check manager manager npm run check
check rust-fmt manager cargo fmt --manifest-path src-tauri/Cargo.toml --all -- --check
check rust-test manager cargo test --manifest-path src-tauri/Cargo.toml --all-targets --all-features
check rust-clippy manager cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets --all-features -- -D warnings
check publisher publisher ./mvnw --batch-mode --no-transfer-progress verify
check clean-tree . git diff --exit-code
printf '\nBEGIN SETUP SANDBOX RESULT\nhead: %s\nimage: %s\nagent-layer: %s\n' "$head_sha" "$image_digest" "$layer_revision"
printf 'identity: '; id
for ((i=0; i<${#names[@]}; i++)); do
  printf '%s: exit %s\n' "${names[$i]}" "${outcomes[$i]}"
done
printf 'overall: %s\nEND SETUP SANDBOX RESULT\n' "$failed"
exit "$failed"
CHECKS
