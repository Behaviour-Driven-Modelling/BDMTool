import * as vscode from 'vscode';
import { BDMTestProvider } from './BDMTestProvider';
import * as fs from 'fs';
import path = require('path');
export class TerminalManager {
    constructor(private workspaceRoot?: string) {}
    nextTerminalId: number = 1;

    async createBDMProjectTerminal(groupId: string, projectId: string, example: boolean, archetypeVersion: string) {
        const terminal = vscode.window.createTerminal(`BDM Terminal #${this.nextTerminalId++}`);
        let archetypeArtifactId = 'archetype';
        if (example) {
            archetypeArtifactId = 'archetype-example';
        }
        const command = `mvn org.apache.maven.plugins:maven-archetype-plugin:3.1.2:generate -DgroupId="${groupId}" -DartifactId="${projectId}"  -DarchetypeArtifactId="${archetypeArtifactId}" -DarchetypeGroupId="com.bdm" -DarchetypeVersion="${archetypeVersion}" -DinteractiveMode=false`;
        terminal.sendText(command);
        terminal.sendText("exit 0");
        terminal.show();
        
        let i = 0;
        let pathW = '';
        vscode.workspace.workspaceFolders?.forEach(test => {
            if (i === 0) {
                pathW = test.uri.fsPath;
                }
            });
        let uri = vscode.Uri.file(pathW+`/${projectId}`);
        
        vscode.window.onDidCloseTerminal(async (t) => { 
            await vscode.commands.executeCommand("vscode.openFolder",uri);
            const jsonObject = {"groupId": groupId, projectId};
			fs.writeFileSync(pathW+`/${projectId}/`+"bdm.json",JSON.stringify(jsonObject));
            if (t.exitStatus && t.exitStatus.code) { 
                    vscode.window.showInformationMessage(`Exit code: ${t.exitStatus.code}`); 
                } 
            }); 
    }

    async runTests(localBDMTestProvider: BDMTestProvider, specification: boolean) {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No tests in empty workspace');
            return Promise.resolve([]);
        }
        if (specification) {
            const terminal = vscode.window.createTerminal(`BDM Terminal #${this.nextTerminalId++}`);
            const glue = "specification";
            terminal.sendText("mvn test " + `--define cucumber.glue='${glue}' --define cucumber.plugin='pretty,json:target/cucumber-reports/reportSpecification.json,html:target/cucumber-reports/reportSpecification.html'`);
            terminal.show();
            terminal.sendText("exit 0");
        }else {
            const terminal = vscode.window.createTerminal(`BDM Terminal #${this.nextTerminalId++}`);
            const settingsPath = path.join(this.workspaceRoot,'bdm.json');
            const glue = JSON.parse(fs.readFileSync(settingsPath, 'utf-8')).groupId;
            terminal.sendText("mvn test " + `--define cucumber.glue='${glue}' --define cucumber.plugin='pretty,json:target/cucumber-reports/reportImplementation.json,html:target/cucumber-reports/reportImplementation.html'`);
            terminal.show();
            terminal.sendText("exit 0");
        }
        
        vscode.window.onDidCloseTerminal(async (t) => { 
                localBDMTestProvider.refresh();

            }); 

    }
}