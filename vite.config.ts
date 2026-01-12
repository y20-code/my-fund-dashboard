import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //解决开发环境跨域问题
  server: {
    proxy:{
      '/api':{
        target:'https://fundgz.1234567.com.cn',// 目标：天天基金接口
        changeOrigin:true,
        rewrite:(path) => path.replace(/^\/api/,'')
      }
    }
  }
})
