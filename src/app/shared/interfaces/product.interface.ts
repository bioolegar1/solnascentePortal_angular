import { Timestamp } from '@angular/fire/firestore';

export interface Products {
  id?: string;
  name: string;
  description: string;
  category: string;
  barcode: string;
  weight: string;
  package_qty: number;
  image_url: string;
  gallery: string[];
  // Lógica: Aceita Timestamp (leitura) ou Date (escrita)
  created_at: Timestamp | Date;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  name: string;
  url: string;
  isMain: boolean;

}
