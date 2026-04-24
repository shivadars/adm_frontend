import { mockProducts } from './apiMockData';

// Simulated axios instance for mock functionality
const axiosInstance = {
  get: async (url, config = {}) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let currentProducts = mockProducts;
        try {
          const stored = localStorage.getItem('adoremom_products');
          if (stored) currentProducts = JSON.parse(stored);
        } catch (e) {}

        if (url === '/api/products') {
          // simple search and filter mock
          let data = currentProducts;
          if (config.params?.category) {
            const catParam = config.params.category.toLowerCase().replace(/-/g, ' ');
            data = data.filter(p => p.category.toLowerCase() === catParam || p.category.toLowerCase().replace(/-/g, ' ') === catParam);
          }
          if (config.params?.search) {
            data = data.filter(p => p.name.toLowerCase().includes(config.params.search.toLowerCase()));
          }
          resolve({ data: { success: true, count: data.length, data } });
        } else if (url.startsWith('/api/products/')) {
          const id = url.split('/').pop();
          const product = currentProducts.find(p => p.id === id);
          if (product) resolve({ data: { success: true, data: product } });
          else reject({ response: { status: 404, data: { message: 'Product not found' } } });
        } else {
          reject({ response: { status: 404, data: { message: 'Route not found' } } });
        }
      }, 500); // 500ms network delay
    });
  }
};

export default axiosInstance;
