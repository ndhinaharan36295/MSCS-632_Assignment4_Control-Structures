class EmployeeScheduler {
    constructor() {
        // Using an object here for employees with their shift preferences
        this.employees = {};

        // Using an object here for schedule with days and shifts
        this.schedule = {
            "Monday": { "morning": [], "afternoon": [], "evening": [] },
            "Tuesday": { "morning": [], "afternoon": [], "evening": [] },
            "Wednesday": { "morning": [], "afternoon": [], "evening": [] },
            "Thursday": { "morning": [], "afternoon": [], "evening": [] },
            "Friday": { "morning": [], "afternoon": [], "evening": [] },
            "Saturday": { "morning": [], "afternoon": [], "evening": [] },
            "Sunday": { "morning": [], "afternoon": [], "evening": [] }
        };

        // Using an object here to track the number of days each employee has worked
        this.workdays = {};

        // Using an object here to track the number of shifts assigned to each employee
        this.shiftsAssigned = {};
    }

    // Input and storage of employee names and their shift preferences and priority rankings into the objects
    addEmployeePreferences(name, preferences) {
        this.employees[name] = preferences;
        this.workdays[name] = 0;
        this.shiftsAssigned[name] = 0;
    }

    // Assign shifts for employees based on preferences and scheduling rules
    assignShifts() {
        for (let day in this.schedule) {
            // Create a set of unassigned employees
            let unassigned = new Set(Object.keys(this.employees));

            for (let shift of ["morning", "afternoon", "evening"]) {
                // Find employees who prefer this shift and have worked less than 5 days
                let preferredEmployees = Array.from(unassigned).filter(e => this.employees[e][day].includes(shift) && this.workdays[e] < 5);

                if (preferredEmployees.length >= 2) {
                    // Sort (to give everyone an equal chance) employees by the number of shifts assigned and their preference ranking for this shift
                    preferredEmployees.sort((a, b) => this.shiftsAssigned[a] - this.shiftsAssigned[b] || this.employees[a][day].indexOf(shift) - this.employees[b][day].indexOf(shift));

                    // Assign the first 2 preferred employees to the shift
                    this.assignToShift(day, shift, preferredEmployees.slice(0, 2), unassigned);
                } else {
                    // Find other available employees if preferred employees are less than 2
                    let availableEmployees = Array.from(unassigned).filter(e => this.workdays[e] < 5 && !preferredEmployees.includes(e));

                    // Sort available employees by the number of shifts assigned
                    availableEmployees.sort((a, b) => this.shiftsAssigned[a] - this.shiftsAssigned[b]);

                    // Assign the preferred employees and the first available employees to fill the shift
                    this.assignToShift(day, shift, preferredEmployees.concat(availableEmployees.slice(0, 2 - preferredEmployees.length)), unassigned);
                }

                // Ensure at least 2 employees per shift
                if (this.schedule[day][shift].length < 2) {
                    // Find additional employees who have worked less than 5 days and are not already assigned to this shift
                    let additionalEmployees = Object.keys(this.employees).filter(e => this.workdays[e] < 5 && !this.schedule[day]["morning"].includes(e) && !this.schedule[day]["afternoon"].includes(e) && !this.schedule[day]["evening"].includes(e));

                    // Sort additional employees by the number of shifts assigned
                    additionalEmployees.sort((a, b) => this.shiftsAssigned[a] - this.shiftsAssigned[b]);

                    // Assign the first additional employees to fill the shift
                    this.assignToShift(day, shift, additionalEmployees.slice(0, 2 - this.schedule[day][shift].length), unassigned);
                }
            }
        }
    }

    // Assign the shift to the employees in assigned and update their workdays and shifts assigned
    assignToShift(day, shift, employees, unassigned) {
        for (let e of employees) {
            if (unassigned.has(e)) {
                this.schedule[day][shift].push(e);
                this.workdays[e]++;
                this.shiftsAssigned[e]++;
                unassigned.delete(e);
            }
        }
    }

    // Logic to detect and resolve conflicts
    resolveConflicts() {
        for (let day in this.schedule) {
            for (let shift in this.schedule[day]) {
                if (this.schedule[day][shift].length > 2) {
                    // If more than 2 employees are assigned to a shift, reassign the excess employees
                    let excessEmployees = this.schedule[day][shift].slice(2);

                    this.schedule[day][shift] = this.schedule[day][shift].slice(0, 2);

                    for (let e of excessEmployees) {
                        for (let altShift of ["morning", "afternoon", "evening"]) {
                            if (this.schedule[day][altShift].length < 2) {
                                this.schedule[day][altShift].push(e);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    // Print the weekly schedule
    displaySchedule() {
        for (let day in this.schedule) {
            console.log(`${day}:`);
            for (let shift in this.schedule[day]) {
                console.log(`  ${shift.charAt(0).toUpperCase() + shift.slice(1)}: ${this.schedule[day][shift].join(", ") || "No employees assigned"}`);
            }
            console.log("-".repeat(30));
        }
    }
}

// Example usage
const scheduler = new EmployeeScheduler();

const employeeData = {
    "Employee A": {
        "Monday": ["morning", "afternoon", "evening"],
        "Tuesday": ["morning", "afternoon", "evening"],
        "Wednesday": ["morning", "afternoon", "evening"],
        "Thursday": ["morning", "afternoon", "evening"],
        "Friday": ["morning", "afternoon", "evening"],
        "Saturday": ["morning", "afternoon", "evening"],
        "Sunday": ["morning", "afternoon", "evening"]
    },
    "Employee B": {
        "Monday": ["afternoon", "morning", "evening"],
        "Tuesday": ["afternoon", "morning", "evening"],
        "Wednesday": ["afternoon", "morning", "evening"],
        "Thursday": ["afternoon", "morning", "evening"],
        "Friday": ["afternoon", "morning", "evening"],
        "Saturday": ["afternoon", "morning", "evening"],
        "Sunday": ["afternoon", "morning", "evening"]
    },
    "Employee C": {
        "Monday": ["evening", "morning", "afternoon"],
        "Tuesday": ["evening", "morning", "afternoon"],
        "Wednesday": ["evening", "morning", "afternoon"],
        "Thursday": ["evening", "morning", "afternoon"],
        "Friday": ["evening", "morning", "afternoon"],
        "Saturday": ["evening", "morning", "afternoon"],
        "Sunday": ["evening", "morning", "afternoon"]
    },
    "Employee D": {
        "Monday": ["morning", "evening", "afternoon"],
        "Tuesday": ["morning", "evening", "afternoon"],
        "Wednesday": ["morning", "evening", "afternoon"],
        "Thursday": ["morning", "evening", "afternoon"],
        "Friday": ["morning", "evening", "afternoon"],
        "Saturday": ["morning", "evening", "afternoon"],
        "Sunday": ["morning", "evening", "afternoon"]
    },
    "Employee E": {
        "Monday": ["afternoon", "evening", "morning"],
        "Tuesday": ["afternoon", "evening", "morning"],
        "Wednesday": ["afternoon", "evening", "morning"],
        "Thursday": ["afternoon", "evening", "morning"],
        "Friday": ["afternoon", "evening", "morning"],
        "Saturday": ["afternoon", "evening", "morning"],
        "Sunday": ["afternoon", "evening", "morning"]
    },
    "Employee F": {
        "Monday": ["morning", "afternoon", "evening"],
        "Tuesday": ["morning", "afternoon", "evening"],
        "Wednesday": ["morning", "afternoon", "evening"],
        "Thursday": ["morning", "afternoon", "evening"],
        "Friday": ["morning", "afternoon", "evening"],
        "Saturday": ["morning", "afternoon", "evening"],
        "Sunday": ["morning", "afternoon", "evening"]
    },
    "Employee G": {
        "Monday": ["afternoon", "morning", "evening"],
        "Tuesday": ["afternoon", "morning", "evening"],
        "Wednesday": ["afternoon", "morning", "evening"],
        "Thursday": ["afternoon", "morning", "evening"],
        "Friday": ["afternoon", "morning", "evening"],
        "Saturday": ["afternoon", "morning", "evening"],
        "Sunday": ["afternoon", "morning", "evening"]
    },
    "Employee H": {
        "Monday": ["evening", "morning", "afternoon"],
        "Tuesday": ["evening", "morning", "afternoon"],
        "Wednesday": ["evening", "morning", "afternoon"],
        "Thursday": ["evening", "morning", "afternoon"],
        "Friday": ["evening", "morning", "afternoon"],
        "Saturday": ["evening", "morning", "afternoon"],
        "Sunday": ["evening", "morning", "afternoon"]
    },
    "Employee I": {
        "Monday": ["morning", "evening", "afternoon"],
        "Tuesday": ["morning", "evening", "afternoon"],
        "Wednesday": ["morning", "evening", "afternoon"],
        "Thursday": ["morning", "evening", "afternoon"],
        "Friday": ["morning", "evening", "afternoon"],
        "Saturday": ["morning", "evening", "afternoon"],
        "Sunday": ["morning", "evening", "afternoon"]
    },
    "Employee J": {
        "Monday": ["afternoon", "evening", "morning"],
        "Tuesday": ["afternoon", "evening", "morning"],
        "Wednesday": ["afternoon", "evening", "morning"],
        "Thursday": ["afternoon", "evening", "morning"],
        "Friday": ["afternoon", "evening", "morning"],
        "Saturday": ["afternoon", "evening", "morning"],
        "Sunday": ["afternoon", "evening", "morning"]
    }
};

for (let name in employeeData) {
    scheduler.addEmployeePreferences(name, employeeData[name]);
}

scheduler.assignShifts();
scheduler.resolveConflicts();
scheduler.displaySchedule();