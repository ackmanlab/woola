// load chromium pdf making functionality
const puppeteer = require('puppeteer');

// module.exports = function writepdf(uri, outfilename, config=null) {
//   (async() => {
//   const browser = await puppeteer.launch({args: ['--no-sandbox']});
//   const page = await browser.newPage();
//   await page.goto('http://localhost:8001/practice_midterm1.txt');
//   await page.pdf({path: 'practice_midterm1.pdf', format: 'Letter'});
// 
//   await browser.close();
//   })();
// 
// 
// }

module.exports = function writepdf(uri, outfilename, config=null) {

 if (!config) {
    const pdfconfig = {
        path: outfilename, 
        format: 'Letter',
        headerTemplate : '<div id="header-template" style="font-size:10px !important; color:#808080; width:100%; margin-left:50px; text-align:left">Name_________________________</div><div class="title" style="font-size:10px !important; color:#808080; width:100%; margin-right:50px; text-align:right"></div>',
        // headerTemplate : '<div id="header-template" style="font-size:10px !important; color:#808080; width:100%; padding-left:50px; text-align:left"></div>',
        footerTemplate : '<div id="footer-template" style="width:100%; text-align:left; font-size:10px !important; color:#808080; padding-right:50px"><span class="pageNumber"></span>/<span class="totalPages"></span></div>',
        // footerTemplate : '<div id="footer-template" style="width:100%; text-align:right; font-size:10px !important; color:#808080; padding-right:50px">Ackman, <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
        displayHeaderFooter: true,
        preferCSSPageSize : false,
        margin: {
          top: "50px",
          bottom: "50px",
          left: "50px",
          right: "50px"
        }
      }
 } else {
   const pdfconfig = config
   if (!pdfconfig.outfilename) {
     pdfconfig.path = outfilename
   }
    console.log('Rendering ' + uri)
    puppeteer.launch({args: ['--no-sandbox']}).then(async browser => {
    const page = await browser.newPage();
    await page.goto(uri, {waitUntil: 'networkidle0'});
    // await page.goto('https://archlinux.org');
    await page.pdf(pdfconfig);
    await browser.close();
   
})
 }

}

// return new Promise(async (resolve, reject) => {
//   console.log('Rendering ' + uri)
//   try {
//   const browser = await puppeteer.launch({args: ['--no-sandbox']});
//   const page = await browser.newPage();
//   await page.goto(uri, {timeout: 0, waitUntil: 'domcontentloaded'});
//   // await page.goto('https://archlinux.org');
//   await page.pdf(pdfconfig); 
//   browser.close(null,(err,res) => {
//       if (err) return console.log(err)
//       console.log(res)      
//   });
//   } catch (err) {
//     return reject(err)
//   }
// })



// pdf.create(html, pdfconfig).toFile(outfilename, (err, res) => {
//   if (err) return console.log(err)
//   console.log(res)
//  })



// run(5).then(console.log).catch(console.error);



// async function makepdf(url,cfg) {
//   console.log('Rendering pdf...')
//   try {
//   const browser = await puppeteer.launch({args: ['--no-sandbox']});
//   const page = await browser.newPage();
//   await page.goto(url, {waitUntil: 'networkidle2'});
//   await page.pdf(cfg); 
//   await browser.close();
// } catch (err) {
//   return console.log(err)
// }
//   // if (err) return console.log(err)
//   // console.log(res)    
// }
