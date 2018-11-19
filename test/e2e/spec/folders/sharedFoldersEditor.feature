################################################################################
#
# This .feature file has been written by Mona Ghassemi for use by Peerio.
# It is part of a set of .feature files currently included in a folder 
# called SHARED_FOLDERS_SCENARIOS.
#
# The Scenarios have been created based on contents of the "Files Planning"
#   document available in the Peerio Google drive, and based on the
#   functionality of the Peerio staging app, Desktop, as of this date: 
#   November 9, 2018. 
#   Version 3.8.3-staging. 
# 
# This file is a DRAFT. 
# It is intended to be used as documentation for the features here specified.
# It is also intended as a starting point for future regression testing. 
# It may contain inconsistencies with actual or intended functionality. 
# 
# If you have any questions, comments, or concerns regarding the contents 
# of this file, please contact Mona Ghassemi, @bluemona, on Peerio. 
#
# Thanks! 
#
################################################################################

@folders @sharing @editor
Feature: Shared Folders (volumes) editor
    As a Peerio user, I have access to shared folders called volumes. I may have different 
    privileges (viewer, editor, owner) with respect to a given volume. This feature contains 
    volume operations available only to editors and owners. It does not contain operations
    available exclusively to volume owners.

Background: 
    Given I am the editor of the folder

#NOTE: because editors have all privileges that an viewers have, write tests inherited from viewer where possible
#actually maybe an inheritance structure is not needed, simply run all the cucumber tests? 
#but in some cases you may actually need to overwrite

#does it work as invite? 
Scenario: I want to share a folder from files tab
    Given I have navigated to the files tab
    When  I select the file options
    And   I select "Share"
    And   I select a user to share with
    Then  the selected user will be sent the file as a message
    And   the folder will appear in the user's "All Files"

Scenario: I want to share a folder via chat
    Given I have navigated to the chat tab
    When  I click "Share to chat"
    Then  a menu pops up to share files 
    When  I select "Share from Peerio files"
    Then  A dialog pops up prompting me to select a file or folder
    When  I select a folder 
    Then  The folder will become a volume
    Then  The volume will appear in the chat
    And   The volume will be added to the recipient(s) "All Files"
    And   The recipient(s) will be able to navigate to the volume by clicking on the volume's icon in the chat

#I am not sure there are any differences here, I don't think so. 
#Scenario: add a user (as editor)
#this is exactly the same is the first scenario above. 

#note: for indivdiual files, the option available is to delete the file
Scenario Outline: remove a user (as editor) from audit log
    Given I have selected folder's options
    And   I have selected share
    And   I have selected "View Shared With"
    When  I select a username
    And   I select remove
    Then  the user will lose access to the folder
    And   the user will receive a notification that they have been removed

#THIS ONE BASED ON STAGING APP
Scenario Outline: remove a user from file tab (as editor)
    Given I have navigated to the files tab
    And   I click on the volume options
    And   I click on share
    And   I click on "View Shared With"
    And   I click the "-" next to a user 
    Then  The app will show "removed" next to the user's name
    When  I click "Save"
    And   The user's privileges to the volume will be revoked
    And   The file volume will be removed from the user's "All Files"
    And   Any chats in which the folder was shared will show "Folder was unshared" instead
    And   My chat messages where I have shared the folder will have an option "Reshare"
    #NOTE: IN CURRENT IMPLEMENTATION OF STAGING APP: 
    #The recipient access is not revoked until the recipient has restarted the app
    #Even when the editor/owner revokes access to the recipient, the folder SHOWS UP AS A VOLUME

Scenario Outline: Reshare a folder
    Given I have revoked access to a folder that was shared in a chat
    And   I click on "Reshare"
    Then  The recipient receives a new chat message in which the folder is shared

Scenario Outline: I begin to remove a user from file tab but I change my mind (as editor)
    Given I have navigated to the files tab
    And   I click on the volume options
    And   I click on share
    And   I click on "View Shared With"
    And   I click the "-" next to a user 
    Then  The app will show "removed" next to the user's name
    When  I click "Undo"
    And   The user's privileges to the volume will NOT be revoked
    And   The file volume will be NOT removed from the user's "All Files"

Scenario: move file from volume (shared folder) into regular folder
    Given I have navigated to the file
    When  I click on the file options
    And   I click on move
    Then  I am prompted to move the file
    And   The file will be copied to the destination folder
    And   The file will be removed from the volume
    And   The file will be unshared from users of the volume except the file owner 