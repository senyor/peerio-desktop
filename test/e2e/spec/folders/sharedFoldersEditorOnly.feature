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
    This feature contains volume operations available only to editors. It does not contain operations
    available exclusively to volume owners.
    In most cases this amounts to the specification that I can not remove privileges from the Owner. 

Background: 
    Given I am the editor of the folder

Scenario Outline: remove a user from file tab (as editor)
    Given I have navigated to the files tab
    And   I click on the volume options (...)
    And   I click on share
    And   I click on "View Shared With"
    Then  I have access to removal for all users except the owner 
    And   I click the "-" next to a user
    Then  The app will show "removed" next to the user's name
    When  I click "Save"
    And   The user's privileges to the volume will be revoked
    And   The file volume will be removed from the user's "Files"
    And   Any chats in which the folder was shared will show "Folder was unshared" instead
    And   My chat messages where I have shared the folder will have an option "Reshare"

Scenario Outline: I begin to remove a user from file tab but I change my mind (as editor)
    Given I have navigated to the files tab
    And   I click on the volume options
    And   I click on share
    And   I click on "View Shared With"
    Then  I have access to removal for all users except the owner 
    And   I click the "-" next to a user 
    Then  The app will show "removed" next to the user's name
    When  I click "Undo"
    And   The user's privileges to the volume will NOT be revoked
    And   The file volume will be NOT removed from the user's "All Files"

Scenario: move file from volume (shared folder) into regular folder (as editor)
    Given I have navigated to the file
    When  I click on the file options
    And   I click on move
    Then  I am prompted to move the file
    And   The file will be copied to the destination folder
    And   The file will be removed from the volume
    And   The file will be unshared from users of the volume except the file owner 

Scenario Outline: I begin to remove a user from file tab but I change my mind (as editor)
    Given I have navigated to the files tab
    And   I click on the volume options
    And   I click on share
    And   I click on "View Shared With"
    Then  I have access to removal for all users except the owner 
    And   I click the "-" next to a user 
    Then  The app will show "removed" next to the user's name
    When  I click "Undo"
    And   The user's privileges to the volume will NOT be revoked
    And   The file volume will be NOT removed from the user's "All Files"

Scenario: move file from volume (shared folder) into regular folder (as editor)
    Given I have navigated to the file
    When  I click on the file options
    And   I click on move
    Then  I am prompted to move the file
    And   The file will be copied to the destination folder
    And   The file will be removed from the volume
    And   The file will be unshared from users of the volume except the file owner 