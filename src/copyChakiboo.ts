import * as vscode from "vscode";
import axios from "axios";

import Chakiboo from "./chakiboo";

class ChakibooQuickPickItem implements vscode.QuickPickItem {
  // ChakibooQuickPickItem helps at returning the index of the selected chakiboo from the Quick Pick menu
  label: string;
  id: string;
  description: string;
  constructor(chakiboo: Chakiboo) {
    this.label = chakiboo.title;
    this.id = chakiboo.id;
    this.description = chakiboo.description;
  }
}

function convertIntoChakibooQuickPickItems(db_chakiboos: any[]) {
  let chakiboos: Chakiboo[] = db_chakiboos.map((db_chakiboo: any) => {
    return new Chakiboo(db_chakiboo);
  });
  const chakibooQuickPickItems: ChakibooQuickPickItem[] = chakiboos.map(
    (chakiboo: Chakiboo) => {
      return new ChakibooQuickPickItem(chakiboo);
    }
  );
  return chakibooQuickPickItems;
}

async function copyChakiboo(db_chakiboos: any[]) {
  console.log("running");
  let quickPicks = convertIntoChakibooQuickPickItems(db_chakiboos);
  console.log(quickPicks);
  let pick: ChakibooQuickPickItem = await vscode.window.showQuickPick(
    quickPicks
  );
  let axiosResponse = await axios({
    url: "https://kettlecat-graphql.herokuapp.com/graphql",
    method: "get",
    data: {
      query: `
        query{
          chakiboo(id: "${pick.id}"){
            code
          }
        }
      `
    }
  });
  let code: string = axiosResponse.data.data.chakiboo.code;
  let beginning: vscode.Position = new vscode.Position(0, 0);
  vscode.window.activeTextEditor.edit(textEditor => {
    textEditor.insert(beginning, code);
  });
}

export default copyChakiboo;