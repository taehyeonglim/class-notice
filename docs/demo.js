export const demoKey = "class-notice-demo";

const examples = [
  {
    id: "school-festival", category: "notice", pinned: true, daysAgo: 0,
    title: "학예회 참여 안내",
    body: "다음 주 금요일에 학예회를 엽니다. 학생들은 발표 순서와 준비물을 미리 확인해 주세요. 학부모님은 오전 10시부터 강당에 입장하실 수 있습니다.",
  },
  {
    id: "art-supplies", category: "supplies", pinned: false, daysAgo: 2,
    title: "미술 시간 준비물",
    body: "다음 미술 시간에는 가을 풍경을 그립니다. 색연필, 사인펜, 풀을 챙겨 오세요.",
  },
  {
    id: "math-homework", category: "homework", pinned: false, daysAgo: 3,
    title: "수학 익힘책 숙제",
    body: "수학 익힘책 42~43쪽을 풀어 오세요. 어려웠던 문제에 표시해 두면 다음 시간에 함께 풀어 볼게요.",
  },
  {
    id: "library", category: "schedule", pinned: false, daysAgo: 4,
    title: "도서관 이용 일정",
    body: "이번 주 도서관 이용 시간은 수요일 3교시입니다. 반납할 책이 있다면 함께 가져오세요.",
  },
];

export function demoNotices() {
  const saved = localStorage.getItem(demoKey);
  if (saved !== null) return JSON.parse(saved);
  return examples.map(({ daysAgo, ...notice }) => ({
    ...notice,
    created_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  }));
}
