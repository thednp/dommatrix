const str = document.getElementById("str");
const css = document.getElementById("css");
const dom = document.getElementById("dom");
const span1 = css.querySelector("span.row");
const span2 = dom.querySelector("span.row");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
let { value } = str;
let includeFunction = [
  "matrix",
  "translate",
  "rotate",
  "scale",
  "skew",
  "perspective",
].some((x) => value.includes(x));
value = includeFunction ? value : value.split(",").map(parseFloat);
let matrix1 = new CSSMatrix(value);
let matrix2 = new DOMMatrix(value);

btn1.addEventListener("click", (e) => {
  value = str.value;
  if (!value || !value.length) return;
  includeFunction = [
    "matrix",
    "translate",
    "rotate",
    "scale",
    "skew",
    "perspective",
  ].some((x) => value.includes(x));

  value = includeFunction ? value : value.split(",").map(parseFloat);

  if (
    (typeof value === "object" && [16, 6].includes(value.length)) ||
    includeFunction
  ) {
    matrix1 = new CSSMatrix(value);
    matrix2 = new DOMMatrix(value);
  } else {
    throw TypeError("Invalid transform value");
  }

  const matrixString1 = Array.from(matrix1.toFloat32Array())
    .map((x, i) => '<span class="col-3">' + x.toFixed(4) + "</span>")
    .join("");
  const matrixString2 = Array.from(matrix2.toFloat32Array())
    .map((x, i) => '<span class="col-3">' + x.toFixed(4) + "</span>")
    .join("");

  css.style.transform = matrix1.toString();
  dom.style.transform = matrix2.toString();
  span1.innerHTML = matrixString1;
  span2.innerHTML = matrixString2;
  css.matrix = matrix1;
  dom.matrix = matrix2;
});
btn2.addEventListener("click", (e) => {
  matrix1 = new CSSMatrix();
  matrix2 = new DOMMatrix();
  const pp = Number(document.getElementById("perspective").value);
  const tx = Number(document.getElementById("translateX").value);
  const ty = Number(document.getElementById("translateY").value);
  const tz = Number(document.getElementById("translateZ").value);
  const rx = Number(document.getElementById("rotateX").value);
  const ry = Number(document.getElementById("rotateY").value);
  const rz = Number(document.getElementById("rotateZ").value);
  const sx = Number(document.getElementById("skewX").value);
  const sy = Number(document.getElementById("skewY").value);
  const s = Number(document.getElementById("scale").value);

  if (pp && (tz || rx || ry)) {
    matrix1.m34 = -1 / pp;
    matrix2.m34 = -1 / pp;
  }

  if (tx || ty || tz) {
    matrix1.translateSelf(tx || 0, ty || 0, tz || 0);
    matrix2.translateSelf(tx || 0, ty || 0, tz || 0);
  }
  if (rx || ry || rz) {
    matrix1.rotateSelf(rx || 0, ry || 0, rz || 0);
    matrix2.rotateSelf(rx || 0, ry || 0, rz || 0);
  }
  if (sx) {
    matrix1.skewXSelf(sx || 0);
    matrix2.skewXSelf(sx || 0);
  }
  if (sy) {
    matrix1.skewYSelf(sy || 0);
    matrix2.skewYSelf(sy || 0);
  }
  if (s !== 1) {
    matrix1.scaleSelf(s || 1);
    matrix2.scaleSelf(s || 1);
  }

  // reset perspective
  if (matrix1.m34 !== 0 && !tz && !rx && !ry) {
    matrix1.m34 = 0;
    matrix2.m34 = 0;
  }

  const matrixString1 = Array.from(matrix1.toFloat32Array())
    .map((x, i) => '<span class="col-3">' + x.toFixed(4) + "</span>")
    .join("");
  const matrixString2 = Array.from(matrix2.toFloat32Array())
    .map((x, i) => '<span class="col-3">' + x.toFixed(4) + "</span>")
    .join("");

  css.style.transform = matrix1.toString();
  dom.style.transform = matrix2.toString();
  span1.innerHTML = matrixString1;
  span2.innerHTML = matrixString2;
  css.matrix = matrix1;
  dom.matrix = matrix2;
});
function setMatrix(v) {
  str.value = v;
  value = v;
}
function resetMatrix() {
  document.getElementById("translateX").value = 0;
  document.getElementById("translateY").value = 0;
  document.getElementById("translateZ").value = 0;
  document.getElementById("rotateX").value = 0;
  document.getElementById("rotateY").value = 0;
  document.getElementById("rotateZ").value = 0;
  document.getElementById("skewX").value = 0;
  document.getElementById("skewY").value = 0;
  document.getElementById("scale").value = 1;
  btn2.dispatchEvent(new Event("click"));
}
