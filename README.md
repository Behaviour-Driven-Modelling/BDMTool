# BDMTool
The Behaviour-Driven Modelling tool for Visual Studio Code


## How-to

This is a short walkthrough of how to use the BDM-VSCode extension:

    1. Download the BDMTool-latest.vsix file from releases.
    2. Install the extension in Visual Studio Code the extension sidepanel the options button: install from VSIX... 
    3. Open a new workspace.
    4. Open the command pallet with the command `ctrl+shift+p` or right click the explorer panel.
    5. Select `Create new BDM example project`.
     1. Input Group ID and Artifact ID.
    7. Await the installation of the example.
     1. It can be necessary to save the different files as well as the pom.xml to ensure correct behaviour from the tool.
     2. To validate the correct behaviour the terminal output will show creation of specification files in the target folder.
     3. The target folder can also be observed to see that a corresponing .class file exists to the stepdefinition file.  
    8. Navigate with the activitybar to the 'BDM testing' view.
    9. Select `Run BDM tests` or 'Run BDM tests on specification'.
    10. Observe the BDM test view for specification for the succesful running of the BDM project.   
