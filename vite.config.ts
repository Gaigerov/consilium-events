import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: "/consilium-events/",
    plugins: [react()],
    build: {
        outDir: 'build',
        assetsDir: 'assets',
        cssCodeSplit: true,
        minify: 'esbuild',
        cssMinify: true,
        rollupOptions: {
            output: {
                manualChunks: undefined,
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    }
})
