const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify')
const replaceTemplate = require('./1-node-farm/starter/modules/replaceTemplate.js')



///////////////////////////////////////////////////////////////
// FILES


// // Blocking, synchronous way
// const textIn = fs.readFileSync('./1-node-farm/starter/txt/input.txt', 'utf8');

// console.log(textIn);

// const textOut = `This is what we know abut the avocado: ${textIn}.\nCreated on ${Date.now()}`; 
// fs.writeFileSync('./1-node-farm/starter/txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./1-node-farm/starter/txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.error('ERROR!');

//     fs.readFile(`./1-node-farm/starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./1-node-farm/starter/txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./1-node-farm/starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log('Your file has been written');
//             })
//         })
//     })
// })
// console.log('Will read file');


///////////////////////////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}))
console.log(slugs);

const server = http.createServer((req, res) => {

    
    const {query, pathname} = url.parse(req.url, true);

    // Overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, { 'Content-type': 'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)



        res.end(output)

    // Product page
    }else if(pathname === '/product'){
        res.writeHead(200, { 'Content-type': 'text/html'})
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)

    // API
    }else if(pathname === '/api'){
    res.writeHead(200, { 'Content-type': 'application/json'})
    res.end(data)

    //Not found
    }else{
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('<h1>Page not found!</h1>')
    }

    
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000');
})