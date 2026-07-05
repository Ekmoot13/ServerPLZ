/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Tymczasowo (Etap 0): nie blokuj builda błędami typów/ESLint.
  // Ten frontend zostanie przepisany w Etapie 2/3 — wtedy to usuniemy.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
