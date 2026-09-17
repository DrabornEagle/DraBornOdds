#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
dkd_target="$HOME/projects/DraBornOdds"
dkd_temp="$(mktemp -d)"
trap 'rm -rf -- "$dkd_temp"' EXIT
for dkd_command in node npm curl unzip; do
  if ! command -v "$dkd_command" >/dev/null 2>&1; then printf 'Eksik paket: %s\nÖnce çalıştır: pkg install -y nodejs-lts curl unzip\n' "$dkd_command"; exit 1; fi
done
node -e 'const dkd_v=process.versions.node.split(".").map(Number);if(!((dkd_v[0]===22&&dkd_v[1]>=13)||(dkd_v[0]===24&&dkd_v[1]>=3)||dkd_v[0]>=26)){console.error("Expo SDK 58 için Node 22.13+, 24.3+ veya 26+ gerekli.");process.exit(1)}'
printf '\nDraBornOdds v0.2 indiriliyor…\n'
curl --fail --location --retry 3 --connect-timeout 20 'https://codeload.github.com/DrabornEagle/DraBornOdds/zip/refs/heads/main' --output "$dkd_temp/dkd-source.zip"
unzip -q "$dkd_temp/dkd-source.zip" -d "$dkd_temp"
test -f "$dkd_temp/DraBornOdds-main/package-lock.json"
mkdir -p "$HOME/projects"
if [ -e "$dkd_target" ]; then dkd_backup="${dkd_target}_backup_$(date +%Y%m%d_%H%M%S)_$$";mv -- "$dkd_target" "$dkd_backup";printf 'Önceki kaynak korundu: %s\n' "$dkd_backup";fi
mv -- "$dkd_temp/DraBornOdds-main" "$dkd_target"
cd "$dkd_target"
printf '\nSDK 58 bağımlılıkları kuruluyor…\n'
npm ci --no-audit --no-fund
printf '\nHazır. Aynı telefonda Expo Go 58 → URL gir → exp://127.0.0.1:8081\n'
printf 'v0.2 gerçek veriyi Supabase dbo_ katmanından okur; internet bağlantısı gerekir.\n\n'
EXPO_NO_TELEMETRY=1 npm start -- --port 8081 --clear
