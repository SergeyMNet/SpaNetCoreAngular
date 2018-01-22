import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';

import { AppState } from './reducers';
import { AdminActions } from './actions';


@Component({
    moduleId: module.id,
    selector: 'app-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.scss']
})
export class AdminComponent implements OnInit {


    // lineChart
    public lineChartType = 'line';
    public lineChartData: Array<any> = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90], ];
    public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    // Pie
    public pieChartType = 'doughnut';
    chats_names$: Observable<any[]>;
    public pieChartData = [300, 500];

    constructor(private store: Store<any>,
        private adminActions: AdminActions) {
        this.chats_names$ = this.store.select(s => s.reducer.chats);
        this.chats_names$.subscribe(r => { console.log(r); });
    }

    ngOnInit() {
        this.store.dispatch(this.adminActions.loadChats());
    }

    public chartClicked(e: any): void {
        console.log(e);
      }

    public chartHovered(e: any): void {
        console.log(e);
    }

}
