import {Component, OnDestroy} from '@angular/core';
import {BreadcrumbService} from './app.breadcrumb.service';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnDestroy {

  subscription: Subscription;

  items: MenuItem[];
  back: any;

  constructor(public breadcrumbService: BreadcrumbService) {
    this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
      this.items = response;
    });
    this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
      this.back = response;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
