"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const BDMTestProvider_1 = require("./BDMTestProvider");
const DependencyFetcher_1 = require("./DependencyFetcher");
const HtmlReportProvider_1 = require("./HtmlReportProvider");
const TerminalManager_1 = require("./TerminalManager");
const UserInputManager_1 = require("./UserInputManager");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    const rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;
    const localBDMTestProviderSpecification = new BDMTestProvider_1.BDMTestProvider(true, rootPath);
    const localBDMTestProviderImplementation = new BDMTestProvider_1.BDMTestProvider(false, rootPath);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposableInstall = vscode.commands.registerCommand('bdm.createProject', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let dependencyFetcherVDMJ = new DependencyFetcher_1.DependencyFetcher("resources", "nickbattle", "vdmj", false, false);
        await dependencyFetcherVDMJ.downloadAndInstall("vdmj");
        vscode.window.showInformationMessage("BDMTool is installing dependencies...");
        let dependencyFetcherArchetype = new DependencyFetcher_1.DependencyFetcher("resources", "Behaviour-Driven-Modelling", "BDMArchetype", false, false);
        await dependencyFetcherArchetype.downloadAndInstall("archetype");
        let dependencyFetcherCore = new DependencyFetcher_1.DependencyFetcher("resources", "Behaviour-Driven-Modelling", "BDMCore", false, false);
        await dependencyFetcherCore.downloadAndInstall("core");
        //vscode.window.showInformationMessage("Dependencies installed successfully");
        let userInputManager = new UserInputManager_1.UserInputManager(rootPath);
        await userInputManager.createBDMProjectUI(false);
    });
    let disposableInstallExample = vscode.commands.registerCommand('bdm.createProjectExample', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let dependencyFetcherVDMJ = new DependencyFetcher_1.DependencyFetcher("resources", "nickbattle", "vdmj", false, false);
        await dependencyFetcherVDMJ.downloadAndInstall("vdmj");
        vscode.window.showInformationMessage("BDMTool is installing dependencies...");
        let dependencyFetcherArchetype = new DependencyFetcher_1.DependencyFetcher("resources", "Behaviour-Driven-Modelling", "BDMArchetype", false, false);
        await dependencyFetcherArchetype.downloadAndInstall("archetype");
        let dependencyFetcherCore = new DependencyFetcher_1.DependencyFetcher("resources", "Behaviour-Driven-Modelling", "BDMCore", false, false);
        await dependencyFetcherCore.downloadAndInstall("core");
        //vscode.window.showInformationMessage("Dependencies installed successfully");
        let userInputManager = new UserInputManager_1.UserInputManager(rootPath);
        await userInputManager.createBDMProjectUI(true);
    });
    let disposableTest = vscode.commands.registerCommand('bdm.test', async () => {
        let terminalManager = new TerminalManager_1.TerminalManager(rootPath);
        terminalManager.runTests(localBDMTestProviderSpecification, true);
        terminalManager.runTests(localBDMTestProviderImplementation, false);
    });
    let disposableTestSpecification = vscode.commands.registerCommand('bdm.testSpecification', async () => {
        let terminalManager = new TerminalManager_1.TerminalManager(rootPath);
        terminalManager.runTests(localBDMTestProviderSpecification, true);
    });
    let disposableTestImplementation = vscode.commands.registerCommand('bdm.testImplementation', async () => {
        let terminalManager = new TerminalManager_1.TerminalManager(rootPath);
        terminalManager.runTests(localBDMTestProviderImplementation, false);
    });
    let disposableOpenReportSpecification = vscode.commands.registerCommand("bdm.htmlreport.openSpecification", async () => {
        const panel = vscode.window.createWebviewPanel("SpecificationReport", "Specification Report", vscode.ViewColumn.One, {});
        panel.webview.options = { enableScripts: true };
        panel.webview.html = (0, HtmlReportProvider_1.getWebviewContent)("reportSpecification.html", rootPath);
    });
    let disposableOpenReportImplementation = vscode.commands.registerCommand("bdm.htmlreport.openImplementation", async () => {
        const panel = vscode.window.createWebviewPanel("ImplementationReport", "Implementation Report", vscode.ViewColumn.One, {});
        panel.webview.options = { enableScripts: true };
        panel.webview.html = (0, HtmlReportProvider_1.getWebviewContent)("reportImplementation.html", rootPath);
    });
    context.subscriptions.push(disposableOpenReportImplementation);
    context.subscriptions.push(disposableOpenReportSpecification);
    context.subscriptions.push(disposableInstallExample);
    context.subscriptions.push(disposableInstall);
    context.subscriptions.push(disposableTest);
    context.subscriptions.push(disposableTestSpecification);
    context.subscriptions.push(disposableTestImplementation);
    vscode.window.registerTreeDataProvider('BDMTestViewSpecification', localBDMTestProviderSpecification);
    vscode.window.registerTreeDataProvider('BDMTestViewImplementation', localBDMTestProviderImplementation);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map