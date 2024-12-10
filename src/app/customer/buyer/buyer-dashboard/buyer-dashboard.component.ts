import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AdminAuthGuardLogin } from '../../../shared/services/auth-gaurd.service';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buyer-dashboard',
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.scss']
})
export class BuyerDashboardComponent implements OnInit {

  all_products = [];
  filtered_products = [];
  show_checkout: Boolean = false;
  searchQuery: string = '';
  private searchSubscription: Subscription;

  constructor(
    private router: Router, 
    private customerService: CustomerService, 
    public authService: AdminAuthGuardLogin,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.getAllProduct();
    this.searchSubscription = this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
      this.filterProducts();
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  filterProducts() {
    if (!this.searchQuery.trim()) {
      this.filtered_products = this.all_products.filter(product => product.status === 'publish'); // Si no hay búsqueda, mostrar todos
    } else {
      this.filtered_products = this.all_products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.filtered_products = this.filtered_products.filter(product => product.status === 'publish');
    }
  }

  getAllProduct() {
    this.customerService.allProduct().subscribe(data => {
      this.all_products = data; 
      // Filtrar los productos con `status: "publish"`
      this.filtered_products = this.all_products.filter(product => product.status === 'publish');
    }, error => {
      console.log("Error al obtener los productos", error);
    });
  }

  buyProduct(id) {
    this.show_checkout = true;
    this.customerService.quickBuyProduct(id) //We pass to serice from service we can access in another component
    this.router.navigateByUrl("/checkout");
  }



}
