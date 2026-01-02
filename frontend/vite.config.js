import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // build: {
    //   outDir: '../new/frontend/',
    // },
    base: env.VITE_ROOT_PATH,
    plugins: [react()],
  }
})
