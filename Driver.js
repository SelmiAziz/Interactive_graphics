// Driver.js

/**
 * The Driver class acts as the low-level bridge to the GPU hardware.
 * It manages the WebGL context, shader compilation, and viewport isolation.
 */
export class Driver {
    /**
     * @param {string} canvasId - The ID of the HTML5 canvas element
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        // "gl" is the low-level API to communicate with the graphics card
        this.gl = this.canvas.getContext("webgl");

        if (!this.gl) {
            throw new Error("WebGL Driver failed to initialize. Hardware not supported.");
        }

        this.program = null; // This will hold our compiled shader program
    }

    /**
     * Compiles and links the Vertex and Fragment shaders into a single GPU Program.
     * @param {string} vsSource - The Vertex Shader GLSL source code
     * @param {string} fsSource - The Fragment Shader GLSL source code
     */
    loadShaders(vsSource, fsSource) {
        const gl = this.gl;

        // Compile individual shader stages
        const vs = this._compileShader(gl.VERTEX_SHADER, vsSource);
        const fs = this._compileShader(gl.FRAGMENT_SHADER, fsSource);

        // Create the program container
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        // Check for linking errors (the most common place for bugs)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const msg = gl.getProgramInfoLog(program);
            throw new Error("Firmware Linking Error: " + msg);
        }

        this.program = program;
        gl.useProgram(this.program);
        
        return program; 
    }

    /**
     * Internal helper to compile a single shader stage.
     */
    _compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const error = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`Shader Compilation Error (${type}): ${error}`);
        }
        return shader;
    }

    /**
     * Isolates a specific area of the screen for drawing.
     * Math: Uses Scissor Test to prevent pixels from "leaking" outside the area.
     */
    isolateArea(x, y, width, height, r, g, b, a = 1.0) {
        const gl = this.gl;

        // Activate the drawing box (Viewport)
        gl.viewport(x, y, width, height);
        
        // Activate the clipping box (Scissor)
        gl.scissor(x, y, width, height);
        gl.enable(gl.SCISSOR_TEST);

        // Clear only the isolated pixels with the chosen color
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * Finds the memory address of a variable inside the GPU Program.
     * @param {string} name - The name of the variable (e.g., 'uColor')
     * @param {boolean} isUniform - True if it's a Uniform, False if it's an Attribute
     */
    getLocation(name, isUniform = true) {
        if (isUniform) {
            return this.gl.getUniformLocation(this.program, name);
        } else {
            return this.gl.getAttribLocation(this.program, name);
        }
    }
}
