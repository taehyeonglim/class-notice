# 우리반 알림장 트레일러

[완성 영상](class-notice-trailer.mp4) · 60초 · 1920×1080 · 30fps

이 폴더에서 아래 명령으로 미리 보거나 다시 렌더할 수 있습니다.

```sh
npm ci
npm run studio
npm run render
```

장면 순서와 길이, 문구는 `src/trailer.jsx`에 있습니다. 데스크톱과 휴대폰 장면에는 프로젝트의 실제 화면 캡처를 사용했습니다. 알림 작성과 검색 장면은 체험 데이터를 바탕으로 작성했습니다.

배경음을 수정했다면 다음 명령으로 오디오를 다시 만들 수 있습니다.

```sh
python3 make-score.py /tmp/class-notice-score.wav
ffmpeg -y -i /tmp/class-notice-score.wav -b:a 96k public/score.mp3
```

## 우리반 알림장 만든 과정

[완성 영상](class-notice-making-of.mp4) · 2분 20초 · 1920×1080 · 30fps

Remotion Studio에서 `ClassNoticeMakingOf`를 선택하면 미리 볼 수 있습니다.
이 폴더에서 `npm run render:making-of`를 실행하면 MP4를 다시 렌더합니다.

장면과 자막은 `src/making-of.jsx`와 `src/making-of-scenes.js`에 있습니다.
전후 화면은 저장소의 `screenshots/`에서 직접 불러옵니다. 바꾼 이유는 `CHECKLIST.md`를 바탕으로 썼고, 요청 자막은 `prompts.md`의 실제 문장에서 발췌했습니다. 마지막 비교 장면의 화면에는 빈 목록을 보여 주고, 저장 실패 안내는 자막에 담았습니다.
