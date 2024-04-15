class Calc {
    constructor(currentOpScreenText,previousOpScreenText) {
        this.currentOpScreenText = currentOpScreenText
        this.previousOpScreenText = previousOpScreenText
        this.storedOperation = null;
        this.storedOperandA = null;
        this.storedOperandB = null;
        this.rptOp = null;
        this.isRepeat = false;
        this.clear()
    }

    clear() {
        this.currentOp = "0";
        this.previousOp = "";
        this.operation = undefined;
        this.currentOpScreenText.innerText = "0"; 
        this.previousOpScreenText.innerText = "";
        this.storedOperation = null;
        this.storedOperandA = null;
        this.storedOperandB = null;
        this.rptOp = null;
        this.isRepeat = false;
    }

    delete() {        
        if (this.currentOp.toString().length === 1) { 
            this.currentOp = "0"; 
        } else {
            this.currentOp = this.currentOp.toString().slice(0, -1);
        }  
    } 
    
    repeat() {
        if (this.storedOperation !== null && this.storedOperandA !== null && this.storedOperandB !== null) {
            this.isRepeat = true;
            this.currentOp = this.storedOperandB
            this.rptOp = this.storedOperandA;
            this.previousOp = this.storedOperandA
            this.operation = this.storedOperation 
            this.compute();
            this.updtDisplay();
            this.isRepeat = false;           
        }
    }   
    
    appendNumber(number) {
        if (number === "." && this.currentOp.includes(".") || this.currentOp.toString().length >= 10) return;
        else if (number === "." && this.currentOp.toString() === "") {
            this.currentOp = "0";
        }
        else if (this.currentOp.toString() === "0" && number !== ".") {
            this.currentOp = '';
        }    
        this.currentOp = this.currentOp.toString() + number.toString();
    }  
    

    pickOperation(operation) {
        if(this.currentOp === "" ) return
        if(this.previousOp !== "" ) {
            this.compute()
        }
        if (operation === "-" && this.currentOp === "0"){
            this.currentOp = "-"
            this.updtDisplay()
            return
        }
        this.operation = operation
        this.previousOp = this.currentOp
        this.currentOp = ""        
    }

    compute() {
        let computation

        const convPrevOp = parseFloat(this.previousOp)
        const convCurrOp = parseFloat(this.currentOp)

        this.storedOperation = this.operation
        if(isNaN(convPrevOp) || isNaN(convCurrOp)) return
        switch (this.operation) {
            case "+":
                computation = convPrevOp + convCurrOp
                computation = this.adjustValue(computation)
                this.storedOperandA =  computation
                break
            case "-":
                computation = convPrevOp - convCurrOp
                computation = this.adjustValue(computation)
                this.storedOperandA =  computation
                break      
            case "÷":
                if (convCurrOp == 0) {
                    alert("It's impossible to divide by zero")
                    this.clear() 
                    return
                }
                computation = convPrevOp / convCurrOp
                computation = this.adjustValue(computation)
                this.storedOperandA =  computation
                break      
            case "x":
                computation = convPrevOp * convCurrOp
                computation = this.adjustValue(computation)
                this.storedOperandA =  computation
                break    
            default:
                return                                                 
        }
        this.currentOp = computation
        this.previousOp = ""        
        this.operation = undefined

    }

    adjustValue(value) {
        if (value.toString().length >= 10) {
            return value.toPrecision(5);
        } else {
            return value;
        }
    }

    updtDisplay() {
        this.currentOpScreenText.innerText = this.currentOp
        if(this.currentOpScreenText.innerText === "Infinity") {
            alert('Input is too long')
            this.clear() 
            return
        }
        else if (this.operation != null) {
            this.previousOpScreenText.innerText = `${this.previousOp} ${this.operation} ${this.currentOp}`
            this.storedOperandB = this.currentOp
        }
        else if (this.isRepeat) {
            this.previousOpScreenText.innerText = `${this.rptOp} ${this.storedOperation} ${this.storedOperandB}` 
        }        
        
    }


}


const numbersBtns = document.querySelectorAll('[data-number]')
const operationBtns = document.querySelectorAll('[data-operation]')
const equalsBtn = document.querySelector('[data-equals]')
const deleteBtn = document.querySelector('[data-delete]')
const clearBtn = document.querySelector('[data-all-clear]')

const currentOpScreenText = document.querySelector('[data-current-operand]')
const previousOpScreenText = document.querySelector('[data-previous-operand]')

let lastButton = ""

const calculator = new Calc(currentOpScreenText,previousOpScreenText)

numbersBtns.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updtDisplay()
        lastButton = button.value
    })
})

operationBtns.forEach(button => {
    button.addEventListener('click', () => {
        calculator.pickOperation(button.value)
        calculator.updtDisplay()
        lastButton = button.value
    })
})

equalsBtn.addEventListener('click', () => {
    if (lastButton != "=") {
        calculator.compute();
        calculator.updtDisplay();
    } else {
        calculator.repeat();
    }
    lastButton = "=";
});

clearBtn.addEventListener('click', () => {
    calculator.clear()
    lastButton = "clear"
})

deleteBtn.addEventListener('click', () => {
    calculator.delete()
    calculator.updtDisplay()
    lastButton = "delete"
})

