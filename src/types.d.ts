
declare global {
    interface ProductType {
        id: number;
        title: string;
        rating: number;
        price: number;
        brand: string;
        category: string;
        products: []
      }
}

export {}