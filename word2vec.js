/**
 * Tool to compare word2vec datas over words or texts.
 * This script will start an http server providing an api to get informations from a word2vec dataset.
 *
 * === Usage ===
 *
 * - GET /word/freq/:word
 *      Get the usage frequency of a given word `:word`.
 * - GET /word/vect/:word
 *      Get the vector representing the word `word`.
 * - GET /word/dist/:word1/:word2
 *      Get a non-similarity quantification between words `word1` and `word2`.
 *      This non-similarity is processed as 1 - cosine between both vectors.
 *
 * - POST /text/vect need parameter `text`
 *      Get the vector representing the whole text.
 * - POST /text/dist need parameter `text1` and `text2`
 *      Get the non-similarity between the two texts.
 */


const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const readline = require('readline');


// Port the server listen on
const PORT = 8080

// File containing the word2vec datas
// Each line contain a word and then its vector
// The only separator must be a space
const VECT_FILE = 'data.txt'

// File containing a dictionnary of distribution
// The second column must be a word and the third a number
const FREQ_FILE = 'freq.txt'

// Dimension of our vectorial space
let DATA_SIZE = null;


/**
 * Process scalar product of two vectors.
 */
function product(a, b) {
    console.assert(a.length == b.length);

    let sum = 0;
    for (let i = 0 ; i < a.length ; i++)
        sum += a[i] * b[i];
    return sum;
}

/**
 * Process cosinus between two vectors.
 */
function cos(a, b) {
    console.assert(a.length == b.length);

    return product(a, b) / Math.sqrt(product(a, a) * product(b, b));
}

/**
 * Process the cartesian distance between two vectors
 */
function distance(a, b) {
    console.assert(a.length == b.length);

    let sum = 0;
    for (let i = 0 ; i < a.length ; i++) {
        sum += (a[i] - b[i])**2;
    }
    return Math.sqrt(sum);
}

/* ***** Create datastructures ***** */
let words = {};
let freqs = {};

readline.createInterface({
    input: fs.createReadStream(VECT_FILE)
}).on('line', function(line) {
    const vect = line.split(' ');
    words[vect[0]] = vect.slice(1).map(Number);
    DATA_SIZE = vect.length - 1;
}).on('close', function() {
    console.log(`Finished reading ${Object.keys(words).length} vectorial datas`);
});

readline.createInterface({
    input: fs.createReadStream(FREQ_FILE)
}).on('line', function(line) {
    const vect = line.split(' ');
    freqs[vect[1]] = 1 /  Number(vect[2]);
}).on('close', function() {
    console.log(`Finished reading ${Object.keys(freqs).length} frequency datas`);
});

/* ***** Advanced functions ***** */

/**
 * Return a vector supposed to summerise the text.
 */
function text_to_vect(text) {
    const text_words = text.split(/,| |\.|'/);
    let result = Array(DATA_SIZE).fill(0);
    let nb_words = 0;

    for (let i = 0 ; i < text_words.length ; i++) {
        const w = text_words[i]
        if (w in words && w in freqs) {
            const coef = freqs[w];
            nb_words += coef;

            for (let k = 0 ; k < DATA_SIZE ; k++) {
                result[k] += words[w][k] * coef;
            }
        }
    }

    for (let k = 0 ; k < DATA_SIZE ; k++)
        result[k] /= nb_words;

    return result;
}


/* ***** Create server listener ***** */

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/word/freq/:word', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    if (req.params.word in freqs)
        res.end(String(freqs[req.params.word]));
    else
        res.end('unknown');
});

app.get('/word/vect/:word', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    if (req.params.word in words)
        res.end(words[req.params.word].join(' '));
    else
        res.end('unknown');
});

app.get('/word/dist/:word1/:word2', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    if (req.params.word1 in words && req.params.word2 in words) {
        const dist = (1 - cos(words[req.params.word1], words[req.params.word2])) / 2;
        res.end(String(dist));
    }
    else
        res.end('unknown');
});


app.post('/text/vect', function(req, res) {
    res.end(text_to_vect(req.body.text).join(' '));
});

app.post('/text/dist', function(req, res) {
    const v1 = text_to_vect(req.body.text1);
    const v2 = text_to_vect(req.body.text2);

    res.end(String((1 - cos(v1, v2)) / 2));
});

console.log('Listening on port', PORT);
app.listen(PORT);
