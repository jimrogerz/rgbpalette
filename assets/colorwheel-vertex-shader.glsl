attribute vec4 aVertexPosition;
varying lowp vec4 vPosition;

void main(void) {
    gl_Position = aVertexPosition;
    vPosition = aVertexPosition;
}
