class SnakeBod:

    x = 0
    y = 0
    facing = ""
    extra_length = 0

    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.facing = ""
        self.body = [[x, y]]
        self.head = [x, y]
        self.extra_length = 0

    def getImage(self):
        return self.body

    def move(self, nextBox):
        toReturn = []
        # Make the front of the snake the new box
        self.head = nextBox

        # If there is extra lenght, append to the array
        if (self.extra_length > 0) :
            self.extra_length -= 1
            self.body.append(nextBox)
        else: # Else move the snake forward one
            # Move all the snake boxes back one (head is the end of the array)
            toReturn = self.body[0]
            for i in range(0, len(self.body)-1):
                self.body[i] = self.body[i+1]
            # Make the new head in the array
            self.body[len(self.body) - 1] = nextBox

        # Return the box that needs to be filled in
        return toReturn