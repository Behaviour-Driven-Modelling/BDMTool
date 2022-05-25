"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInputManager = void 0;
const vscode = require("vscode");
const TerminalManager_1 = require("./TerminalManager");
class UserInputManager {
    async createBDMProjectUI() {
        let selectedText = '';
        const groupIdQuery = await vscode.window.showInputBox({
            placeHolder: "Group ID",
            prompt: "Group ID",
            value: selectedText
        });
        if (groupIdQuery === '') {
            console.log(groupIdQuery);
            vscode.window.showErrorMessage('A group id is required.');
        }
        if (groupIdQuery !== undefined) {
            console.log(groupIdQuery);
            vscode.window.showInformationMessage("The desired group id for the project: " + groupIdQuery);
        }
        const projectIdQuery = await vscode.window.showInputBox({
            placeHolder: "Artifact ID",
            prompt: "Artifact ID",
            value: selectedText
        });
        if (projectIdQuery === '') {
            console.log(projectIdQuery);
            vscode.window.showErrorMessage('A Artifact id is required.');
        }
        if (projectIdQuery !== undefined) {
            console.log(projectIdQuery);
            vscode.window.showInformationMessage("The desired artifact id for the project: " + projectIdQuery);
        }
        if (groupIdQuery !== undefined && projectIdQuery !== undefined) {
            let terminalManager = new TerminalManager_1.TerminalManager();
            await terminalManager.createBDMProjectTerminal(groupIdQuery, projectIdQuery);
        }
    }
}
exports.UserInputManager = UserInputManager;
//# sourceMappingURL=UserInputManager.js.map