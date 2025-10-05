import { defineConfig } from 'vite';

/**
 * Vite Configuration: Combines existing root/public setup with build settings.
 */
export default defineConfig({
  // Existing configuration for project structure
  root: 'src/',
  publicDir: '../static/',
  base: './',

  // Build configuration to resolve deployment and warning issues
  build: {
    // 1. CRITICAL FIX: Explicitly set the output directory relative to the project root.
    // Since 'root' is 'src/', we need to tell Vite to put the final output 
    // *outside* of 'src/', typically in 'dist' relative to the project root.
    // If you want 'dist' to be *inside* 'src', change this to 'src/dist'.
    outDir: '../dist', 

    // 2. CHUNK SIZE WARNING FIX: Increases the warning threshold to 2000 KiB (2 MB)
    chunkSizeWarningLimit: 2000,

    // Optional: Enable source maps for better debugging of production code
    sourcemap: true,
  },
});