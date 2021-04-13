module.exports = {
  siteUrl: 'https://www.whoscheat.com',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 100,
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/api', '/user', '/user/*'],
  // Default transformation function
  transform: async (config, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/admin/*', '/user/*', '/api'],
      },
    ],
  },
};
