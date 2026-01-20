# WCA Competition Simulator (Website Ver.)

Kia Ora guys! I actually made this [project](https://github.com/dwyaneramos/cubing-comp-round-sim) before, but decided to make a website in order to learn React/JavaScript while also making it more accessible to more people and devices.

## How to run this on your computer?

### Website

[Live Server Link](https://dwyaneramos.github.io/wca-comp-sim/)

### Running it locally

1. Clone this repository
2. Run `npm install` on the same directory as this repository folder to install the necessary dependencies
3. In the same directory, run `npm run dev` to locally run the app.
4. Enjoy!

## How to use the website?

1. Enter in the WCA IDs or names of the cubers you wish to "compete against"
2. Click start
3. A scramble should appear, enter in the time and you will see the results of others (or not depending on your chosen settings)
4. Finish the average, and you will be ranked against other people and your results will be saved.

## Keyboard Shortcuts

| Key   | Action    |
|--------------- | --------------- |
| Enter   | Either enters the selected cuber or your time   |
| Space | Starts/Stops the inspection timer in the game page |
|↑ ↓| Navigate the search results|

## Additional Notes

- FMC and MBLD have yet to be properly implemented
- You must click on the search result (or Enter) to add a particular cuber.
- A cubers' times is simulated using their 50 most recent solves (they must have at least 5 successes to be simulated)
- There is a JS script to fetch the WCA IDs/Names of all cubers in the WCA DB on which the program uses that for its search functionality. This script is currently run and its results are uploaded manually, so there might be some very new cubers on whom the program won't be able to recognise. This task is to be automated in the future.
- The module used to generate scrambles (Cubing JS) uses D, B and L moves in 2x2. However, all scrambles are random-state except for big cubes and megaminx.
- There is no confirm popup for resetting your stats (press it wisely)

## Tech Stack / Dependencices

- React / JavaScript
- TailwindCSS
- React Icons
- ChartJS
- Cubing JS Module

## Acknowledgements

This app relies on the WCA Rest API made by Robin Ingelbrecht for simulating players' times

## To-Do List (can be ignored)

### Starting Page

- [X] Start the competition
- [X] Do cuber validation (a cuber can't be simulated in an event they haven't competed in)
- [x] Ensure people can't enter the same cuber twice
- [X] Use keypresses to make entering cubers more convenient
- [X] Search with WCA IDs

### Game Page

- [X] Simulate a person's times
- [X] Take in user input
- [X] Rank cubers based on time
- [X] Calculate and display WPA/BPA
- [X] Generate a scramble and display it
- [X] Edit times
- [X] Toggle visibility of other cubers' times
- [X] Polish formatting
- [X] Display times properly in MM:SS:ms format
- [X] Be able to enter times in MM:SS:ms format
- [X] Edit times in MM:SS:ms format
- [X] make sure you can't enter a really big time
- [X] save stats when clicking home (not just when rematching)
- [X] Scale  std.dev for different events
- [X] Implement inspection timer
- [X] Implement Mo3
- [ ] Calculate StdDev properly instead of it depending on cuber's recent mean of solves

### Stats Page

- [X] Show how many rounds a user has competed in
- [X] Graph user's recent times
- [X] Be able to view stats for different events
- [X] Graph times should be in 2dp
- [X] Show mo10ao5
- [X] Show best averages
- [X] Show best times
- [X] Make it look nice
- [X] Change colours for 4th/5th results
- [X] Be able to reset results
- [X] Show dates of times
- [ ] Have a confirm popup for resetting times
