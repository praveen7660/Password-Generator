const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*([{|_-+=;:<},]>.?/';

// initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// ste strength circle color to grey
setIndicator("#ccc");

// Sets Password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength -min)*100/(max-min)) + "100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRandInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandInteger(65,91));
}

function generateSymbol(){
    const randNum = getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let haslower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercasecheck.checked) hasUpper = true;
    if(lowercasecheck.checked) haslower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && haslower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }else if(
        (haslower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }

}
async function copyContent(){
    try{
    await navigator.clipboard.writeText(passwordDisplay.value);  
    copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() =>{
        copyMsg.classList.remove("active")
    },2000);
}

function shufflePassword(array){
    // Fisher Yates method => shuffling an array method
    for(let i = array.length-1;i>0;i--){
        // finding Random j
        const j = Math.floor(Math.random() * (i + 1));
        // swapping
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    //special condition
     if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
     }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copybtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click',() => {
    // if none of the checkbox selected
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // let's start the journey to find new password
    console.log("Starting the Journey")
    //remove old password
    password = "";

    // let's put the stuff mentioned by checkboxes
    // if(uppercasecheck.checked){
    //     password +=generateUpperCase();
    // }
    // if(lowercasecheck.checked){
    //     password +=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password +=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password +=generateSymbol();
    // }

    let funArr = [];

    if(uppercasecheck.checked){
        funArr.push(generateUpperCase);
    }
    if(lowercasecheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funArr.push(generateSymbol);
    }

    // compulsory Addition
    for(let i=0;i<funArr.length;i++){
        password += funArr[i]();
    }
    console.log("Compulsory Addition done");

    // remaining addition
    for(let i=0;i<passwordLength-funArr.length;i++){
        let randIndex = getRandInteger(0,funArr.length);
        console.log("randIndex"+randIndex);
        password += funArr[randIndex]();
    }
    console.log("Remaining Addition done");
    // shuffle the password
    password = shufflePassword(Array.from(password));

    console.log("Shuffling Addition done");
    // show in UI
    passwordDisplay.value = password;

    console.log("UI Addition done");

    // Calculate strength
    calcStrength();
 
});