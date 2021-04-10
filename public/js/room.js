// const url="../../public/js/pdf.pdf"

function base64ToBlob(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: 'application/pdf' });
};

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.5,
  canvas = document.querySelector('#pdf-render'),
  ctx = canvas.getContext('2d');
  const pdfdata = document.querySelector('#pdf')
  const pdfbase64 = pdfdata.innerText
  const pdfbase64_2 = pdfbase64.substr(56,pdfbase64.length-60)
  console.log(pdfbase64[40])
  console.log(pdfbase64[41])
  console.log(pdfbase64[42])
  console.log(pdfbase64[43])
  console.log(pdfbase64[44])
  console.log(pdfbase64[45])
  console.log(pdfbase64[46])
  console.log(pdfbase64[56])
  console.log(pdfbase64.length)
  console.log(pdfbase64[pdfbase64.length-5])
  console.log(pdfbase64_2[0])
  console.log(pdfbase64_2[pdfbase64_2.length-1])

// Render the page
const renderPage = num => {
  pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    // Output current page
    document.querySelector('#page-num').textContent = num;
  });
};

// Check for pages rendering
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// Show Prev Page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
};

// Show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
};

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

// Get Document
pdfjsLib
  .getDocument({ data : atob(pdfbase64_2)})
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
  })
  .catch(err => {
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    // Remove top bar
    document.querySelector('.top-bar').style.display = 'none';
  });

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);
