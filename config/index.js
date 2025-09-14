export const API = {
  currentBuild: 'base', // 'dev' или 'base'

  base: {
    protocol: 'https',
    url: 'life30server.ru',
    port: '',
    subpage: 'sitebypro',
  },

  dev: {
    protocol: 'http',
    url: 'localhost',
    port: ':3000',
    subpage: 'sitebypro',
  },

  get fullUrl() {
    const config = this[this.currentBuild]; 
    return `${config.protocol}://${config.url}${config.port}/${config.subpage}`;
  }
};

