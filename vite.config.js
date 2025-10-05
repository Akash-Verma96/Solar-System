import { defineConfig } from "vite"

export default{
    root: 'src/',
    publicDir: '../static/',
    base: './',
    build: {
    chunkSizeWarningLimit: 2000, 
  },
}


// import { defineConfig } from 'vite';

// export default defineConfig({
//   build: {
//     chunkSizeWarningLimit: 2000, 
//   },
// });