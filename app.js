// Class to manage the state of the calculator
class State {
    /** 
     * Constructor to initialize the state
     * @param {boolean} err - boolean to track if there is an error
     * @param {string} previousPress - stores the last pressed button type
     * @param {Array} history - array to store calculation history
     */
    constructor(err = false, previousPress = '', history = []) {
        this.err = err; // boolean to track if there is an error
        this.history = history; // array to store calculation history
        this.previousPress = previousPress; // stores the last pressed button type
    }

    /**
     * Method to get the x value of the previous calculation
     * @returns {number} - x value of the previous calculation or 0 if no history
     */
    getPreviousX() {
        return this.history.length === 0 ? 0 : this.history[this.history.length - 1].x;
    }

    /**
     * Method to get the y value of the previous calculation
     * @returns {number} - y value of the previous calculation or 0 if no history
     */
    getPreviousY() {
        return this.history.length === 0 ? 0 : this.history[this.history.length - 1].y;
    }

    /**
     * Method to get the operator of the previous calculation
     * @returns {string} - operator of the previous calculation or empty string if no history
     */
    getPreviousOp() {
        return this.history.length === 0 ? '' : this.history[this.history.length - 1].op;
    }

    /**
     * Method to get the result of the previous calculation
     * @returns {number} - result of the previous calculation or 0 if no history
     */
    getPreviousOutput() {
        return this.history.length === 0 ? 0 : this.history[this.history.length - 1].result;
    }

    /**
     * Method to add a new calculation to the history
     * @param {Object} calcObj - object containing x, op, y, and result of a calculation
     */
    addToHistory(calcObj) {
        // Create a new Calculation object and add it to the history array
        this.history.push(new Calculation(calcObj.x, calcObj.op, calcObj.y, calcObj.result));
        console.log(this.history);
    }
}

// Class to create a calculation object
class Calculation {
    /**
     * Constructor to initialize a calculation
     * @param {number} x - first operand
     * @param {string} op - operator
     * @param {number} y - second operand
     * @param {number|null} result - result of the calculation
     */
    constructor(x = 0, op = '', y = 0, result = null) {
        this.x = x; // first operand
        this.op = op; // operator
        this.y = y; // second operand
        this.result = result; // result of the calculation
    }

    /**
     * Method to perform the calculation based on the operator
     * @returns {number} - result of the calculation
     * @throws {Error} - if the operator is unknown
     */
    calculate() {
        switch (this.op) {
            case '+': return this.add();
            case '-': return this.sub();
            case '*': return this.mul();
            case '/': return this.div();
            default: throw new Error("Unknown operator");
        }
    }

    /**
     * Method to perform addition
     * @returns {number} - sum of x and y
     */
    add() {
        this.result = this.x + this.y;
        return this.result;
    }

    /**
     * Method to perform subtraction
     * @returns {number} - difference of x and y
     */
    sub() {
        this.result = this.x - this.y;
        return this.result;
    }

    /**
     * Method to perform multiplication
     * @returns {number} - product of x and y
     */
    mul() {
        this.result = this.x * this.y;
        return this.result;
    }

    /**
     * Method to perform division
     * @returns {number} - quotient of x and y
     * @throws {Error} - if division by zero occurs
     */
    div() {
        if (this.y === 0) {
            throw new Error("Division by zero");
        }

        // If both operands are integers, perform normal division
        if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
            this.result = this.x / this.y;
        } else {
            // Use precise division for floating-point numbers
            this.result = this.preciseDivide(this.x, this.y, 10);
        }

        return this.result;
    }

    /**
     * The preciseDivide function is designed to handle division operations with higher precision,
     * mitigating the common issue of floating-point arithmetic errors.
     * It scales the numbers to integers before performing the division to avoid precision loss.
     * 
     * @param {number} a - The numerator (the number to be divided).
     * @param {number} b - The denominator (the number by which the numerator is to be divided).
     * @param {number} precision - The number of decimal places to be used for scaling the numbers to integers.
     * @returns {number} - Result of the division with higher precision
     */
    preciseDivide(a, b, precision) {
        const factor = Math.pow(10, precision); // Scaling factor based on precision
        const scaledA = Math.round(a * factor); // Scale and round the numerator
        const scaledB = Math.round(b * factor); // Scale and round the denominator
        const answer = scaledA / scaledB; // Perform division on scaled values
        return answer; // Return the precise result
    }

    /**
     * Method to set the x value
     * @param {number} number - value to set as x
     * @returns {number} - updated x value
     */
    setX(number) {
        this.x = number;
        return this.x;
    }

    /**
     * Method to set the y value
     * @param {number} number - value to set as y
     * @returns {number} - updated y value
     */
    setY(number) {
        this.y = number;
        return this.y;
    }

    /**
     * Method to set either x or y value based on the operator
     * @param {number} number - value to set as x or y
     */
    setNumber(number) {
        this.op ? this.setY(number) : this.setX(number);
    }

    /**
     * Method to set the operator
     * @param {string} operator - operator to set
     * @returns {string} - updated operator
     */
    setOperator(operator) {
        this.op = operator;
        return this.op;
    }

    /**
     * Method to check if the calculation is ready to be performed
     * @returns {boolean} - true if x, y, and op are set, false otherwise
     */
    isCalcReady() {
        if (this.x && this.y && this.op) return true;
        return false;
    }
}

// CalculatorController function to manage the calculator's operations and UI
// This function is a closure that encapsulates the calculator state and logic
const CalculatorController = () => {
    let state = new State(); // Initialize state
    let currentCalculation = new Calculation(); // Initialize current calculation object
    let userInput = [0]; // Array to store user input
    const display = document.querySelector(".display"); // Display element
    const operators = document.querySelectorAll(".operator"); // Operator buttons
    const plusStyle = document.querySelector(".plus").style;
    const minusStyle = document.querySelector(".minus").style;
    const multiplyStyle = document.querySelector(".multiply").style;
    const divideStyle = document.querySelector(".divide").style;

    /**
     * Function to initialize event listeners
     */
    const initEventListeners = () => {
        const calculator = document.querySelector("#calculator");
        calculator.addEventListener("click", handleInput);
        document.addEventListener("keydown", handleInput);
    };

    /**
     * Function to handle input events
     * @param {Event} event - input event (click or keydown)
     */
    const handleInput = (event) => {
        const { inputType, inputText, inputStyle } = normalizeInput(event);

        if (!inputType) return;

        if (state.previousPress === "operator") {
            resetOperatorColor();
        }

        switch (inputType) {
            case "number":
                handleNumberInput(inputText);
                break;
            case "operator":
                handleOperatorInput(inputText, inputStyle);
                break;
            case "equals":
                handleEqualsInput();
                break;
            case "clear":
                handleClear();
                break;
            case "negate":
                handleNegate();
                break;
            case "percent":
                handlePercent();
                break;
        }

        console.log(currentCalculation);

        state.previousPress = inputType;
    };

    /**
     * Function to normalize the input event and return the type, text, and style
     * @param {Event} event - input event (click or keydown)
     * @returns {Object} - normalized input event details
     */
    const normalizeInput = (event) => {
        let buttonElement, keyPress, inputType, inputText, inputStyle;

        buttonElement = event.type === "click" ? event.target : null
        keyPress = event.type === "keydown" ? event.key : null

        inputText = getButtonText(buttonElement || keyPress);

        inputType = getButtonClassName(buttonElement || keyPress); 

        inputStyle = getButtonStyle(buttonElement || keyPress);

        return { inputType, inputText, inputStyle };
    };

  /**
     * Function to get the text of the button clicked
     * @param {HTMLElement|string} button - clicked button element or key
     * @returns {string} - type of the button
     */
  const getButtonText = (buttonElementOrKeyPress) => {
    return buttonElementOrKeyPress.innerText || buttonElementOrKeyPress;
};

    /**
     * Function to get the type of the button clicked
     * @param {HTMLElement|string} button - clicked button element or key
     * @returns {string} - type of the button
     */
    const getButtonClassName = (button) => {
        const keyMap = {
          '0': 'number', '1': 'number', '2': 'number', '3': 'number', '4': 'number',
          '5': 'number', '6': 'number', '7': 'number', '8': 'number', '9': 'number',
          '+': 'operator', '-': 'operator', '*': 'operator', '/': 'operator',
          'Enter': 'equals', '=': 'equals', 'Escape': 'clear', 'c': 'clear'
        };
      
        const classTypes = ['number', 'operator', 'equals', 'clear', 'negate', 'percent'];
        
        if (button.classList) {
          return classTypes.find(type => button.classList.contains(type)) || '';
        } else {
          return keyMap[button] || '';
        }
      };
      

    /**
     * Function to get the style of the operator clicked
     * @param {HTMLElement|string} button - clicked button element or key
     * @returns {CSSStyleDeclaration} - style of the operator button
     */
    const getButtonStyle = (button) => {
        if ((button?.classList?.contains("plus") ?? false) || button === '+') return plusStyle;
        if ((button?.classList?.contains("minus") ?? false) || button === '-') return minusStyle;
        if ((button?.classList?.contains("multiply") ?? false) || button === '*') return multiplyStyle;
        if ((button?.classList?.contains("divide") ?? false) || button === '/') return divideStyle;
        return "";
    };

    /**
     * Function to handle number input
     * @param {string} buttonText - text of the button clicked or key pressed
     */
    const handleNumberInput = (buttonText) => {
        if (state.err) {
            userInput.length = 0; // If there is an error, reset the input
            state.err = false
        }

        userInput.push(buttonText); // Add the new number to the input

        const fullInput = getNumber();

        currentCalculation.setNumber(fullInput);

        updateDisplay(fullInput); // Update the display
    };

    /**
     * Function to handle operator input
     * @param {string} buttonText - text of the button clicked or key pressed
     * @param {CSSStyleDeclaration} buttonStyle - style of the operator button
     */
    const handleOperatorInput = (buttonText, buttonStyle) => {
        if (state.previousPress === "equals") {
            currentCalculation.setX(state.getPreviousOutput());
        }

        // This if statement enables chaining of previous output with new operator
        if (currentCalculation.isCalcReady()) {
            const result = currentCalculation.calculate();
            updateDisplay(result); // Update the display
            state.addToHistory(currentCalculation); // Add the calculation to history
            currentCalculation = new Calculation(); // Reset the current calculation
            currentCalculation.x = state.getPreviousOutput();
        }

        currentCalculation.setOperator(buttonText); // Set the operator
        userInput.length = 0; // Reset user input

        buttonStyle.backgroundColor = 'white'; // Highlight the operator button
        buttonStyle.color = 'orange';
    };

    /**
     * Function to handle equals input
     */
    const handleEqualsInput = () => {
        try {
            if (state.previousPress === "equals") {
                currentCalculation.setX(state.getPreviousOutput());
                currentCalculation.setOperator(state.getPreviousOp());
                currentCalculation.setY(state.getPreviousY());
            }
            const result = currentCalculation.calculate(); // Perform the calculation
            updateDisplay(result); // Update the display
            state.addToHistory(currentCalculation); // Add the calculation to history
            currentCalculation = new Calculation(); // Reset the current calculation
            userInput = [0]; // Reset user input
        } catch (error) {
            updateDisplay(error.message); // Display error message
            state.err = true; // Set error state to true
        }
    };

    /**
     * Function to handle clear input
     */
    const handleClear = () => {
        userInput = [0]; // Reset user input
        updateDisplay('0'); // Update the display
        state.err = false; // Set error state to false
        currentCalculation = new Calculation(); // Reset the current calculation
    };

    /**
     * Function to handle negate input
     */
    const handleNegate = () => {
        if (state.previousPress === "equals") {
            userInput = [state.getPreviousOutput()];
            userInput.unshift('-');
        } else if (userInput[0] === '-') {
            userInput.shift(); // Remove the negative sign
        } else if (getNumber() >= 0) {
            userInput.unshift('-'); // Add the negative sign
        }
        const fullInput = getNumber();

        currentCalculation.setNumber(fullInput);
        updateDisplay(fullInput); // Update the display
        state.err = false; // Set error state to false
    };

    /**
     * Function to handle percent input
     */
    const handlePercent = () => {
        if (state.err) {
            return updateDisplay("Error");
        } else if (state.previousPress === "equals") {
            userInput = [currentCalculation.preciseDivide(state.getPreviousOutput(), 100, 10)];
        } else if (state.previousPress === "percent") {
            userInput = [currentCalculation.preciseDivide(getNumber(), 100, 10)];
        } else {
            userInput = [currentCalculation.preciseDivide(getNumber(), 100, 10)];
        }
        updateDisplay(getNumber());
        state.err = false;
    };

    /**
     * Function to get the number from user input
     * @returns {number} - number from user input array
     */
    const getNumber = () => {
        return userInput.length === 0 ? 0 : parseFloat(userInput.join(''));
    };

    /**
     * Function to update the display
     * @param {number|string} input - input to display
     */
    const updateDisplay = (input) => {
        display.innerText = input;
    };

    /**
     * Function to reset operator button colors
     */
    const resetOperatorColor = () => {
        operators.forEach((button) => {
            button.style.backgroundColor = 'rgb(252, 139, 0)'; // Default color
            button.style.color = 'rgb(255, 255, 255)'; // Default text color
        });
    };

    // Initialize the event listeners
    initEventListeners();
};

/*-------------------------------- Initialize Calculator --------------------------------*/

// Initialize the calculator controller
CalculatorController();





























































// // State function to manage the state of the calculator
// // This function returns an object that keeps track of the calculator's state
// const State = (err = false, previousPress = '', history = []) => ({
//     err, // boolean to track if there is an error
//     history, // array to store calculation history
//     previousPress,

//     // Method to get the result of the previous calculation
//     getPreviousOutput() {
//         // If there is no history, return 0, otherwise return the result of the last calculation
//         return this.history.length === 0 ? 0 : this.history[this.history.length - 1].result;
//     },

//     // Method to add a new calculation to the history
//     addToHistory(calcObj) {
//         // Create a new calculation object and add it to the history array
//         const previousCalculation = CalculationObject(calcObj.x, calcObj.op, calcObj.y, calcObj.result);
//         this.history.push(previousCalculation);
//     }
// });

// // CalculationObject function to create a calculation object
// // This function returns an object representing a single calculation
// const CalculationObject = (x = 0, op = '', y = 0, result = null) => ({
//     x, // first operand
//     y, // second operand
//     op, // operator
//     result, // result of the calculation

//     // Method to perform the calculation based on the operator
//     calculate() {
//         switch (this.op) {
//             case '+': return this.add();
//             case '-': return this.sub();
//             case '*': return this.mul();
//             case '/': return this.div();
//             default: throw new Error("Unknown operator");
//         }
//     },

//     // Method to perform addition
//     add() {
//         this.result = this.x + this.y;
//         return this.result
//     },

//     // Method to perform subtraction
//     sub() {
//         this.result = this.x - this.y;
//         return this.result
//     },

//     // Method to perform multiplication
//     mul() {
//         this.result = this.x * this.y;
//         return this.result
//     },

//     // Method to perform division
//     div() {
//         if (this.y === 0) {
//             throw new Error("Division by zero");
//         }
//         this.result = this.x / this.y;
//         return this.result
//     },

//     // Method to set the operator
//     setOperator(operator) {
//         this.op = operator;
//     },

//     // Method to reset the calculation object
//     reset() {
//         this.x = 0;
//         this.y = 0;
//         this.op = '';
//         this.result = null;
//     }
// });

// // CalculatorController function to manage the calculator's operations and UI
// // This function is a closure that encapsulates the calculator state and logic
// const CalculatorController = () => {
//     let state = State(); // Initialize state
//     let currentCalculation = CalculationObject(); // Initialize current calculation object
//     let userInput = [0]; // Array to store user input
//     const display = document.querySelector(".display"); // Display element
//     const operators = document.querySelectorAll(".operator"); // Operator buttons
//     const plusStyle = document.querySelector(".plus").style
//     const minusStyle = document.querySelector(".minus").style
//     const multiplyStyle = document.querySelector(".multiply").style
//     const divideStyle = document.querySelector(".divide").style

//     // Function to initialize event listeners
//     const initEventListeners = () => {
//         const calculator = document.querySelector("#calculator");
//         calculator.addEventListener("click", handleButtonClick);
//         document.addEventListener("keydown", handleKeyPress);
//     };

//     // Function to handle button clicks and key presses
//     // This function demonstrates closure as it captures and uses state and currentCalculation
//     const handleInput = (inputType, inputText, inputStyle = null) => {
//         resetOperatorColor();

//         switch (inputType) {
//             case "number":
//                 handleNumberInput(inputText);
//                 break;
//             case "operator":
//                 handleOperatorInput(inputText, inputStyle);
//                 break;
//             case "equals":
//                 handleEqualsInput();
//                 break;
//             case "clear":
//                 handleClear();
//                 break;
//             case "negate":
//                 handleNegate();
//                 break;
//             case "percent":
//                 handlePercent();
//                 break;
//         }
//         state.previousPress = inputType
//     };

//     // Function to handle button clicks
//     const handleButtonClick = (event) => {
//         const buttonType = getButtonClassName(event.target);
//         const buttonText = event.target.innerText;
//         const buttonStyle = getButtonStyle(event.target)
//         handleInput(buttonType, buttonText, buttonStyle);
//     };

//     // Function to handle key presses
//     const handleKeyPress = (event) => {
//         const keyMap = {
//             '0': 'number', '1': 'number', '2': 'number', '3': 'number', '4': 'number',
//             '5': 'number', '6': 'number', '7': 'number', '8': 'number', '9': 'number',
//             '+': 'operator', '-': 'operator', '*': 'operator', '/': 'operator',
//             'Enter': 'equals', '=': 'equals', 'Escape': 'clear', 'c': 'clear'
//         };

//         const buttonType = keyMap[event.key];
//         if (!buttonType) return;

//         const buttonText = event.key === 'Enter' ? '=' : event.key;

//         const buttonStyle = getButtonStyle(event.key)
//         handleInput(buttonType, buttonText, buttonStyle);
//     };

//     // Function to get the type of the button clicked
//     const getButtonClassName = (button) => {
//         if (button.classList.contains("number")) return "number";
//         if (button.classList.contains("operator")) return "operator";
//         if (button.classList.contains("equals")) return "equals";
//         if (button.classList.contains("clear")) return "clear";
//         if (button.classList.contains("negate")) return "negate";
//         if (button.classList.contains("percent")) return "percent";
//         return "";
//     };

//     // Function to get the style of the operator clicked
//     const getButtonStyle = (button) => {
//         if ((button?.classList?.contains("plus") ?? false) || button === '+') return plusStyle;
//         if ((button?.classList?.contains("minus") ?? false) || button === '-') return minusStyle;
//         if ((button?.classList?.contains("multiply") ?? false) || button === '*') return multiplyStyle;
//         if ((button?.classList?.contains("divide") ?? false) || button === '/') return divideStyle;
//         return "";
//     };

//     // Function to handle number input
//     // Uses closure to modify and access userInput array and state object
//     const handleNumberInput = (buttonText) => {
//         // If the user input starts with zero or there is an error, reset the input
//         if (userInput[0] === 0 || state.err) {
//             userInput.length = 0;
//         } else if (userInput[0] === '-' && userInput[1] === 0) {
//             userInput.pop();
//         }
//         userInput.push(buttonText); // Add the new number to the input
//         updateDisplay(userInput.join('')); // Update the display
//     };

//     // Function to handle operator input
//     // Uses closure to modify and access currentCalculation and userInput array
//     const handleOperatorInput = (buttonText, buttonStyle) => {
//         console.log(state.getPreviousOutput())
//         currentCalculation.x = state.previousPress === "equals" ? state.getPreviousOutput() : getNumber();
//         currentCalculation.setOperator(buttonText); // Set the operator
//         userInput = []; // Reset user input
//         if (buttonStyle) {
//             buttonStyle.backgroundColor = 'white'; // Highlight the operator button
//             buttonStyle.color = 'orange';
//         }
//     };

//     // Function to handle equals input
//     // Uses closure to modify and access currentCalculation, state, and userInput
//     const handleEqualsInput = () => {
//         try {
//             currentCalculation.y = userInput.length === 0 ? currentCalculation.x : getNumber();
//             const result = currentCalculation.calculate(); // Perform the calculation
//             updateDisplay(result); // Update the display
//             state.addToHistory(currentCalculation); // Add the calculation to history
//             currentCalculation.reset(); // Reset the current calculation
//             userInput = [0]; // Reset user input
//         } catch (error) {
//             updateDisplay(error.message); // Display error message
//             state.err = true; // Set error state to true
//         }
//     };

//     // Function to handle clear input
//     // Uses closure to reset userInput, state, and currentCalculation
//     const handleClear = () => {
//         userInput = [0]; // Reset user input
//         updateDisplay('0'); // Update the display
//         state.err = false; // Set error state to false
//         currentCalculation.reset(); // Reset the current calculation
//     };

//     // Function to handle negate input
//     // Uses closure to modify and access userInput array and state object
//     const handleNegate = () => {
//         if (userInput[0] === '-') {
//             userInput.shift(); // Remove the negative sign
//         } else if (getNumber() >= 0) {
//             userInput.unshift('-'); // Add the negative sign
//         }
//         updateDisplay(userInput.join('')); // Update the display
//         state.err = false; // Set error state to false
//     };

//     // Function to handle percent input
//     // Uses closure to modify and access userInput array and state object
//     const handlePercent = () => {
//         if (state.err) {
//             updateDisplay("Error")
//         } else {
//             userInput = [getNumber() / 100]; // Convert the number to percentage
//             updateDisplay(userInput.join('')); // Update the display
//             state.err = false
//         }
//     };

//     // Function to get the number from user input
//     // Uses closure to access userInput array
//     const getNumber = () => {
//         return userInput.length === 0 ? 0 : parseFloat(userInput.join(''));
//     };

//     // Function to update the display
//     const updateDisplay = (input) => {
//         display.innerText = input;
//     };

//     // Function to reset operator button colors
//     const resetOperatorColor = () => {
//         operators.forEach((button) => {
//             button.style.backgroundColor = 'rgb(252, 139, 0)'; // Default color
//             button.style.color = 'rgb(255, 255, 255)'; // Default text color
//         });
//     };

//     // Initialize the event listeners
//     initEventListeners();

//     // Return the functions to manage calculator operations and UI
//     return {
//         handleButtonClick,
//         handleKeyPress,
//         handleNumberInput,
//         handleOperatorInput,
//         handleEqualsInput,
//         handleClear,
//         getNumber,
//         updateDisplay,
//         resetOperatorColor,
//         initEventListeners
//     };
// };

// /*-------------------------------- Initialize Calculator --------------------------------*/

// // Initialize the calculator controller
// const calculatorController = CalculatorController();

// console.log(calculatorController);































// class State {
//     constructor(displayingOutput = false, err = false, history = []) {
//         this.displayingOutput = displayingOutput;
//         this.err = err;
//         this.history = history;
//     }

//     getPreviousOutput() {
//         if (this.history.length === 0) return 0;
//         return this.history[this.history.length - 1].result;
//     }

//     addToHistory(calcObj) {
//         const previousCalculation = new CalculationObject(calcObj.x, calcObj.op, calcObj.y, calcObj.result);
//         this.history.push(previousCalculation);
//     }
// }

// class CalculationObject {
//     constructor(x = 0, op = '', y = 0, result = null) {
//         this.x = x;
//         this.y = y;
//         this.op = op;
//         this.result = result;
//     }

//     calculate() {
//         switch (this.op) {
//             case '+':
//                 this.result = this.add();
//                 break;
//             case '-':
//                 this.result = this.sub();
//                 break;
//             case '*':
//                 this.result = this.mul();
//                 break;
//             case '/':
//                 this.result = this.div();
//                 break;
//         }
//         return this.result;
//     }

//     add() {
//         return +this.x + +this.y;
//     }

//     sub() {
//         return +this.x - +this.y;
//     }

//     mul() {
//         return +this.x * +this.y;
//     }

//     div() {
//         return +this.x / +this.y;
//     }

//     setOperator(operator) {
//         this.op = operator;
//     }

//     reset() {
//         this.x = 0;
//         this.y = 0;
//         this.op = '';
//         this.result = null;
//     }
// }

// class CalculatorController {
//     constructor() {
//         this.state = new State();
//         this.currentCalculation = new CalculationObject();
//         this.userInput = [];
//         this.display = document.querySelector(".display");
//         this.operators = document.querySelectorAll(".operator");
//         this.initEventListeners();
//     }

//     initEventListeners() {
//         const calculator = document.querySelector("#calculator");
//         calculator.addEventListener("click", (event) => this.handleButtonClick(event));
//     }

//     handleButtonClick(event) {
//         const buttonType = this.getButtonClassName(event.target);
//         const buttonText = event.target.innerText;
//         this.resetOperatorColor()

//         if (buttonType === "number") {
//             this.handleNumberInput(buttonText);
//         } else if (buttonType === "operator") {
//             this.handleOperatorInput(buttonText);
//         } else if (buttonType === "equals") {
//             this.handleEqualsInput();
//         } else if (buttonText === "C") {
//             this.handleClear();
//         }
//     }

//     getButtonClassName(button) {
//         if (button.classList.contains("number")) return "number";
//         if (button.classList.contains("operator")) return "operator";
//         if (button.classList.contains("equals")) return "equals";
//         return "";
//     }

//     handleNumberInput(buttonText) {
//         this.userInput.push(buttonText);
//         this.updateDisplay(this.userInput.join(''));
//         this.state.displayingOutput = false;
//     }

//     handleOperatorInput(buttonText) {
//         if (this.state.displayingOutput) {
//             this.currentCalculation.x = this.state.getPreviousOutput();
//         } else {
//             this.currentCalculation.x = this.getNumber();
//         }
//         this.currentCalculation.setOperator(buttonText);
//         this.userInput = [];
//         event.target.style.backgroundColor = 'white';
//         event.target.style.color = 'orange';
//     }

//     handleEqualsInput() {
//         this.currentCalculation.y = this.userInput.length === 0 ? this.currentCalculation.x : this.getNumber();
//         const result = this.currentCalculation.calculate();
//         this.updateDisplay(result);
//         this.state.addToHistory(this.currentCalculation);
//         this.state.displayingOutput = true;
//         this.currentCalculation.reset();
//         this.userInput = [];
//     }

//     handleClear() {
//         this.userInput = [];
//         this.updateDisplay('0');
//         this.state.displayingOutput = false;
//         this.currentCalculation.reset();
//     }

//     getNumber() {
//         return this.userInput.length === 0 ? 0 : parseFloat(this.userInput.join(''));
//     }

//     updateDisplay(input) {
//         this.display.innerText = input;
//     }

//     resetOperatorColor() {
//         this.operators.forEach((button) => {
//             button.style.backgroundColor = 'rgb(252, 139, 0)';
//             button.style.color = 'rgb(255, 255, 255)';
//         });
//     }
// }

// /*-------------------------------- Initialize Calculator --------------------------------*/

// const calculatorController = new CalculatorController();





































// class State {
//     constructor(newCalculation = true, displayingOutput = false, operatorPressed = false, err = false, history = []) {
//         this.newCalculation = newCalculation
//         this.displayingOutput = displayingOutput
//         this.operatorPressed = operatorPressed
//         this.err = err
//         this.history = history
//     }

//     getPreviousOutput() {
        
//         const highestIndex = this.history.length - 1
//         const lastCalc = this.history[highestIndex]

//         return lastCalc.result
//     }

//     addToHistory(calcObj) {
//         let previousCalculation = new CalculationObject(calcObj.x, calcObj.op, calcObj.y, calcObj.result)
//         this.history.push(previousCalculation)
//     }
// }

// class CalculationObject {
//     constructor(x = 0, op = '', y = 0, result = null) {
//         this.x = x
//         this.y = y
//         this.op = op
//         this.result = result
//     }

//     calculate() {

//         switch(this.op) {
//             case '+':
//                 this.result = this.add()
//                 break
    
//             case '-':
//                 this.result = this.sub()
//                 break
    
//             case '*':
//                 this.result = this.mul()
//                 break
    
//             case '/':
//                 this.result = this.div()
//                 break
//         }
//         return this.result
//     }

//     add() {
//         return +this.x + +this.y
//     }
    
//     sub() {
//         return +this.x - +this.y
//     }
    
//     mul() {
//         return +this.x * +this.y
//     }
    
//     div() {
//         return +this.x / +this.y
//     }

//     setOperator(operator) {
//         this.op = operator

//         event.target.style.backgroundColor = 'white'
//         event.target.style.color = 'orange'
//     }

//     reset() {
//         this.x = 0
//         this.y = 0
//         this.op = ''
//         this.result = null
//     }
// }

// /*-------------------------------- Constants --------------------------------*/

// /*-------------------------------- Variables --------------------------------*/

// let userInput = []
// let state = new State()
// let currentCalculation = new CalculationObject()

// /*------------------------ Cached Element References ------------------------*/

// const calculator = document.querySelector("#calculator");
// const display = document.querySelector(".display");
// const operators = document.querySelectorAll(".operator")

// /*----------------------------- Event Listeners -----------------------------*/

// calculator.addEventListener("click", (event) => {

//     // state.operatorPressed will always start as false
//     // we assume the user will type a number first so that logic is handled first
//     if (!state.operatorPressed) {
    
//         if (buttonType("number")) {

//             // push each number press to the userInput array
//             userInput.push(getButtonInnerText())

//             // do a .join('') on the array to get the entire number and display it 
//             updateDisplay(getNumber())

//             // its possible that output from a previous calculation was displaying when 
//             // the number was typed but since we overwrite that with the new input
//             // restore the displayingOutput state to false
//             state.displayingOutput = false
//         }

//         if (buttonType("operator")) {

//             // in the case that the calculator is displaying a previous result 
//             // set the previous result to the x value of the current calculation
//             if (state.displayingOutput) {
//                 currentCalculation.x = state.getPreviousOutput()

//             // Otherwise set the x value to be the user input
//             // if the user has no input before clicking an operator x gets set to 0
//             } else {
//                 currentCalculation.x = getNumber()
//             }

//             // get the operator and change color of button associated with it
//             currentCalculation.setOperator(getButtonInnerText())

//             // this ensures the else branch of logic executes on next button press
//             state.operatorPressed = true 

//             // reset user input for next number
//             userInput = []
//         }

//         if (getButtonInnerText() === "C") {
//             userInput = []
//             updateDisplay('0')
//             state.displayingOutput = false
//         }

//         // x input set and operator currently selected
//     } else {

//         resetOperatorColor()

//         if (buttonType("operator")) {
//             currentCalculation.setOperator(getButtonInnerText())
//         } 

//         if (buttonType("number")) {
//             userInput.push(getButtonInnerText())
//             updateDisplay(getNumber())
//         }

//         if (buttonType("equals")) {

//             if (userInput.length === 0) {
//                 currentCalculation.y = currentCalculation.x

//             } else {
//                 currentCalculation.y = getNumber()
//             }

//             let output = currentCalculation.calculate()
//             updateDisplay(output)

//             state.addToHistory(currentCalculation)
            
//             state.displayingOutput = true
//             state.operatorPressed = false
//             currentCalculation.reset()
//             userInput = []
//             console.log(state.history)
//         }

//         if (getButtonInnerText() === "C") {
//             currentCalculation.op = ''
//             state.operatorPressed = false
//         }
//     }
// });

// /*-------------------------------- Functions --------------------------------*/

// function getButtonInnerText() {
//     return this.event.target.innerText
// }

// function buttonType(cssClass) {
//     return this.event.target.classList.contains(cssClass)
// }

// function getNumber() {
//     if (userInput.length === 0) {
//         return 0
//     } else {
//         return +userInput.join('')
//     }
    
// }

// function updateDisplay(input) {
//     display.innerText = input
// }

// function resetOperatorColor() {
//     operators.forEach((button) => {
//         button.style.backgroundColor = 'rgb(252, 139, 0)'
//         button.style.color = 'rgb(255, 255, 255)'
//     })
// }