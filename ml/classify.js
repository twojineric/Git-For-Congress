const fs = require('fs');
const NLP = require('natural');
const classifier = new NLP.LogisticRegressionClassifier();

// Load our training data
const trainingData = parseTrainingData("./trainingData.json");

// For each of the labels in our training data,
// train and generate the classifier
let i = 0;
console.log('teaching classifier');
Object.keys(trainingData).forEach((element, key) => {
    trainClassifier(classifier, element, trainingData[element].inputs);
    i++;
    if (i === Object.keys(trainingData).length)
    {
        classifier.train();
        const filePath = './classifier.json';
        classifier.save(filePath, (err, classifier) => {
            if(err) console.error(err);
            console.log('Created a Classifier file in ', filePath);
        });
    }
});

/**
 * Will add the phrases to the provided classifier under the given label.
 *
 * @param {Object} classifier
 * @param {String} label
 * @param {Array.String} phrases
 */
function trainClassifier(classifier, label, phrases)
{
    //console.log('Teaching set', label, phrases);
    phrases.forEach((phrase) => {
        //console.log(`Teaching single ${label}: ${phrase}`);
        classifier.addDocument(phrase.toLowerCase(), label);
    });
}

function interpret(phrase)
{
    const guesses = classifier.getClassifications(phrase.toLowerCase());
    const guess = guesses.reduce((x, y) => x && x.value > y.value ? x : y);
    return {
        probabilities: guesses,
        guess: guess.value > (0.66) ? guess.label : null
    };
}

let options = ["strike_noIns_section", "strike_noIns_string", "strike_insert", "amend_full", "append_new_with_target", "append_new_no_target"];
//takes in a string, runs it through nlu
function handleMessage(message)
{
    const interpretation = interpret(message);
    console.log('Bot heard: ', message);
    console.log('Bot interpretation: ', interpretation); //log all guesses

    if (interpretation.guess && trainingData[interpretation.guess])
    {
        let x = options.indexOf(trainingData[interpretation.guess].answer);
        if(x == -1) return console.log("something went wrong!");
        let ans = processStr(message, x);
        return ans;
        //console.log(`Response: ${trainingData[interpretation.guess].answer}`);
    }
    else
    {
        console.log('Couldn\'t match phrase');
    }
}


//testing
handleMessage('In General.—Subsection (b) of section 11 is amended to read as follows:');
handleMessage('(a) Dividends received by corporations (1) In general Section 243(a)(1) is amended by striking “70 percent” and inserting “50 percent”.');
handleMessage('(3) Conforming amendment The heading for section 243(c) is amended by striking “ Retention of 80-percent Dividend Received Deduction ” and inserting “ Increased Percentage ”');

//takes a file, parses and return a json object
function parseTrainingData(filePath)
{
    const f = fs.readFileSync(filePath);
    return JSON.parse(f);
}

//given a string and a category, parses into bits
function processStr(string, commandNum)
{
    let bill, strike, repl;
    let indexBill = string.indexOf("is amended");
    if(indexBill == -1) return console.log("cannot find bill");
    bill = string.substring(0, indexBill).trim();
    let indexStrike = string.indexOf("by striking") + 12;

    if(commandNum == 2) //strike_insert
    {
        let indexReplace = string.indexOf("and inserting") + 14;
        strike = string.substring(indexBill, indexReplace).match(/“([^“”]+)”/)[1].trim();
        repl = string.substring(indexReplace).match(/“([^“”]+)”/)[1].trim();
        console.log([commandNum, bill, strike, repl]);
        return [commandNum, bill, strike, repl];
    }
    else if(commandNum == 0) //strike_noIns_section
    {
        repl = string.substring(indexStrike).trim();
        console.log([commandNum, bill, repl]);
        return [commandNum, bill, repl];
    }
    else if(commandNum == 1) //strike_noIns_string
    {
        repl = string.substring(indexStrike).match(/“([^“”]+)”/)[1].trim();
        console.log([commandNum, bill, repl]);
        return [commandNum, bill, repl];
    }
    else if(commandNum == 3 || commandNum == 4 || commandNum == 5) //amend_full, append_new_with_target, append_new_no_target
    {
        bill = string.substring(0, indexBill).trim();
        console.log([commandNum, bill]);
        return [commandNum, bill];
    }
    else
    {
        console.log('not supported');
    }
}

module.exports = { handleMessage };
