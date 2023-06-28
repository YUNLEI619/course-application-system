const config = {
    // request codes
    REQUEST_SUCCESS: 1000,

    // user roles
    USER_ROLE_ADMIN: "sys:admin",
    USER_ROLE_STUDENT: "sys:student",
    USER_ROLE_LECTURER: "sys:lecturer",

    // toasts
    TOAST_SUCCESS_COLOR: "success",
    TOAST_SUCCESS_MSG: "Successful",
    TOAST_FAILED_COLOR: "danger",
    TOAST_FAILED_MSG: "Failed",

    // urls
    basicURL: 'http://localhost:3000', // this field is probably not going to be used
    loginUrl: '/auth/login',
    logoutUrl: '/auth/logout', // might not use

    // course
    getAllCourses: '/course/getAllCourses',
    getCourseById: '/course/getCourseById',
    getCoursesByFacultyId: '/course/getCoursesByFacultyId',
    createCourse: '/course/saveCourse',
    updateCourse: '/course/updateCourse',
    deleteCourse: '/course/deleteCourseById',
    // faculty
    getAllFaculties: '/faculty/getAllFaculties',
    getFacultyById: '/faculty/getFacultyById',
    createFaculty: '/faculty/saveFaculty',
    updateFaculty: '/faculty/updateFaculty',

    // student
    getAllCoursesByStudentId: '/course_student/getAllCoursesByStudentId',
    getAllCoursesStudentCanEnroll: '/course_student/viewStudentCourseListEnrolment',
    viewStudentCourseGradeAndGPA: '/course_student/viewStudentCourseGradeAndGPA',
    // lecturer
    getCourseByLecturerId: '/course_lecturer/getCoursesByLecturerId',
    getStudentsByCourseId: '/course/getStudentsByCourseId',
    gradeStudentForCourse: '/course_lecturer/gradeStudentForCourse',
    getStudentPerformance: '/lecturer/getStudentPerformanceByLecturerId',
    lecturerEnrollCourse: '/course_lecturer/lecturerEnrollCourse',
    getEnrollCoursesByLecturerId: '/course_lecturer/getEnrollCoursesByLecturerId',
    // course
    getCourseLecturerSchedule: '/course/getCourseLecturerSchedule',
    getAllStudentOngoingCourseList: '/course_student/getAllStudentOngoingCourseList',
    deleteFaculty: '/faculty/deleteFacultyById',
    // lecturer
    getAllLecturers: '/lecturer/getAllLecturers',
    getLecturerById: '/lecturer/getLecturerById',
    getLecturerByFacultyId: '/lecturer/getLecturerByFacultyId',
    createLecturer: '/lecturer/saveLecturer',
    updateLecturer: '/lecturer/updateLecturer',
    deleteLecturer: '/lecturer/deleteLecturerById',
    // student
    getAllStudents: '/student/getAllStudents',
    getStudentById: '/student/getStudentById',
    getStudentsByFacultyId: '/student/getStudentByFacultyId',
    createStudent: '/student/saveStudent',
    updateStudent: '/student/updateStudent',
    deleteStudent: '/student/deleteStudentById',
    // course_lecturer
    removeLecturerFromCourse: '/course_lecturer/removeLecturerFromCourse',
    inputScoreForTheCourse: '/course_lecturer/inputScoreForTheCourse',
    // course_schedule
    createScheduleByCourse: '/course_schedule/createScheduleByCourse',
    removeScheduleByCourse: '/course_schedule/removeScheduleByCourse',
    // course_student
    studentEnrollCourse: '/course_student/studentEnrollCourse',
    removeStudentFromCourse: '/course_student/removeStudentFromCourse',
    getEnrollStudentForTheCourse: '/course_student/getEnrollStudentForTheCourse',
    // schedule
    getAllSchedule: '/schedule/getAllSchedule',
    getScheduleById: '/schedule/getScheduleById',
    deleteScheduleById: '/schedule/deleteScheduleById',
    saveSchedule: '/schedule/saveSchedule',
    updateSchedule: '/schedule/updateSchedule',
};

export default config;
