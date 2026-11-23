import colorBefore from '../../screenshots/01-color-before.png';
import colorAfter from '../../screenshots/01-color-after.png';
import firstBefore from '../../screenshots/02-first-screen-before.png';
import firstAfter from '../../screenshots/02-first-screen-after.png';
import listBefore from '../../screenshots/03-list-before.png';
import listAfter from '../../screenshots/03-list-after.png';
import fontBefore from '../../screenshots/04-font-before.png';
import fontAfter from '../../screenshots/04-font-after.png';
import mobileBefore from '../../screenshots/05-mobile-before.png';
import mobileAfter from '../../screenshots/05-mobile-after.png';
import emptyBefore from '../../screenshots/06-empty-error-before.png';
import emptyAfter from '../../screenshots/06-empty-error-after.png';

export const openingPrompt = '학급 알림장 웹앱을 만들어 줘. 교사가 알림을 쓰고 학생과 학부모가 보는 앱이야. GitHub Pages에 올릴 거야.';

export const changes = [
  {
    title: '교실 TV에서 눈이 덜 부시도록',
    topic: '색',
    before: {image: colorBefore, label: '연보라 배경과 그라데이션', focus: [0.5, 0.30]},
    after: {image: colorAfter, label: '짙은 남색, 주황, 회색', focus: [0.5, 0.30]},
    zoom: 1.24,
    prompt: '보라색 배경과 그라데이션을 빼고, 짙은 남색과 주황색 두 가지에 회색만 써 줘. 교실 TV로 볼 때 눈이 부시지 않게 해 줘.',
    reason: '교실 TV에서 밝은 배경이 눈부셔서, 바탕은 짙은 남색으로 바꾸고 주황색은 강조할 곳에 썼어요.',
  },
  {
    title: '첫 화면에서 오늘 알림부터',
    topic: '첫 화면',
    before: {image: firstBefore, label: '큰 배너 아래에 알림', focus: [0.28, 0.35]},
    after: {image: firstAfter, label: '왼쪽 위에 작은 제목, 바로 아래에 오늘 알림', focus: [0.28, 0.21]},
    zoom: 1.28,
    prompt: '첫 화면의 큰 배너를 없애고, 제목은 왼쪽 위에 작게 두고 오늘 알림이 맨 위에 바로 보이게 해 줘.',
    reason: '알림장을 열면 오늘 알림부터 보이도록, 첫 화면에서 큰 배너를 걷어냈어요.',
  },
  {
    title: '지난 알림은 날짜별로',
    topic: '목록',
    before: {image: listBefore, label: '알림마다 둥근 카드', focus: [0.23, 0.40]},
    after: {image: listAfter, label: '날짜 제목 아래에 알림을 묶음', focus: [0.23, 0.40]},
    zoom: 1.30,
    prompt: '알림 카드를 날짜별 목록으로 바꿔 줘. 같은 날짜의 알림은 날짜 제목 아래에 묶어 줘.',
    reason: '알림이 쌓이면 날짜로 찾게 돼요. 같은 날 올라온 알림을 날짜 제목 아래에 모았어요.',
  },
  {
    title: '교실 뒤에서도 읽히는 글자',
    topic: '글꼴',
    before: {image: fontBefore, label: '기본 글꼴 · 본문 14px', focus: [0.35, 0.33]},
    after: {image: fontAfter, label: 'Pretendard · 본문 20px', focus: [0.35, 0.33]},
    zoom: 1.65,
    prompt: '글꼴을 Pretendard로 바꾸고 본문 글자를 20px로 키워 줘. 교실 뒤에서도 읽혀야 해.',
    reason: '교실 뒤에 앉은 학생도 알림을 읽을 수 있게 Pretendard를 적용하고 본문을 14px에서 20px로 키웠어요.',
  },
  {
    title: '휴대폰에서도 본문 끝까지',
    topic: '모바일',
    before: {image: mobileBefore, label: '한 줄에서 잘리는 본문', focus: [0.5, 0.31]},
    after: {image: mobileAfter, label: '세로로 놓인 분류 버튼과 여러 줄 본문', focus: [0.5, 0.43]},
    mobile: true,
    zoom: 1.24,
    prompt: '휴대폰 화면(폭 390px)에서 잘리거나 가로로 밀리는 곳이 없게 고쳐 줘. 한 줄에 하나씩 세로로 보이게 해 줘.',
    reason: '학부모가 휴대폰으로 보니까 분류 버튼은 한 줄에 하나씩 놓고, 긴 본문은 줄을 바꿔 끝까지 보여 줬어요.',
  },
  {
    title: '알림이 없거나 저장이 실패할 때',
    topic: '빈 화면·오류',
    before: {image: emptyBefore, label: '빈 목록이라는 사실만 표시', focus: [0.5, 0.32]},
    after: {image: emptyAfter, label: '새 알림이 어디에 표시되는지 안내', focus: [0.5, 0.32]},
    zoom: 1.80,
    prompt: '알림이 하나도 없을 때 보여 줄 안내 문구와, 저장에 실패했을 때 다시 저장하라는 문구를 넣어 줘.',
    reason: '다음에 뭘 해야 할지 알 수 있도록, 빈 목록에는 새 알림이 여기 표시된다고 안내하고 저장 실패 때는 “다시 저장해 주세요.”라고 안내했어요.',
  },
];
