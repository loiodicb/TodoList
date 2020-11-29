import { TodoItemData } from '../dataTypes/TodoItemData';
import { TodoService } from '../todo.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { from } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})

export class TodoItemComponent implements OnInit {
  
  @Input() private data: TodoItemData;
  @ViewChild("newTextInput", { static: false }) private inputLabel: ElementRef;

  private _editionMode = false;
  constructor(private todoService: TodoService) { }

  ngOnInit() {
  }

  get editionMode(): boolean {
    return this._editionMode;
  }

  set editionMode(e: boolean) {
    this._editionMode = e;
    requestAnimationFrame(() => this.inputLabel.nativeElement.focus());
  }

  get label(): string {
    return this.data.label;
  }

  set label(lab: string) {
    this.todoService.setItemsLabel(lab, this.data);
  }

  get isDone(): boolean {
    return this.data.isDone;
  }

  set isDone(done: boolean) {
    this.todoService.setItemsDone(done, this.data);
  }

  destroy() {
    this.todoService.removeItems(this.data);
  }
  
}