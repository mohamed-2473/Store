import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  images: string[];
  rating: number | { rate: number; count: number };
  stock: number;
  brand: string;
  discountPercentage: number;
  image?: string; // Added for compatibility
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.apiUrl}?limit=100`).pipe(
      map(response => response.products.map(product => ({
        ...product,
        // Map thumbnail to image for compatibility with existing components
        image: product.thumbnail,
        // Create rating object for compatibility
        rating: typeof product.rating === 'object' ? product.rating : {
          rate: product.rating,
          count: Math.floor(Math.random() * 1000) + 50 // Generate random review count
        }
      })))
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(product => ({
        ...product,
        image: product.thumbnail,
        rating: typeof product.rating === 'object' ? product.rating : {
          rate: product.rating,
          count: Math.floor(Math.random() * 1000) + 50
        }
      }))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/category/${category}`).pipe(
      map(response => response.products.map(product => ({
        ...product,
        image: product.thumbnail,
        rating: typeof product.rating === 'object' ? product.rating : {
          rate: product.rating,
          count: Math.floor(Math.random() * 1000) + 50
        }
      })))
    );
  }

  getFeaturedProducts(limit: number = 4): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products
        .sort((a, b) => {
          const rateA = typeof a.rating === 'object' ? a.rating.rate : a.rating;
          const rateB = typeof b.rating === 'object' ? b.rating.rate : b.rating;
          return rateB - rateA;
        })
        .slice(0, limit)
      )
    );
  }

  getRelatedProducts(productId: number, category: string, limit: number = 4): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products
        .filter(p => p.category === category && p.id !== productId)
        .slice(0, limit)
      )
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/search?q=${query}`).pipe(
      map(response => response.products.map(product => ({
        ...product,
        image: product.thumbnail,
        rating: typeof product.rating === 'object' ? product.rating : {
          rate: product.rating,
          count: Math.floor(Math.random() * 1000) + 50
        }
      })))
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/products/categories`);
  }
}

























// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, map } from 'rxjs';
// import { environment } from '../../environments/environment';

// export interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   image: string;
//   rating: {
//     rate: number;
//     count: number;
//   };
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductsService {
//   private apiUrl = `${environment.apiBaseUrl}/products`; // Use environment variable

//   constructor(private http: HttpClient) { }

//   getAllProducts(): Observable<Product[]> {
//     return this.http.get<Product[]>(this.apiUrl);
//   }

//   getProductById(id: number): Observable<Product | undefined> {
//     return this.getAllProducts().pipe(
//       map(products => products.find(product => product.id === id))
//     );
//   }

//   getProductsByCategory(category: string): Observable<Product[]> {
//     return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
//   }

//   getFeaturedProducts(limit: number = 4): Observable<Product[]> {
//     return this.getAllProducts().pipe(
//       map(products => products
//         .sort((a, b) => b.rating.rate - a.rating.rate)
//         .slice(0, limit)
//       )
//     );
//   }

//   getRelatedProducts(productId: number, category: string, limit: number = 4): Observable<Product[]> {
//     return this.getAllProducts().pipe(
//       map(products => products
//         .filter(p => p.category === category && p.id !== productId)
//         .slice(0, limit)
//       )
//     );
//   }

//   searchProducts(query: string): Observable<Product[]> {
//     return this.getAllProducts().pipe(
//       map(products => products.filter(product => 
//         product.title.toLowerCase().includes(query.toLowerCase()) ||
//         product.description.toLowerCase().includes(query.toLowerCase()) ||
//         product.category.toLowerCase().includes(query.toLowerCase())
//       ))
//     );
//   }

//   getCategories(): Observable<string[]> {
//     return this.getAllProducts().pipe(
//       map(products => [...new Set(products.map(p => p.category))])
//     );
//   }
// }