/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "yxpamzkgnfiglvph.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
