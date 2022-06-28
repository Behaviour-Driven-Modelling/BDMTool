import * as vscode from 'vscode';
import * as path from 'path';

export class BDMTestItem extends vscode.TreeItem {
    constructor(
        public status: string,
        public label: string,
        private version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public id: string,
        public name: string,
        public keyword: string
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}`;
        this.description = this.version;
    }


    iconPath = {
        light: this.status === 'passed' ? path.join(__filename, '..', '..', 'resources', 'icons', 'passed.svg') : 
                this.status === 'failed' || this.status === 'undefined' ? path.join(__filename, '..', '..', 'resources', 'icons', 'failed.svg') : 
                this.status === 'pending' ?  path.join(__filename, '..', '..', 'resources', 'icons', 'pending.svg'):
                path.join(__filename, '..', '..', 'resources', 'icons', 'filtered.svg'),
        dark: this.status === 'passed' ? path.join(__filename, '..', '..', 'resources', 'icons', 'passed.svg') : 
                this.status === 'failed' || this.status === 'undefined' ? path.join(__filename, '..', '..', 'resources', 'icons', 'failed.svg') : 
                this.status === 'pending' ?  path.join(__filename, '..', '..', 'resources', 'icons', 'pending.svg'):
                path.join(__filename, '..', '..', 'resources', 'icons', 'filtered.svg')
    };
}


