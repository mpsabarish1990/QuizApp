import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './QuizAppWebPartWebPart.module.scss';
import * as strings from 'QuizAppWebPartWebPartStrings';

import {SPHttpClient,SPHttpClientResponse,ISPHttpClientOptions} from "@microsoft/sp-http";

export interface IQuizAppWebPartWebPartProps {
  description: string;
}

export default class QuizAppWebPartWebPart extends BaseClientSideWebPart<IQuizAppWebPartWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
    <h2>Registration Form for Quiz</h2>
    <div class="container">
        <div class="row">
          <div class="col-25">
            <label for="fname">Name</label>
          </div>
          <div class="col-75">
            <input type="text" id="fname" name="firstname" placeholder="Enter your name">
          </div>
        </div>

        <div class="row">
          <div class="col-25">
            <label for="email">Email ID</label>
          </div>
          <div class="col-75">
            <input type="text" id="txtEmail" name="lastname" placeholder="Enter your Email">
          </div>
        </div>

        <div class="row">
          <div class="col-25">
            <label for="ContactNumber">Contact Number</label>
          </div>
          <div class="col-75">
            <input type="text" id="txtcontactNumber" name="ContactNumber" placeholder="Enter your Contact Number">
          </div>
        </div>

         <div class="row">
          <div class="col-25">
            <label for="dob">Date of Birth</label>
          </div>
          <div class="col-75">
          <input type="date" id="dtpickerbirthday" name="birthday">
          </div>
        </div>

        <div class="row">
          <div class="col-25">
            <label for="gender">Gender</label>
          </div>
          <div class="col-75">
            <select id="gender" name="gender">
            <option disabled selected value> -- Select your Gender -- </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-25">
            <label for="country">Country</label>
          </div>
          <div class="col-75">
            <select id="country" name="country">
            <option disabled selected value> -- Select your Country -- </option>
              <option value="australia">Australia</option>
              <option value="canada">Canada</option>
              <option value="usa">USA</option>
            </select>
          </div>
        </div>

        </br>

        <div class="row">
          <input type="submit" id="btnSubmit" value="Submit">
        </div>

        <div class="row">
        <div id="divstatus">
        </div>

        <div class="containerNew">
        <header>
            <div>
                <a href="./highscore.html">
                    <button class="scores-header"
                            id="view-high-scores">
                        View High Scores
                    </button>
                </a>
            </div>

            <div class="timer">
                <p>
                    Time:
                    <span id="timer">
                        0
                    </span>
                </p>
            </div>
        </header>

        <main class="quiz">
            <div id="quiz-start">
                <div class="landing"
                     id="start-screen">
                    <h1 id="top">
                        GeeksforGeeks
                    </h1>
                    <h1>
                        Coding Quiz Challenge
                    </h1>
                    <p>
                        Try to answer the following
                        code-related questions with
                        in the time limit. Keep in
                        mind that incorrect answers
                        will penalize your score/time
                        by ten seconds!
                    </p>
                    <button id="start">
                        Start Quiz
                    </button>
                </div>
            </div>

            <div class="hide" id="questions">
                <h2 id="question-words"></h2>
                <div class="options" id="options">
                </div>
            </div>

            <div class="hide" id="quiz-end">
                <h2>All Done!</h2>
                <p>Your final score is:
                    <span id="score-final">
                    </span>
                </p>
                <p>
                    Please enter your name:
                    <input type="text"
                           id="name"
                           max="3" />
                    <button id="submit-score">
                        Submit
                    </button>
                </p>
            </div>

            <div id="feedback"
                 class="feedback hide">
            </div>
            <div class="scores">
        <h1>Highscores</h1>
        <ol id="highscores"></ol>
        <a href="index.html">
            <button>
                Re-Start
            </button>
        </a>
        <button id="clear">
            Clear Highscores
        </button>
    </div>
    </div>`;
    this._bindallEvents();
  }

  private _bindallEvents():void{
    this.domElement.querySelector('#btnSubmit').addEventListener('Click',()=>{
      this.submitUserInfo();
    });
  }

  private submitUserInfo():void
  {
    var Name= document.getElementById("fname")["value"];
    var EMailID= document.getElementById("txtEmail")["value"];
    var ContactNumber= document.getElementById("txtcontactNumber")["value"];
    var DOB= document.getElementById("dtpickerbirthday")["value"];
    var Gender= document.getElementById("gender")["value"];
    var Country= document.getElementById("country")["value"];

    const UserDetailssiteurl:string=this.context.pageContext.site.absoluteUrl+"/_api/web/lists/getbytitle('User%20Details')/items";


    const itemBody:any={
      "Title": Name,
      "EmailID":EMailID,
      "Contact Number":ContactNumber,
      "DOB":DOB,
      "Gender":Gender,
      "Country":Country
    };

    const spHttpClientOptions:ISPHttpClientOptions={
    "body":JSON.stringify(itemBody)
    };

    this.context.spHttpClient.post(UserDetailssiteurl,SPHttpClient.configurations.v1,spHttpClientOptions)
    .then((response:SPHttpClientResponse)=>{
      if(response.status===201){
        let statusmessage:Element=this.domElement.querySelector("#divstatus");
        statusmessage.innerHTML="Submitted Successfully";
      }
      else{
        let statusmessage:Element=this.domElement.querySelector("#divstatus");
        statusmessage.innerHTML="SUbmission Failed";
      }
    });

  }
  private printHighscores():void {
    let highscores =
        JSON.parse(
            window.localStorage.getItem(
                "highscores"
            )
        ) || [];
    highscores.sort(function (a, b) {
        return b.score - a.score;
    });
    highscores.forEach(function (
        score
    ) {
        let liTag =
            document.createElement(
                "li"
            );
        liTag.textContent =
            score.name +
            " - " +
            score.score;
        let olEl =
            document.getElementById(
                "highscores"
            );
        olEl.appendChild(liTag);
    });
}
private DisplayQuestions():void{
  const QuestionsMasterList:string=this.context.pageContext.site.absoluteUrl+"/_api/web/lists/getbytitle('Quiz%20Master')/items$select=Questions,OptionA,OptionB,OptionC,OptionD,Answer";
  this.context.spHttpClient.get(QuestionsMasterList, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
        if (response.ok) {
            response.json().then((responseJSON) => {
                if (responseJSON!=null && responseJSON.value!=null){
                    let items:any[] = responseJSON.value;
                }
            });
        }
    });
}
private clearHighscores():void {
  window.localStorage.removeItem(
      "highscores"
  );
  window.location.reload();
}
document.getElementById("clear").onclick = this.clearHighscores;
printHighscores();
  /*protected get dataVersion(): Version {
    return Version.parse('1.0');
  }*/

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
