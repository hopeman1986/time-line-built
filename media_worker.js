importScripts("videoplayer.js", "mp4box.all.min.js");

let moduleLoadedResolver = null;
let modulesReady = new Promise(resolver => (moduleLoadedResolver = resolver));
let playing = false
let audioRenderer = null;
let videoRenderer = null;
let lastMediaTimeSecs = 0;
let lastMediaTimeCapturePoint = 0;

(async () => {
    audioRenderer = new webglvideo.AudioRenderer;
    videoRenderer = new webglvideo.VideoRenderer;
    moduleLoadedResolver();
    moduleLoadedResolver = null;
    console.info('Worker modules imported');

    // Promise.all([audioImport, videoImport]).then((modules) => {
    //   audioRenderer = new modules[0].AudioRenderer();
    //   videoRenderer = new modules[1].VideoRenderer();
    //   moduleLoadedResolver();
    //   moduleLoadedResolver = null;
    //   console.info('Worker modules imported');
    // })
})();

function updateMediaTime(mediaTimeSecs, capturedAtHighResTimestamp) {
  lastMediaTimeSecs = mediaTimeSecs;
  // Translate into Worker's time origin
  lastMediaTimeCapturePoint =
    capturedAtHighResTimestamp - performance.timeOrigin;
}

// Estimate current media time using last given time + offset from now()
function getMediaTimeMicroSeconds() {
  let msecsSinceCapture = performance.now() - lastMediaTimeCapturePoint;
  return ((lastMediaTimeSecs * 1000) + msecsSinceCapture) * 1000;
}

self.addEventListener('message', async function(e) {
  await modulesReady;

//  console.info(`Worker message: ${JSON.stringify(e.data)}`);

  switch (e.data.command) {
    case 'initialize':
      //let demuxerModule = await import('./mp4_pull_demuxer.js');

      let audioDemuxer = new webglvideo.MP4PullDemuxer(e.data.audioFile);
      let audioReady = audioRenderer.initialize(audioDemuxer);

      let videoDemuxer = new webglvideo.MP4PullDemuxer(e.data.videoFile);
      let videoReady = videoRenderer.initialize(videoDemuxer, e.data.canvas);
      // await Promise.all([videoReady]);
      // await Promise.all([audioReady]);

      await Promise.all([audioReady, videoReady]);
      postMessage({command: 'initialize-done',
                   sampleRate: audioRenderer.sampleRate,
                   channelCount: audioRenderer.channelCount,
                   sharedArrayBuffer: audioRenderer.ringbuffer.buf,
                   movie_duration: videoRenderer.movie_duration});
      break;
    case 'play':
      playing = true;

      updateMediaTime(e.data.mediaTimeSecs,
                      e.data.mediaTimeCapturedAtHighResTimestamp);

      audioRenderer.play();

      self.requestAnimationFrame(renderVideo);
      break;
    case 'pause':
      playing = false;
      audioRenderer.pause();
      await seekFile(0);

      playing = true;
      updateMediaTime(0,
        0);

      audioRenderer.play();
      self.requestAnimationFrame(renderVideo);

      break;
    case 'update-media-time':
      console.log("update-media-time________", e.data.mediaTimeSecs);
      updateMediaTime(e.data.mediaTimeSecs,
                      e.data.mediaTimeCapturedAtHighResTimestamp);
      break;
    default:
      console.error(`Worker bad message: ${e.data}`);
  }

  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function renderVideo() {
    if (!playing)
    return;
    videoRenderer.render(getMediaTimeMicroSeconds());
    // await sleep(10);
    self.requestAnimationFrame(renderVideo);
  }
});

async function seekFile(time) {
  videoRenderer.seekFile(time);
  audioRenderer.seekFile(time);
}