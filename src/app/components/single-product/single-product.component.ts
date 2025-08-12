import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService, Product } from '../../services/products.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css'
})
export class SingleProductComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  isLoading = true;
  isLoadingRelated = true;
  quantity = 1;
  selectedImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productsService: ProductsService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(+productId);
      }
    });
  }

  loadProduct(productId: number) {
    this.isLoading = true;
    this.productsService.getProductById(productId).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.loadRelatedProducts();
        } else {
          this.toastr.error('Product not found', 'Error');
          this.router.navigate(['/products']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.toastr.error('Error loading product', 'Error');
        this.router.navigate(['/products']);
        this.isLoading = false;
      }
    });
  }

  loadRelatedProducts() {
    if (!this.product) return;
    
    this.isLoadingRelated = true;
    this.productsService.getRelatedProducts(this.product.id, this.product.category, 4).subscribe({
      next: (products) => {
        this.relatedProducts = products;
        this.isLoadingRelated = false;
      },
      error: (err) => {
        console.error('Error loading related products:', err);
        this.isLoadingRelated = false;
      }
    });
  }

  incrementQuantity() {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack() {
    this.location.back();
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/single-product', productId]);
  }

  getStarArray(rating: number | { rate: number; count: number }): boolean[] {
    const stars = [];
    const rate = typeof rating === 'object' ? rating.rate : rating;
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.floor(rate));
    }
    return stars;
  }

  getHalfStar(rating: number | { rate: number; count: number }): boolean {
    const rate = typeof rating === 'object' ? rating.rate : rating;
    return (rate % 1) >= 0.5;
  }

  get math() {
    return Math;
  }

  shareProduct() {
    if (!this.product) return;

    if (navigator.share) {
      navigator.share({
        title: this.product.title,
        text: this.product.description,
        url: window.location.href
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.toastr.info('Product link copied to clipboard!', 'Shared');
      });
    }
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  getDiscountedPrice(): number {
    if (this.product?.discountPercentage) {
      return this.product.price * (1 - this.product.discountPercentage / 100);
    }
    return this.product?.price || 0;
  }

  hasDiscount(): boolean {
    return (this.product?.discountPercentage ?? 0) > 0;
  }

  getCurrentImage(): string {
    if (!this.product) return '';
    
    if (this.product.images && this.product.images.length > 0) {
      return this.product.images[this.selectedImageIndex] || this.product.images[0];
    }
    
    return this.product.thumbnail || this.product.image || '';
  }
}