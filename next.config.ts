/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:  `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
        port: "", // Leave empty unless using a custom port
        pathname: "/**", // Allows all paths under this domain
      },
    ],
  },
};

module.exports = nextConfig;