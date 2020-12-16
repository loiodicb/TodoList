import { Injectable } from '@angular/core';


declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

 recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords = '';

  constructor() { }
// initialisation of the variables to have the voice recognition
  init() {

    this.recognition.interimResults = true;
    //  Select the language to search the recognition through the french Language
    this.recognition.lang = 'fr-FR';

    this.recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
    });
  }

/*
    Method   start() 
    the function Start the voice recognition
     and ask the permission to get the microphone open into
     the browser if it's not already allowed
*/ 
  start() {
    this.text = '';
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', (condition) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.wordConcat()
        this.recognition.start();
      }
    });
  }

/*
    Method stop() 
    The function stop() interrupt the connection with microphone 
*/ 
  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat()
    this.recognition.stop();
    console.log("End speech recognition")
  }
  /*
    Method wordConcat() 
    When the Voice recognition is active WordConcat() 
    get all the words and put it inside a variable and return the text
*/ 
  wordConcat() {
    // Concatenation of the text and return the words said in this.text
    this.text = this.text + ' ' + this.tempWords;
    this.tempWords = '';
  }
}