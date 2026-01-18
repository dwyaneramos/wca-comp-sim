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

## Keyboard Shortcuts

| Key   | Action    |
|--------------- | --------------- |
| Enter   | Either enters the selected cuber or your time   |
| Space | Starts/Stops the inspection timer in the game page |
|↑ ↓| Navigate the search results|

## Additional Notes

- FMC and MBLD have yet to be properly implemented
- You must click on the search result (or Enter) to add a particular cuber.
- You can search for a cuber by entering in their name or their WCA ID.
- The module used to generate scrambles (Cubing JS) uses D, B and L moves in 2x2. However, all scrambles are random-state except for big cubes and megaminx.
- Not possible to use the inspection timer feature on tablets/phones

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
- [ ] Use keypresses to make entering cubers more convenient
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

### Stats Page

- [X] Show how many rounds a user has competed in
- [X] Graph user's recent times
- [X] Be able to view stats for different events
- [X] Graph times should be in 2dp
- [ ] Show mo10ao5
- [X] Show best averages
- [X] Show best times
- [X] Make it look nice
- [X] Change colours for 4th/5th results
- [X] Be able to reset results
- [X] Show dates of times
