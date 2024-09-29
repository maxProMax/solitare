import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {};

// export default nextConfig;

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
