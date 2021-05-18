// 获取webgl
var canvas = document.getElementById('webgl');
var gl = canvas.getContext('webgl');
var width = canvas.width;
var height = canvas.height;
var num = 1; // 深度

initWebGl();

function initWebGl() {
  // 初始化着色器
  var vs_source = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main () {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
  }
  `;
  // gl_Position = vec4(-0.5, -0.5, 1.0, 1.0);
  // gl_PointSize=80.0;
  var fs_source = `
  #ifdef GL_ES
    precision mediump float;
  #endif
  uniform vec4 a_FragColor;
  void main () {
    float d = distance(gl_PointCoord, vec2(0.5, 0.5));
    if (d<0.5) {
      gl_FragColor= a_FragColor; 
    } else {
      discard;
    }
  }
  `;
  // 创建着色器程序
  var glProgram = gl.createProgram();
  // 创建顶点着色器
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  // 创建片元着色器
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  // 绑定资源
  gl.shaderSource(vertexShader, vs_source);
  // 绑定资源
  gl.shaderSource(fragmentShader, fs_source);

  // 编译顶点着色器
  gl.compileShader(vertexShader);
  // 编译片元着色器
  gl.compileShader(fragmentShader);

  // 能打印出错误提示
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    // alert(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(vertexShader));
  }

  // 能打印出错误提示
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    // alert(gl.getShaderInfoLog(fragmentShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
  }

  // 添加着色器对象
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);

  // 4、把着色器链接程一个完整的程序并使用他
  gl.linkProgram(glProgram);
  gl.useProgram(glProgram);
  // 绑定glProgram到gl对象中
  gl.glProgram = glProgram;
  render();
}

function setPoints(data, num) {
  // 1、创建缓冲区
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    log('创建缓存区失败。');
    return -1;
  }
  // 2、绑定缓冲区
  // gl.bindBuffer(target, buffer);
  // 用法
  // target:指定缓冲区的目标类型
  // bufffer:自己创建缓冲区的对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 申请一片区域
  // 3、向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // 4、获取attribute变量的存储位置，返回对应的地址信息
  var aPosition = gl.getAttribLocation(gl.glProgram, 'a_Position');
  // 5、把缓冲区对象分配给a_Position
  // gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE*6, 0)
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  // 6、链接缓冲区对象和aPosition
  gl.enableVertexAttribArray(aPosition);

  var aPointSize = gl.getAttribLocation(gl.glProgram, 'a_PointSize');
  gl.vertexAttrib1f(aPointSize, 3.0); // 大小
  var aFragColor = gl.getUniformLocation(gl.glProgram, 'a_FragColor');
  gl.uniform4f(aFragColor, 1.0, 0.0, 0.5, 1.0); // 颜色

  // 清除屏幕
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 执行绘制工作
  gl.drawArrays(gl.POINTS, 0, num); // 0表示从第0个点开始，1表示绘制一个点
}

// 创建点
function createPoints(gap) {
  // 波动最大幅度 20px;
  var max = 10;
  var n = 100;
  var m = 10;
  var arr = [];
  // 角度转弧度, 360度等于2πr
  var numToDeg = function (num) {
    return (Math.PI * num) / 180;
  };
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      var deg = i * 7 - j * 20 + gap;
      var x = webglX(-(width / 2) - 200 + i * ((width + 500) / n) + j * 20);
      var y = webglY(
        -(height / 2) + Math.sin(numToDeg(deg)) * (max + j * 3) + j * 20
      );
      var z = 1;
      var item = [x, y, z];
      arr = arr.concat(item);
    }
  }
  return {
    positions: new Float32Array(arr),
    nums: m * n,
  };
}
function render() {
  requestAnimationFrame(render);
  num = num - 1;
  var data = createPoints(num);
  console.log(data);
  // setSize(data.size, data.nums);
  setPoints(data.positions, data.nums);
}
function webglX(num) {
  return num / (width / 2);
}

function webglY(num) {
  return num / (height / 2);
}
