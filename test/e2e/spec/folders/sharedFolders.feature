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


@folders @files @sharing @viewer 
Feature: Shared Folders (volumes) user 
    As a Peerio user, I have access to shared folders called volumes. I may have different 
    privileges (editor, owner) with respect to a given volume. This feature contains 
    volume operations available to all users (editors, and owners).
    This feature file contains volume operations specifically related to sharing and unsharing. 
    It also does not contain operations related specifically to moving files.  

Background: 
    Given I am any user of the file(s) in question

Scenario Outline: I am invited and accept the invite to a shared folder
    Given the owner or editor of the folder has invited me to share the folder
    Then  the pending invitation will be available in "All Files" 
    When  I accept the invite
    Then  the volume will be added to my "Your Drive" with the editor privileges applied

#If "viewer" gets implemented the above Scenario will be replaced with the scenario outline below
#Scenario Outline: I am invited and accept the invite to a shared folder
#    Given the owner or editor of the folder has invited me as <usertype>
#    Then  the pending invitation will be available in "All Files" 
#    When  I accept the invite
#    Then  the volume will be added to my "Your Drive" with the <usertype> privileges applied
#
#Examples: 
#    | usertype | 
#    | editor   | 
#    | viewer   | 

Scenario: I am invited and reject the invite to a shared folder
    Given the owner or editor of the folder has invited me
    Then  the pending invitation will be available in "All Files"
    When  I reject the invite 
    Then  the volume will be removed from "All Files"

#Only if "viewer" gets implemented
#perhaps rewrite to make testable? 
#Scenario: A file has been shared with me in multiple contexts
#    Given I have been granted different privileges regarding the file
#    Then  my file privileges will be the highest available

Scenario: view contents of received volume from files tab
    Given I have navigated to the files tab 
    When  I click on the received volume
    Then  I can view the contents of the volume 

Scenario: view contents of received volume from dm
    Given I have navigated to the chat 
    When  I click on the recevied volume in the chat
    Then  I can view the contents of the received volume 

