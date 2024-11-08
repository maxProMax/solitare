import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilepackages: ["three"],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
