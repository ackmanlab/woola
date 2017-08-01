// load phantomjs pdf making functionality
const pdf = require('html-pdf')

module.exports = function writepdf(html, outfilename, config=false) {

  if (!config) {
    var pdfconfig = { 
      format: "Letter",
      border: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in"
      },
      footer: {
        height: "0.5",
        contents: {
          first: " ",
          default: "<div style='text-align:right;color:#adadad;font-size:0.875em'>{{page}}/{{pages}}</div>"
        }
      },
      base: 'file://' + process.cwd() + '/'
    }
  } else {
    var pdfconfig = config
    if (!pdfconfig.base) {
      pdfconfig.base = 'file://' + process.cwd() + '/'
    }
  }
  
  console.log('Rendering pdf...')    

  pdf.create(html, pdfconfig).toFile(outfilename, (err, res) => {
    if (err) return console.log(err)
    console.log(res)
  })
}
