import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import './trailer.css';

export const FPS = 30;
const scenes = [
  {duration: 9, Scene: Intro},
  {duration: 10, Scene: Publish},
  {duration: 10, Scene: Pinned},
  {duration: 10, Scene: Mobile},
  {duration: 12, Scene: Search},
  {duration: 9, Scene: Closing},
];
export const FRAMES = scenes.reduce((total, {duration}) => total + duration * FPS, 0);

function reveal(frame, start = 0, duration = 23) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}

function Rise({at = 0, distance = 38, className = '', children}) {
  const progress = reveal(useCurrentFrame(), at);
  return <div className={className} style={{opacity: progress, transform: `translateY(${distance * (1 - progress)}px)`}}>{children}</div>;
}

function Brand() {
  return <div className="brand"><span className="brand-icon"><i /><i /><i /></span>우리반 알림장</div>;
}

function Stage({theme, children, closing = false}) {
  return (
    <AbsoluteFill className={`stage ${theme}`}>
      {!closing && <header className="masthead"><Brand /></header>}
      {children}
    </AbsoluteFill>
  );
}

function Copy({label, title, highlight, body, children, className = ''}) {
  return (
    <div className={`copy ${className}`}>
      {label && <Rise at={3} className="eyebrow"><span />{label}</Rise>}
      <Rise at={7}><h1>{title}<br /><em>{highlight}</em></h1></Rise>
      {body && <Rise at={14}><p className="body-copy">{body}</p></Rise>}
      {children}
    </div>
  );
}

function Browser({children, className = ''}) {
  return (
    <div className={`browser ${className}`}>
      <div className="browser-bar"><span className="window-dots"><i /><i /><i /></span><span className="address">taehyeonglim.github.io/class-notice</span></div>
      {children}
    </div>
  );
}

function BoardImage() {
  return <Img className="board-image" src={staticFile('desktop.png')} />;
}

function Phone() {
  return <div className="phone"><Img src={staticFile('mobile.png')} /></div>;
}

function Intro() {
  return (
    <Stage theme="paper intro">
      <div className="intro-circle" />
      <Copy title="우리 반 소식," highlight="한곳에서." className="intro-copy">
        <Rise at={12} className="role-pair">
          <p><b>교사</b><span>학급 알림을 올려요.</span></p>
          <p><b>학생·학부모</b><span>로그인 없이 확인해요.</span></p>
        </Rise>
      </Copy>
      <Rise at={8} className="intro-board"><Browser><BoardImage /></Browser></Rise>
      <Rise at={20} className="intro-phone"><Phone /></Rise>
    </Stage>
  );
}

function Publish() {
  const frame = useCurrentFrame();
  const check = reveal(frame, 103, 15);
  const success = reveal(frame, 167, 18);
  return (
    <Stage theme="navy publish">
      <div className="publish-grid" />
      <Copy label="교사" title="새 알림을 쓰고" highlight="바로 게시해요." body={<>공지부터 준비물까지.<br />올린 알림은 수정하거나 삭제할 수 있어요.</>} />
      <Rise at={13} className="editor-wrap">
        <div className="editor">
          <div className="editor-head"><strong>새 알림 쓰기</strong><span>×</span></div>
          <div className="field"><b>분류</b><span>공지 <small>⌄</small></span></div>
          <div className="field"><b>제목</b><span>학예회 참여 안내</span></div>
          <div className="field"><b>내용</b><span className="text-field">다음 주 금요일에 학예회를 엽니다.<br />발표 순서와 준비물을 미리 확인해 주세요.</span></div>
          <div className="check-line"><span style={{background: check > 0 ? '#d79a60' : '#172231'}}><i style={{opacity: check}}>✓</i></span>같은 날짜에서 상단에 고정</div>
          <div className="editor-actions"><span>취소</span><strong style={{transform: `scale(${1 - 0.08 * Math.sin(Math.PI * reveal(frame, 152, 15))})`}}>게시하기</strong></div>
        </div>
        <div className="toast" style={{opacity: success, transform: `translateY(${24 * (1 - success)}px)`}}><span>✓</span>알림을 게시했습니다.</div>
      </Rise>
    </Stage>
  );
}

function Pinned() {
  const outline = reveal(useCurrentFrame(), 46, 22);
  return (
    <Stage theme="paper pinned">
      <Copy label="오늘 알림" title="중요한 소식은" highlight="그날 맨 위에." body={<>오늘 올라온 알림부터 확인하고,<br />지난 알림도 날짜별로 찾아볼 수 있어요.</>} />
      <Rise at={11} className="pin-board">
        <Browser>
          <div className="pin-window">
            <BoardImage />
            <div className="pin-outline" style={{opacity: outline, transform: `scale(${1.025 - outline * .025})`}} />
          </div>
        </Browser>
      </Rise>
    </Stage>
  );
}

function Mobile() {
  const frame = useCurrentFrame();
  const depth = reveal(frame, 20, 110);
  return (
    <Stage theme="peach mobile">
      <div className="mobile-disc" />
      <Copy label="학생·학부모" title="휴대폰에서도" highlight="로그인 없이." body={<>알림장 주소를 열면 바로 볼 수 있어요.<br />긴 알림도 본문 전체가 표시돼요.</>} />
      <Rise at={10} className="mobile-device"><div style={{transform: `translateY(${14 - 14 * depth}px)`}}><Phone /></div></Rise>
    </Stage>
  );
}

const categories = ['전체', '공지', '준비물', '숙제', '일정'];
const notices = [
  ['오늘', '학예회 참여 안내', '공지', '발표 순서와 준비물을 미리 확인해 주세요.'],
  ['11월 21일', '미술 시간 준비물', '준비물', '색연필, 사인펜, 풀을 챙겨 오세요.'],
  ['11월 20일', '수학 익힘책 숙제', '숙제', '수학 익힘책 42~43쪽을 풀어 오세요.'],
  ['11월 19일', '도서관 이용 일정', '일정', '이번 주 도서관 이용 시간은 수요일 3교시입니다.'],
];

function Search() {
  const frame = useCurrentFrame();
  const selected = frame >= 79 && frame < 174 ? '숙제' : '전체';
  const query = frame >= 185 ? '미술'.slice(0, frame >= 199 ? 2 : 1) : '';
  const results = notices.filter(([, title, category]) => title.includes(query) && (selected === '전체' || selected === category));
  return (
    <Stage theme="navy search">
      <Copy label="분류 · 검색" title="필요한 알림만" highlight="빠르게 찾아요." body={<>공지·준비물·숙제·일정으로 골라 보고,<br />기억나는 단어로 검색해요.</>} />
      <Rise at={12} className="search-board">
        <Browser>
          <div className="search-app">
            <div className="search-top">
              <div><h2>학급 알림</h2><span>{results.length}개의 알림</span></div>
              <div className={`search-input ${frame >= 174 ? 'focused' : ''}`}><i /><span>{frame >= 174 ? query : '알림 검색'}</span>{frame >= 174 && frame < 232 && <b />}</div>
            </div>
            <div className="filters">{categories.map(category => <span key={category} className={selected === category ? 'selected' : ''}>{category}</span>)}</div>
            <div>
              {results.map(([date, title, category, description]) => (
                <div key={title} className="result">
                  <div className="result-date">{date}</div>
                  <div className="result-row"><strong>{title}</strong><span>{category}</span><p>{description}</p></div>
                </div>
              ))}
            </div>
          </div>
        </Browser>
      </Rise>
    </Stage>
  );
}

function Closing() {
  return (
    <Stage theme="peach closing" closing>
      <div className="closing-orbit orbit-one" />
      <div className="closing-orbit orbit-two" />
      <div className="closing-content">
        <Rise at={3}><Brand /></Rise>
        <Rise at={10}><h1>오늘 우리 반엔<br />어떤 소식이 있을까요?</h1></Rise>
        <Rise at={25} className="closing-link"><b>알림장 열기</b><span>taehyeonglim.github.io/class-notice</span><strong>↗</strong></Rise>
      </div>
    </Stage>
  );
}

export function Trailer() {
  const frame = useCurrentFrame();
  let start = 0;
  return (
    <AbsoluteFill className="trailer">
      {scenes.map(({duration, Scene}) => {
        const from = start;
        const length = duration * FPS;
        start += length;
        return <Sequence key={Scene.name} from={from} durationInFrames={length} name={Scene.name}><Scene /></Sequence>;
      })}
      <div className="progress"><div style={{width: `${100 * (frame + 1) / FRAMES}%`}} /></div>
      <Audio src={staticFile('score.mp3')} />
    </AbsoluteFill>
  );
}
