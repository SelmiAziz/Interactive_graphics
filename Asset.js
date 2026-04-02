// Asset.js

/**
 * The Asset class manages GPU buffers for geometric shapes.
 * It ensures vertex data is uploaded once and reused efficiently.
 */
export class Asset {
    /**
     * @param {WebGLRenderingContext} gl - The WebGL context from the Driver
     * @param {Float32Array} data - Flat array of x, y coordinates
     */
    constructor(gl, data) {
        this.gl = gl;
        
        // Create an empty buffer object on the GPU (VRAM)
        this.buffer = gl.createBuffer();
        
        // Calculate the number of vertices (each vertex has 2 components: x and y)
        this.vertexCount = data.length / 2; 
        
        // Bind the buffer to make it the active one for data upload
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);  
        
        // Upload the coordinate data to the GPU memory
        // STATIC_DRAW tells the GPU this data won't change often
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW); 
    }
    
    /**
     * Prepares the GPU to use this specific shape for the next draw call.
     * @param {number} attrLocation - The index of the 'aPosition' attribute in the shader
     */
    enable(attrLocation) {
        // Re-bind this buffer so the GPU knows which data to use
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer); 
        
        // Explain to WebGL how to interpret the data (2 floats per vertex)
        this.gl.vertexAttribPointer(attrLocation, 2, this.gl.FLOAT, false, 0, 0); 
        
        // Enable the attribute so the Vertex Shader can read it
        this.gl.enableVertexAttribArray(attrLocation); 
    }
     
    /**
     * Factory method to create a basic Triangle asset
     */
    static CreateTriangle(gl) {
        const vertices = new Float32Array([
            0.0,  0.3,  // Top
           -0.2, -0.2,  // Left
            0.2, -0.2   // Right
        ]); 
        return new Asset(gl, vertices); 
    }
     
    /**
     * Factory method to create a Circle asset using a Triangle Fan
     * @param {number} segments - Number of slices to approximate the circle
     */
    static CreateCircle(gl, segments = 64) {
        let vertices = [0, 0]; // Center point (the pivot of the fan)
        
        for (let i = 0; i <= segments; ++i) {
            // Angle math: (current / total) * 360 degrees in radians
            const angle = (i / segments) * Math.PI * 2; 
            
            // Trigonometry: convert angle to x, y coordinates
            vertices.push(Math.cos(angle)); 
            vertices.push(Math.sin(angle)); 
        }
        
        return new Asset(gl, new Float32Array(vertices)); 
    }
}
