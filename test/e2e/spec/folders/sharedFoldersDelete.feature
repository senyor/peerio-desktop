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
#   November 12, 2018: CONFIRMED THAT THIS FILE MATCHES CURRENT IMPLEMENTATION
#   AND/OR EXPECTED FUNCTIONALITY. 
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

@folders @files @delete @remove @viewer @editor 
Feature: Shared Folders (volumes) user 
    As a Peerio user, I have access to shared folders called volumes. I may have different 
    privileges (viewer, editor, owner) with respect to a given volume. This feature contains 
    volume operations available to all users (viewers, editors, and owners).
    This feature file contains volume operations specifically related to deleting / removing files 
    from the perspective of a user (viewer or editor). 
    This applies to both desktop and mobile. 

Background: 
    Given I have navigated to the files tab
    And   I have selected the file_or_folder options
    And   I have selected Delete 

#users who are not editors are not implemented in this release
#Scenario: I want to remove a file (as user) 
#    Then  the file is removed from "Your Drive"
#    But   the owner will retain access
#    And   any other users will retain access
#    And   the file binary will remain on Peerio servers (Azure)
#    And   users in rooms or chats where the file has been shared will retain access 
#    And   if I am in rooms or chats where the file has been shared
#    Then  the file will still be available to me in "All Files" 
#    And   I will retain the privileges specified in the context where the file was shared with me

Scenario: I want to leave a folder (when a non owner "deletes" a shared folder, they leave it)
    Then  the folder is removed from "Your Drive"
    But   the owner will retain access
    And   any other users will retain access
    And   the folder binaries will remain on Peerio servers (Azure)
    And   users in rooms or chats where the file has been shared will retain access 
    And   if I am in rooms or chats where the file has been shared
    Then  the folder will still be available to me in "All Files" 
    And   I will retain the privileges specified in the context where the file was shared with me