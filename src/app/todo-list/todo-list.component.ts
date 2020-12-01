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
    public events :  Array<TodoListData>;
    public position: number;
    
    constructor(private todoService: TodoService, private voiceRecognition: VoiceRecognitionService){
        this.localStorageTodolist()
        todoService.getTodoListDataObservable().subscribe( 
            tdl => {
                this.todoList = tdl;
                localStorage.setItem("todolist",JSON.stringify(this.items));
            });
        this.myAngularxQrCode = "";
        this.voiceRecognition.init();
        
    }

    ngOnInit() {
        this.events = JSON.parse(localStorage.getItem("events")) || [];
        this.position = this.events.length - 1;
        console.log(this.position);

    }
 
    get label(): string {
        return this.todoList.label;
    }
    
    get items(): TodoItemData[] {
        return this.todoList.items;
    }
    appendItem(label: string, isDone: boolean = false, fromLocalStorage: boolean = false){
        if(label != ""){
            this.todoService.appendItems({
                label,
                isDone:isDone,
                isShow: true
            });
        }
        if(!fromLocalStorage){
            this.addEvent();
        }
        
    }
    itemSupp(){
        // this.todoService.removeItems();
        this.todoService.removeItemsDone();
        this.addEvent();
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
    
    selectAll(){
    var service = this;
        this.todoList.items.forEach(I => 
            {if(I.isDone==false)
                service.todoService.setItemsDone(I.isDone = true);
            });
    }

    erasedAll(){
        this.todoList.items.forEach(I =>this.todoService.removeItems(I));
        this.addEvent();
    }

    localStorageTodolist(){
        let nom = localStorage.getItem("todolist");
        if(nom != "" && nom != null){
            JSON.parse(nom).forEach(I => this.appendItem(I.label, I.isDone, true));
        }
        
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
        this.voiceRecognition.text = "";
        this.message = "";
      }
    
    addEvent(){
        
        // get list of events I stored
        this.events = JSON.parse(localStorage.getItem("events")) || [];
        // add current todolist  to the var events
        this.events.push(this.todoList);
        if(this.events != null){
            // set the key events  with the new list inside the local strorage
            localStorage.setItem("events",JSON.stringify(this.events));
        }
       
        console.log(this.events);
        this.position = this.events.length - 1;
    }
    undo(){
        // get my list of events
        this.events = JSON.parse(localStorage.getItem("events")) || [];
        this.position = this.position -1;
        if(this.position >= 0){
            var event = this.events[this.position];
            console.log(event);
            this.todoList.items =event.items;
        }
    }

    redo(){
        // get my list of events
        this.events = JSON.parse(localStorage.getItem("events")) || [];
        // add 1 to the position to move into the array
        this.position = this.position + 1;
        console.log(this.position)
        if(this.position <= this.events.length -1){
            var event = this.events[this.position];
            console.log(event);
            // add the last Item removed in the list 
            this.todoList.items = event.items;
        }else{
            console.log("It can't be greater than the lenght of this.event")
        } 
        console.log(this.position)
        console.log(this.events)
    }
}