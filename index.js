#! /usr/bin/env node
import inquirer from 'inquirer';
// Account class encapsulates the details and operations of a bank account
class Account {
    username;
    password;
    balance;
    transactions = [];
    constructor(username, password, balance) {
        this.username = username;
        this.password = password;
        this.balance = balance;
    }
    // Method to check if the provided password matches the account's password
    checkPassword(password) {
        return this.password === password;
    }
    // Method to perform a transaction (deposit or withdrawal)
    performTransaction(type, amount) {
        if (type === "withdrawal" && amount > this.balance) {
            return "Insufficient funds.";
        }
        if (type === "deposit") {
            this.balance += amount;
        }
        else if (type === "withdrawal") {
            this.balance -= amount;
        }
        this.transactions.push({ type, amount });
        return `${type.charAt(0).toUpperCase() + type.slice(1)} of $${amount} successful.`;
    }
    // Method to get the current balance of the account
    getBalance() {
        return this.balance;
    }
    // Method to get the transaction history of the account
    getTransactionHistory() {
        return this.transactions;
    }
}
// Bank class manages multiple accounts and provides an interface for user interaction
class Bank {
    accounts = [];
    constructor() {
        console.log("Welcome to MyBank Console App!");
    }
    // Method to create a new account
    async createAccount() {
        console.log("\n=== Create a New Account ===");
        const answers = await inquirer.prompt([
            { type: 'input', name: 'username', message: 'Enter username:' },
            { type: 'password', name: 'password', message: 'Enter password:' },
            { type: 'number', name: 'initialBalance', message: 'Enter initial balance:', default: 0 }
        ]);
        const { username, password, initialBalance } = answers;
        const newAccount = new Account(username, password, initialBalance);
        this.accounts.push(newAccount);
        console.log("Account created successfully!");
    }
    // Method to log in to an existing account
    async login() {
        console.log("\n=== Log In ===");
        const answers = await inquirer.prompt([
            { type: 'input', name: 'username', message: 'Enter username:' },
            { type: 'password', name: 'password', message: 'Enter password:' }
        ]);
        const { username, password } = answers;
        const account = this.accounts.find(acc => acc.username === username && acc.checkPassword(password));
        if (!account) {
            console.log("Invalid username or password. Please try again.");
        }
        return account;
    }
    // Method to handle the session of a logged-in user
    async handleAccountSession(account) {
        while (true) {
            const { innerChoice } = await inquirer.prompt({
                type: 'list',
                name: 'innerChoice',
                message: 'Please select an option:',
                choices: ['Deposit', 'Withdraw', 'Check Balance', 'Logout']
            });
            switch (innerChoice) {
                case "Deposit":
                    const { depositAmount } = await inquirer.prompt({
                        type: 'number',
                        name: 'depositAmount',
                        message: 'Enter deposit amount:'
                    });
                    console.log(account.performTransaction('deposit', depositAmount));
                    break;
                case "Withdraw":
                    const { withdrawalAmount } = await inquirer.prompt({
                        type: 'number',
                        name: 'withdrawalAmount',
                        message: 'Enter withdrawal amount:'
                    });
                    console.log(account.performTransaction('withdrawal', withdrawalAmount));
                    break;
                case "Check Balance":
                    console.log(`Current balance: $${account.getBalance()}`);
                    break;
                case "Logout":
                    console.log("Logged out.");
                    return;
                default:
                    console.log("Invalid choice. Please try again.");
            }
        }
    }
    // Main method to run the bank application
    async main() {
        while (true) {
            const { choice } = await inquirer.prompt({
                type: 'list',
                name: 'choice',
                message: 'Please select an option:',
                choices: ['Create Account', 'Log In', 'Exit']
            });
            switch (choice) {
                case "Create Account":
                    await this.createAccount();
                    break;
                case "Log In":
                    const loggedInAccount = await this.login();
                    if (loggedInAccount) {
                        await this.handleAccountSession(loggedInAccount);
                    }
                    break;
                case "Exit":
                    console.log("Thank you for using MyBank Console App!");
                    return;
                default:
                    console.log("Invalid choice. Please try again.");
            }
        }
    }
}
// Create an instance of the Bank class and run the main method to start the application
const bank = new Bank();
bank.main();
