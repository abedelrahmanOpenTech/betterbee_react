import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // build: {
    //   outDir: '../new/frontend/',
    // },
    // build: {
    //     rollupOptions: {
    //         output:{
    //             manualChunks(id) {
    //                 if (id.includes('node_modules')) {
    //                     return id.toString().split('node_modules/')[1].split('/')[0].toString();
    //                 }
    //             }
    //         }
    //     }
    // },
    base: env.VITE_ROOT_PATH,
    plugins: [react()],
  }
})
