import { defineConfig } from "vitepress";
import svgLoader from "vite-svg-loader";
import { siteConfig } from "./site-config.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: siteConfig.title,
  description: siteConfig.description,
  head: [
    ["link", { rel: "icon", href: "./favicon.ico" }],
    ["meta", { property: "og:locale", content: "en_US" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: siteConfig.name }],
    ["meta", { property: "og:title", content: siteConfig.title }],
    ["meta", { property: "og:description", content: siteConfig.description }],
    ["meta", { property: "og:url", content: siteConfig.url }],
    ["meta", { property: "og:image", content: siteConfig.ogImage }],
    ["meta", { property: "twitter:url", content: siteConfig.url }],
    ["meta", { property: "twitter:card", content: "summary_large_image" }],
    ["meta", { property: "twitter:title", content: siteConfig.title }],
    ["meta", { property: "twitter:image", content: siteConfig.ogImage }],
    [
      "meta",
      { property: "twitter:description", content: siteConfig.description },
    ],
  ],
  cleanUrls: true,
  srcExclude: ["**/README.md"],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: "/logo-no-name-dark.svg",
      dark: "/logo-no-name-light.svg",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/", activeMatch: "/guide/" },
      { text: "Examples", link: "/examples/" },
      { text: "Generate", link: "/generate/" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Get Started", link: "/guide/" },
          { text: "How It Works", link: "/guide/how-it-works" },
          { text: "Customization", link: "/guide/customization" },
        ],
      },
      {
        text: "Packages",
        items: [
          { text: "Core", link: "/guide/packages/core" },
          { text: "React", link: "/guide/packages/react" },
          { text: "Vue", link: "/guide/packages/vue" },
          { text: "Angular", link: "/guide/packages/angular" },
          { text: "Styles", link: "/guide/packages/styles" },
          { text: "Server", link: "/guide/packages/server" },
          { text: "Cli", link: "/guide/packages/cli" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/yadav-saurabh/qrGrid" },
    ],
    editLink: {
      pattern: "https://github.com/yadav-saurabh/qrGrid/edit/main/docs/:path",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright:
        "Copyright © 2024-present <a href='https://yadav-saurabh.com' target='_blank'>Saurabh Yadav </a>",
    },
  },
  vite: {
    plugins: [svgLoader()],
  },
  sitemap: {
    hostname: siteConfig.url,
  },
});
