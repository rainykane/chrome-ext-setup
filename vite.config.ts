import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import glob from "glob"
import copy from 'rollup-plugin-copy'

const getEntry = () => {
  const list = {};
  // 遍历文件夹中含有main.ts的文件夹路径
  const allEntry = glob.sync("./src/views/**/main.ts");
  // 创建多页面模板
  allEntry.forEach((entry: string) => {
    const pathArr = entry.split("/");
    const name = pathArr[pathArr.length - 2];
    const tempHtml = `src/views/${name}/index.html`;
    // input中的配置
    list[name] = path.resolve(__dirname, tempHtml);
  });
  return list;
}

const pageEntry = getEntry();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    copy({
      targets: [
        { src: 'src/config/*', dest: 'dist' },
        { src: 'src/assets/image', dest: 'dist/assets' }
      ],
      hook: 'writeBundle'
    })
  ],
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src")
    }
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: pageEntry,
      output: {
        manualChunks(id) {
          console.log('[id]', id)
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        }
      }
    }
  }
})
