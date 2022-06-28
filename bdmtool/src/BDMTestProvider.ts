import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BDMTestItem } from './BDMTestItem';


export class BDMTestProvider implements vscode.TreeDataProvider<BDMTestItem> {
  constructor(private workspaceRoot?: string) {}

  private _onDidChangeTreeData: vscode.EventEmitter<BDMTestItem | undefined | null | void> = new vscode.EventEmitter<BDMTestItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<BDMTestItem | undefined | null | void> = this._onDidChangeTreeData.event;

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: BDMTestItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: BDMTestItem): Thenable<BDMTestItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No tests in empty workspace');
      return Promise.resolve([]);
    }


    if (element) {
      return Promise.resolve(
        this.getTestsInPackageJson(
          path.join(this.workspaceRoot, 'target', 'cucumber-reports', 'reports.json')
        )
      );
    } else {
      const packageJsonPath = path.join(this.workspaceRoot, 'target', 'cucumber-reports', 'reports.json');
      if (this.pathExists(packageJsonPath)) {
        return Promise.resolve(this.getTestsInPackageJson(packageJsonPath));
      } else {
        vscode.window.showInformationMessage('Workspace has no reports.json');
        return Promise.resolve([]);
      }
    }
  }
  //TODO: refactor for correct data
  /**
   * Given the path to test.json, read all its features, scenarios and examples.
   */
  private getTestsInPackageJson(packageJsonPath: string): BDMTestItem[] {
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const toDep = (moduleName: string, version: string, status: string): BDMTestItem => {
        if (moduleName === 'Feature') {
            return new BDMTestItem(
                "",
                moduleName,
                version,
                vscode.TreeItemCollapsibleState.Collapsed
              );
        } else if (moduleName === 'Scenario') {
            return new BDMTestItem(
                status,
                moduleName,
                version,
                vscode.TreeItemCollapsibleState.Collapsed
              );
        } else {
          return new BDMTestItem(status, moduleName, version, vscode.TreeItemCollapsibleState.None);
        }
      };
      let features: BDMTestItem[] = [];
      let scenarios: BDMTestItem[] = [];
      let steps: BDMTestItem[] = [];
      packageJson.forEach((element: any) => {
        // incorrect looping
        console.log(element);
        features = element ? features.concat([toDep(element.keyword,element.name,"")]) : [];
        //features = element ? Object.keys(element).map((dep,idx) => toDep(element.keyword,dep,"")) : [];
        element.elements.forEach((inner: any) => {
            
        scenarios = inner ? scenarios.concat([toDep(inner.type,inner.name,inner.before[0].result.status)]) : [];
        inner.steps.forEach((stepsi: any) => {
            console.log(stepsi);
            steps = stepsi ? steps.concat([toDep(stepsi.keyword,stepsi.name,stepsi.result.status)]) : [];
        });
        });
      });
      console.log(features);
      return features !== undefined ? features.concat(scenarios, steps) : [];
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }


}

