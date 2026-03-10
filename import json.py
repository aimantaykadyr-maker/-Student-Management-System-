import json
import os

# ==================== 配置 ====================
DATA_FILE = "students.json"

# ==================== 学生类 ====================
class Student:
    def __init__(self, student_id, name, age, grade, department):
        self.student_id = student_id
        self.name = name
        self.age = age
        self.grade = grade
        self.department = department

    def to_dict(self):
        return {
            "id": self.student_id,
            "name": self.name,
            "age": self.age,
            "grade": self.grade,
            "department": self.department
        }

    @staticmethod
    def from_dict(data):
        return Student(
            student_id=data["id"],
            name=data["name"],
            age=data["age"],
            grade=data["grade"],
            department=data["department"]
        )

    def __str__(self):
        return (f"ID: {self.student_id:<5} | "
                f"Аты: {self.name:<15} | "
                f"Жасы: {self.age:<4} | "
                f"Бағасы: {self.grade:<5} | "
                f"Факультет: {self.department}")


# ==================== Менеджер класы ====================
class StudentManager:
    def __init__(self):
        self.students = []
        self._next_id = 1
        self.load_from_file()

    # ---------- Файлмен жұмыс ----------
    def load_from_file(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.students = [Student.from_dict(d) for d in data]
                    if self.students:
                        self._next_id = max(s.student_id for s in self.students) + 1
            except (json.JSONDecodeError, KeyError):
                print("⚠️  Деректер файлы зақымдалған. Жаңа база жасалды.")
                self.students = []

    def save_to_file(self):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([s.to_dict() for s in self.students], f, ensure_ascii=False, indent=4)

    # ---------- CRUD операциялары ----------
    def add_student(self):
        print("\n── Студент қосу ──────────────────────")
        name = input_required("  Аты-жөні          : ")
        age = input_int("  Жасы              : ", min_val=1, max_val=120)
        grade = input_required("  Бағасы (A/B/C...): ")
        department = input_required("  Факультет          : ")

        student = Student(self._next_id, name, age, grade, department)
        self.students.append(student)
        self._next_id += 1
        self.save_to_file()
        print(f"\n✅ Студент сәтті қосылды: {student}")

    def delete_student(self):
        print("\n── Студент өшіру ─────────���───────────")
        self.list_students()
        if not self.students:
            return
        student_id = input_int("  Өшіру үшін ID енгізіңіз: ")
        student = self._find_by_id(student_id)
        if student:
            self.students.remove(student)
            self.save_to_file()
            print(f"✅ Студент өшірілді: {student.name}")
        else:
            print("❌ Студент табылған жоқ.")

    def search_student(self):
        print("\n── Студент іздеу ─────────────────────")
        keyword = input_required("  Атын немесе ID енгізіңіз: ").lower()
        results = [
            s for s in self.students
            if keyword in s.name.lower() or keyword == str(s.student_id)
        ]
        if results:
            print(f"\n🔍 {len(results)} нәтиже табылды:")
            print_table_header()
            for s in results:
                print(s)
        else:
            print("❌ Студент табылған жоқ.")

    def update_student(self):
        print("\n── Студент жаңарту ───────────────────")
        self.list_students()
        if not self.students:
            return
        student_id = input_int("  Жаңарту үшін ID енгізіңіз: ")
        student = self._find_by_id(student_id)
        if not student:
            print("❌ Студент табылған жоқ.")
            return

        print("  (Өзгертпесеңіз Enter басыңыз)\n")
        name = input(f"  Жаңа аты [{student.name}]: ").strip() or student.name
        age_input = input(f"  Жаңа жасы [{student.age}]: ").strip()
        age = int(age_input) if age_input.isdigit() else student.age
        grade = input(f"  Жаңа бағасы [{student.grade}]: ").strip() or student.grade
        department = input(f"  Жаңа факультет [{student.department}]: ").strip() or student.department

        student.name = name
        student.age = age
        student.grade = grade
        student.department = department
        self.save_to_file()
        print(f"\n✅ Студент жаңартылды: {student}")

    def list_students(self):
        if not self.students:
            print("\n📭 Студенттер тізімі бос.")
            return
        print(f"\n── Барлық студенттер ({len(self.students)} адам) ─────")
        print_table_header()
        for s in sorted(self.students, key=lambda x: x.student_id):
            print(s)
        print("─" * 70)

    def show_stats(self):
        print("\n── Статистика ────────────────────────")
        if not self.students:
            print("  Деректер жоқ.")
            return
        ages = [s.age for s in self.students]
        print(f"  Жалпы студент саны : {len(self.students)}")
        print(f"  Орташа жас          : {sum(ages) / len(ages):.1f}")
        print(f"  Ең жас              : {min(ages)}")
        print(f"  Ең үлкен            : {max(ages)}")
        grade_counts = {}
        for s in self.students:
            grade_counts[s.grade] = grade_counts.get(s.grade, 0) + 1
        print("  Бағалар бойынша     :", ", ".join(f"{k}={v}" for k, v in sorted(grade_counts.items())))

    # ---------- Көмекші функция ----------
    def _find_by_id(self, student_id):
        for s in self.students:
            if s.student_id == student_id:
                return s
        return None


# ==================== Утилиталар ====================
def input_required(prompt):
    while True:
        val = input(prompt).strip()
        if val:
            return val
        print("  ⚠️  Бос қалдыруға болмайды, қайталаңыз.")

def input_int(prompt, min_val=None, max_val=None):
    while True:
        val = input(prompt).strip()
        if val.lstrip('-').isdigit():
            num = int(val)
            if (min_val is None or num >= min_val) and (max_val is None or num <= max_val):
                return num
        print(f"  ⚠️  Дұрыс сан енгізіңіз"
              + (f" ({min_val}–{max_val})" if min_val and max_val else "") + ".")

def print_table_header():
    print("─" * 70)
    print(f"{'ID':<6} {'Аты-жөні':<16} {'Жасы':<5} {'Бағасы':<7} {'Факультет'}")
    print("─" * 70)


# ==================== Басты мәзір ====================
def menu():
    manager = StudentManager()
    print("=" * 55)
    print("   🎓  Студенттер ақпаратын басқару жүйесі  🎓")
    print("=" * 55)

    actions = {
        '1': ("Студент қосу",                    manager.add_student),
        '2': ("Студент өшіру",                   manager.delete_student),
        '3': ("Студент іздеу",                   manager.search_student),
        '4': ("Студентті жаңарту",               manager.update_student),
        '5': ("Барлық студенттерді көрсету",     manager.list_students),
        '6': ("Статистика",                       manager.show_stats),
        '0': ("Шығу",                             None),
    }

    while True:
        print("\n┌─────────────────────────────────────┐")
        for key, (label, _) in actions.items():
            print(f"│  {key}.  {label:<33}│")
        print("└─────────────────────────────────────┘")

        choice = input("  👉 Операция нөмірін таңдаңыз: ").strip()

        if choice == '0':
            print("\n👋 Бағдарламадан шықты. Сау болыңыз!")
            break
        elif choice in actions:
            actions[choice][1]()
        else:
            print("❌ Қате таңдау, қайталап көріңіз.")


if __name__ == '__main__':
    menu()