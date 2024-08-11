import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "Qr Grid",
  description: "The Ultimate Customizable QR Code JavaScript Library",
  head: [["link", { rel: "icon", href: "./favicon.ico" }]],
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
      { text: "Guide", link: "/guide/", activeMatch: '/guide/' },
      { text: "Generate", link: "/generate/" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Get Started", link: "/guide/" },
          { text: "Customization", link: "/guide/customization" },
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
      copyright: "Copyright © 2024-present Saurabh Yadav",
    },
  },
  sitemap: {
    hostname: "https://qrgrid.dev/",
  },
});
