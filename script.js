'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Subareesh Krishnan',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-07-20T17:01:17.194Z',
    '2021-07-21T23:36:17.929Z',
    '2021-07-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jeran Joel',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Jessica Davis',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
};

const account4 = {
  owner: 'Thomas Edison',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUsenames = accs => {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsenames(accounts);

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCurrency = function (value, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? [...acc.movements].sort((a, b) => a - b) : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);
    const html = `<div class="movements__row">
                  <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                  <div class="movements__date">${displayDate}</div>
                  <div class="movements__value">${formattedMov}</div>
                  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // Print remaining time
    labelTimer.textContent = `${min}:${sec}`;

    // When 0, stop the time and logout
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease time
    time--;
  };

  // Set time to 5min
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const calcPrintBalance = function (account) {
  const balance = account.movements.reduce((acc, curr) => acc + curr);
  labelBalance.textContent = `${formatCurrency(
    balance,
    account.locale,
    account.currency
  )}`;
};

const calcDisplaySummary = function (account, interestRate) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCurrency(
    income,
    account.locale,
    account.currency
  )}`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = `${formatCurrency(
    out,
    account.locale,
    account.currency
  )}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (interestRate / 100))
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${formatCurrency(
    interest,
    account.locale,
    account.currency
  )} €`;
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcPrintBalance(acc);
  // Display summary
  calcDisplaySummary(acc, acc.interestRate);
};

// Event Handler

let currentAccount, timer;
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // ? - Optional Chaining.
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    // Display all
    containerApp.style.opacity = 100;
    // Create Current Date with API - Internationalization

    const now = new Date();
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    // Clear fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

// Tansfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  var totalAmount = currentAccount.movements.reduce(
    (acc, curr) => acc + curr,
    0
  );
  if (inputTransferAmount.value <= totalAmount) {
    var transferTo = accounts.find(
      acc => acc.username === inputTransferTo.value
    );
    if (
      accounts.find(acc => acc.username === inputTransferTo.value) &&
      inputTransferTo.value !== currentAccount.username
    ) {
      var amount = +inputTransferAmount.value;
      currentAccount.movements.push(-amount);
      transferTo.movements.push(amount);
      // Date
      currentAccount.movementsDates.push(new Date().toISOString());
      transferTo.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogoutTimer();
      inputTransferAmount.value = '';
      inputTransferTo.value = '';
      inputTransferTo.blur();
    }
  }
});

// Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      // Dates
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
    inputLoanAmount.value = '';
  }
});

// Account Close
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    var accoundIdx = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(accoundIdx, 1);
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// ////////////////// Map method/////////////////////
// const euroToUsd = 1.1;
// const movementsUSD = movements.map(mov => mov * euroToUsd);
// const movementsDesc = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// ////////////////// Filter method/////////////////////
// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);

// ////////////////// Reduce method/////////////////////
// // const balance = movements.reduce(function (accumulator, curr, i, arr) {
// //   return accumulator + curr;
// // }, 0); // 0 for initializing value for the Accumulator.

// const balance = movements.reduce((accumulator, curr) => accumulator + curr);
// const max = movements.reduce(
//   (acc, cur) => (acc > cur ? acc : cur),
//   movements[0]
// ); // Findiang the maximum in the array

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   console.log(humanAge);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// // console.log(balance);
// // console.log(deposits);
// // console.log(withdrawals);
// // console.log(accounts);
// // console.log(movementsDesc);
// // console.log(movementsUSD);
// // console.log(max);

// // Flat
// let arr = [1, [2, 4, [2, 3]], 5, 6, 7, [8, 5, 4]];
// console.log(arr.flat(2));

// let total = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, curr) => acc + curr, 0);
// console.log(total);

// // Flatmap

// let total1 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(total1);

// Sorting Array

// const arr = ['Subhi', 'Santo', 'Naina'];
// console.log(arr.sort()); // Sorting a string array
// const numArray = [-1, -6, 2, -3, 9, 1, 3, 5];
// console.log(numArray.sort()); // Sorting doesn't work on numbers!

// // Solution
// console.log(
//   numArray.sort((a, b) => {
//     if (a > b) return 1; // a and b are two consecutive numbers in the array.
//     if (a < b) return -1;
//   }) // Ascending
// );

// console.log(
//   numArray.sort((a, b) => {
//     if (a < b) return 1; // a and b are two consecutive numbers in the array.
//     if (a > b) return -1;
//   }) // Descending
// );

// // Simple math solution.
// console.log(numArray.sort((a, b) => a - b)); // Ascending
// console.log(numArray.sort((a, b) => b - a)); // descending

// // Filling the arrays
// const arr = new Array(41); // Creates an array with 41 empty values.
// console.log(arr);
// // Fill method
// arr.fill(23); // Fill the array with 41 '23s'.
// console.log(arr);

// arr.fill(1, 0, 5); // Fill the first 5 elements with 1s.
// console.log(arr);

// // Array.from method
// const ar = Array.from({ length: 23 }, () => 5); // Creates an array with 23 5s.
// console.log(ar);
// const a = Array.from({ length: 7 }, (_, i) => i + 1); // Array with 1 to 7.
// console.log(a);
// const ran = Array.from({ length: 100 }, () =>
//   Math.trunc(Math.random() * 6 + 1)
// );
// console.log(ran);

// const arr = [1, 2, 3, 4, 5];
// arr.forEach(c => console.log(c + 1));

// const d = new Date();

// d.setFullYear(2021);
// d.setMonth(0);
// d.setDate(31);
// d.setHours(12);
// console.log(d);

// Working with Time
// const friends = [
//   'Sandy',
//   'Subhi',
//   'Naina',
//   'Hakeem',
//   'Naren',
//   'Parthi',
//   'Tiwary',
// ];
// const rand = Math.trunc(Math.random() * 7);
// const rand1 = Math.trunc(Math.random() * 7);
// while (rand === rand1) {
//   rand1 = Math.random() * 7 + 1;
// }
// console.log(rand);
// console.log(rand1);

// const timer = setTimeout(
//   (name1, name2) => console.log(`${name1} and ${name2} are friends!`),
//   2000,
//   friends[rand],
//   friends[rand1]
// );
