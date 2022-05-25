import { downloadRelease } from "@terascope/fetch-github-release";
import { GithubRelease, GithubReleaseAsset } from "@terascope/fetch-github-release/dist/src/interfaces";
import * as vscode from 'vscode';
import path = require('path');
import { Console } from "console";
export class DependencyFetcher {
    resourcesDirectory: string;
    user: string;
    repo: string;
    leaveZipped: boolean;
    disableLogging: boolean;
    pathBDMCore: string = "";
    constructor(resourcesDirectory: string, user: string, repo: string, leaveZipped: boolean, disableLogging: boolean) {
        this.resourcesDirectory = resourcesDirectory;
        this.user = user;
        this.repo = repo;
        this.leaveZipped = leaveZipped;
        this.disableLogging = disableLogging;
    }
    
    // Define a function to filter releases.
    filterRelease(release: GithubRelease) {
        // Filter out prereleases.
        return release.prerelease === false;
    }

    // Define a function to filter assets.
    filterAsset(asset:GithubReleaseAsset) {
        // Select all assets
        return true;
    }

    downloadDependency(): void {
       let filepaths = downloadRelease(this.user,this.repo,this.resourcesDirectory,this.filterRelease, this.filterAsset, this.leaveZipped, this.disableLogging).then((te) => 
            console.log("All dependencies downloaded successfully: " +te)).catch(err => console.log(err.message));
        
    }

    async downloadAndInstall(artifactId: string) {
        downloadRelease(this.user,this.repo,this.resourcesDirectory,this.filterRelease, this.filterAsset, this.leaveZipped, this.disableLogging).then((te) => this.install(te,artifactId)).catch(err => console.log(err.message));
         
     }

     async install(filePaths: string[], artifactId: string) {
        let NEXT_TERM_ID = 1;
        filePaths.forEach(path => {
            const terminal = vscode.window.createTerminal(`BDM Terminal #${NEXT_TERM_ID++}`);
            const version = this.extractVersion(path);
            const filePath = vscode.Uri.file(path).fsPath;
            //const filePathPom = vscode.Uri.file(context.asAbsolutePath(path.join('resources','jars',"archetype", 'pom.xml'))).fsPath;
            const command = `mvn install:install-file \ -Dfile="${filePath}" \ -DgroupId="com.bdm" \ -DartifactId="${artifactId}" \ -Dversion="${version}" \ -Dpackaging=jar`;
            terminal.sendText(command);

            if(artifactId==="core") {
                       
                this.updateUserSettings(path);
            }
        });
		 
     }

     async updateUserSettings (path: string)  {
          await vscode.workspace
            .getConfiguration()
            .update("vdm-vscode.server.classPathAdditions", [vscode.Uri.file(path).fsPath], vscode.ConfigurationTarget.Global);
      };

     async extractVersion(path: string) {
         const regex = /(\d+\.)(\d+\.)(\d+)/g;
         const version =  regex.exec(path);
         if (version) {
            return version[0];
         } else {
            return "1.1.0";
         }
         
     }

 

}