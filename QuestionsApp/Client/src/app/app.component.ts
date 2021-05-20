import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private readonly CONTEXT = '/api/questions';

  questions: any;

  title = 'questions';

  newQuesEditorRef: any;

  editorData: any;

  selectedIndex: number = -1;

  isEditing: boolean = false;

  

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(this.CONTEXT).toPromise().then((data) => {
      this.questions = data;
    });
  }

  newQuestion(editor: any) {
    this.newQuesEditorRef = editor;
    this.editorCreated(editor);
  }

  editorCreated(editor: any) {
    const tooltipSave = editor.theme.tooltip.save;
    editor.theme.tooltip.save = function () {
      let url = this.textbox.value;
      if (url.indexOf('http') === -1) {
        url = 'http://' + url;
      }
      this.textbox.classList.remove('ql-error');
      if (new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?').test(url)) {
        tooltipSave.call(this);
      }
      else {
        // show error in tooltip
        this.textbox.classList.add('ql-error');
      }
    };
  }

  contentChanged(event: any) {
    this.editorData = {
      html: event.html,
      text: event.text
    }
  }

  saveQuestion() {
    this.http.post(this.CONTEXT, this.editorData).toPromise().then((data) => {
      this.questions.push(this.editorData);
      this.cancelQuestion();
    });
  }

  cancelQuestion() {
    this.editorData = null;
    this.newQuesEditorRef.setContents([]);
    this.newQuesEditorRef.setText('');
  }


  editQuestion(question: any) {
    this.selectedIndex = question.id;
    this.isEditing = true;
  }

  updateQuestion(question: any) {
    question.html = this.editorData.html;
    question.text = this.editorData.text;
    this.http.put(this.CONTEXT, question).toPromise().then((data) => {
      this.cancelUpdate()
    });
  }

  cancelUpdate() {
    this.editorData = null;
    this.selectedIndex = -1;
    this.isEditing = false;
  }

  deleteQuestion(question: any) {
    this.http.delete(`${this.CONTEXT}/${question.id}`).toPromise().then((data) => {
      this.questions = this.questions.filter((element: any) => element.id !== question.id);
      this.cancelUpdate();
    });
  }

}
