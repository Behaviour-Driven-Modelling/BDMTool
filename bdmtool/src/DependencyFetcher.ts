import { downloadRelease } from "@terascope/fetch-github-release";
import { GithubRelease, GithubReleaseAsset } from "@terascope/fetch-github-release/dist/src/interfaces";
import * as vscode from 'vscode';
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

    filterVDMJAsset(release: GithubReleaseAsset) {
        // Filter out prereleases.
        return release.name.includes("vdmj") && !release.name.includes("vdmjunit") && !release.name.includes("P");
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
        if (artifactId != "vdmj") {
            downloadRelease(this.user,this.repo,this.resourcesDirectory,this.filterRelease, this.filterAsset, this.leaveZipped, this.disableLogging).then((te) => this.install(te,artifactId)).catch(err => console.log(err.message));
        } else {
            downloadRelease(this.user,this.repo,this.resourcesDirectory,this.filterRelease, this.filterVDMJAsset, this.leaveZipped, this.disableLogging).then((te) => this.install(te,artifactId)).catch(err => console.log(err.message));

        }
                 
     }

     async install(filePaths: string[], artifactId: string) {
        let NEXT_TERM_ID = 1;
        filePaths.forEach(localpath => {
            let artifactFinalId = artifactId;
            if(artifactId = 'archetype') {
                if (localpath.includes('archetype-example')) {
                    artifactFinalId = 'archetype-example';
                }
            }
            let groupId = "com.bdm";
            if (artifactId === "vdmj") {
                groupId = "com.fujitsu";
            }
            const terminal = vscode.window.createTerminal(`BDM Terminal #${NEXT_TERM_ID++}`);
            const version = this.extractVersion(localpath);
            const filePath = vscode.Uri.file(localpath).fsPath;
            //const filePathPom = vscode.Uri.file(context.asAbsolutePath(path.join('resources','jars',"archetype", 'pom.xml'))).fsPath;
            const command = `mvn install:install-file \ -Dfile="${filePath}" \ -DgroupId="${groupId}" \ -DartifactId="${artifactFinalId}" \ -Dversion="${version}" \ -Dpackaging=jar`;
            terminal.sendText(command);
            
            

            if(artifactId==="core") {
                       
                this.updateUserSettings(localpath);
            }
        });
		 
     }

     updateUserSettings (ppath: string)  {
          vscode.workspace
            .getConfiguration()
            .update("vdm-vscode.server.classPathAdditions", [vscode.Uri.file(ppath).fsPath], vscode.ConfigurationTarget.Global);
      };

    extractVersion(ppath: string) {
         const regex = /(\d+\.)(\d+\.)(\d+)/g;
         const version =  regex.exec(ppath);
         if (version) {
            return version[0];
         } else {
            return "1.2.0";
         }
         
     }

 

}