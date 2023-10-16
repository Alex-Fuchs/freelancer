import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Modal} from "bootstrap";

/**
 * Initializes invoice overview with all modals.
 *
 * @author Alexander Fuchs
 */
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  orders = {
    loaded: false,
    columns: ['ID', 'Anfang', 'Ende'],
    data: []
  };

  response = {
    success: false
  };

  ordersForm: FormGroup;

  constructor(private data: DataService, private formBuilder: FormBuilder) {
  }

  /**
   * Initializes all the checkboxes for selecting which orders.
   */
  ngOnInit() {
    this.ordersForm = this.formBuilder.group({});

    this.data.getOrders().subscribe(data => {
      this.orders = data;

      for (let order of this.orders.data) {
        this.ordersForm.addControl(order[0], new FormControl(false));
      }
    });
  }

  /**
   * Trys to send the invoices and shows if successful. Reads all the checkboxes.
   */
  onSubmit(): void {
    let ids = [];

    for (let field in this.ordersForm.controls) {
      if (this.ordersForm.get(field).value) {
        ids.push(field);
      }
    }

    this.data.sendInvoices(ids).subscribe(data => {
      this.response = data;

      let element = document.getElementById('status') as HTMLElement;
      new Modal(element).show();
    });
  }
}
