## Status
- specified
- not implemented

## Precondition
- A course is selected (see [Select Course](./select-course/course-select.md))
![Select Course](../mockups/course-selected.png)

## Description
- The user clicks on "archive".
- A submit dialog is shown:
    - `Do you really want to archive this course?`
    - Yes / No
- A click on "No" closes the dialog. The course is still selected.
- A click on "Yes" archives the course. The app navigates to the home screen.
![Home](../mockups/home.png)
- A success message appears for 5 seconds on the bottom right of the screen:
    - `Course {name} has been successfully archived.`
- The archived course is no longer visible on the home screen.
