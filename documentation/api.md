## API Specification

### Course Management

1. **[POST] /course/ids**
    - **Body:** `{ isArchived: boolean }`
    - **Returns:** List of IDs
    - **Notes:** This endpoint allows fetching IDs based on the archive status, useful for filtering courses.

2. **[POST] /course/get-by-ids**
    - **Body:** List of IDs
    - **BadRequest:** If any ID is not found in the database
    - **Returns:** List of course objects
    - **Notes:** Fetch course objects

3. **[PUT] /course/archive/{id}**
    - **BadRequest:** If the ID is not found in the database
    - **Hub:** `onCourseChanged(id)`
    - **Returns:** Success if OK

4. **[PUT] /course/restore/{id}**
    - **BadRequest:** If the ID is not found in the database
    - **Hub:** `onCourseChanged(id)`
    - **Returns:** Success if OK

5. **[POST] /course/create**
    - **Body:** Course object
    - **BadRequest:** If name or number is empty
    - **Hub:** `onNewCourse(id)`
    - **Returns:** Success with ID if OK

6. **[PUT] /course/update**
    - **Body:** Course object
    - **BadRequest:** If name or number is empty
    - **BadRequest:** If ID is not found in the database
    - **Hub:** `onCourseChanged(id)`
    - **Returns:** Success if OK

7. **[GET] /course/statistic/{id}**
    - **BadRequest:** If ID is not found in the database
    - **Returns:** Statistic data
    - **Notes:** Ensure the statistics are comprehensive enough to provide valuable insights.

### Questionnaire Management

8. **[POST] /questionnaire**
    - **Body:** Array of QuestionIds and RightWrongFlags
    - **BadRequest:** If any ID is not found in the database
    - **Hub:** `onCourseChanged(id)`
    - **Returns:** Questionnaire statistics if OK
    - **Notes:** Consider returning the course status if it changes due to the questionnaire completion.

### Question Management

9. **[POST] /question/ids**
    - **Body:** `{ courseId: GUID, randomOrder: boolean, limit: int }`
    - **Returns:** List of IDs
    - **Notes:** This endpoint allows fetching IDs based on the course Id. If randomOrder is set, the Ids are randomly ordered.

10. **[POST] /question/get-by-ids**
    - **Body:** List of IDs
    - **BadRequest:** If any ID is not found in the database
    - **Returns:** List of question objects
    - **Notes:** fetch question objects

11. **[POST] /question**
    - **Body:** Question object
    - **BadRequest:** If the answer or question is empty
    - **Hub:** `onCourseChanged(id)`
    - **Returns:** OK if success

12. **[PUT] /question**
    - **Body:** Question object
    - **BadRequest:** If not found in the database
    - **Hub:** `onCourseChanged(id)`
    - **Returns:** OK if success

13. **[PUT] /question/delete** (Sets deletion flag)
    - **Body:** Question object
    - **BadRequest:** If not found in the database
    - **Hub:** `onCourseChanged(id)`
    - **Returns:** OK if success
    - **Notes:** Consider renaming the endpoint to `question/soft-delete` for clarity.
