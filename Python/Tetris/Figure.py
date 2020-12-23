import random

class Figure:

    # Initial x and y
    x = 0
    y = 0

    figures = [
        [[1, 5, 9, 13], [4, 5, 6, 7]], # Line 
        [[1, 4, 5, 6], [1, 5, 6, 9], [4, 5, 6, 9], [1, 4, 5, 9]], # T-piece
        [[1, 2, 5, 9], [4, 5, 6, 10], [1, 5, 8, 9], [0, 4, 5, 6]], # L-piece
        [[1, 2, 6, 10], [3, 5, 6, 7], [2, 6, 10, 11], [5, 6, 7, 9]], # backwards L-piece
        [[1, 2, 4, 5], [1, 5, 6, 10]], # backwards Z-piece
        [[0, 1, 5, 6], [1, 4, 5, 8]], # Z-piece
        [[1, 2, 5, 6]] # Square
    ]

    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.type = random.randint(0, len(self.figures) - 1) # Choose a random type of figure, the color will be the same number
        self.color = self.type + 1
        self.rotation = 0

    def getImage(self):
        return self.figures[self.type][self.rotation]

    def rotate(self):
        self.rotation = (self.rotation + 1) % len(self.figures[self.type])

    