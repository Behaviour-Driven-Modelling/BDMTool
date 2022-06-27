import * as vscode from 'vscode';
import * as path from 'path';

export class BDMTestItem extends vscode.TreeItem {
    constructor(
        public status: string,
        public label: string,
        private version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}`;
        this.description = this.version;
    }

iconpathfunc() {

    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dependency.svg')
    };
}


