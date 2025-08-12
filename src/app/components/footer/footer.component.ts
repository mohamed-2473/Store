import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  email = "info@store.com";
  currentYear = new Date().getFullYear();
  socialLinks = [
    { icon: 'bi-facebook', url: 'https://facebook.com' },
    { icon: 'bi-twitter', url: 'https://twitter.com' },
    { icon: 'bi-instagram', url: 'https://instagram.com' },
    { icon: 'bi-linkedin', url: 'https://linkedin.com' }
  ];
}