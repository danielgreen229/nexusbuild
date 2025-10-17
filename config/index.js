export const API = {
  currentBuild: 'base', // 'dev' или 'base'

  base: {
    protocol: 'https',
    url: 'sitebypro-server.ru',
    port: '',
    subpage: '',
  },

  dev: {
    protocol: 'http',
    url: 'localhost',
    port: ':3000',
    subpage: '',
  },

  get fullUrl() {
    const config = this[this.currentBuild]; 
    return `${config.protocol}://${config.url}${config.port}${config.subpage? '/' + config.subpage : ''}`;
  }
};

