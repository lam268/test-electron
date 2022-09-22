/**
 * @module preload
 */

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';
import { ipcRenderer, contextBridge } from "electron";

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
    try{
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        } as MediaTrackConstraints
      })
      handleStream(stream)
      } catch (e) {
        console.log(e)
      }
})

contextBridge.exposeInMainWorld('electronAPI', {
  getOptions: async () => {
    await ipcRenderer.send('GET_SOURCE')
  }
})

function handleStream (stream: any) {
    const video = document.querySelector('video')
    video!.srcObject = stream
    video!.onloadedmetadata = () => video!.play()
  }