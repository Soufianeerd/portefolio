import asyncio
import random
from js import document, window, console
from pyodide.ffi import create_proxy

# Configuration
CANVAS_SIZE = 500
GRID_SIZE = 20
TILE_COUNT = CANVAS_SIZE // GRID_SIZE
SPEED = 0.10

# Colors
COLOR_BG = "#111"
COLOR_SNAKE = "#39ff14"
COLOR_FOOD = "#ff00ff"

class SnakeGame:
    def __init__(self):
        try:
            self.canvas = document.getElementById("gameCanvas")
            self.ctx = self.canvas.getContext("2d")
            self.score_el = document.getElementById("score")
            self.start_overlay = document.getElementById("start-overlay")
            
            # Initial Draw (Black screen)
            self.ctx.fillStyle = COLOR_BG
            self.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
            
            self.running = False
            self.game_over = False
            self.snake = []
            self.food = None
            self.velocity = (0, 0)
            self.score = 0
            
            # Bind Start Button
            self.start_proxy = create_proxy(self.start_game)
            start_btn = document.getElementById("start-btn")
            if start_btn:
                start_btn.addEventListener("click", self.start_proxy)

            # Bind controls (global)
            self.key_handler_proxy = create_proxy(self.handle_keydown)
            window.addEventListener("keydown", self.key_handler_proxy)
            
            # Hide loading screen when Python is ready
            loading = document.getElementById("loading")
            if loading:
                loading.style.display = "none"
            
            console.log("Snake Game Initialized Successfully")
            
        except Exception as e:
            console.error(f"Error init: {e}")
            print(f"Error init: {e}")

    def start_game(self, event):
        if self.start_overlay:
            self.start_overlay.style.display = "none"
        self.reset()
        if not self.running:
            self.running = True
            asyncio.ensure_future(self.game_loop())

    def reset(self):
        self.snake = [(10, 10), (10, 11), (10, 12)] # Head is first
        self.velocity = (0, -1) # Moving Up
        self.food = self.spawn_food()
        self.score = 0
        self.game_over = False
        self.update_score()

    def spawn_food(self):
        while True:
            x = random.randint(0, TILE_COUNT - 1)
            y = random.randint(0, TILE_COUNT - 1)
            if (x, y) not in self.snake:
                return (x, y)

    def handle_keydown(self, event):
        try:
            key = event.code
            
            # Prevent scrolling with arrows
            if key in ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]:
                event.preventDefault()

            # Restart
            if self.game_over and key == "Space":
                self.reset()
                return

            # Directions (prevent 180 turns)
            vx, vy = self.velocity
            
            if key == "ArrowUp" and vy != 1:
                self.velocity = (0, -1)
            elif key == "ArrowDown" and vy != -1:
                self.velocity = (0, 1)
            elif key == "ArrowLeft" and vx != 1:
                self.velocity = (-1, 0)
            elif key == "ArrowRight" and vx != -1:
                self.velocity = (1, 0)
        except Exception as e:
            console.error(f"Input error: {e}")

    def update(self):
        if self.game_over:
            return

        # Move Head
        head_x, head_y = self.snake[0]
        vx, vy = self.velocity
        
        new_head = (head_x + vx, head_y + vy)
        
        # Check Collisions (Walls)
        if (new_head[0] < 0 or new_head[0] >= TILE_COUNT or 
            new_head[1] < 0 or new_head[1] >= TILE_COUNT):
            self.game_over = True
            return

        # Check Self Collision
        if new_head in self.snake:
            self.game_over = True
            return

        self.snake.insert(0, new_head)

        # Check Food
        if new_head == self.food:
            self.score += 10
            self.update_score()
            self.food = self.spawn_food()
        else:
            self.snake.pop() # Remove tail

    def draw(self):
        # Clear
        self.ctx.fillStyle = COLOR_BG
        self.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

        # Draw Food
        if self.food:
            self.ctx.fillStyle = COLOR_FOOD
            self.ctx.shadowBlur = 15
            self.ctx.shadowColor = COLOR_FOOD
            fx, fy = self.food
            self.ctx.fillRect(fx * GRID_SIZE, fy * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)

        # Draw Snake
        self.ctx.fillStyle = COLOR_SNAKE
        self.ctx.shadowBlur = 10
        self.ctx.shadowColor = COLOR_SNAKE
        
        for i, (x, y) in enumerate(self.snake):
            # Head glow is stronger
            if i == 0:
                self.ctx.shadowBlur = 20
            else:
                 self.ctx.shadowBlur = 0
            
            self.ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)

        # Game Over Text
        if self.game_over:
            self.ctx.fillStyle = "white"
            self.ctx.font = "40px 'Source Code Pro'"
            self.ctx.textAlign = "center"
            self.ctx.shadowBlur = 0
            self.ctx.fillText("GAME OVER", CANVAS_SIZE // 2, CANVAS_SIZE // 2)
            self.ctx.font = "20px 'Source Code Pro'"
            self.ctx.fillText("Press SPACE to Restart", CANVAS_SIZE // 2, CANVAS_SIZE // 2 + 40)

    def update_score(self):
        self.score_el.innerText = str(self.score)

    async def game_loop(self):
        while True:
            if not self.game_over:
                self.update()
            self.draw()
            await asyncio.sleep(SPEED)

# Start Game Instance
try:
    game = SnakeGame()
except Exception as e:
    console.error(f"Global error: {e}")
    print(f"Global error: {e}")
