import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { TruncatePipe } from '../../truncate.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe],
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  isLoading = true;

  @ViewChild('productsSection') productsSection!: ElementRef;

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;

  // Filters
  selectedCategory = 'all';
  searchQuery = '';
  sortOption = 'default';

  constructor(
    private service: ProductsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();

    // Check if category is passed from home page
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.applyFilters();
      }
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.service.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.toastr.error('Error loading products', 'Error');
        this.isLoading = false;
      },
    });
  }

  get math() {
    return Math;
  }

  loadCategories() {
    this.service.getAllProducts().subscribe((products) => {
      const uniqueCategories = [...new Set(products.map((p) => p.category))];
      this.categories = uniqueCategories;
    });
  }

  applyFilters() {
    let filtered = [...this.products];

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sorting
    switch (this.sortOption) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
    }

    this.filteredProducts = filtered;
    this.currentPage = 1; // Reset to first page when filters change
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get pageNumbers() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  resetFilters() {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.sortOption = 'default';
    this.applyFilters();
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/single-product', productId]);
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.floor(rating));
    }
    return stars;
  }

  scrollToProducts() {
    const filtersSection = document.querySelector('.filters-section');
    if (filtersSection) {
      filtersSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
