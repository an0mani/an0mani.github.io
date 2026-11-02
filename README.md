# an0mani.github.io

an0mani의 포트폴리오 사이트입니다. 👉 https://an0mani.github.io

클레이모피즘 스타일에 마이크로 인터랙션을 더했습니다.

## 기술

- Next.js (App Router, 정적 export) + TypeScript
- Tailwind CSS v4
- Motion: 버튼/카드/체크 애니메이션
- three.js + React Three Fiber: 첫 화면의 3D 점토 도형

## 로컬에서 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다.

## 내용 고치기

화면에 보이는 글(소개, 기술, 프로젝트, 체크리스트)은 모두 `src/data/profile.ts` 한 파일에 있습니다.

| 파일 | 역할 |
| --- | --- |
| `src/components/Hero.tsx` | 첫 화면 |
| `src/components/ClayScene.tsx` | 3D 점토 도형 |
| `src/components/Skills.tsx` | 기술 목록 |
| `src/components/ProjectCard.tsx` | 프로젝트 카드 (기울기, 펼치기) |
| `src/components/DoneDemo.tsx` | Done It 미니 체험 |
| `src/app/globals.css` | 색상과 `clay` 그림자 스타일 |

## 배포

`main` 브랜치에 push하면 GitHub Actions가 빌드해서 GitHub Pages에 올립니다.
처음 한 번은 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 바꿔야 합니다.
