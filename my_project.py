name = input("Атыңызды енгізіңіз: ")

try:
    age = int(input("Жасыңызды енгізіңіз: "))
    print("Сәлем", name)
    print("Жасыңыз:", age)
except ValueError:
    print("Қате: жас сан болуы керек")