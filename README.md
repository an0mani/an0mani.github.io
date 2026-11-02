# an0mani.github.io

an0mani의 포트폴리오 사이트입니다. 👉 https://an0mani.github.io

클레이모피즘 스타일에 마이크로 인터랙션을 더했습니다.
Next.js로 만든 사이트 안에 Flutter로 만든 Done It 미니 앱이 들어 있습니다.

## 기술

- Next.js (App Router, 정적 export) + TypeScript
- Tailwind CSS v4
- Motion: 버튼/카드/드래그 애니메이션
- Flutter Web: Done It 미니 앱 (`flutter_app/`, 사이트의 `/done-it/` 주소)

## 로컬에서 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다.

"Done It 체험하기"의 Flutter 앱까지 보려면 Flutter SDK를 설치하고 먼저 한 번 빌드합니다.

```bash
npm run build:flutter
```

Flutter 앱만 따로 고칠 때는 `flutter_app` 폴더에서 `flutter run -d chrome`으로 실행하면 됩니다.

## 내용 고치기

사이트에 보이는 글(소개, 기술, 프로젝트)은 모두 `src/data/profile.ts` 한 파일에 있습니다.
Flutter 앱의 기본 할 일 목록은 `flutter_app/lib/screens/done_screen.dart`에 있습니다.

| 파일 | 역할 |
| --- | --- |
| `src/components/Hero.tsx` | 첫 화면 |
| `src/components/ClayPlayground.tsx` | 끌어서 던지는 점토 도형과 캐릭터 |
| `src/components/Skills.tsx` | 기술 목록 (벤토 그리드) |
| `src/components/ProjectCard.tsx` | 프로젝트 카드 (기울기, 펼치기) |
| `src/components/AppDemo.tsx` | 폰 화면 안에 Flutter 앱을 띄우는 영역 |
| `src/app/globals.css` | 색상과 `clay` 그림자 스타일 |
| `flutter_app/lib/` | Done It 미니 앱 (Flutter) |

## 배포

`main` 브랜치에 push하면 GitHub Actions가 Flutter 앱과 Next.js 사이트를 빌드해서 GitHub Pages에 올립니다.
처음 한 번은 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 바꿔야 합니다.
