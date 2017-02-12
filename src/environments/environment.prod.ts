export const environment = {
  production: true,
  envName: 'production',
  papersApiUrl: 'http://dev.papers.fm/',
  apiArticles: 'wp-json/wp/v2/articles/',
  apiJournals: 'wp-json/wp/v2/journals/',
  itemsPerPage: 10,
  client: 'web'
};

export const dbAdapter = new LokiIndexedAdapter('loki');
