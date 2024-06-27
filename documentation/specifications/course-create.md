## Status
- specified
- not implemented

## Precondition
- The user is on the home screen ([Navigate To Home](./navigate-to-home/navigate-to-home.md))
![Home](../mockups/home.png)

## Description
- The user clicks on the button `New Course`.
- The user sets a number and a name for the new Course
![New course](../mockups/course-new.png)
- He can submit the creation by clicking on the save button
    - The submit Button is only enabled when at least one character is in each text-field
    - When the user is clicking on cancel, the creation is aborted (route back to home)
    - When the user sets a number which is already existing in the database an error message `The given number is already set for another course` is shown and the number field is set to an empty string
- He is routet to the question catalog of the newly created course
![Question List empty](../mockups/question-list-empty.png)