import { Component } from '@angular/core';
import { Table } from '@stocks-radar/table';

@Component({
  selector: 'app-dashboard',
  imports: [Table],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
})
export class Dashboard {}
