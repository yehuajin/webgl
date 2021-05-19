function initShader(gl, vs_source, fs_source) {
  // 2、创建顶点着色器
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  // 绑定资源
  gl.shaderSource(vertexShader, vs_source);
  // 编译顶点着色器
  gl.compileShader(vertexShader);

  // 能打印出错误提示
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    // alert(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(vertexShader));
  }

  // 2、创建片元着色器
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  // 绑定资源
  gl.shaderSource(fragmentShader, fs_source);
  // 编译片元着色器
  gl.compileShader(fragmentShader);

  // 能打印出错误提示
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    // alert(gl.getShaderInfoLog(fragmentShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
  }

  // 3、创建着色器程序
  var glProgram = gl.createProgram();
  // 添加着色器对象
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);

  // 4、把着色器链接程一个完整的程序并使用他
  gl.linkProgram(glProgram);
  gl.useProgram(glProgram);
  gl.glProgram = glProgram;
}

function bufferInit(gl, data, attribute, num = 2) {
  // 1、创建缓冲区
  var vertexBuffer = gl.createBuffer();
  // 2、绑定缓冲区
  // gl.bindBuffer(target, buffer);
  // 用法
  // target:指定缓冲区的目标类型
  // bufffer:自己创建缓冲区的对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 申请一片区域
  // 3、向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // 4、获取attribute变量的存储位置，返回对应的地址信息
  var aPosition = gl.getAttribLocation(gl.glProgram, attribute);
  // 5、把缓冲区对象分配给a_Position
  // gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE*6, 0);第二个参数2表示一组数据是2个，即一个点有2个数据组成
  gl.vertexAttribPointer(aPosition, num, gl.FLOAT, false, 0, 0);
  // 6、链接缓冲区对象和aPosition
  gl.enableVertexAttribArray(aPosition);
}
