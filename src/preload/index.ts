/* eslint-disable @typescript-eslint/no-unused-vars */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

ipcRenderer.on('SET_SOURCE', async (_event, sourceId) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop'
        }
      } as MediaTrackConstraints,
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
    handleError(e)
  }
})

function handleStream(stream): void {
  const video = document.querySelector('video')
  video!.srcObject = stream
  video!.onloadedmetadata = (_e): Promise<void> => video!.play()
}

function handleError(e): void {
  console.log(e)
}
