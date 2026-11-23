import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Trailer, FPS, FRAMES} from './trailer';
import {MakingOf, MAKING_OF_FRAMES} from './making-of';

function Root() {
  return (
    <>
      <Composition id="ClassNoticeTrailer" component={Trailer} width={1920} height={1080} fps={FPS} durationInFrames={FRAMES} />
      <Composition id="ClassNoticeMakingOf" component={MakingOf} width={1920} height={1080} fps={FPS} durationInFrames={MAKING_OF_FRAMES} />
    </>
  );
}

registerRoot(Root);
