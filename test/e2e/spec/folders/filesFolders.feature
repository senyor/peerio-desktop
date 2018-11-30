################################################################################
#
# This .feature file has been written by Mona Ghassemi for use by Peerio.
# It is part of a set of .feature files located in the desktop repository
# branch files-folders-scenarios
# 
# If you have any questions, comments, or concerns regarding the contents 
# of this file, please contact Mona Ghassemi, @bluemona, on Peerio. 
#
# Thanks! 
#
################################################################################


@folders @files
Feature: Files and Folders General
         As a Peerio user, I have access to a file directory in my Peerio application.
         The file system has certain valid and invalid operations. This feature details 
         aspects of the file directory system not including sharing functionality.

Background: 
    Given I am using the peerio desktop app and have navigated to the file section

Scenario: I want to add a file from my computer to a folder (including the root directory)
    Given I have navigated to the folder where I want to add the file
    And   I click on "Upload"
    Then  the system file dialog opens
    When  I choose a file and click open
    Then  the file uploads to Peerio and is added to the folder
    And   the file is visible in "All Files"
    # IS THIS LAST LINE NECESSARY IN THE CURRENT IMPLEMENTATION? 
    And   I become the owner of the file

Scenario: I want to create a folder in Peerio
    When  I click "Add Folder"
    Then  A dialog opens asking me for the folder name
    When  I type a folder name
    And   I click "Create" (or press "return")
    Then  a folder is created with the name I specified
    And   the folder is added to "All Files"
    # IS THIS LAST LINE NECESSARY IN THE CURRENT IMPLEMENTATION? 
    And   I become the owner of the folder

#this should be implemented for "/" and probably (possibly?) for other files too
# THIS SHOULD STAY HERE BECAUSE IT IS A GOOD CHECK TO HAVE
Scenario: Invalid folder name 
    When  I click "Add Folder"
    Then  A dialog opens asking me for the folder name
    When  I enter an invalid folder name
    Then  A dialog appears telling me "invalid folder name"
    And   The folder is not created 

#this one might need to be reviewed (JUST BECAUSE IT IS VERY SPECIFIC about UI)
Scenario: I want to drag and drop a file to a folder
    Given I have navigated to a view where both the file and the folder are visible
    And   I drag the file over the folder
    Then  the file item should be shown highlighted in grey with the checkbox selected
    And   an image showing file icon and name should follow my mouse
    And   the folder should be highlighted in blue
    When  I release the file over the folder
    Then  the file should moved into the folder

Scenario: I want to move a file into a folder
    Given I have created the folder
    And   I have uploaded the file 
    When  I click the file options (...)
    And   I click "Move"
    Then  A dialog shows prompting me to choose a folder
    When  I select the folder 
    And   I click "Move"
    Then  the file is moved into the folder   

Scenario: I cannot move a folder into its own child
    Given I have created a folder
    And   I click on the file options
    And   I click "Move"
    Then  A dialog shows prompting me to choose a folder
    And   The folder I have selected is not an available option
    And   Children of the folder I have selected are not available options