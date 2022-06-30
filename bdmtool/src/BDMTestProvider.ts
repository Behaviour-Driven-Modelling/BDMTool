import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BDMTestItem } from './BDMTestItem';


export class BDMTestProvider implements vscode.TreeDataProvider<BDMTestItem> {
  constructor(private specification: boolean, private workspaceRoot?: string) {}

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
    let packageJsonPath = '';
    if(this.specification) {
      packageJsonPath = path.join(this.workspaceRoot, 'target', 'cucumber-reports', 'reportSpecification.json');
    } else {
      packageJsonPath = path.join(this.workspaceRoot, 'target', 'cucumber-reports', 'reportImplementation.json');
    }
    if(fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if(element?.label === "scenario") {
        return Promise.resolve(
          this.getSteps(packageJson,element.id)
        );
      } else if (element) {
        // 1.st - children
        return Promise.resolve(
          this.getFirstChildren(packageJson)
          /* this.getTestsInPackageJson(
            path.join(this.workspaceRoot, 'target', 'cucumber-reports', 'reports.json')
          ) */
        );
      } else {
        // Absolute parent
        //const packageJsonPath = path.join(this.workspaceRoot, 'target', 'cucumber-reports', 'reports.json');
        if (this.pathExists(packageJsonPath)) {
          return Promise.resolve(this.getParentItems(packageJson));
        } else {
          vscode.window.showInformationMessage('Workspace has no reports');
          return Promise.resolve([]);
        }
      }
    } else {
      return Promise.resolve([]);
    }

  }

  private getSteps(parentObject: [], id: string) {
    let steps: BDMTestItem [] = [];
    const toBDMItem = (moduleName: string, version: string, status: string, id: string, name: string, keyword: string): BDMTestItem => {
        return new BDMTestItem(status, moduleName, version, vscode.TreeItemCollapsibleState.None,id,name,keyword);
    };
    parentObject.forEach((feature: any) => {
        feature.elements.forEach((scenario: any) => {
            if(scenario.id === id) {
              scenario.steps.forEach((step: any) => {
                 steps.push(toBDMItem(step.keyword, step.name,step.result.status,step.id,step.name,step.keyword ));
              });
            }
        });
    });
    return steps;
  }
  private getParentItems(parentObject: BDMTestItem[]) {
    let features: BDMTestItem[] = [];
    const toBDMItem = (moduleName: string, version: string, status: string, id: string, name: string, keyword: string): BDMTestItem => {
      return new BDMTestItem(
          status,
          moduleName,
          version,
          vscode.TreeItemCollapsibleState.Collapsed,
          id,
          name,
          keyword
      );
    };

    parentObject.forEach((feature: any) => {
        let status = 'passed';
        feature.elements.forEach((scenario:any) => {
          scenario.steps.forEach((step:any) => {
            if (step.result.status !== 'passed') {
              if (step.result.status === 'undefined' || step.result.status === 'failed') {
                status = step.result.status;
              } else if(status !== "undefined" && status !== 'failed') {
                    if (status !== 'pending') {
                      status = step.result.status;
                    }  
                } 
            }
        });
        });
        features.push(toBDMItem(feature.keyword,feature.name,status, feature.id, feature.name, feature.keyword));
    });

    return features;
  }
  private getFirstChildren(parentObject: []) {
    const toBDMItem = (moduleName: string, version: string, status: string, id: string, name: string, keyword: string): BDMTestItem => {
          return new BDMTestItem(
            status,
            moduleName,
            version,
            vscode.TreeItemCollapsibleState.Collapsed,
            id,
            name,
            keyword
          );
      };

    let scenarios: BDMTestItem[] = [];
    parentObject.forEach((feature: any) => {
      feature.elements.forEach((scenario: any) => {
          let status = 'passed';
          scenario.steps.forEach((step:any) => {
            if (step.result.status !== 'passed') {
              if (step.result.status === 'undefined' || step.result.status === 'failed') {
                status = step.result.status;
              } else if(status !== "undefined" && status !== 'failed') {
                    if (status !== 'pending') {
                      status = step.result.status;
                    }  
                } 
            }
                
          });
          scenarios.push(toBDMItem(scenario.type,scenario.name,status,scenario.id,scenario.name,scenario.keyword));
        });
      });
   
    return scenarios;
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

