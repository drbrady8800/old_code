from Tetris import Tetris
import sys
import pygame

# Colors of pieces
colors = [
    (0, 0, 0), # Black, won't be used
    (254, 0, 0), # Red
    (253, 254, 2), # Yellow
    (11, 255, 11), # Green
    (1, 30, 254), # Dark Blue
    (254, 0, 246), # Magenta
    (255, 165, 0), # Orange
    (0, 255, 255), # Cyan
]

pygame.init()

# Define colors for the UI
BLACK = (0, 0, 0)
GREY = (128, 128, 128)
WHITE = (255, 255, 255)

size = (650, 750)
screen = pygame.display.set_mode(size)

pygame.display.set_caption("Tetris")

# Loop until the user hits the close button
done = False
clock = pygame.time.Clock()
fps = 25
game = Tetris(20, 10)
counter = 0

pressingDown = False

while not done:
    # Start the game
    if game.figure == None:
        game.newFigure()
    counter += 1

    # Reset the counter so it doesn't overflow
    if counter > 100000:
        counter = 0

    # If it is time to update the screen update it
    if counter % (fps // (game.level / 2) // 2) == 0 or pressingDown:
        if game.state == "Start":
            game.goDown()
    
    # For every key being pressed do something
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                game.rotate()
            elif event.key == pygame.K_DOWN:
                pressingDown = True
            elif event.key == pygame.K_LEFT:
                game.goSide(-1)
            elif event.key == pygame.K_RIGHT:
                game.goSide(1)
            elif event.key == pygame.K_SPACE:
                if game.state == "Start":
                    game.goSpace()
            elif event.key == pygame.K_p:
                game.pause()
            elif event.key == pygame.K_ESCAPE: # Restart
                game.__init__(20, 10)
                
    
        if event.type == pygame.KEYUP:
            if event.key == pygame.K_DOWN:
                pressingDown = False
    

    # Set up the look of the screen
    screen.fill(WHITE)

    for i in range(game.height):
        for j in range(game.width):
            pygame.draw.rect(screen, GREY, [game.x + game.zoom * j, game.y + game.zoom * i, game.zoom, game.zoom], 1)
            if game.field[i][j] > 0:
                pygame.draw.rect(screen, colors[game.field[i][j]], [game.x + game.zoom * j + 1, game.y + game.zoom * i + 1, game.zoom-2, game.zoom-2])

    # Set up the nextFigure box
    pygame.draw.rect(screen, GREY, [game.x + game.zoom*(game.width+2), game.y + game.zoom, game.zoom*5, game.zoom*6], 3)
    if game.nextFigure != None:
        for i in game.nextFigure.getImage():
                pygame.draw.rect(screen, colors[game.nextFigure.color], [game.x + game.zoom*(game.width+3) + game.zoom*(i%4), game.y + 2*game.zoom + game.zoom*(i//4), game.zoom, game.zoom])
                # Outline
                pygame.draw.rect(screen, GREY, [game.x + game.zoom*(game.width+3) + game.zoom*(i%4), game.y + 2*game.zoom + game.zoom*(i//4), game.zoom, game.zoom], 1)

            
    # Color in the shape
    if game.figure is not None:
        for i in range(4): 
            for j in range(4):
                p = i * 4 + j
                if p in game.figure.getImage():
                     pygame.draw.rect(screen, colors[game.figure.color], 
                     [game.x + game.zoom * (j + game.figure.x) + 1,
                     game.y + game.zoom * (i + game.figure.y) + 1, game.zoom-2, game.zoom-2])
    
    font = pygame.font.SysFont('Calibri', 25, True, False)
    font1 = pygame.font.SysFont('Calibri', 65, True, False)
    font2 = pygame.font.SysFont('Calibri', 15, True, False)
    textScore = font.render("Score: " + str(game.score), True, BLACK)
    textLines = font2.render("Lines: " + str(game.lines), True, BLACK)
    textLevel = font2.render("Level: " + str(game.level), True, BLACK)
    textGameOver = font1.render("Game Over", True, (255, 125, 0))
    textGameOver1 = font.render("Press ESC", True, (255, 215, 0))
    textPause = font1.render("Paused", True, BLACK)
    textPause1 = font.render("Press p to resume", True, GREY)
    textNext = font.render("Next:", True, BLACK)

    screen.blit(textScore, [10, 0])
    screen.blit(textLines, [10, 25])
    screen.blit(textLevel, [10, 40])
    screen.blit(textNext, [game.x + game.zoom*(game.width+2), game.y])


    if game.state == "Game Over":
        screen.blit(textGameOver, [20, 200])
        screen.blit(textGameOver1, [25, 265])

    if game.state == "Paused":
        screen.blit(textPause, [20, 200])
        screen.blit(textPause1, [25, 265])

    pygame.display.flip()
    clock.tick(fps)

pygame.quit()
sys.exit()
