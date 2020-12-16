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
        // local storage initialisation to get the list from the local storage
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
/*
    Method appendItem() 
    Append an item in the list ang give a status true false in parameters
    isDone: boolean
    label: string
    and add a copy inside the local storage
*/ 
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

/*
    Method itemSupp() 
    This methode will delete from the list only the element
    whos has been checked on the list of todolist
*/ 
    
    itemSupp(){
        this.todoService.removeItemsDone();
        this.addEvent();
    }
/*
    Method itemActive()
    In the tab "Actifs" it look if in the list one or severals words or checked 
    if yes I hide the element checked
*/ 
    itemActive(){
       this.todoList.items.forEach(I => 
        {if(I.isDone==true)
            I.isShow=false;
        else{I.isShow=true;}

        });
        console.log("Item Active",this.todoList.items);
    }
/*
    Method itemAll()
    In the tab "Tous" we are displaying all the element in present 
    in the list checked or not
*/ 
    itemAll(){
        this.todoList.items.forEach(I =>I.isShow=true);
     }

/*
    Method itemComplete()
    In the tab "Complétés" it will appear only the element
     who has been checked in the list
*/ 
    itemComplete(){
        this.todoList.items.forEach(I => 
        {if(I.isDone==true)
            I.isShow=true;
        else{
            I.isShow=false;
        }
        });
         
    }
/*
    Method compteur()
    In the bottom left there is a label  "restates" we display just before this label
    the number of element is not checked/complete
*/ 
    compteur(){
        return this.todoList.items.length - this.todoList.items.filter(I =>I.isDone==true).length;
    }
/*
    Method selectAll(
    In the left side where we typy the task we want to add a new task 
    there is a small arrow going down. I use this arrow to select/deselect 
    all the element in the list even if one element of the list is already selected
    I give in a forEach the list of all items or at true to don't deselect any items
*/ 
    selectAll(){
    var service = this;
    // Check the status of all the items
    var checkAllSelected = this.items.every(I => I.isDone);
        this.todoList.items.forEach(I => 
            {if(checkAllSelected == false){
                service.todoService.setItemsDone(I.isDone = true);
            }
            else{
                service.todoService.setItemsDone(I.isDone = false);
            }
            });
    }
/*
    Method erasedAll()
    if we click on the button "Tout suppr" 
    it will delete all the element in the list doesn't matter the status
*/ 
    erasedAll(){
        this.todoList.items.forEach(I =>this.todoService.removeItems(I));
        this.addEvent();
    }
/*
    Method localStorageTodolist()()
    we store all the element we added inside the local storage 
*/ 
    localStorageTodolist(){
        let nom = localStorage.getItem("todolist");
        if(nom != "" && nom != null){
            JSON.parse(nom).forEach(I => this.appendItem(I.label, I.isDone, true));
        }
        
    }
/*
    Method generateQrCode()
    while we click on the top right button with the QrCode icone
    it will generate a QrCode of all the element present inside the list 
*/ 
    generateQrCode(){
        this.myAngularxQrCode = JSON.stringify(this.todoList.items);
        console.log(this.myAngularxQrCode);
    }

/*
    Method start()
   this methode start the service voice-recognition to listen
    and interpret the words who someone say
*/ 
    start() {
        this.voiceRecognition.start();
    }
/*
   Method stop()
   this methode stop the service voice-recognition and 
   concat the word and add it to the list of items
*/ 
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

/*
   Method undo()
   this methode go to search the previous element being deleted in the list.
   we get this last element with the local storage
*/ 
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
/*
   Method redo()
     this methode go to search the last state of the list with the local storage
*/ 
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