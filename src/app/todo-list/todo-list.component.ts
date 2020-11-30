import {Component, OnInit} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';
import { JsonPipe } from '@angular/common';
import { isEmpty } from 'rxjs-compat/operator/isEmpty';
import { VoiceRecognitionService } from '../service/voice-recognition.service';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.css']
 
})
export class TodoListComponent implements OnInit {

    private todoList: TodoListData;
    public myAngularxQrCode: string = "";
    public message : string = "";
    
    constructor(private todoService: TodoService, private voiceRecognition: VoiceRecognitionService){
        todoService.getTodoListDataObservable().subscribe( tdl => this.todoList = tdl );
        this.myAngularxQrCode = "";
        this.voiceRecognition.init();
        
    }

    ngOnInit() {
    }
 
    get label(): string {
        return this.todoList.label;
    }
    
    get items(): TodoItemData[] {
        return this.todoList.items;
    }
    appendItem(label: string){
        if(label != ""){
            this.todoService.appendItems({
                label,
                isDone:false,
                isShow: true
            });
        }
        
    }
    itemSupp(){
        // this.todoService.removeItems();
        this.todoService.removeItemsDone();
    }

    itemActive(){
       this.todoList.items.forEach(I => 
        {if(I.isDone==true)
            I.isShow=false;
        else{I.isShow=true;}

        });
        console.log("Item Active",this.todoList.items);
    }

    itemAll(){
        this.todoList.items.forEach(I =>I.isShow=true);
     }
    
    itemComplete(){
        this.todoList.items.forEach(I => 
        {if(I.isDone==true)
            I.isShow=true;
        else{
            I.isShow=false;
        }
        });
         
    }
    compteur(){
        return this.todoList.items.length - this.todoList.items.filter(I =>I.isDone==true).length;
    }
    
    erasedAll(){
        this.todoList.items.forEach(I =>this.todoService.removeItems(I));
    }

    generateQrCode(){
        this.myAngularxQrCode = JSON.stringify(this.todoList.items);
        console.log(this.myAngularxQrCode);
    }

    start() {
        this.voiceRecognition.start();
    }
    
    stop(){
        this.voiceRecognition.stop();
        if(this.voiceRecognition.text != ""){
            this.appendItem(this.voiceRecognition.text);
            console.log("6 :",this.voiceRecognition.text);
            this.message = this.voiceRecognition.tempWords;
        }else{
            console.log("variable empty");
        }
        // this.voiceRecognition.text = "";
        // this.message = "";
      }
}