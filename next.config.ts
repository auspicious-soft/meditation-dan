/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
        port: "", // Leave empty unless using a custom port
        pathname: "/**", // Allows all paths under this domain
      },
    ],
  },
};

module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'standalone',
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
//         port: "",
//         pathname: "/**",
//       },
//     ],
//   },
//   experimental: {
//     serverActions: {
//       bodySizeLimit: '2mb' // or any other configuration
//     },
//     // Remove serverComponentsExternalPackages from experimental
//   },
//   serverExternalPackages: ['@aws-sdk/client-s3'], // Moved from experimental
//   typescript: {
//     ignoreBuildErrors: false
//   },
//   eslint: {
//     ignoreDuringBuilds: false
//   }
// };

// module.exports = nextConfig;