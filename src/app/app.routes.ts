import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { AdminAnalyticsPageComponent } from './pages/admin-analytics/admin-analytics-page.component';
import { AdminLoginPageComponent } from './pages/admin-login/admin-login-page.component';
import { AdminPageComponent } from './pages/admin/admin-page.component';
import { AdminSettingsPageComponent } from './pages/admin-settings/admin-settings-page.component';
import { AdminUsersPageComponent } from './pages/admin-users/admin-users-page.component';
import { AdminWatchesPageComponent } from './pages/admin-watches/admin-watches-page.component';
import { AdminOrdersPageComponent } from './pages/admin-orders/admin-orders-page.component';
import { InfoPageComponent } from './pages/info/info-page.component';
import { AboutPageComponent } from './pages/about/about-page.component';
import { BrandsPageComponent } from './pages/brands/brands-page.component';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { CatalogPageComponent } from './pages/catalog/catalog-page.component';
import { CheckoutPageComponent } from './pages/checkout/checkout-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { OrdersPageComponent } from './pages/orders/orders-page.component';
import { ProductDetailsPageComponent } from './pages/product-details/product-details-page.component';
import { ProfilePageComponent } from './pages/profile/profile-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { WishlistPageComponent } from './pages/wishlist/wishlist-page.component';

export const routes: Routes = [
{ path: '', loadComponent: () => import('./pages/home/home-page.component').then(m => m.HomePageComponent) },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'brands', component: BrandsPageComponent },
  { path: 'watches', component: CatalogPageComponent },
  { path: 'catalog', component: CatalogPageComponent },
  { path: 'watch/:id', component: ProductDetailsPageComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutPageComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersPageComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
  { path: 'wishlist', component: WishlistPageComponent, canActivate: [authGuard] },
  { path: 'admin/login', component: AdminLoginPageComponent },
  { path: 'admin', component: AdminPageComponent, canActivate: [adminGuard] },
  { path: 'admin/watches', component: AdminWatchesPageComponent, canActivate: [adminGuard] },
  { path: 'admin/orders', component: AdminOrdersPageComponent, canActivate: [adminGuard] },
  { path: 'admin/users', component: AdminUsersPageComponent, canActivate: [adminGuard] },
  { path: 'admin/analytics', component: AdminAnalyticsPageComponent, canActivate: [adminGuard] },
  { path: 'admin/settings', component: AdminSettingsPageComponent, canActivate: [adminGuard] },
  { path: 'faq', component: InfoPageComponent, data: { title: 'FAQ', subtitle: 'Answers for client services, warranties, ownership, and delivery.' } },
  { path: 'shipping', component: InfoPageComponent, data: { title: 'Shipping & Returns', subtitle: 'White-glove delivery, insured transit, and return guidance.' } },
  { path: 'contact', component: InfoPageComponent, data: { title: 'Contact Us', subtitle: 'Speak with Caliber concierge for sourcing, aftercare, or delivery support.' } },
  { path: '**', redirectTo: '' }
];
