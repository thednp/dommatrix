export const getExampleDOM = () => {
  // const CSS = await fetch("https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css").then(r => r.text());
  // This is just a raw example of setting up some DOM
  // that we can interact with. Swap this with your UI
  // framework of choice 😉
  // const div = document.createElement('div');
  const HTML = document.documentElement;
  HTML.innerHTML = 
`<head>
  <meta charset="UTF-8">
  <title>DOMMatrix Testing Page</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
  <style>
    .box {height: 200px;}
    #dom, #css {transition: transform 0.5s ease;}
  </style>
</head>
<body class="container">
  <h1 class="mt-3 mt-md-5"><a class="text-decoration-none" href="https://github.com/thednp/DOMMatrix">DOMMatrix Shim Test</a></h1>

  <div class="row">
    <div id="css" class="col-12 col-md-6">
      <div class="box bg-primary text-white p-3 my-3 text-center align-self-center rounded">
        <b>CSSMatrix</b><br><span class="row"></span>
      </div>
    </div>
    <div id="dom" class="col-12 col-md-6">
      <div class="box bg-secondary text-white p-3 my-3 text-center align-self-center rounded">
        <b>DOMMatrix</b><br><span class="row"></span>
      </div>
    </div>
  </div>

</body>
`;

  return HTML;
};
