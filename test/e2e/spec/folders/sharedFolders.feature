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


@folders @files @sharing @viewer 
Feature: Shared Folders (volumes) user 
    As a Peerio user, I have access to shared folders called volumes. I may have different 
    privileges (viewer, editor, owner) with respect to a given volume. This feature contains 
    volume operations available to all users (viewers, editors, and owners).
    This feature file contains volume operations specifically related to sharing and unsharing. 
    It does not contain operations available exclusively to editors and owners.
    It also does not contain operations related specifically to moving files.  

Background: 
    Given I am any user, or viewer of the file(s) in question

Scenario Outline: I am invited and accept the invite to a shared folder
    Given the owner or editor of the folder has invited me as <usertype>
    Then  the pending invitation will be available in "All Files" 
    When  I accept the invite
    Then  the volume will be added to my "Your Drive" with the <usertype> privileges applied

Examples: 
    | usertype | 
    | editor   | 
    | viewer   | 

Scenario: I am invited and reject the invite to a shared folder
    Given the owner or editor of the folder has invited me
    Then  the pending invitation will be available in "All Files"
    When  I reject the invite 
    Then  the volume will be removed from "All Files"

#perhaps rewrite to make testable? 
Scenario: A file has been shared with me in multiple contexts
    Given I have been granted different privileges regarding the file
    Then  my file privileges will be the highest available

Scenario: view contents of received volume from files tab
    Given I have navigated to the files tab 
    When  I click on the received volume
    Then  I can view the contents of the volume 

Scenario: view contents of received volume from dm
    When  I click on the recevied volume in the chat
    Then  I can view the contents of the received volume 

