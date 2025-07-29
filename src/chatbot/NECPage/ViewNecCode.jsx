// // src/pages/ViewNecCode.jsx
// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const ViewNecCode = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { code, description, pdfUrl } = location.state || {};


//   // const code = 'NEC 210.8(A)';
//   // const description = 'This section mandates ground-fault protection for personnel in dwelling units, bathrooms, garages, and more.';
//   // const pdfUrl = 'https://hrb5wx2v-5008.inc1.devtunnels.ms/matched_pages/Split-books_Split3/NEC_Page_19_1_Split2023%20NEC%2070%20Handbook%20A_split_3.pdf';



//   // Optional: handle if no data is passed
//   if (!code || !description || !pdfUrl) {
//     return (
//       <div className="container py-5 text-center">
//         <h4 className="text-danger">No NEC code data provided.</h4>
//         <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-4">
//       <div className="card shadow">
//         <div className="card-body">
//           <h2 className="card-title text-primary mb-3">
//             Showing NEC Code: {code}
//           </h2>
//           <p className="card-text mb-4">{description}</p>

//           <div className="ratio ratio-16x9">
//             <iframe
//               title={`NEC Code PDF - ${code}`}
//               src={pdfUrl}
//               allowFullScreen
//             ></iframe>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewNecCode;

// // src/pages/ViewNecCode.jsx
// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';

// const ViewNecCode = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search);

//   const code = query.get('code');
//   const description = query.get('description');
//   const pdfUrl = query.get('pdfUrl');

//   // const code = 'NEC 210.8(A)';
//   // const description = 'This section mandates ground-fault protection for personnel in dwelling units, bathrooms, garages, and more.';
//   // const pdfUrl = 'https://hrb5wx2v-5008.inc1.devtunnels.ms/matched_pages/Split-books_Split3/NEC_Page_19_1_Split2023%20NEC%2070%20Handbook%20A_split_3.pdf';



//   if (!code) {
//     return (
//       <div className="container py-5 text-center">
//         <h4 className="text-danger">🚫 No NEC code data provided.</h4>
//         <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       {/* <div className="d-flex justify-content-between align-items-center mb-4">
//         <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Back
//         </button>
//         <h4 className="mb-0 text-muted">NEC Code Viewer</h4>
//       </div> */}

//       <div className="card shadow-lg border-0">
//         <div className="card-body">
//           <h2 className="card-title text-primary d-flex align-items-center mb-3">
//             <FaFilePdf className="me-2" /> {code}
//           </h2>
//           <p className="card-text fs-5 text-dark">{description}</p>

//           <div className="ratio ratio-16x9 border rounded shadow-sm mt-4">
//             <iframe
//               title={`NEC Code PDF - ${code}`}
//               src={pdfUrl}
//               className="rounded"
//               allowFullScreen
//             ></iframe>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewNecCode;import React, { useEffect, useState, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaFilePdf, FaSpinner } from 'react-icons/fa';
// import { PDFDocument } from 'pdf-lib';
// import { useEffect, useRef, useState } from 'react';

// const ViewNecCode = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search);

//   const code = query.get('code');
//   const urls = JSON.parse(query.get('urls') || '[]');
//   const descriptions = JSON.parse(query.get('descriptions') || '[]');

//   const [mergedDescription, setMergedDescription] = useState('');
//   const [loading, setLoading] = useState(true);
//   const mergedPdfUrlRef = useRef(null); // Use ref to avoid re-generating blob URL

//   useEffect(() => {
//     if (urls.length > 0) {
//       mergePdfs(urls).then((url) => {
//         mergedPdfUrlRef.current = url;
//         setLoading(false);
//       });

//       const cleanDescriptions = descriptions
//         .map((desc) => desc.replace(/\n/g, ' ').trim())
//         .join(' ');
//       setMergedDescription(cleanDescriptions);
//     } else {
//       setLoading(false);
//     }

//     // Clean up old blob URL on unmount
//     return () => {
//       if (mergedPdfUrlRef.current) {
//         URL.revokeObjectURL(mergedPdfUrlRef.current);
//       }
//     };
//   }, [urls, descriptions]);

//   const mergePdfs = async (urls) => {
//     const mergedPdf = await PDFDocument.create();

//     for (const url of urls) {
//       const pdfBytes = await fetch(url).then((res) => res.arrayBuffer());
//       const pdf = await PDFDocument.load(pdfBytes);
//       const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
//       copiedPages.forEach((page) => mergedPdf.addPage(page));
//     }

//     const mergedPdfFile = await mergedPdf.save();
//     const mergedPdfBlob = new Blob([mergedPdfFile], { type: 'application/pdf' });
//     return URL.createObjectURL(mergedPdfBlob);
//   };

//   if (!code) {
//     return (
//       <div className="container py-5 text-center">
//         <h4 className="text-danger">🚫 No NEC code data provided.</h4>
//         <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <div className="card shadow-lg border-0">
//         <div className="card-body">
//           <h2 className="card-title text-primary d-flex align-items-center mb-3">
//             <FaFilePdf className="me-2" /> {code}
//           </h2>
//           <p className="card-text fs-5 text-dark">{mergedDescription}</p>

//           {loading ? (
//             <div className="d-flex justify-content-center align-items-center mt-5">
//               <FaSpinner className="fa-spin me-2 text-primary" />
//               <span>Loading PDF...</span>
//             </div>
//           ) : (
//             <div className="ratio ratio-16x9 border rounded shadow-sm mt-4">
//               <iframe
//                 title={`NEC Code PDF - ${code}`}
//                 src={mergedPdfUrlRef.current}
//                 className="rounded"
//                 allowFullScreen
//               ></iframe>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewNecCode;

// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaFilePdf, FaSpinner } from 'react-icons/fa';
// import { useEffect, useState } from 'react';

// const ViewNecCode = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search);

//   const code = query.get('code');
//   const article = query.get('article');
//   const description = query.get('description');

//   const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMergedPdf = async () => {
//       try {
//         const response = await fetch('https://netaai-backend-production.up.railway.app/api/merge/mergeArticlePDFs', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ search: `article ${article}` }),
//         });

//         const data = await response.json();
//         if (data.status === 'success' && data.merged_pdf_path) {
//           setMergedPdfUrl(data.merged_pdf_path);
//         } else {
//           console.error('Merge failed:', data);
//         }
//       } catch (error) {
//         console.error('Error fetching merged PDF:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (article) {
//       fetchMergedPdf();
//     } else {
//       setLoading(false);
//     }
//   }, [article]);

//   if (!code) {
//     return (
//       <div className="container py-5 text-center">
//         <h4 className="text-danger">🚫 No NEC code data provided.</h4>
//         <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <div className="card shadow-lg border-0">
//         <div className="card-body" style={{ minHeight: '100vh', background: '#f9f9f9' }}>
//           <h2 className="card-title text-primary d-flex align-items-center mb-3">
//             <FaFilePdf className="me-2" /> {code}
//           </h2>
//           <p className="card-text fs-5 text-dark">{description}</p>

//           {loading ? (
//             <div className="d-flex justify-content-center align-items-center mt-5" style={{ height: '100%' }}>
//               <FaSpinner className="fa-spin me-2 text-primary" />
//               <span>Loading PDF...</span>
//             </div>
//           ) : mergedPdfUrl ? (
//             <div className="ratio ratio-16x9 border rounded shadow-sm mt-4" style={{ height: '100%' }}>
//               {/* <iframe
//                 title={`NEC Code PDF - ${code}`}
//                 src={mergedPdfUrl}
//                 className="rounded"
//                 allowFullScreen
//               ></iframe> */}
//               <iframe
//                 src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(mergedPdfUrl)}`}
//                 className="rounded w-100"
//                 style={{ height: '100%' }}
//                 title="NEC Code PDF"
//               />
//             </div>
//           ) : (
//             <p className="text-danger">⚠️ Failed to load PDF.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewNecCode;
//=====================================================================================

// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaFilePdf, FaSpinner } from 'react-icons/fa';
// import { useEffect, useState } from 'react';

// const ViewNecCode = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search);

//   const code = query.get('code');
//   const article = query.get('article');
//   const description = query.get('description');

//   const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMergedPdf = async () => {
//       try {
//         const response = await fetch('https://netaai-backend-production.up.railway.app/api/merge/mergeArticlePDFs', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ search: `article ${article}` }),
//         });

//         const data = await response.json();
//         if (data.status === 'success' && data.merged_pdf_path) {
//           setMergedPdfUrl(data.merged_pdf_path);
//         } else {
//           console.error('Merge failed:', data);
//         }
//       } catch (error) {
//         console.error('Error fetching merged PDF:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (article) {
//       fetchMergedPdf();
//     } else {
//       setLoading(false);
//     }
//   }, [article]);

//   if (!code) {
//     return (
//       <div className="container py-5 text-center">
//         <h4 className="text-danger">🚫 No NEC code data provided.</h4>
//         {/* <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Go Back
//         </button> */}
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight: '100vh', background: '#f9f9f9', padding: '1rem' }}>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         {/* <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" />
//           Back
//         </button> */}
//         <h5 className="text-primary mb-0 d-flex align-items-center">
//           <FaFilePdf className="me-2" /> {code}
//         </h5>
//       </div>
//       <p className="fs-6 text-dark mb-4">{description}</p>

//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
//           <FaSpinner className="fa-spin me-2 text-primary" />
//           <span>Loading PDF...</span>
//         </div>
//       ) : mergedPdfUrl ? (
//         <div style={{ height: '80vh' }} className="border rounded shadow-sm">
//           <iframe
//             src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(mergedPdfUrl)}`}
//             title={`NEC Code PDF - ${code}`}
//             style={{ width: '100%', height: '100%', border: 'none' }}
//           />
//         </div>
//       ) : (
//         <p className="text-danger">⚠️ Failed to load PDF.</p>
//       )}
//     </div>
//   );
// };

// export default ViewNecCode;

import { useLocation } from 'react-router-dom';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import './pdfWorker';

const ViewNecCode = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const code = query.get('code');
  const article = query.get('article');
  const description = query.get('description');

  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [references, setReferences] = useState([]);


  const extractNECReferencesFromPDF = async (pdfUrl) => {
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += ' ' + pageText;
      }

      const regex = /\b(\d{3}\.\d+)\b/g;
      const matches = [...fullText.matchAll(regex)];

      const cleanedCode = code.replace(/\s+/g, '');
      const articlePrefix = cleanedCode.split('.')[0];
      const numericPart = articlePrefix.match(/\d+/)[0];
      const articleSeriesRegex = new RegExp(`^${articlePrefix}(\\.|$)`);

      const filteredRefs = [...new Set(
        matches
          .map(m => m[0])
          .filter(ref => {
            const cleanedRef = ref.replace(/\s+/g, '');
            return !cleanedRef.startsWith(numericPart) && !articleSeriesRegex.test(cleanedRef);
          })
      )];

      return filteredRefs;
    } catch (err) {
      console.error("Error extracting references:", err);
      return [];
    }
  };


  useEffect(() => {
    const fetchMergedPdf = async () => {
      try {
        const response = await fetch('https://netaai-backend-production.up.railway.app/api/merge/mergeArticlePDFs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search: `article ${article}` }),
        });

        const data = await response.json();
        if (data.status === 'success' && data.merged_pdf_path) {
          setMergedPdfUrl(data.merged_pdf_path);

          const refs = await extractNECReferencesFromPDF(data.merged_pdf_path);
          setReferences(refs);
        } else {
          console.error('Merge failed:', data);
        }
      } catch (error) {
        console.error('Error fetching merged PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    if (article) {
      fetchMergedPdf();
    } else {
      setLoading(false);
    }
  }, [article]);


  if (!code) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">🚫 No NEC code data provided.</h4>
      </div>
    );
  }

  const handlenecclick = (ref) => {
    // Extract article number from NEC code
    const match = ref.code.match(/\d+/); // extracts first number like 110
    const articleNumber = match ? match[0] : null;

    if (!articleNumber) {
      alert("Invalid NEC code");
      return;
    }

    const queryParams = new URLSearchParams({
      code: ref.code,
      article: articleNumber,
      description: ref.description || '',
    }).toString();

    const url = `/nec?${queryParams}`;
    window.open(url, '_blank');
  };


  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9', padding: '1rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-primary mb-0 d-flex align-items-center">
          <FaFilePdf className="me-2" /> {code}
        </h5>
      </div>

      <p className="fs-6 text-dark mb-4">{description}</p>

      {/* {references.length > 0 && (
        <div className="mb-4">
          <h6 className="text-muted mb-2">Referenced NEC Codes:</h6>
          <div className="border rounded shadow-sm bg-white p-3">
            <div className="row">
              {references.sort().map((ref, idx) => (
                <div key={idx} className="col-md-3 col-sm-4 col-6 mb-2">
                  <span className="badge bg-primary text-white px-3 py-2 w-100 text-center" style={{ fontSize: '0.95rem' }}>
                    {ref}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}

      {references.length > 0 && (
        <div className="mb-4">
          <h6 className="text-muted mb-2">Referenced NEC Codes:</h6>
          <div className="border rounded shadow-sm bg-white p-3">
            <div className="row">
              {references.sort().map((ref, idx) => (
                <div key={idx} className="col-md-3 col-sm-4 col-6 mb-2">
                  <button
                    className="badge bg-primary text-white px-3 py-2 w-100 text-center"
                    style={{ fontSize: '0.95rem', cursor: 'pointer' }}
                    onClick={() => handlenecclick({ code: ref, description: description })}
                  >
                    {ref}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <FaSpinner className="fa-spin me-2 text-primary" />
          <span>Loading PDF...</span>
        </div>
      ) : mergedPdfUrl ? (
        <div style={{ height: '80vh' }} className="border rounded shadow-sm">
          <iframe
            src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(mergedPdfUrl)}`}
            title={`NEC Code PDF - ${code}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      ) : (
        <p className="text-danger">⚠️ Failed to load PDF.</p>
      )}
    </div>
  );
};

export default ViewNecCode;
