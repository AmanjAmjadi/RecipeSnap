import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      { // Allow local images if needed for development previews
        protocol: 'http',
        hostname: 'localhost',
        port: '*', // Or specify your dev port
        pathname: '/**',
      }
    ],
     // Allow data URIs for image previews
     dangerouslyAllowSVG: true,
     contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
     // The following allows data: URIs. Be cautious with this in production.
     // Consider more specific policies if needed.
     domains: ['data:'],
  },
};

export default nextConfig;
