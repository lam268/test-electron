import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { electron } from './src/scripts/vite-plugin-electron'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['@electron-toolkit/utils']
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        external: [...electron.externals, '@electron-toolkit/preload']
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    optimizeDeps: {
      exclude: [...electron.externals, 'fs-extra', 'extract-zip']
    },
    plugins: [
      vue(),
      electron(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  }
})
