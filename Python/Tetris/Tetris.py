from Figure import Figure

class Tetris:
    level = 1
    score = 0
    lines = 0
    state = "Start"
    field = [] # variable that will hold the pieces in the grid
    height = 0 # number of squares in the height
    width = 0 # number of squares in the width
    x = 100 # actual coordinates for x and y of the game screen
    y = 60
    zoom = 30
    figure = None
    nextFigure = None

    def __init__(self, height, width):
        self.field = []
        self.height = height
        self.width = width
        for i in range(height):
            newLine = [] # create the new line array
            for j in range(width):
                newLine.append(0)
            self.field.append(newLine)
        self.state = "Start"
        self.figure = None
        self.level = 1
        self.lines = 0
        self.score = 0
        self.nextFigure = None

    def newFigure(self):
        if self.nextFigure == None:
            self.figure = Figure((self.width // 2) - 2, 0)
        else:
            self.figure = self.nextFigure

        self.nextFigure = Figure((self.width // 2) - 2, 0) # add a new figure to the game in the middle top

    # See if the figure is intersecting any unmoving pieces in the field
    def intersecting(self):
        toReturn = False
        for index in self.figure.getImage(): # If the figure hits the bottom, its the sides, 
            # or the particular index filled in return an intersection of true 
            if (index // 4) + self.figure.y > self.height - 1 \
                or (index % 4) + self.figure.x > self.width - 1 \
                or (index % 4) + self.figure.x < 0 \
                or self.field[(index // 4) + self.figure.y][(index % 4) + self.figure.x] > 0:
                toReturn = True
        return toReturn

    # If there is an intersection freeze the figure
    def freeze(self):
        for index in self.figure.getImage():
            self.field[(index // 4) + self.figure.y][(index % 4) + self.figure.x] = self.figure.color
        self.breakLines() # function to see if a full line is completed
        self.newFigure() # get a new figure
        if self.intersecting():
            self.state = "Game Over"
    
    def breakLines(self):
        newScore = 0
        linesInARow = 0
        for i in range(1, self.height):
            for j in range(self.width):
                if self.field[i][j] == 0:
                    fullLine = False
                    linesInARow = 0
                    break
                if j == self.width - 1: # Reached end of line and it is full
                    linesInARow += 1
                    # Find out how much to add to the score
                    if linesInARow == 1:
                        newScore += 100*self.level
                        self.lines += 1
                    elif linesInARow == 2 or linesInARow == 3:
                        newScore += 200*self.level
                        self.lines += 1
                    else:
                        newScore += 300*self.level
                        self.lines += 1
                    
                    # Actually reset the line
                    for k in range(i, 1, -1):
                        for l in range(self.width):
                            self.field[k][l] = self.field[k-1][l]

            # Check if 4 lines have been broken (max you can)
            if newScore == 800:
                break
            
        # Check if we go to the next level
        if self.lines / self.level >= 10:
            self.level += 1

        self.score += newScore

    def goSpace(self):
        # Move down while not running into anything
        while not self.intersecting():
            self.figure.y += 1
        # Move the piece into its correct spot
        self.figure.y -= 1
        self.freeze()

    def goDown(self):
        self.figure.y += 1
        if self.intersecting():
            self.figure.y -= 1
            self.freeze()

    def goSide(self, dx):
        self.figure.x += dx
        if self.intersecting():
            self.figure.x -= dx

    def rotate(self):
        oldRotate = self.figure.rotation
        self.figure.rotate()
        if self.intersecting():
            self.figure.rotation = oldRotate
    
    def pause(self):
        if (self.state == "Paused"):
            self.state = "Start"
        elif (self.state == "Start"):
            self.state = "Paused"