// 范围滑块属性。
// 填充：拖动滑块时看到的尾随颜色。
// 背景：默认范围滑块背景
const sliderProps = {
    fill: "#0B1EDF",
    background: "rgba(255, 255, 255, 0.214)",
};

// 选择将影响密码长度属性的范围滑块容器。
const slider = document.querySelector(".range__slider");

// 显示范围滑块值的文本。
const sliderValue = document.querySelector(".length__title");

// 使用事件侦听器应用填充并更改文本的值。
slider.querySelector("input").addEventListener("input", event => {
    sliderValue.setAttribute("data-length", event.target.value);
    applyFill(event.target);
});
// 选择范围输入并将其传入applyFill函数。
applyFill(slider.querySelector("input"));
// 此函数负责创建尾随颜色并设置填充。
function applyFill(slider) {
    const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage +
        0.1}%)`;
    slider.style.background = bg;
    sliderValue.setAttribute("data-length", slider.value);
}

// 我们将用来创建随机密码字母的所有函数名的对象
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
};

// Generator Functions
// 所有负责返回随机值的函数，我们将使用这些函数来创建密码。
function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}
function getRandomSymbol() {
    const symbols = '~!@#$%^&*()_+{}":?><;.,';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// 选择所有必需的DOM元素 -->

// 显示结果的视图框
const resultEl = document.getElementById("result");
// 输入滑块，将用于更改密码的长度
const lengthEl = document.getElementById("slider");

// 复选框表示负责根据用户创建不同类型密码的选项
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");

// 生成密码的按钮
const generateBtn = document.getElementById("generate");
// 复制文本的按钮
const copyBtn = document.getElementById("copy-btn");
// 结果视图框容器
const resultContainer = document.querySelector(".result");
// 单击“生成”按钮后显示的文本信息
const copyInfo = document.querySelector(".result__info.right");
// 单击“复制”按钮后出现文本
const copiedInfo = document.querySelector(".result__info.left");

// 复制密码到剪贴板
copyBtn.addEventListener("click", () => {
    const textarea = document.createElement("textarea");
    const password = resultEl.innerText;
    if (!password || password == "CLICK GENERATE") {
        return;
    }
    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();

    copyInfo.style.transform = "translateY(200%)";
    copyInfo.style.opacity = "0";
    copiedInfo.style.transform = "translateY(0%)";
    copiedInfo.style.opacity = "0.75";
});

// 单击“生成”时，将生成密码
generateBtn.addEventListener("click", () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numberEl.checked;
    const hasSymbol = symbolEl.checked;
    resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
    copyInfo.style.transform = "translateY(0%)";
    copyInfo.style.opacity = "0.75";
    copiedInfo.style.transform = "translateY(200%)";
    copiedInfo.style.opacity = "0";
    // 自动复制密码到剪切板
    copyBtn.click();
});

// 负责生成密码并返回密码的函数。
function generatePassword(length, lower, upper, number, symbol) {
    let generatedPassword = "";
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);
    if (typesCount === 0) {
        return "";
    }
    for (let i = 0; i < length; i++) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    return generatedPassword.slice(0, length);
}

// 页面加载完成
window.onload = function () {
    // 自动生成一次密码
    generateBtn.click();
}
