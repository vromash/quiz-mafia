/* eslint-disable no-param-reassign */
module.exports = {
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false, os: false };
        return config;
    }
};
