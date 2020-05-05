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
        headerTemplate : '<div id="header-template" style="font-size:10px !important; color:#808080; width:100%; margin-left:50px; text-align:left">Name:</div><div class="title" style="font-size:10px !important; color:#808080; width:100%; margin-right:50px; text-align:right"></div>',
        footerTemplate : '<div id="footer-template" style="width:100%; text-align:left; font-size:10px !important; color:#808080; padding-right:50px"><span class="pageNumber"></span>/<span class="totalPages"></span></div>',
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
    await page.pdf(pdfconfig);
    await browser.close();
   
})
 }

}

