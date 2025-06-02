export interface ProductSpecs {
  [key: string]: any; // Permet un accès dynamique aux specs
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  brand: string;
  type: string;
  model: string;
  description: string;
  description2?: string;
  price: number;
  pricet1: number;
  pricet2: number;
  pricet3: number;
  guarantee?: string;
  gn: boolean;
  image: string;
  role: string;
  specs?: ProductSpecs;
}
