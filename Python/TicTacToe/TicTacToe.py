import pygame
import sys
import time # Used for pausing and the opening

# Make global variables
XO = 'x'
winner = ""
draw = False
width = 400
height = 400
WHITE = (255, 255, 255)
GREY = (10, 10, 10)
RED = (250, 0, 0)
fps = 30

# Actual board for the tic tac toe
Board = [[""]*3, [""]*3, [""]*3]
clock = pygame.time.Clock()

pygame.init()
screen = pygame.display.set_mode((width, height+100), 0, 32)
pygame.display.set_caption("Tic Tac Toe")

# Load in the images
opening = pygame.image.load("tic tac opening.png")
x_image = pygame.image.load("X.png")
o_image = pygame.image.load("O.png")

# Size the images to fit on the board
x_image = pygame.transform.scale(x_image, (80, 80))
o_image = pygame.transform.scale(o_image, (80, 80))
opening = pygame.transform.scale(opening, (width, height+100))
# Do the opening sequence
def game_opening() :
    screen.blit(opening, (0,0))
    pygame.display.update()
    time.sleep(1) # Wait one second and go into the game
    screen.fill(WHITE)

    # Draw the lines
    pygame.draw.line(screen, GREY, (width / 3, 0), (width / 3, height), 7)
    pygame.draw.line(screen, GREY, ((width / 3) * 2, 0), ((width / 3) * 2, height), 7)

    pygame.draw.line(screen, GREY, (0, height / 3), (width, height / 3,), 7)
    pygame.draw.line(screen, GREY, (0, (height / 3) * 2), (width, (height / 3) * 2), 7)
    draw_status()

def draw_status():
    global draw
    message = ""

    if winner == "" :
        message = XO.upper() + "'s Turn"
    else:
        message = winner.upper() + " Won!"
    
    if draw:
        message = "The Game is a Draw!"

    font = pygame.font.Font(None, 30)
    text = font.render(message, 1, (255, 255, 255))

    # Format the screen to display the message
    screen.fill((0,0,0), (0, 400, 500, 100)) # Fill in the bottom of the screen black
    text_to_display = text.get_rect(center=(width/2, 500-50))
    screen.blit(text, text_to_display)
    pygame.display.update()

def check_win() :
    global Board, winner, draw
    # Check the rows
    for i in range(0, 3) :
        # If the rows elements equal eachother and don't equal the empty string
        if (Board[i][0] == Board[i][1] == Board[i][2]) and Board[i][0] != "" :
            winner = Board[i][0]
            pygame.draw.line(screen, RED, (0, (i + 1)*height/3 -height/6),\
                              (width, (i + 1)*height/3 - height/6), 7)
            break

    # Check the columns
    for i in range(0, 3) :
        # If the column elements equal eachother and don't equal the empty string
        if (Board[0][i] == Board[1][i] == Board[2][i]) and Board[0][i] != "" :
            winner = Board[0][i]
            pygame.draw.line(screen, RED, ((i + 1)*width/3 -width/6, 0),\
                              (((i + 1)*width/3 - width/6), height), 7)
            break
    
    # Check the diagonals
    if (Board[0][0] == Board[1][1] == Board[2][2]) and Board[0][0] != "" :
        winner = Board[0][0]
        pygame.draw.line (screen, (250,70,70), (50, 50), (350, 350), 7)

    if (Board[0][2] == Board[1][1] == Board[2][0]) and Board[0][2] != "" :
        winner = Board[0][2]
        pygame.draw.line (screen, (250,70,70), (350, 50), (50, 350), 7)

    # If the Board is full (a tie)
    if(all([all(row) for row in Board]) and winner == ""):
        draw = True
    draw_status()

# Draw the new XO input
def drawXO(row, col) :
    global Board, XO

    posx = (width/3)*(row-1) + 30
    posy = (height/3)*(col-1) + 30
    Board[row-1][col-1] = XO

    # Draw the new position and change the XO
    if(XO == 'x'):
        screen.blit(x_image ,(posy, posx))
        XO= 'o'
    else:
        screen.blit(o_image, (posy, posx))
        XO= 'x'
    pygame.display.update()

def user_click() :
    # Get coords of mouse click
    x, y = pygame.mouse.get_pos()

    # Get column of mouse click (1-3)
    if(x < width / 3):
        col = 1
    elif (x < width / 3 * 2):
        col = 2
    elif(x < width):
        col = 3
    else:
        col = None

    # Get row of mouse click (1-3)
    if(y < height / 3):
        row = 1
    elif (y < height / 3 * 2):
        row = 2
    elif(y < height):
        row = 3
    else:
        row = None

    if row and col and Board[row - 1][col - 1] == "" : 
        global XO

        # Draw x or the o
        drawXO(row, col)
        check_win()

def reset_game() :
    global Board, winner, XO, draw
    time.sleep(3)
    XO = 'x' # X goes first
    draw = False
    game_opening()
    winner = ""
    Board = [[""]*3, [""]*3, [""]*3]



# Run the game
game_opening()

# Run the game forever
while(True) :
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.MOUSEBUTTONDOWN:
            # the user clicked; place an X or O
            user_click()
            if(winner or draw):
                reset_game()
    pygame.display.update()
    clock.tick(fps)
