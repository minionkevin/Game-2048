import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-block',
  imports: [NgStyle],
  templateUrl: './block.component.html',
  styleUrl: './block.component.css'
})
export class BlockComponent {

  @Input({ required: true }) blockCount !: number;
  @Input() style!: { top: number, left: number };
  @Input() index!: number;

  get positionStyle() {
    return {
      top: this.style.top + 'px',
      left: this.style.left + 'px'
    };
  }

  getColor(value: number): string {
    switch (value) {
      case 2: return '#eee4da';
      case 4: return '#ede0c8';
      case 8: return '#f2b179';
      case 16: return '#f59563';
      case 32: return '#f67c5f';
      case 64: return '#f65e3b';
      case 128: return '#edcf72';
      case 256: return '#edcc61';
      case 512: return '#edc850';
      case 1024: return '#edc53f';
      case 2048: return '#edc22e';
      default: return '#3c3a32';
    }
  }
}
