from collections import defaultdict

class EmployeeScheduler:
    def __init__(self):
        # Using a dictionary here for employees with their shift preference
        self.employees = {}

        # Using a dictionary here for schedule with days and shifts
        self.schedule = {day: {"morning": [], "afternoon": [], "evening": []} for day in
                         ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}

        # Using a dictionary here to track the number of days each employee has worked
        self.workdays = defaultdict(int)

        # Using a dictionary here to track the number of shifts assigned to each employee
        self.shifts_assigned = defaultdict(int)

    # Input and storage of employee names and their shift preferences and priority rankings
    def add_employee_preferences(self, name, preferences):
        # Add an employee with their shift preferences and priority rankings
        self.employees[name] = preferences

    # Assign shifts for employees based on preferences and scheduling rules
    def assign_shifts(self):
        for day in self.schedule:
            # Create a set of unassigned employees (fill this with all employees as we haven't started assigning yet)
            unassigned = set(self.employees.keys())

            for shift in ["morning", "afternoon", "evening"]:
                # Find employees who prefer this shift and have worked less than 5 days (more than which they cannot be scheduled)
                preferred_employees = [e for e in unassigned if shift in self.employees[e][day] and self.workdays[e] < 5]

                if len(preferred_employees) >= 2:
                    # Sort (to give everyone an equal chance) employees by the number of shifts assigned and their preference ranking for this shift
                    preferred_employees.sort(key=lambda e: (self.shifts_assigned[e], self.employees[e][day].index(shift)))

                    # Assign the first 2 preferred employees to the shift
                    assigned = preferred_employees[:2]

                else:
                    # Find other available employees if preferred employees are less than 2
                    available_employees = [e for e in unassigned if self.workdays[e] < 5 and e not in preferred_employees]

                    # Sort available employees by the number of shifts assigned
                    available_employees.sort(key=lambda e: self.shifts_assigned[e])

                    # Assign the preferred employees and the first available employees to fill the shift
                    assigned = preferred_employees + available_employees[:2 - len(preferred_employees)]

                # Assign the shift to the employees in assigned and update their workdays and shifts assigned
                for e in assigned:
                    if e in unassigned:
                        self.schedule[day][shift].append(e)
                        self.workdays[e] += 1
                        self.shifts_assigned[e] += 1
                        unassigned.remove(e)

                # Ensure at least 2 employees per shift
                # If fewer than 2 employees are available for a shift
                # randomly assign additional employees who have not worked 5 days yet
                if len(self.schedule[day][shift]) < 2:
                    # Find additional employees who have not worked 5 days and are not already assigned to a shift on this day
                    additional_employees = [e for e in self.employees if self.workdays[e] < 5 and e not in self.schedule[day]["morning"] and e not in self.schedule[day]["afternoon"] and e not in self.schedule[day]["evening"]]

                    # Sort additional employees by the number of shifts assigned
                    additional_employees.sort(key=lambda e: self.shifts_assigned[e])

                    # Calculate the number of additional employees needed to fill the shift
                    additional_needed = 2 - len(self.schedule[day][shift])

                    # Assign the first additional employees to fill the shift
                    additional_assigned = additional_employees[:additional_needed]

                    # Assign the shift to the employees in additional_assigned and update their workdays and shifts assigned
                    for e in additional_assigned:
                        self.schedule[day][shift].append(e)
                        self.workdays[e] += 1
                        self.shifts_assigned[e] += 1

    # Logic to detect and resolve conflicts
    def resolve_conflicts(self):
        # Ensure employees get at least one shift close to their preference if it is unavailable
        for day in self.schedule:
            for shift in self.schedule[day]:
                if len(self.schedule[day][shift]) > 2:
                    # If more than 2 employees are assigned to a shift, reassign the excess employees
                    excess_employees = self.schedule[day][shift][2:]
                    self.schedule[day][shift] = self.schedule[day][shift][:2]
                    for e in excess_employees:
                        for alt_shift in ["morning", "afternoon", "evening"]:
                            if len(self.schedule[day][alt_shift]) < 2:
                                self.schedule[day][alt_shift].append(e)
                                break

    def display_schedule(self):
        # Prints the weekly schedule
        for day, shifts in self.schedule.items():
            print(f"{day}: ")
            for shift, employees in shifts.items():
                print(f"  {shift.capitalize()}: {', '.join(employees) if employees else 'No employees assigned'}")
            print("-" * 30)

# Example usage
scheduler = EmployeeScheduler()

# Add employees with their shift preferences and priority rankings
employee_data = {
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
}

for name, prefs in employee_data.items():
    scheduler.add_employee_preferences(name, prefs)

scheduler.assign_shifts()
scheduler.resolve_conflicts()
scheduler.display_schedule()
