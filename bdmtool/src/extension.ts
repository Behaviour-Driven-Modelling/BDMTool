// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from 'vscode';
import { BDMTestProvider } from './BDMTestProvider';
import { DependencyFetcher } from './DependencyFetcher';
import { TerminalManager } from './TerminalManager';
import { UserInputManager } from './UserInputManager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	const rootPath =
  vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined;
	const localBDMTestProvider = new BDMTestProvider(rootPath);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableInstall = vscode.commands.registerCommand('bdm.createProject', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let dependencyFetcherVDMJ = new DependencyFetcher("resources","nickbattle","vdmj",false,false);
		await dependencyFetcherVDMJ.downloadAndInstall("vdmj");

		vscode.window.showInformationMessage("BDMTool is installing dependencies...");
		let dependencyFetcherArchetype = new DependencyFetcher("resources","mactanex","BDMArchetype",false,false);
		await dependencyFetcherArchetype.downloadAndInstall("archetype");

		let dependencyFetcherCore = new DependencyFetcher("resources","mactanex","BDMCore",false,false);
		await dependencyFetcherCore.downloadAndInstall("core");
		//vscode.window.showInformationMessage("Dependencies installed successfully");

		let userInputManager = new UserInputManager();
		await userInputManager.createBDMProjectUI();

	});
	let disposableTest = vscode.commands.registerCommand('bdm.test', async () => {
		let terminalManager = new TerminalManager();
		terminalManager.runTests();
		localBDMTestProvider.refresh();
	});

	context.subscriptions.push(disposableInstall);
	context.subscriptions.push(disposableTest);
	
	vscode.window.registerTreeDataProvider(
		'BDMTestView',
		localBDMTestProvider
	  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

