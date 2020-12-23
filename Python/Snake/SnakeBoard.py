from SnakeBod import SnakeBod
import random

class SnakeBoard:
    length = 0
    state = "Start"
    field = [] # variable that will hold the pieces in the grid
    height = 0 # number of squares in the height
    width = 0 # number of squares in the width
    x = 100 # actual coordinates for x and y of the game screen
    y = 60
    zoom = 15 # Size of the squares
    snake = None
    food = []

    def __init__(self, height, width):
        self.field = []
        self.height = height
        self.width = width
        for i in range(height):
            newLine = [] # create the new line array
            for j in range(width):
                if i == 0 or j == 0 or i == height-1 or j == width-1:
                    newLine.append(-1)
                else:
                    newLine.append(0)
            self.field.append(newLine)
        self.state = "Start"

        # Create the head of the snake
        snake_head_x = random.randint(1, width-2)
        snake_head_y = random.randint(1, height-2)
        self.snake = SnakeBod(snake_head_x, snake_head_y)
        self.field[snake_head_y][snake_head_x] = 1

        self.length = 1

        # Create the food for the snake
        food_x = random.randint(1, width-2)
        food_y = random.randint(1, height-2)
        self.food = [food_x, food_y]
        self.field[food_y][food_x] = 2

        # Helper method for converting coords to string
    def coords_to_string(self, convert):
        return str(convert[0]) + ", " + str(convert[1])

    # See if the snake is intersecting itself or the borders
    def intersecting(self):
        dictionary_coords = {}
        for i in self.snake.getImage(): # If the snake hits itself or walls return true
            to_add = self.coords_to_string(i)
            # If the snake intersects itself or a border return true
            if to_add in dictionary_coords or i[0] == 0 or i[0] == len(self.field[0]) - 1 or i[1] == 0 or i[1] == len(self.field) - 1:
                return True
            dictionary_coords[to_add] = i
        return False

    # If the snake got to the food
    def grow(self):
        self.length += 5
        self.snake.extra_length += 5
 
        # Make a new spot for the food CAN BE MADE MORE EFFICIENT
        self.food = [random.randint(1, self.width-2), random.randint(1, self.height-2)]

        # Create a dictionary for the snake parts so food can be put outside it
        dictionary_coords = {}
        for i in self.snake.getImage(): # If the snake hits itself or walls return true
            dictionary_coords[self.coords_to_string(i)] = i

        # Change the location of the food bit until not on snake
        while self.coords_to_string(self.food) in dictionary_coords:
            self.food = [random.randint(1, self.width-2), random.randint(1, self.height-2)]
        self.field[self.food[1]][self.food[0]] = 2
    
    def move(self):
        # Box to fill in
        fillIn = []

        # Box that the snake is moving to
        if (self.snake.facing == "North"):
            fillIn = self.snake.move([self.snake.head[0], self.snake.head[1] - 1])
            self.field[self.snake.head[1]][self.snake.head[0]] = 1
        elif (self.snake.facing == "East"):
            fillIn = self.snake.move([self.snake.head[0] + 1, self.snake.head[1]])
            self.field[self.snake.head[1]][self.snake.head[0]] = 1
        elif (self.snake.facing == "South"):
            fillIn = self.snake.move([self.snake.head[0], self.snake.head[1] + 1])
            self.field[self.snake.head[1]][self.snake.head[0]] = 1
        else:
            fillIn = self.snake.move([self.snake.head[0] - 1, self.snake.head[1]])
            self.field[self.snake.head[1]][self.snake.head[0]] = 1
        
        # Make the end of the snake back to the old color if there is not more to add on
        if fillIn != []:
            self.field[fillIn[1]][fillIn[0]] = 0

        if self.intersecting():
            self.state = "Game Over"
        
        # If the food is found grow
        if self.snake.head == self.food:
            self.grow()

    
    
    def change_direction(self, new_direction):
        if self.snake.facing == "North":
            if new_direction == "East" or new_direction == "West" or (new_direction == "South" and self.length == 1):
                self.snake.facing = new_direction
        elif self.snake.facing == "East":
            if new_direction == "North" or new_direction == "South" or (new_direction == "West" and self.length == 1):
                self.snake.facing = new_direction
        elif self.snake.facing == "South":
            if new_direction == "East" or new_direction == "West" or (new_direction == "South" and self.length == 1):
                self.snake.facing = new_direction
        elif self.snake.facing == "West":
            if new_direction == "North" or new_direction == "South" or (new_direction == "East" and self.length == 1):
                self.snake.facing = new_direction
        else:
            self.snake.facing = new_direction
            
    # Pause the game
    def pause(self):
        if (self.state == "Paused"):
            self.state = "Start"
        elif (self.state == "Start"):
            self.state = "Paused"