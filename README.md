# Award Utilities Plugin
Award utilities for JC Ink forums

## Install
 - Upload file as new webpage
 - Create new profile field:
	 - Type: Text Area
	 - Max Input: unlimited
	 - Include on Registration?: No
	 - Field must be completed?: No
	 - Hide from member's profile?: No (Field *can* be hidden through styling on the User Control Panel
	 - Field can be edited?: Yes
 - Set ***ucpField*** on line 6 to new profile field: *eg "field_19"*

## Usage
 - Log in to the ACP through the utility
 - Status is read through the console at the bottom of the plugin


## **Multi-Award**
**General Usage**

 - Complete the award form on the left-hand side of the plugin 
 -  Usernames are separated by a carriage return
 - Click 'Submit'
 - Click 'Save as Template' to save award information for future use
 - Click 'Reset' to clear the form *and* selected template awards from the queue
 

**Using Templates**

	
*Selecting Templates*
 - Click an award image on the right-hand side of the plugin to move it to the editor and queue it
 - Queuing multiple awards will close the editor
 - Click an award in the queue to remove it from the queue


*Loading Templates*
 - Click '**Load**' in the middle of the toolbar beneath 'Saved Awards' to fetch saved award templates from the User Profile
	 - This will clear any currently loaded templates


	*Saving Templates*
	

 - Click '**Save as Template**' on the left-hand side to make a copy of the award currently in-editor and move it to the right-hand side
	 - Templates are not *truly* saved until the User Profile is updated
 - Click '**Save Selected**' or '**Save All**' under the 'Save' menu on the toolbar
	 - 'Save Selected' will append the currently selected templates to the existing templates in the user profile. This is useful for saving new templates
	 - 'Save All' will overwrite any existing templates in the user profile with the currently loaded templates on the right-hand side


	*Submitting Templates*
 - Enter usernames in the box on the left-hand side, separated by carriage return
 - Click awards on the right-hand side to move them to the queue
 - Click 'Submit'. Award status will be listed per-user in the console
	 - If you can't see the award in the profile, make sure it's set to be visible


##  Award Editor 
*Editing Awards*

 - Click '**Generate Awards Data**'
	 - Utility will sleep for 5 seconds. Status can be read in the console at the bottom row
 - Edit award fields as needed by clicking and making changes
	 - All fields except the award identifier can be edited
	 - Edited awards (after losing focus) will be highlighted yellow by default
	 - Controls on the right hand side of the entry will be appended on edit. The left one will submit the changes, the right will reset the changes
 - Awards can be filtered with the inputs in the bottom right-hand corner. Select the data type to filter by, enter a full phrase (exact match), and click search.
	 - Filtering is by exact match, and must fully match the data. Searching '*Hello*' will not turn up '*Hello World*'
	 - Filtering can be reset with the ⎌ button, immediately to the right of the search button
 - Awards can be modified *en masse* in the same way: Select the data type to modify, enter the phrase to replace, and enter a replacement phrase
	 - As with searching, replacement is by exact, full-cell matching. 'HELLO'  will not replace 'Hello' in 'Hello World'
	 - Modifications can be discarded by clicking 'Discard Changes'
 - Click '**Submit Edits**' or '**Discard Changes**' to submit or discard the changes (entries highlighted yellow). This will not delete entries highlighted red


*Deleting Awards*

 - Click the **✗** icon on the far right-hand side of the entry you wish to delete.
	 - Entries marked for deletion are highlighted red
 - Click '**Delete Selected**'
	 - Entries that have been deleted are faded out. This is not readily reversible

## Back-ups
Back-ups are not made by the utility, but the file generated upon clicking 'Build Awards Table' is accessible in the Database Management section of the Admin Control Panel.

## Troubleshooting
pls don't break it.

Actions are briefly documented in the console at the bottom of the utility, which can be expanded by hovering over it. The browser console (which can be accessed by hitting F12 in most browsers) contains significantly more information.
