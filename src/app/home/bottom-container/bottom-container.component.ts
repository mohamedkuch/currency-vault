import { Component } from '@angular/core';

@Component({
  selector: 'app-bottom-container',
  templateUrl: './bottom-container.component.html',
  styleUrls: ['./bottom-container.component.scss'],
})
export class BottomContainerComponent {
  buttons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', 'delete'];

  constructor() {}
}
