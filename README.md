# BDMTool
The Behaviour-Driven Modelling tool for Visual Studio Code


## How-to

This is a short walkthrough of how to use the BDM-VSCode extension:

    1. Download the BDMTool-latest.vsix file.
    2. Install the extension in Visual Studio Code the extension sidepanel the options button: install from VSIX... 
    3. Open a new workspace.
    4. Open the command pallet with the command `ctrl+shift+p`.
    5. Select `Create new BDM project`.
     1. Input Group ID and Artifact ID.
    7. Uncomment the .feature file, step definition file, and the specification file.
     1. It can be necessary to save the different files as well as the pom.xml to ensure correct behaviour from the tool.
     2. To validate the correct behaviour the terminal output will show creation of specification files in the target folder.
     3. The target folder can also be observed to see that a corresponing .class file exists to the stepdefinition file.  
    8. Open the command pallet again.
    9. Select `Run BDM tests`.
    10. Observe the terminal view for the succesful running of BDM.   
