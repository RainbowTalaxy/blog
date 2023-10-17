class Person:
    def __init__(self, name):
        self.name = name
        self.__greeting()
    
    def greeting(self):
        print("Hello, I'm " + self.name)

    __greeting = greeting

class Student(Person):
    def greeting(self):
        return print("Hello, I'm " + self.name + ". I'm a student.")
    
student = Student("Talaxy") # => "Hello, I'm Talaxy"