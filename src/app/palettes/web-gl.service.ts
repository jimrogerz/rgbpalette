import { Injectable } from '@angular/core';
import * as matrix from 'gl-matrix';

@Injectable({
  providedIn: 'root'
})
export class WebGLService {
  private gl!: WebGLRenderingContext;

  private get clientCanvas(): HTMLCanvasElement {
    return this.gl.canvas as HTMLCanvasElement
  }

  private positionBuffer: any
  private programInfo: any

  initialiseWebGLContext(canvas: HTMLCanvasElement, fragmentShaderSrc: string, vertexShaderSrc: string): boolean {
    const options = {antialias: true, alpha: false};
    let ctx  = (canvas.getContext('webgl', options)
     || canvas.getContext('experimental-webgl', options)) as WebGLRenderingContext;
    if (!ctx) {
      console.error("webgl not supported");
      return false;
    }
    this.gl = ctx;
    let shaderProgram = this.initializeShaders(fragmentShaderSrc, vertexShaderSrc);
    if (shaderProgram == null) {
      return false;
    }
    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(
          shaderProgram!,
          'aVertexPosition'
        ),
      },
    };
    this.positionBuffer = this.buildPositionBuffer();
    this.updateViewport();
    this.initialiseWebGLCanvas();
    this.bindVertexPosition(this.programInfo, this.positionBuffer);
    this.gl.useProgram(this.programInfo.program);
    return true;
  }

  initialiseWebGLCanvas() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  setShaderInt(name: string, int: number) {
    this.gl.uniform1i(this.getLocation(name), int);
  }

  setShaderVec3(name: string, f1: number, f2: number, f3: number) {
    this.gl.uniform3f(this.getLocation(name), f1, f2, f3);
  }

  setShaderArray(name: string, array:number[]) {
    this.gl.uniform1fv(this.getLocation(name), new Float32Array(array));
  }

  setShader4Array(name: string, array:number[]) {
    this.gl.uniform4fv(this.getLocation(name), new Float32Array(array));
  }

  private getLocation(name: string): WebGLUniformLocation | null {
    return this.gl.getUniformLocation(this.programInfo.program, name);
  }

  updateViewport() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);    
  }

  drawScene() {
    const offset = 0;
    const vertexCount = 4;
    this.gl.drawArrays(
      this.gl.TRIANGLE_STRIP,
      offset,
      vertexCount
    );
  }

  bindVertexPosition(programInfo: any, positionBuffer: any) {
    const bufferSize = 2;
    const type = this.gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      bufferSize,
      type,
      normalize,
      stride,
      offset
    );
    this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  buildPositionBuffer(): any {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
       1.0,  1.0, 
      -1.0,  1.0, 
       1.0, -1.0, 
      -1.0, -1.0
    ]);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      positions,
      this.gl.STATIC_DRAW
    );
    return positionBuffer;
  }

  initializeShaders(fragmentShaderSrc: string, vertexShaderSrc: string): WebGLProgram | null {
    let shaderProgram = this.gl.createProgram();
    let fragmentShader = this.loadShader(fragmentShaderSrc, 'x-shader/x-fragment');
    if (!fragmentShader) return null;
    let vertexShader = this.loadShader(vertexShaderSrc,'x-shader/x-vertex');
    if (!vertexShader) return null;
    this.gl.attachShader(shaderProgram!, fragmentShader);
    this.gl.attachShader(shaderProgram!, vertexShader);
    this.gl.linkProgram(shaderProgram!);
    if (!this.gl.getProgramParameter(shaderProgram!, this.gl.LINK_STATUS)) {
      console.log(
        'Unable to initialize the shader program: ' +
          this.gl.getProgramInfoLog(shaderProgram!)
      );
    }
    return shaderProgram!;
  }

  private determineShaderType(shaderMimeType: string): number {
    if (shaderMimeType) {
      if (shaderMimeType === 'x-shader/x-vertex') {
        return this.gl.VERTEX_SHADER;
      } else if (shaderMimeType === 'x-shader/x-fragment') {
        return this.gl.FRAGMENT_SHADER;
      } else {
        console.log('Error: could not determine the shader type');
      }
    }
    return -1;
  }

  private loadShader(shaderSource: string, shaderType: string): WebGLShader | null {
    const shaderTypeAsNumber = this.determineShaderType(shaderType);
    if (shaderTypeAsNumber < 0) {
      return null;
    }
    const glShader = this.gl.createShader(shaderTypeAsNumber);
    this.gl.shaderSource(glShader!, shaderSource);
    this.gl.compileShader(glShader!);
    const compiledShader = this.gl.getShaderParameter(glShader!, this.gl.COMPILE_STATUS);
    if (!compiledShader) {
      const lastError = this.gl.getShaderInfoLog(glShader!);
      console.error(lastError);
      this.gl.deleteShader(glShader!);
      return null;
    }
    return glShader!;
  }
}
