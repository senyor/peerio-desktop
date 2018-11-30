################################################################################
#
# This .feature file has been written by Mona Ghassemi for use by Peerio.
# It is part of a set of .feature files located in the desktop repository
# branch files-folders-scenarios.
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
    privileges (editor, owner) with respect to a given volume.
    Because we may one day implement "viewers" who are not editors,  
    This feature contains volume operations available only to editors and owners. It does not contain operations
    available exclusively to volume owners.

Background: 
    Given I am the editor or owner of the folder

Scenario: I want to share a folder from files tab
    Given I have navigated to the files tab
    When  I select the file options
    And   I select "Share"
    And   I select a user to share with
    Then  the selected user will be sent the file as a message
    And   the folder will appear in the user's "Files"

Scenario: I want to share a folder via chat
    Given I have navigated to the chat tab
    When  I click "Share to chat"
    Then  a menu pops up to share files 
    When  I select "Share from Peerio files"
    Then  A dialog pops up prompting me to select a file or folder
    When  I select a folder 
    Then  The folder will become a volume
    Then  The volume will appear in the chat
    #And   The volume will be added to the recipient(s) "All Files"
    And   The recipient(s) will be able to navigate to the volume by clicking on the volume's icon in the chat

Scenario Outline: remove a user from file tab (as editor)
    Given I have navigated to the files tab
    And   I click on the volume options (...)
    And   I click on share
    And   I click on "View Shared With"
    And   I click the "-" next to a user 
    Then  The app will show "removed" next to the user's name
    When  I click "Save"
    And   The user's privileges to the volume will be revoked
    And   The file volume will be removed from the user's "Files"
    And   Any chats in which the folder was shared will show "Folder was unshared" instead
    And   My chat messages where I have shared the folder will have an option "Reshare"

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