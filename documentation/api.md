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
    - **Notes:** Ensure the API supports partial valid requests, returning useful information even if some IDs are invalid.

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

9. **[POST] /question**
    - **Body:** Question object
    - **BadRequest:** If the answer or question is empty
    - **Hub:** `onCourseChanged(id)`
    - **Returns:** OK if success

10. **[PUT] /question**
    - **Body:** Question object
    - **BadRequest:** If not found in the database
    - **Hub:** `onCourseChanged(id)`
    - **Returns:** OK if success

11. **[PUT] /question/delete** (Sets deletion flag)
    - **Body:** Question object
    - **BadRequest:** If not found in the database
    - **Hub:** `onCourseChanged(id)`
    - **Returns:** OK if success
    - **Notes:** Consider renaming the endpoint to `question/soft-delete` for clarity.
