
function perform(){
    const input = document.getElementById("in");
    const out = document.getElementById("out");
    const write = document.getElementById("write");
    const value = parseFloat(input.value);
    if(isNaN(value)){
        out.innerHTML = "Please input a number.";
        return;
    }

    const decimalSplit = value => {
        // Let's do little endian way
        let decimals = [];
        for(let reduced = value; 1 <= reduced; reduced /= 10.){
            decimals.push((reduced << 0) % 10);
        }
        return decimals.reverse();
    };

    const countDigit = n => decimalSplit(n).length;

    const repeat = (n, c = " ") => Array(Math.max(0, n)).fill().reduce((s, _) => s + c, "");

    const formatDecimals = (value, digits, fillZeros=false, showZero=true) => {
        const decimals = decimalSplit(value);
        if(fillZeros){
            while(decimals.length < digits)
                decimals.unshift(0);
        }
        if(showZero && decimals.length === 0)
            decimals.unshift(0);
        return repeat(digits - decimals.length) + decimals.reduce((s, v) => s + "" + v, "");
    }

    const range = (start, stop) => Array.from({ length: stop - start + 1}, (_, i) => start + i);

    let decimals = decimalSplit(value);

    let hundreds = [];
    for(let reduced = value; 1 < reduced; reduced /= 100.){
        hundreds.push((reduced << 0) % 100);
    }

    hundreds.reverse();

    let writeAns = "";
    let writeNextLeft = [];
    let writeNextRight = [];

    const first = `first, we split the input into blocks of two digits, ${hundreds.reduce((accum, val) => accum += " | " + val, "")}`;

    const second = `look at the most significant block, which is ${hundreds[0]}`;

    let ans = [];

    let topDigit = 0;
    for(topDigit = 1; topDigit * topDigit <= hundreds[0]; topDigit++);
    topDigit--;
    ans.push(topDigit);
    writeAns += " " + formatDecimals(topDigit, 3);

    const topStr = `The biggest number that its square won't exceed ${hundreds[0]} is ${topDigit}, which is the first digit of the answer`;

    let sum = topDigit * 2;
    let lhs = ["" + topDigit + " ", "" + topDigit + " "];
    let rhs = [hundreds.reduce((accum, val) => accum ? accum += " | " + formatDecimals(val, 2, true) : formatDecimals(val, 2), ""),
        formatDecimals(topDigit * topDigit, 2)];

    const topSum = `On the left hand side, add the number together to get ${sum}`;

    let carry = hundreds[0] - topDigit * topDigit;

    const topSub = `On the right hand side, subtract the square of that number ${topDigit * topDigit} from top block ${hundreds[0]} to get remaining ${carry}`;

    let nextBlockStr = "";

    for(let digit = 1; digit < hundreds.length; digit++){
        const nextBlock = carry * 100 + hundreds[digit];

        nextBlockStr += `The next block is ${nextBlock}, which is sum of remainder ${carry} times 100 and second block ${hundreds[digit]}<br>`;

        topDigit = 0;
        for(topDigit = 1; (sum * 10 + topDigit) * topDigit <= nextBlock; topDigit++);
        topDigit--;
        ans.push(topDigit);
        writeAns += formatDecimals(topDigit, 5);

        nextBlockStr += `Let's find the biggest number x that (${sum} * 10 + x)x won't exceed the block ${nextBlock
        }, which is ${topDigit}<br>`;

        const sub = (sum * 10 + topDigit) * topDigit;

        nextBlockStr += `On the left hand side, add the number together to get ${sum * 10 + topDigit}<br>`;

        lhs.push(formatDecimals(sum * 10 + topDigit, digit + 1));
        lhs.push(formatDecimals(topDigit, digit + 1));
        rhs.push(range(0, digit).reduce((s, digit) =>
            formatDecimals(nextBlock / Math.pow(100, digit) % 100, 2,
                Math.pow(100, digit + 1) < nextBlock, false) + "   " + s, ""));
        rhs.push(range(0, digit).reduce((s, digit) =>
            formatDecimals(sub / Math.pow(100, digit) % 100, 2,
                Math.pow(100, digit + 1) < sub, false) + "   " + s, ""));

        carry = nextBlock - sub;

        nextBlockStr += `On the right hand side, subtract the (${sum} * 10 + x)x = ${sub} from current block ${nextBlock} to get remaining ${carry}<br>`;

        sum = sum * 10 + topDigit * 2;
    }

    const ansNum = ans.reduce((accum, val) => accum * 10 + val, 0);

    const ansStr = `Now we figured out that the answer is ${ansNum}. Let's try squaring it: ${ansNum * ansNum}`;

    const rightFill = (s, len) => {
        const left = len - s.length;
        if(0 < left)
            return s + repeat(left);
        else
            return s;
    };

    const lhsLen = lhs.reduce((n, v) => Math.max(n, v.length), 1);
    const rhsLen = rhs.reduce((n, v) => Math.max(n, v.length), 1);
    let writeBar = "+" + repeat(rhs.reduce((a, v) => Math.max(a, v.length), 0) + 1, "-");
    let writeLeftSpace = repeat(lhsLen);
    let writeStr = writeLeftSpace + writeAns + "\n" + writeLeftSpace + writeBar + "\n";
    for(let i = 0; i < lhs.length; i++){
        if(i % 2 === 0 && i !== 0){
            writeStr += repeat(lhsLen, "-") + " " + repeat(rhsLen + 1, "-") + "\n";
        }
        writeStr += rightFill(lhs[i], lhsLen) + (i === 0 ? ") " : "  ") + rhs[i] + "\n";
    }

    write.innerHTML = `${writeStr}`;

    out.innerHTML = `Input: ${decimals}<br>
    ${first}<br>
    ${second}<br>
    ${topStr}<br>
    ${topSum}<br>
    ${topSub}<br>
    ${nextBlockStr}
    ${ansStr}`;
}