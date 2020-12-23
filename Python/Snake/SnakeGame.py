from SnakeBoard import SnakeBoard
import pygame

pygame.init()

# Define colors for the UI
BLACK = (0, 0, 0)
GREY = (128, 128, 128)
WHITE = (255, 255, 255)
BLUE = (1, 30, 254)
ORANGE = (255, 165, 0)
RED = (255, 0, 0)
GREEN = (11, 255, 11)

size = (1200, 800)
screen = pygame.display.set_mode(size)

pygame.display.set_caption("Snake")

# Loop until the user hits the close button
done = False
clock = pygame.time.Clock()
fps = 20
game = SnakeBoard(40, 60)
counter = 0


while not done:
    # Increase the counter
    counter += 1

    # Reset the counter so it doesn't overflow
    if counter > 100000:
        counter = 0

    # If it is time to update the screen update it
    if game.snake.facing != "" and game.state == "Start":
        game.move()
    
    # For every key being pressed do something
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                game.change_direction("North")
            elif event.key == pygame.K_DOWN:
                game.change_direction("South")
            elif event.key == pygame.K_LEFT:
                game.change_direction("West")
            elif event.key == pygame.K_RIGHT:
                game.change_direction("East")
            elif event.key == pygame.K_p:
                game.pause()
            elif event.key == pygame.K_ESCAPE: # Restart
                game.__init__(40, 60)

    # Set up the look of the screen
    screen.fill(WHITE)

    for i in range(0, game.height):
        for j in range(0, game.width):
            pygame.draw.rect(screen, BLUE, [game.x + game.zoom * j, game.y + game.zoom * i, game.zoom, game.zoom])
            if game.field[i][j] == 1:
                pygame.draw.rect(screen, ORANGE, [game.x + game.zoom * j + 1, game.y + game.zoom * i + 1, game.zoom-2, game.zoom-2])
            elif game.field[i][j] == 2:
                pygame.draw.rect(screen, GREEN, [game.x + game.zoom * j + 1, game.y + game.zoom * i + 1, game.zoom-2, game.zoom-2])
            elif game.field[i][j] == -1:
                pygame.draw.rect(screen, RED, [game.x + game.zoom * j, game.y + game.zoom * i, game.zoom, game.zoom])


            
    
    font = pygame.font.SysFont('Calibri', 25, True, False)
    font1 = pygame.font.SysFont('Calibri', 65, True, False)
    font2 = pygame.font.SysFont('Calibri', 15, True, False)
    textScore = font.render("Score: " + str(game.length), True, BLACK)
    textGameOver = font1.render("Game Over", True, (255, 125, 0))
    textGameOver1 = font.render("Press ESC", True, (255, 215, 0))
    textPause = font1.render("Paused", True, BLACK)
    textPause1 = font.render("Press p to resume", True, GREY)

    screen.blit(textScore, [10, 0])


    if game.state == "Game Over":
        screen.blit(textGameOver, [20, 200])
        screen.blit(textGameOver1, [25, 265])

    if game.state == "Paused":
        screen.blit(textPause, [20, 200])
        screen.blit(textPause1, [25, 265])

    pygame.display.flip()
    clock.tick(fps)

pygame.quit()
