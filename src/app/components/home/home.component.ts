import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];
  categories: string[] = [];
  isLoading = true;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  loadFeaturedProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        // Get top 4 highest rated products as featured
        this.featuredProducts = products
          // .sort((a, b) => b.rating.rate - a.rating.rate)
          .slice(0, 4);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading featured products:', err);
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.productsService.getAllProducts().subscribe((products) => {
      this.categories = [...new Set(products.map(p => p.category))];
    });
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }

  navigateToCategory(category: string) {
    this.router.navigate(['/products'], { queryParams: { category } });
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}