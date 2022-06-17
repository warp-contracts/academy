// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Warp Academy',
  tagline: 'Dinosaurs are cool',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/smartweave.png',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'tutorials',
          path: 'tutorials',
          sidebarPath: require.resolve('./sidebars/tutorialSidebar.js'),
          lastVersion: 'current',
          onlyIncludeVersions: ['current'],
          editUrl: ({ docPath }) => {
            return `https://github.com/warp-contracts/warp/tree/main/warp-academy-docs/tutorials/${docPath}`;
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        // Will be passed to @docusaurus/plugin-google-analytics.
        googleAnalytics: {
          trackingID: 'UA-216524725-1',
          // Optional fields.
          anonymizeIP: true, // Should IPs be anonymized?
        },
      }),
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'docs',
        path: 'docs',
        routeBasePath: 'docs',
        editUrl: ({ docPath }) => {
          return `https://github.com/warp-contracts/warp/tree/main/warp-academy-docs/docs/${docPath}`;
        },
        sidebarPath: require.resolve('./sidebars/docsSidebar.js'),
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
      },
      hideableSidebar: true,
      navbar: {
        title: 'Warp Academy',
        logo: {
          alt: 'My Site Logo',
          src: 'img/smartweave.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'tutorials-intro',
            position: 'left',
            label: 'Tutorials',
          },
          {
            label: 'Docs',
            position: 'left',
            to: 'docs/docs-intro',
          },
          {
            href: 'https://github.com/warp-contracts/warp',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.com/invite/PVxBZKFr46',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/redstone_defi',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/warp-contracts/warp',
              },
              {
                label: 'Website',
                href: 'https://warp.cc',
              },
            ],
          },
        ],
        logo: {
          alt: 'Warp logo',
          src: 'img/smartweave.svg',
          href: 'https://warp.cc',
          width: 50,
          height: 20,
        },
        copyright: `Copyright © ${new Date().getFullYear()} RedStone`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'MCHYFKZV38',

        apiKey: '83b1fd61be3073cd6100d6f2239fe47c',

        indexName: 'redstone-academy',
      },
    }),
};

module.exports = config;
