/**
 * @module preload
 */
export {versions} from './versions';
import {createPeer} from './stream';
import {createJoinPeer} from './join';
import {ipcRenderer, contextBridge} from 'electron';

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720,
        },
      } as MediaTrackConstraints,
    });
    handleStream(stream);
  } catch (e) {
    console.log(e);
  }
});

ipcRenderer.on('SET_CAMERA', async _event => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    handleStream(stream, true);
  } catch (e) {
    console.log(e);
  }
});

contextBridge.exposeInMainWorld('electronAPI', {
  getOptions: async () => {
    await ipcRenderer.send('GET_SOURCE');
  },
  joinCamera: () => {
    ipcRenderer.send('JOIN_CAMERA');
  },
  joinStream: () => {
    const peer = createJoinPeer();
    peer.addTransceiver('video', {direction: 'recvonly'});
  },
  lockKeyboard: (locked: boolean) => {
    ipcRenderer.send('LOCK_KEYBOARD', locked);
  },
  lockMouse: (lockedMouse: boolean) => {
    // ipcRenderer.send('LOCK_MOUSE');
    if (lockedMouse) {
      const body = document.getElementsByTagName('BODY')[0] as HTMLElement;
      body.style.pointerEvents = 'none';
    } else {
      const body = document.getElementsByTagName('BODY')[0] as HTMLElement;
      body.style.pointerEvents = 'auto';
    }
    const btnLock = document.getElementById('lock-mouse') as HTMLElement;
    btnLock.style.pointerEvents = 'auto';
  },
});

function handleStream(stream: any, isWebcam = false) {
  const id = isWebcam ? 'camera' : 'screen-sharing';
  const video = document.getElementById(id) as HTMLMediaElement;
  video!.srcObject = stream;
  video!.onloadedmetadata = () => video!.play();
  const peer = createPeer();
  stream.getTracks().forEach((track: any) => peer.addTrack(track, stream));
}
