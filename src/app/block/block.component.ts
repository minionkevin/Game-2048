import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, input } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { SingleBlockData } from '../block-type.Module';
import { BoardService } from '../services/board.service';

@Component({
  selector: 'app-block',
  imports: [NgStyle, CommonModule],
  templateUrl: './block.component.html',
  styleUrl: './block.component.css'
})
export class BlockComponent {

  @Input() width!: number;
  @Input() height!: number;
  @Input() xpos!: number;
  @Input() ypos!: number;

  @Output() moveEnd = new EventEmitter<SingleBlockData>();
  @Input() blockData!: SingleBlockData;

  public isMerge: boolean = false;
  public isMove: boolean = false;

  constructor() { }

  onTransitionEnd(event: TransitionEvent) {
    this.moveEnd.emit(this.blockData);
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
      default: return '#eee4da';
    }
  }
}
