/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js'

/** @type {import("next").NextConfig} */
const config = {
  rewrites: async () => {
    return [
      {
        // 👇 matches all routes except /api
        source: '/((?!api/).*)',
        destination: '/static-app-shell',
      },
    ]
  },
  devIndicators: false,
}

export default config
