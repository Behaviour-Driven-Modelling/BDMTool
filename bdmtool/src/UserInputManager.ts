import * as vscode from 'vscode';
import { TerminalManager } from './TerminalManager';


export class UserInputManager {
	constructor(private workspaceRoot?: string) {}
    async createBDMProjectUI(example: boolean, archetypeVersion: string) {
        let selectedText = '';
		const groupIdQuery = await vscode.window.showInputBox({
			placeHolder: "Group ID",
			prompt: "Group ID",
			value: selectedText
		  });
		if(groupIdQuery === ''){
		vscode.window.showErrorMessage('A group id is required.');
		}
		
		if(groupIdQuery !== undefined){
		vscode.window.showInformationMessage("The desired group id for the project: " + groupIdQuery);
		}
		const projectIdQuery = await vscode.window.showInputBox({
		placeHolder: "Artifact ID",
		prompt: "Artifact ID",
		value: selectedText
		});
		if(projectIdQuery === ''){
		vscode.window.showErrorMessage('A Artifact id is required.');
		}
		
		if(projectIdQuery !== undefined){
		vscode.window.showInformationMessage("The desired artifact id for the project: " + projectIdQuery);
		}
        if (groupIdQuery !== undefined && projectIdQuery !== undefined) {
            let terminalManager = new TerminalManager(this.workspaceRoot);

            await terminalManager.createBDMProjectTerminal(groupIdQuery,projectIdQuery,example, archetypeVersion);
        }
        
    }
}