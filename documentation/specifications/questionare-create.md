## Status
- specified
- not implemented

## Precondition
- A course is selected ([Select Course](./course-select.md))
![Selected Course](../mockups/course-selected.png)

## Description
- The user clicks on the "Start Questionnaire" button.
- The user answers 10 questions ([Answer Question](./question-answer.md)).
![Question](../mockups/questionare-submit.png)
- After completing the questions, a statistic is shown displaying how many answers are right and how many are wrong.
![Questionnaire Statistic](../mockups/questionare-statistics.png)
- A click on "OK" returns the user to the selected course.

## Cancel
- The user can cancel the questionnaire at any time by clicking on "Cancel" during the Answer Steps or by clicking the home button.
- A confirmation dialog is displayed: `Do you really want to cancel the questionnaire (no answer is saved)? Yes/No`.
- A click on "No" simply closes the confirmation dialog, while a click on "Yes" takes the user back to the selected course.
