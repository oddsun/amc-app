const MathJaxScript = () => {

  (window as any).MathJax = {
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    },
  };

  const script = document.createElement('script');
  script.type = "text/javascript";
  script.src = './tex-mml-chtml.js';
  script.async = true;
  document.head.appendChild(script);
  console.log('loaded mathjax');
  return () => {
    document.head.removeChild(script);
  }
};
export default MathJaxScript;
