/** @type {import('next').NextConfig} */
// const nextConfig = {

// }

// module.exports = nextConfig

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });

    return config;
  },
  env: {
    SENDINBLUE_API_KEY: process.env.SENDINBLUE_API_KEY,
  },
};
