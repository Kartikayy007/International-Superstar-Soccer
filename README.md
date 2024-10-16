# International Superstar Soccer

## Overview

International Superstar Soccer is an exciting football (soccer) game built with HTML5 Canvas, CSS, and vanilla JavaScript. This game recreates the classic arcade-style football experience, featuring a match between Brazil and Argentina.

## Features

- Real-time gameplay with smooth animations
- Player movement and ball control
- AI-controlled opponent team
- Passing and shooting mechanics
- Goal detection and scoring system
- Timer and scoreboard
- Responsive canvas that adapts to the window size
- Background music and sound effects

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- HTML5 Canvas for rendering
- Web Audio API for sound

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/international-superstar-soccer.git
   ```

2. Navigate to the project directory:
   ```
   cd international-superstar-soccer
   ```

3. Open the `index.html` file in a modern web browser.

Note: Due to browser security restrictions, you may need to run the game through a local server to properly load assets and audio. You can use tools like `live-server` or Python's `http.server` for this purpose.

## How to Play

- Use the W, A, S, D keys to move the player you control.
- Press the Spacebar to pass the ball to a nearby teammate.
- The game automatically switches control to the player with the ball on your team.
- Try to score goals by getting close to the opponent's goal and kicking the ball.
- The game lasts for 10 minutes. The team with the most goals at the end wins!

## Project Structure

- `index.html`: The main HTML file that sets up the game canvas and loads necessary assets.
- `CSS/styles.css`: Contains all the styling for the game.
- `JS/Game.js`: The main game logic, including the game loop and rendering.
- `JS/Classes/Player.js`: Defines the Player class with movement and animation logic.
- `JS/Classes/inputHandling.js`: Handles user input for controlling players.
- `assets/`: Contains all image and audio assets used in the game.

## Future Improvements

- Add a start screen and game over screen
- Implement more advanced AI for the opponent team
- Add more teams and player customization options
- Introduce power-ups and special moves
- Create a multiplayer mode

## Contributing

Contributions to improve International Superstar Soccer are welcome! Please feel free to submit a Pull Request.

## Credits

- Game concept inspired by classic football arcade games
- Sprite assets created by https://www.deviantart.com

## Contact

For any queries or suggestions, please open an issue on this repository or contact [Your Name] at [your.email@example.com].

Enjoy the game!
