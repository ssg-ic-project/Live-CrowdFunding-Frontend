<<<<<<< HEAD
import { fileURLToPath, URL } from 'node:url' 
=======
// import { fileURLToPath, URL } from 'node:url'
//
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
//
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     },
//   },
// })
import { fileURLToPath, URL } from 'node:url'
>>>>>>> c21df164b245dca16065d28741f41650ea0743f8
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
<<<<<<< HEAD

=======
>>>>>>> main
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {  // 여기에 server 설정 추가
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
<<<<<<< HEAD
})
=======
})
>>>>>>> main
