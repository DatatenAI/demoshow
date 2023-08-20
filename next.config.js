const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'standalone',
    experimental: {
        serverComponentsExternalPackages: ["pdfjs-dist","@zilliz/milvus2-sdk-node"],
        swcPlugins: [
            [
                'next-superjson-plugin',
                {
                    excluded: [],
                },
            ],
        ],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });
        config.externals = [...config.externals, "canvas"];
        return config;
    },

}

module.exports = withBundleAnalyzer(nextConfig)
