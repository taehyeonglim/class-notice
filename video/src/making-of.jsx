import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, Sequence, interpolate,
  staticFile, useCurrentFrame,
} from 'remotion';
import {changes, openingPrompt} from './making-of-scenes';
import {FPS} from './trailer';
import './making-of.css';

const introSeconds = 12;
const comparisonSeconds = 19;
const closingSeconds = 14;
const closingStart = introSeconds + changes.length * comparisonSeconds;
export const MAKING_OF_FRAMES = (closingStart + closingSeconds) * FPS;

function easeIn(frame, start, length) {
  return interpolate(frame, [start, start + length], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
}

function ChapterBar({current}) {
  return (
    <header className="making-header">
      <span className="making-brand"><i />우리반 알림장</span>
      <div className="making-chapters">
        {changes.map(({topic}, index) => (
          <span key={topic} className={index + 1 === current ? 'making-current' : ''}>{topic}</span>
        ))}
      </div>
      <span className="making-series">만든 과정 소개</span>
    </header>
  );
}

function Caption({label, children}) {
  return (
    <div className="making-caption">
      <span>{label}</span>
      <p>{children}</p>
    </div>
  );
}

function Opening() {
  const entrance = easeIn(useCurrentFrame(), 0, 20);
  return (
    <AbsoluteFill className="making-opening">
      <ChapterBar />
      <div className="making-hero" style={{opacity: entrance, transform: `translateY(${16 * (1 - entrance)}px)`}}>
        <div className="making-hero-copy">
          <h1>우리반 알림장<span>만든 과정</span></h1>
          <p>교사가 소식을 올리고 학생과 학부모가 보는 웹앱이에요. 교실 TV와 휴대폰에서 더 편하게 볼 수 있도록 여섯 가지를 고쳤어요.</p>
        </div>
        <div className="making-hero-pictures">
          <Img className="making-hero-desktop" src={changes[3].after.image} />
          <Img className="making-hero-phone" src={changes[4].after.image} />
        </div>
      </div>
      <Caption label="AI에게 처음 한 요청">“{openingPrompt}”</Caption>
    </AbsoluteFill>
  );
}

function Screenshot({shot, label, after, mobile, zoom}) {
  const [focusX, focusY] = shot.focus;
  return (
    <figure className={`making-shot${after ? ' making-after' : ''}`}>
      <figcaption><b>{label}</b><span>{shot.label}</span></figcaption>
      <div className={`making-viewport${mobile ? ' making-mobile' : ''}`}>
        <Img
          src={shot.image}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: `${focusX * 100}% ${focusY * 100}%`,
          }}
        />
      </div>
    </figure>
  );
}

function Comparison({change, index}) {
  const frame = useCurrentFrame();
  const captionSwitch = 10 * FPS;
  const zoom = 1 + (change.zoom - 1) * easeIn(frame, 8 * FPS, 46);
  const showsPrompt = frame < captionSwitch;
  return (
    <AbsoluteFill>
      <ChapterBar current={index + 1} />
      <div className="making-title">
        <span>{index + 1} / {changes.length}</span>
        <h1>{change.title}</h1>
        {change.mobile && <span className="making-width">화면 폭 390px</span>}
      </div>
      <div className="making-compare">
        <Screenshot shot={change.before} label="고치기 전" mobile={change.mobile} zoom={zoom} />
        <Screenshot shot={change.after} label="고친 후" after mobile={change.mobile} zoom={zoom} />
      </div>
      {showsPrompt ? (
        <Caption label="AI에게 한 요청">“{change.prompt}”</Caption>
      ) : (
        <Caption label="바꾼 이유">{change.reason}</Caption>
      )}
    </AbsoluteFill>
  );
}

function Closing() {
  const entrance = easeIn(useCurrentFrame(), 0, 20);
  return (
    <AbsoluteFill className="making-closing">
      <ChapterBar />
      <section className="making-summary" style={{opacity: entrance}}>
        <h1>쓰는 사람을 생각하며<span>화면을 하나씩 고쳤어요.</span></h1>
        <div className="making-summary-grid">
          <div><h2>교실 TV</h2><p>짙은 배경 · 큰 본문</p></div>
          <div><h2>알림 찾기</h2><p>오늘 알림 먼저 · 날짜별 목록</p></div>
          <div><h2>휴대폰과 안내</h2><p>본문 전체 · 다음 행동 안내</p></div>
        </div>
      </section>
      <Caption label="만든 과정">화면을 보고 바꿀 이유를 정리한 뒤, AI에게 원하는 모습을 구체적으로 요청했어요.</Caption>
    </AbsoluteFill>
  );
}

export function MakingOf() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill className="making-of">
      <Sequence name="앱 소개와 첫 요청" durationInFrames={introSeconds * FPS}>
        <Opening />
      </Sequence>
      {changes.map((change, index) => (
        <Sequence
          key={change.topic}
          from={(introSeconds + index * comparisonSeconds) * FPS}
          durationInFrames={comparisonSeconds * FPS}
          name={change.topic}
        >
          <Comparison change={change} index={index} />
        </Sequence>
      ))}
      <Sequence name="만든 과정 정리" from={closingStart * FPS} durationInFrames={closingSeconds * FPS}>
        <Closing />
      </Sequence>
      <Audio
        src={staticFile('score.mp3')}
        loop
        volume={() => 0.28 * (1 - easeIn(frame, MAKING_OF_FRAMES - 2 * FPS, 2 * FPS - 1))}
      />
      <div className="making-progress"><div style={{width: `${(frame + 1) * 100 / MAKING_OF_FRAMES}%`}} /></div>
    </AbsoluteFill>
  );
}
