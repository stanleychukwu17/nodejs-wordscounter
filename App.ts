const fs = require('fs');
const readline = require('readline'); // use the readline module of Node.js
const { performance: perf } = require('perf_hooks'); // use the performance module of Node.js

async function Count_the_words() {
    // Record the start time
    const startTime = perf.now();
    const fileStream = fs.createReadStream('great-gatsby.txt');

    // Read the file from this stream
    const result = await Read_the_file_from_this_stream(fileStream);

    // Calculate the elapsed time
    const endTime = perf.now();
    const elapsedTime = endTime - startTime;

    console.log(result);
    console.log('Time taken:', elapsedTime, 'milliseconds');
}

const Read_the_file_from_this_stream = async (fileStream: any) => {
    // stores each word found in the file(no duplicates are store here)
    // result: [in, my, younger, age, and, more ...]
    const allWords: string[] = [];

    // stores the frequency of each word, like {in: 2, my: 3, come: 2, and: 2, more: 5 ...}
    const wordFrequency: any = {};

    // stores each unique frequency, no duplicates frequency is stored here - we use it to group every word that is displayed in each frequency
    // result: [5, 3, 2]; if $wordFrequency = {in: 2, my: 3, come: 2, and: 2, more: 5 ...}, so it takes each unique frequency
    const eachUniqueFrequency: number[] = [];

    // using $eachUniqueFrequency to group each word that is displayed in each frequency
    // result: {5: [in, my, come, and, more], 3: [my, come, and], 2: [in, come, and, more]};
    const finalResult: any = {};

    // used a promise so i can track how long it took the application to run
    return new Promise((resolve, reject) => {
        // starts the process of reading the file line by line
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        // loop through the file line by line: i.e as each line is returned from the $r1
        rl.on('line', (line: string) => {
            const eachWord = line.split(' '); // stores each of the word from the line into an array
    
            // loop through each word to clean it up, then add it to $allWords, then check for the frequency and add it to $wordFrequency
            for (let i = 0; i < eachWord.length; i++) {
                const word = eachWord[i].replace(/[^a-zA-Z0-9]/g, '').trim().toLowerCase();
    
                if (word.length > 0) {
                    if (allWords.includes(word)) {
                        // existing word, so we only increase the frequency of the word
                        wordFrequency[word] += 1;
                    } else {
                        // new word found, adds it to the list of words, i.e $allWords and also adds it to the frequency list
                        allWords.push(word)
                        wordFrequency[word] = 1;
                    }
                }
            }
        });
    
        // when all the lines in the file have been read
        rl.on('close', () => {
            // loop through wordFrequency and arrange the words into the final result
            for (const [word, frequency] of Object.entries(wordFrequency)) {
                if ((frequency as number) in finalResult) {
                    finalResult[frequency as number].push(word)
                } else {
                    finalResult[frequency as number] = [word]
                    eachUniqueFrequency.push(frequency as number);
                }
            }
    
            // sort eachUniqueFrequency, from highest to lowest (i.e descending order)
            eachUniqueFrequency.sort((a, b) => b - a);
    
            // loop through eachUniqueFrequency, use the value to display the words that are in that frequency
            eachUniqueFrequency.forEach((frequency: number) => {
                finalResult[frequency].forEach((word: string) => {
                    console.log(`word: ${word} - ${frequency}`)
                })
            })
    
            resolve('File processed successfully.')
        });
    })
}

// calls the function to count the words
Count_the_words();