const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const jokeHistory = [];
const MAX_JOKES_HISTORY = 5;

async function fetchJoke() {
  try {
    const response = await axios.get('https://dad-jokes.p.rapidapi.com/random/joke', {
      headers: {
        'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com',
        'X-RapidAPI-Key': 'ac36004e64msh2f03d5e28e75ab5p1a32bfjsn9dc87404b637', // Replace with your API key
      },
    });

    return response.data.body[0];
  } catch (error) {
    console.error('Error fetching joke:', error.message);
    return null;
  }
}

async function displayJoke() {
  const joke = await fetchJoke();

  if (joke) {
    console.log(chalk.bold(joke.setup));
    console.log(chalk.dim(joke.punchline));
    jokeHistory.push(joke);

    // Remove oldest joke if history exceeds the maximum limit
    if (jokeHistory.length > MAX_JOKES_HISTORY) {
        jokeHistory.shift();
    }
  }
}

function displayMenu() {
  console.log('\nChoose an option:');
  console.log('1. Get a Joke');
  console.log('2. View Joke History');
  console.log('3. Clear Joke History');
  console.log('4. Quit');
}

function displayHistory() {
    console.log(chalk.bold('Joke History:'));
    jokeHistory.forEach((joke, index) => {
      console.log(chalk.dim(`Joke ${index + 1}:`));
      console.log(chalk.bold(joke.setup));
      console.log(chalk.dim(joke.punchline));
    });
}

function clearHistory() {
    jokeHistory.length = 0;
    console.log('Joke history cleared.');
}

async function run() {
  let userChoice = '';

  while (userChoice !== '4') {
    displayMenu();

    userChoice = await new Promise((resolve) => {
      rl.question('Enter your choice: ', (choice) => {
        resolve(choice);
      });
    });

    switch (userChoice) {
      case '1':
        await displayJoke();
        break;
      case '2':
        if (jokeHistory.length === 0) {
            console.log(chalk.yellow('No jokes in history.'));
        } else {
            displayHistory();
        }
        break;
      case '3':
        clearHistory();
        break;  
      case '4':
        console.log(chalk.blue('Goodbye!'));
        break;
      default:
        console.log(chalk.red('Invalid choice. Please choose again.'));
        break;
    }
  }

  rl.close();
}

run();
