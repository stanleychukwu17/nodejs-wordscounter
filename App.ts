const fs = require('fs');
const readline = require('readline');
const { performance: perf } = require('perf_hooks');

async function Count_the_words() {
    // Record the start time
    const startTime = perf.now();

    const fs = require('fs');
    const readline = require('readline');
    
    const fileStream = fs.createReadStream('great-gatsby.txt');

    const result = await Read_the_file_from_this_stream(fileStream);

    // Calculate the elapsed time
    const endTime = perf.now();
    const elapsedTime = endTime - startTime;

    console.log(result);
    console.log('Time taken:', elapsedTime, 'milliseconds');
}

const Read_the_file_from_this_stream = async (fileStream: any) => {
    const allWords: string[] = [];
    const wordFrequency: any = {};

    const eachUniqueFrequency: number[] = [];
    const finalResult: any = {};

    return new Promise((resolve, reject) => {

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        
        rl.on('line', (line: string) => {
            const eachWord = line.split(' ');
    
            // loop through each word to clean it up
            for (let i = 0; i < eachWord.length; i++) {
                const word = eachWord[i].replace(/[^a-zA-Z0-9]/g, '').trim().toLowerCase();
    
                if (word.length > 0) {
                    if (allWords.includes(word)) {
                        wordFrequency[word] += 1;
                    } else {
                        allWords.push(word)
                        wordFrequency[word] = 1;
                    }
                }
            }
        });
    
        
        rl.on('close', () => {
            // loop through wordFrequency
            for (const [word, frequency] of Object.entries(wordFrequency)) {
                if ((frequency as number) in finalResult) {
                    finalResult[frequency as number].push(word)
                } else {
                    finalResult[frequency as number] = [word]
                    eachUniqueFrequency.push(frequency as number);
                }
            }
    
            // sort eachUniqueFrequency
            eachUniqueFrequency.sort((a, b) => b - a);
    
            // loop through eachUniqueFrequency and print the words that appear that much
            eachUniqueFrequency.forEach((frequency: number) => {
                finalResult[frequency].forEach((word: string) => {
                    console.log(`word: ${word} - ${frequency}`)
                })
            })
    
            resolve('File processed successfully.')
            // console.log();
        });

    })
}

Count_the_words();