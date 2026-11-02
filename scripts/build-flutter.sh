#!/usr/bin/env bash
# Flutter 앱을 웹으로 빌드해서 public/done-it 에 넣습니다.
# Next.js가 빌드할 때 public 폴더를 그대로 복사하므로 /done-it/ 주소로 열립니다.
set -euo pipefail

cd "$(dirname "$0")/../flutter_app"

flutter pub get
flutter build web --release --base-href /done-it/ --no-web-resources-cdn

rm -rf ../public/done-it
mkdir -p ../public
cp -r build/web ../public/done-it
