/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {app, BrowserWindow, ipcMain, desktopCapturer, Menu, systemPreferences} from 'electron';
import {join} from 'path';
import {URL} from 'url';

async function createWindow() {
  const browserWindow = new BrowserWindow({
    show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(app.getAppPath(), 'packages/preload/dist/index.cjs'),
    },
  });

  /**
   * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
   * it then defaults to 'true'. This can cause flickering as the window loads the html content,
   * and it also has show problematic behaviour with the closing of the window.
   * Use `show: false` and listen to the  `ready-to-show` event to show the window.
   *
   * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test.
   */
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

  await browserWindow.loadURL(pageUrl);

  return browserWindow;
}

export async function getListSources(mainWindow: any) {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
  });
  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => mainWindow.webContents.send('SET_SOURCE', source.id),
      };
    }),
  );
  videoOptionsMenu.popup();
}

/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }
  ipcMain.on('GET_SOURCE', async () => {
    const res = await getListSources(window);
    return res;
  });
  ipcMain.on('JOIN_CAMERA', async () => {
    const permissions = systemPreferences.getMediaAccessStatus('camera');
    if (permissions !== 'granted') {
      const res = await systemPreferences.askForMediaAccess('camera');
      console.log(res);
    }
    if (systemPreferences.getMediaAccessStatus('camera') === 'granted') {
      window?.webContents.send('SET_CAMERA');
    }
  });
  function handleEvent(event: any, input: any) {
    console.log(input)
    event.preventDefault();
  }
  ipcMain.on('LOCK_KEYBOARD', (_event, isLocked) => {
    if (isLocked) {
      if (process.platform === 'darwin') window?.setSimpleFullScreen(true)
      else window?.maximize();
      window!.closable = false;
      window!.minimizable = false;
      window?.webContents.addListener('before-input-event', handleEvent);
    } else {
      window!.closable = true;
      window!.minimizable = true;
      window?.webContents.removeListener('before-input-event', handleEvent);
    }
  });
  ipcMain.on('LOCK_MOUSE', () => {
    console.log('lock mouse 108')
  })
  window.focus();
}
