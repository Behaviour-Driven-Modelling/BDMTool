import * as fs from "fs";
import path = require("path");
import * as vscode from 'vscode';

export function getWebviewContent(name: string,workspaceRoot?: string) {
    if (!workspaceRoot) {
        vscode.window.showInformationMessage('No tests in empty workspace');
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
        </head>
        <body>
            <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
        </body>
        </html>`;
    } 
    return fs.readFileSync(path.join(workspaceRoot, 'target', 'cucumber-reports', name), 'utf8');

  }