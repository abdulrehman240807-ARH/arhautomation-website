// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite plugin: force `server.allowedHosts` to accept any host,
 * so the dev server can be exposed through public tunnels
 * (Cloudflare Tunnel / trycloudflare.com, localtunnel, etc.).
 * Runs after Astro's own config so our value wins.
 */
const allowAnyHost = {
  name: 'allow-any-host',
  configResolved(config) {
    config.server.allowedHosts = true
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://voltops.ai',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss(), allowAnyHost],
    server: {
      // Allow access through public tunnels (e.g. Cloudflare Tunnel)
      allowedHosts: true
    }
  }
})
