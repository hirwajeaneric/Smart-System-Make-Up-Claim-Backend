const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new mongoose.Schema({
    code: { type: String, required: [true, 'Course code must be provided'] },
    name: { type: String, required: [true, 'Course name must be provided'] },
    credits: { type: Number, required: [true, 'Number of course credits must be provided'] },
    faculty: { type: String, required: [true, 'Course faculty must be provided'] },
    department: { type: String, required: [true, 'Course department must be provided'] },
    allocations: [
        {
            academicYear: { type: String, required: false },
            semester: { type: String, required: false },
            lecturers: [
                { 
                    lecturerId: { type: Schema.Types.ObjectId, required: false, ref: "User" },
                    name:  { type: String, required: false },
                    groups: { type: Array, required: false },
                }
            ],
            midSemesterExams: {type: Date, require: false},
            finalExams: {type: Date, required: false},
        }
    ],
}) 

module.exports = mongoose.model('Course', courseSchema);