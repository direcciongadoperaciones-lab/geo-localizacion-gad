import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'GAD - Geolocalización División Operaciones',
        short_name: 'GAD Operaciones',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/'
      }
    })
  ]
});